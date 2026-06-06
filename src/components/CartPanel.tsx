"use client";

import { Minus, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);

  return (
    <section
      aria-label="Selected items"
      className="flex flex-col border-t border-border bg-background"
      style={{ height: "42vh" }}
    >
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Selected Items
        </h2>
        <span className="text-xs text-muted-foreground">{itemCount} item(s)</span>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-2">
        {empty ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Tap an item to add it to the order.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {lines.map((l) => (
              <li key={l.itemId}>
                <Card className="flex items-center gap-2 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">
                      {l.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatRupees(l.price)} × {l.qty} ={" "}
                      <span className="font-semibold text-foreground">
                        {formatRupees(l.price * l.qty)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label="Decrease quantity"
                      onClick={() => onInc(l.itemId, l.qty - 1)}
                      className="h-8 w-8 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {l.qty}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      aria-label="Increase quantity"
                      onClick={() => onInc(l.itemId, l.qty + 1)}
                      className="h-8 w-8 rounded-full"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove item"
                      onClick={() => onRemove(l.itemId)}
                      className="ml-1 h-8 w-8 rounded-full text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Separator />

      <footer
        className="bg-card px-4 pt-3 pb-4"
        style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {formatRupees(total)}
          </span>
        </div>
        <Button
          type="button"
          size="lg"
          disabled={empty}
          onClick={onProceedToPay}
          className="w-full text-base"
        >
          Proceed to Pay
        </Button>
      </footer>
    </section>
  );
}
