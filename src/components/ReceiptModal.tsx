"use client";

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
  if (!open) return null;

  const now = new Date();
  const ts = now.toLocaleString("en-IN", { hour12: true });
  const billNo = `B${now.getTime().toString().slice(-6)}`;
  const isBill = kind === "bill";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            {titles[kind]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-100 p-4">
          <div className="mx-auto w-[280px] bg-white p-4 font-mono text-[12px] leading-snug text-zinc-900 shadow-sm">
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

        <footer className="flex flex-col gap-2 border-t border-zinc-200 bg-white px-4 py-3">
          {statusMessage && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {statusMessage}
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={confirmDisabled}
              className="flex-1 rounded-lg border border-zinc-300 bg-white py-3 text-sm font-semibold text-zinc-800 disabled:opacity-40 active:bg-zinc-100"
            >
              Close
            </button>
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={confirmDisabled}
                className="flex-1 rounded-lg bg-amber-500 py-3 text-sm font-semibold text-white disabled:opacity-60 active:bg-amber-600"
              >
                {confirmLabel}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-1 border-t border-dashed border-zinc-400" />;
}
