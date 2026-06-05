"use client";

import { formatRupees } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export function ItemGrid({ items, onAdd }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        No items in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onAdd(item)}
          className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left shadow-sm transition active:scale-[0.98] active:bg-amber-50 hover:border-amber-300"
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-20 w-20 shrink-0 rounded-lg bg-zinc-100 object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-2xl font-semibold text-zinc-400"
            >
              {item.name.charAt(0)}
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
            <span className="line-clamp-2 text-base font-semibold leading-tight text-zinc-900">
              {item.name}
            </span>
            <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white">
              {formatRupees(item.price)}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
