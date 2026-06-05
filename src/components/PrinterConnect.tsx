"use client";

import { Printer, AlertCircle, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { PrinterStatus } from "@/lib/usePrinter";

type Props = {
  status: PrinterStatus;
  onPair: () => void;
};

export function PrinterConnect({ status, onPair }: Props) {
  if (status.kind === "unsupported") {
    return (
      <Badge
        variant="muted"
        title="Use Chrome or another Chromium browser for USB printing."
      >
        <AlertCircle className="h-3 w-3" />
        Printer unsupported
      </Badge>
    );
  }

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

  const variant = (() => {
    switch (status.kind) {
      case "ready":
        return "default";
      case "error":
        return "destructive";
      default:
        return "outline";
    }
  })();

  const disabled = status.kind === "connecting" || status.kind === "ready";
  const Icon =
    status.kind === "connecting"
      ? Loader2
      : status.kind === "error"
        ? AlertCircle
        : Printer;

  return (
    <button
      type="button"
      onClick={onPair}
      disabled={disabled}
      title={status.kind === "error" ? status.message : undefined}
      className="disabled:cursor-default"
    >
      <Badge variant={variant} className="px-3 py-1.5">
        <Icon
          className={`h-3 w-3 ${status.kind === "connecting" ? "animate-spin" : ""}`}
        />
        {label}
      </Badge>
    </button>
  );
}
