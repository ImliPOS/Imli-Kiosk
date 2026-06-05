"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatRupees } from "@/lib/format";
import type { CartLine, PaymentMethod, ReceiptKind } from "@/lib/types";

type Props = {
  open: boolean;
  kind: ReceiptKind;
  lines: CartLine[];
  total: number;
  paymentMethod?: PaymentMethod;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  statusMessage?: string;
};

const titles: Record<ReceiptKind, string> = {
  kot: "KOT Preview",
  bill: "Bill Preview",
};

const methodLabel: Record<PaymentMethod, string> = {
  cash: "CASH",
  upi: "UPI",
};

export function ReceiptModal({
  open,
  kind,
  lines,
  total,
  paymentMethod,
  onClose,
  onConfirm,
  confirmLabel = "Confirm Print",
  confirmDisabled = false,
  statusMessage,
}: Props) {
  const now = new Date();
  const ts = now.toLocaleString("en-IN", { hour12: true });
  const billNo = `B${now.getTime().toString().slice(-6)}`;
  const isBill = kind === "bill";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !confirmDisabled && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle>{titles[kind]}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto bg-background p-4">
          <div className="mx-auto w-[280px] rounded-md bg-zinc-50 p-4 font-mono text-[12px] leading-snug text-zinc-900 shadow-inner">
            <div className="text-center">
              <div className="text-base font-bold">KIOSK CAFÉ</div>
              <div className="text-[11px]">123 Main Road, Bengaluru</div>
              <div className="text-[11px]">GSTIN: 29ABCDE1234F1Z5</div>
            </div>
            <Divider />
            <div className="flex justify-between text-[11px]">
              <span>
                {kind === "kot" ? "KOT" : "Bill"} #{billNo}
              </span>
              <span>{ts}</span>
            </div>
            <Divider />
            <div className="flex text-[11px] font-bold">
              <span className="flex-1">Item</span>
              <span className="w-6 text-right">Qty</span>
              {isBill && <span className="w-16 text-right">Amount</span>}
            </div>
            <Divider />
            {lines.map((l) => (
              <div key={l.itemId} className="flex text-[11px]">
                <span className="flex-1 truncate pr-1">{l.name}</span>
                <span className="w-6 text-right tabular-nums">{l.qty}</span>
                {isBill && (
                  <span className="w-16 text-right tabular-nums">
                    {formatRupees(l.price * l.qty)}
                  </span>
                )}
              </div>
            ))}
            {isBill && (
              <>
                <Divider />
                <div className="flex justify-between text-[12px] font-bold">
                  <span>TOTAL</span>
                  <span className="tabular-nums">{formatRupees(total)}</span>
                </div>
                {paymentMethod && (
                  <div className="flex justify-between text-[11px]">
                    <span>Paid via</span>
                    <span className="font-semibold">
                      {methodLabel[paymentMethod]}
                    </span>
                  </div>
                )}
              </>
            )}
            <Divider />
            <div className="text-center text-[11px]">
              {kind === "kot"
                ? "** KITCHEN COPY **"
                : "Thank you, visit again!"}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border bg-card px-4 py-3">
          {statusMessage && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {statusMessage}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={confirmDisabled}
              className="flex-1"
            >
              Close
            </Button>
            {onConfirm && (
              <Button
                type="button"
                size="lg"
                onClick={onConfirm}
                disabled={confirmDisabled}
                className="flex-1"
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Divider() {
  return <div className="my-1 border-t border-dashed border-zinc-400" />;
}
