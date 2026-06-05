"use client";

import { Banknote, Smartphone } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatRupees } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

type Props = {
  open: boolean;
  total: number;
  onSelect: (method: PaymentMethod) => void;
  onClose: () => void;
};

export function PaymentModal({ open, total, onSelect, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Payment</DialogTitle>
          <DialogDescription>
            Amount due:{" "}
            <span className="font-semibold text-foreground">
              {formatRupees(total)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 pt-2">
          <PaymentOption
            icon={<Banknote className="h-6 w-6" />}
            label="Pay Cash"
            sub="Pay at the counter"
            onClick={() => onSelect("cash")}
          />
          <PaymentOption
            icon={<Smartphone className="h-6 w-6" />}
            label="UPI"
            sub="Scan QR with any UPI app"
            onClick={() => onSelect("upi")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PaymentOption({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-border bg-background p-5 text-left transition active:scale-[0.98] hover:border-primary/40 hover:bg-secondary/30"
    >
      <span
        aria-hidden
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary"
      >
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="text-base font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}
