"use client";

import { cn } from "@/lib/utils";
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
      className="flex h-full w-48 shrink-0 flex-col border-r border-border bg-card"
    >
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Categories
        </h2>
      </div>
      <ul className="flex flex-1 flex-col overflow-y-auto py-2">
        {categories.map((c) => {
          const active = c.id === activeCategoryId;
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                className={cn(
                  "relative w-full px-4 py-4 text-left text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-secondary/40 hover:text-foreground",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
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
