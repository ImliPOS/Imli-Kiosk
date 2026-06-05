"use client";

import { formatRupees } from "@/lib/format";
import type { CartLine } from "@/lib/types";

type Props = {
  lines: CartLine[];
  total: number;
  onInc: (itemId: string, qty: number) => void;
  onRemove: (itemId: string) => void;
  onProceedToPay: () => void;
};

export function CartPanel({
  lines,
  total,
  onInc,
  onRemove,
  onProceedToPay,
}: Props) {
  const empty = lines.length === 0;

  return (
    <section
      aria-label="Selected items"
      className="flex flex-col border-t border-zinc-200 bg-zinc-50"
      style={{ height: "42vh" }}
    >
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-600">
          Selected Items
        </h2>
        <span className="text-xs text-zinc-500">
          {lines.reduce((n, l) => n + l.qty, 0)} item(s)
        </span>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {empty ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Tap an item to add it to the order.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {lines.map((l) => (
              <li
                key={l.itemId}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-zinc-900">
                    {l.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {formatRupees(l.price)} × {l.qty} ={" "}
                    <span className="font-semibold text-zinc-700">
                      {formatRupees(l.price * l.qty)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => onInc(l.itemId, l.qty - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-lg font-bold text-zinc-700 active:bg-zinc-300"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold tabular-nums">
                    {l.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => onInc(l.itemId, l.qty + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white active:bg-amber-600"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label="Remove item"
                    onClick={() => onRemove(l.itemId)}
                    className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 active:bg-zinc-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="border-t border-zinc-200 bg-white px-4 pt-3 pb-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-zinc-600">Total</span>
          <span className="text-2xl font-bold tabular-nums text-zinc-900">
            {formatRupees(total)}
          </span>
        </div>
        <button
          type="button"
          disabled={empty}
          onClick={onProceedToPay}
          className="w-full rounded-lg bg-amber-500 py-4 text-base font-semibold text-white shadow-sm disabled:opacity-40 active:bg-amber-600"
        >
          Proceed to Pay
        </button>
      </footer>
    </section>
  );
}
