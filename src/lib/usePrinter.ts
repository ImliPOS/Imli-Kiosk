"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPairedPrinter,
  isWebUsbSupported,
  openPrinter,
  requestPrinter,
  send,
  type Handle,
} from "./webusb-printer";

export type PrinterStatus =
  | { kind: "unsupported" }
  | { kind: "unpaired" }
  | { kind: "connecting" }
  | { kind: "ready" }
  | { kind: "error"; message: string };

export function usePrinter() {
  const [status, setStatus] = useState<PrinterStatus>({ kind: "unpaired" });
  const [handle, setHandle] = useState<Handle | null>(null);

  useEffect(() => {
    if (!isWebUsbSupported()) {
      setStatus({ kind: "unsupported" });
      return;
    }
    // Try to pick up a device the user paired in a previous session — no
    // prompt needed. Permission is persisted by the browser per-origin.
    (async () => {
      try {
        const device = await getPairedPrinter();
        if (!device) return;
        setStatus({ kind: "connecting" });
        const h = await openPrinter(device);
        setHandle(h);
        setStatus({ kind: "ready" });
      } catch (e) {
        setStatus({ kind: "error", message: errorMessage(e) });
      }
    })();
  }, []);

  const pair = useCallback(async () => {
    if (!isWebUsbSupported()) return;
    try {
      setStatus({ kind: "connecting" });
      const device = await requestPrinter();
      const h = await openPrinter(device);
      setHandle(h);
      setStatus({ kind: "ready" });
    } catch (e) {
      setStatus({ kind: "error", message: errorMessage(e) });
    }
  }, []);

  const sendBytes = useCallback(
    async (bytes: Uint8Array) => {
      if (!handle) throw new Error("Printer not ready");
      await send(handle, bytes);
    },
    [handle],
  );

  return { status, pair, sendBytes, isReady: status.kind === "ready" };
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
