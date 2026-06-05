import { EscPos } from "./escpos";
import type { CartLine, PaymentMethod } from "./types";

// Layout assumes 32-character print width — standard for both 58mm
// (Font A small) and 80mm (Font A normal) thermal heads in ESC/POS mode.
const WIDTH = 32;

export type ReceiptInput = {
  billNo: string;
  timestamp: Date;
  lines: CartLine[];
  total?: number;            // bill only
  paymentMethod?: PaymentMethod;  // bill only
};

function pad(s: string, len: number, align: "left" | "right" = "left"): string {
  if (s.length >= len) return s.slice(0, len);
  const fill = " ".repeat(len - s.length);
  return align === "left" ? s + fill : fill + s;
}

function divider(): string {
  return "-".repeat(WIDTH);
}

function fmtMoney(n: number): string {
  return n.toFixed(2);
}

function fmtTs(d: Date): string {
  return d.toLocaleString("en-IN", { hour12: true });
}

export function buildKot(input: ReceiptInput): Uint8Array {
  const p = new EscPos().init();
  p.align("center").size(2, 2).bold(true).line("KITCHEN ORDER");
  p.size(1, 1).bold(false).line();
  p.align("left").line(`KOT #${input.billNo}`);
  p.line(fmtTs(input.timestamp));
  p.line(divider());
  p.bold(true).line(`${pad("Item", 26)}${pad("Qty", 6, "right")}`).bold(false);
  p.line(divider());
  for (const l of input.lines) {
    p.line(`${pad(l.name, 26)}${pad(String(l.qty), 6, "right")}`);
  }
  p.line(divider());
  p.feed(2).cut();
  return p.build();
}

export function buildBill(input: ReceiptInput): Uint8Array {
  const p = new EscPos().init();
  p.align("center").size(2, 2).bold(true).line("KIOSK CAFE");
  p.size(1, 1).bold(false);
  p.line("123 Main Road, Bengaluru");
  p.line("GSTIN: 29ABCDE1234F1Z5");
  p.line(divider());
  p.align("left").line(`Bill #${input.billNo}`);
  p.line(fmtTs(input.timestamp));
  p.line(divider());
  p.bold(true)
    .line(`${pad("Item", 16)}${pad("Qty", 6, "right")}${pad("Amt", 10, "right")}`)
    .bold(false);
  p.line(divider());
  for (const l of input.lines) {
    const amount = l.qty * l.price;
    p.line(
      `${pad(l.name, 16)}${pad(String(l.qty), 6, "right")}${pad(
        fmtMoney(amount),
        10,
        "right",
      )}`,
    );
  }
  p.line(divider());
  const total = input.total ?? 0;
  p.align("right").size(1, 2).bold(true).line(`TOTAL: Rs.${fmtMoney(total)}`);
  p.size(1, 1).bold(false);
  if (input.paymentMethod) {
    p.line(`Paid via ${input.paymentMethod.toUpperCase()}`);
  }
  p.align("center").line(divider()).line("Thank you, visit again!");
  p.feed(2).cut();
  return p.build();
}
