// WebUSB bridge to a generic ESC/POS thermal printer.
//
// Hard requirements (any failure here returns `supported: false` or an error):
//   1. The page must be served over HTTPS (or localhost). Plain HTTP is
//      blocked by the browser.
//   2. The printer must NOT be claimed by another process. If the kiosk's
//      SK-POS / vendor app is still running, device.open() throws
//      "Access denied".
//   3. The printer must expose a USB Bulk OUT endpoint. Generic ESC/POS
//      printers do; we discover it dynamically below.

// Vendor 0x0483 = STMicroelectronics — matches the "1155" identifier
// shown on the SK-POS printer settings screen. Most generic ESC/POS
// thermal printers ship with an STM32 USB stack.
const PRINTER_FILTERS: USBDeviceFilter[] = [{ vendorId: 0x0483 }];

export type Handle = {
  device: USBDevice;
  interfaceNumber: number;
  endpointNumber: number;
};

export function isWebUsbSupported(): boolean {
  return typeof navigator !== "undefined" && "usb" in navigator;
}

export async function getPairedPrinter(): Promise<USBDevice | null> {
  if (!isWebUsbSupported()) return null;
  const devices = await navigator.usb.getDevices();
  // Prefer something matching the printer filter.
  return (
    devices.find((d) => PRINTER_FILTERS.some((f) => f.vendorId === d.vendorId)) ??
    devices[0] ??
    null
  );
}

export async function requestPrinter(): Promise<USBDevice> {
  if (!isWebUsbSupported()) {
    throw new Error("WebUSB is not supported in this browser");
  }
  // requestDevice() opens Chrome's USB picker. Must be called in a user
  // gesture handler (e.g., button click). Throws if the user cancels.
  return navigator.usb.requestDevice({ filters: PRINTER_FILTERS });
}

export async function openPrinter(device: USBDevice): Promise<Handle> {
  if (!device.opened) await device.open();
  if (device.configuration === null) {
    await device.selectConfiguration(1);
  }

  // Walk every interface alt setting and find the first Bulk OUT endpoint.
  for (const iface of device.configuration!.interfaces) {
    for (const alt of iface.alternates) {
      const outEp = alt.endpoints.find(
        (e) => e.direction === "out" && e.type === "bulk",
      );
      if (outEp) {
        try {
          await device.claimInterface(iface.interfaceNumber);
        } catch (e) {
          // Interface might already be claimed by the kernel — surface
          // a clearer error than the bare "InvalidStateError".
          throw new Error(
            `Could not claim USB interface ${iface.interfaceNumber}. ` +
              "Is another app (SK-POS) still holding the printer? " +
              `Underlying: ${(e as Error).message}`,
          );
        }
        return {
          device,
          interfaceNumber: iface.interfaceNumber,
          endpointNumber: outEp.endpointNumber,
        };
      }
    }
  }

  throw new Error("No bulk OUT endpoint found on this USB device.");
}

export async function send(handle: Handle, bytes: Uint8Array): Promise<void> {
  // Some printers' bulk buffers are small; chunk to 1024-byte writes.
  // `slice` (not `subarray`) gives us a fresh ArrayBuffer-backed view,
  // which is what WebUSB's transferOut signature requires.
  const CHUNK = 1024;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const chunk = bytes.slice(i, i + CHUNK);
    const result = await handle.device.transferOut(handle.endpointNumber, chunk);
    if (result.status !== "ok") {
      throw new Error(`transferOut status=${result.status}`);
    }
  }
}

export async function closePrinter(handle: Handle | null): Promise<void> {
  if (!handle) return;
  try {
    await handle.device.releaseInterface(handle.interfaceNumber);
  } catch {
    // ignore — claim may have been lost already
  }
  try {
    await handle.device.close();
  } catch {
    // ignore
  }
}
