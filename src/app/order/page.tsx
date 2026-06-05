"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CartPanel } from "@/components/CartPanel";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ItemGrid } from "@/components/ItemGrid";
import { PaymentModal } from "@/components/PaymentModal";
import { PrinterConnect } from "@/components/PrinterConnect";
import { ReceiptModal } from "@/components/ReceiptModal";
import { categories, itemsByCategory } from "@/lib/menu";
import { printOrder } from "@/lib/printer";
import type { PaymentMethod } from "@/lib/types";
import { useCart } from "@/lib/useCart";
import { usePrinter } from "@/lib/usePrinter";

type PrintState =
  | { phase: "idle" }
  | { phase: "printing" }
  | { phase: "error"; message: string };

export default function KioskPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0].id,
  );
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [printState, setPrintState] = useState<PrintState>({ phase: "idle" });

  const router = useRouter();
  const cart = useCart();
  const printer = usePrinter();
  const items = useMemo(
    () => itemsByCategory(activeCategoryId),
    [activeCategoryId],
  );
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleSelectPayment = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentOpen(false);
    setReceiptOpen(true);
  };

  const handleConfirmOrder = async () => {
    setPrintState({ phase: "printing" });
    const billNo = `B${Date.now().toString().slice(-6)}`;
    const result = await printOrder(
      {
        billNo,
        lines: cart.lines,
        total: cart.total,
        paymentMethod: paymentMethod ?? undefined,
      },
      printer.isReady ? printer.sendBytes : undefined,
    );

    if (!result.ok) {
      setPrintState({ phase: "error", message: result.error });
      return;
    }

    setPrintState({ phase: "idle" });
    setReceiptOpen(false);
    setPaymentMethod(null);
    cart.clear();
    router.push("/");
  };

  const isPrinting = printState.phase === "printing";

  return (
    <div className="flex h-screen bg-zinc-100">
      <CategorySidebar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-1 flex-col">
            <div className="text-base font-bold leading-tight text-zinc-900">
              Kiosk Café
            </div>
            <div className="text-xs text-zinc-500">
              {activeCategory?.name ?? "Menu"}
            </div>
          </div>
          <PrinterConnect status={printer.status} onPair={printer.pair} />
          {cart.itemCount > 0 && (
            <div className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
              {cart.itemCount} in cart
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto">
          <ItemGrid items={items} onAdd={cart.addItem} />
        </main>

        <CartPanel
          lines={cart.lines}
          total={cart.total}
          onInc={cart.setQty}
          onRemove={cart.removeItem}
          onProceedToPay={() => setPaymentOpen(true)}
        />
      </div>

      <PaymentModal
        open={paymentOpen}
        total={cart.total}
        onSelect={handleSelectPayment}
        onClose={() => setPaymentOpen(false)}
      />

      <ReceiptModal
        open={receiptOpen}
        kind="bill"
        lines={cart.lines}
        total={cart.total}
        paymentMethod={paymentMethod ?? undefined}
        confirmLabel={isPrinting ? "Printing…" : "Confirm & Print"}
        confirmDisabled={isPrinting}
        onClose={() => {
          if (isPrinting) return;
          setReceiptOpen(false);
          setPrintState({ phase: "idle" });
        }}
        onConfirm={handleConfirmOrder}
        statusMessage={
          printState.phase === "error"
            ? `Printer error: ${printState.message}`
            : undefined
        }
      />
    </div>
  );
}
