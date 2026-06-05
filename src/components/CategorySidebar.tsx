"use client";

import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
};

export function CategorySidebar({
  categories,
  activeCategoryId,
  onSelect,
}: Props) {
  return (
    <aside
      aria-label="Menu categories"
      className="flex h-full w-44 shrink-0 flex-col border-r border-zinc-200 bg-white"
    >
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Categories
        </h2>
      </div>
      <ul className="flex flex-1 flex-col overflow-y-auto py-1">
        {categories.map((c) => {
          const active = c.id === activeCategoryId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={`relative w-full px-4 py-4 text-left text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-zinc-800 hover:bg-zinc-50 active:bg-zinc-100"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500"
                  />
                )}
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
