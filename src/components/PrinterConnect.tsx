"use client";

import type { PrinterStatus } from "@/lib/usePrinter";

type Props = {
  status: PrinterStatus;
  onPair: () => void;
};

export function PrinterConnect({ status, onPair }: Props) {
  if (status.kind === "unsupported") return null;

  const label = (() => {
    switch (status.kind) {
      case "ready":
        return "Printer ready";
      case "connecting":
        return "Connecting…";
      case "error":
        return "Tap to retry";
      case "unpaired":
      default:
        return "Pair Printer";
    }
  })();

  const dotClass = (() => {
    switch (status.kind) {
      case "ready":
        return "bg-emerald-500";
      case "connecting":
        return "bg-amber-500 animate-pulse";
      case "error":
        return "bg-red-500";
      default:
        return "bg-zinc-400";
    }
  })();

  const disabled = status.kind === "connecting" || status.kind === "ready";

  return (
    <button
      type="button"
      onClick={onPair}
      disabled={disabled}
      title={status.kind === "error" ? status.message : undefined}
      className="flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-sm disabled:opacity-90"
    >
      <span aria-hidden className={`h-2 w-2 rounded-full ${dotClass}`} />
      {label}
    </button>
  );
}
