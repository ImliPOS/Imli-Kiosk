"use client";

import { formatRupees } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

type Props = {
  open: boolean;
  total: number;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
};

export function PaymentModal({ open, total, onSelect, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Choose Payment
            </h2>
            <div className="text-xs text-zinc-500">
              Amount due:{" "}
              <span className="font-semibold text-zinc-900">
                {formatRupees(total)}
              </span>
            </div>
          </div>
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

        <div className="grid grid-cols-1 gap-3 p-5">
          <button
            type="button"
            onClick={() => onSelect("cash")}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 text-left transition active:scale-[0.98] active:bg-amber-50 hover:border-amber-300"
          >
            <span
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl"
            >
              💵
            </span>
            <span className="flex flex-col">
              <span className="text-base font-semibold text-zinc-900">
                Pay Cash
              </span>
              <span className="text-xs text-zinc-500">
                Pay at the counter
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelect("upi")}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-5 text-left transition active:scale-[0.98] active:bg-amber-50 hover:border-amber-300"
          >
            <span
              aria-hidden
              className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-2xl"
            >
              📱
            </span>
            <span className="flex flex-col">
              <span className="text-base font-semibold text-zinc-900">UPI</span>
              <span className="text-xs text-zinc-500">
                Scan QR with any UPI app
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
