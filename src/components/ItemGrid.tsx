"use client";

import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupees } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

type Props = {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
};

export function ItemGrid({ items, onAdd }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
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
          className="group text-left transition active:scale-[0.98]"
        >
          <Card className="flex h-full items-center gap-3 p-3 transition-colors group-hover:border-primary/40">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-20 w-20 shrink-0 rounded-lg bg-secondary object-cover"
              />
            ) : (
              <div
                aria-hidden
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-secondary text-2xl font-semibold text-muted-foreground"
              >
                {item.name.charAt(0)}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
              <span className="line-clamp-2 text-base font-semibold leading-tight text-foreground">
                {item.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="default">{formatRupees(item.price)}</Badge>
                <span
                  aria-hidden
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary"
                >
                  <Plus className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
