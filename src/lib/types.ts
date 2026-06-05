export type Category = {
  id: string;
  name: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image?: string;
};

export type CartLine = {
  itemId: string;
  name: string;
  price: number;
  qty: number;
};

export type ReceiptKind = "kot" | "bill";

export type PaymentMethod = "cash" | "upi";
