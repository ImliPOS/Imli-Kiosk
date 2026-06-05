import { buildBill, buildKot } from "./receipts";
import type { CartLine, PaymentMethod } from "./types";

// Shape injected by the Android WebView (KioskPrinterBridge.kt).
type NativeBridge = {
  isAvailable: () => boolean;
  listDevices: () => string;
  connectFirstUsb: () => string;
  printOrder: (payloadJson: string) => string;
};

declare global {
  interface Window {
    KioskPrinter?: NativeBridge;
  }
}

export type PrintOutcome =
  | { ok: true; mode: "native" | "webusb" | "browser-stub" }
  | { ok: false; error: string };

export type OrderPayload = {
  billNo: string;
  lines: CartLine[];
  total: number;
  paymentMethod?: PaymentMethod;
};

type BridgeResult = { ok: boolean; error?: string };

function safeParse(json: string): BridgeResult {
  try {
    return JSON.parse(json) as BridgeResult;
  } catch {
    return { ok: false, error: "Bridge returned non-JSON response" };
  }
}

function buildNativePayload(order: OrderPayload) {
  const lines = order.lines.map((l) => ({
    name: l.name,
    qty: l.qty,
    price: l.price,
  }));
  return {
    kot: { billNo: order.billNo, lines },
    bill: {
      billNo: order.billNo,
      lines,
      total: order.total,
      paymentMethod: order.paymentMethod,
    },
  };
}

/**
 * Print routing — tries the most reliable transport first.
 *
 *   1. Android WebView native bridge  (best — kernel-level USB via AAR)
 *   2. WebUSB                          (if a paired device is provided)
 *   3. Browser stub                    (dev / no hardware)
 *
 * The caller passes an optional `webusbSender` so the page can hand in
 * the device it pre-paired through `usePrinter`. We don't try to claim
 * the USB device here because requestDevice() must run from a user gesture.
 */
export async function printOrder(
  order: OrderPayload,
  webusbSender?: (bytes: Uint8Array) => Promise<void>,
): Promise<PrintOutcome> {
  const bridge = typeof window !== "undefined" ? window.KioskPrinter : undefined;

  if (bridge) {
    try {
      const raw = bridge.printOrder(JSON.stringify(buildNativePayload(order)));
      const result = safeParse(raw);
      if (result.ok) return { ok: true, mode: "native" };
      return { ok: false, error: result.error ?? "Unknown printer error" };
    } catch (e) {
      return { ok: false, error: errMsg(e) };
    }
  }

  if (webusbSender) {
    try {
      const input = {
        billNo: order.billNo,
        timestamp: new Date(),
        lines: order.lines,
        total: order.total,
        paymentMethod: order.paymentMethod,
      };
      await webusbSender(buildKot(input));
      await webusbSender(buildBill(input));
      return { ok: true, mode: "webusb" };
    } catch (e) {
      return { ok: false, error: errMsg(e) };
    }
  }

  console.info("[printer] no transport — running as browser-stub", order);
  return { ok: true, mode: "browser-stub" };
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
