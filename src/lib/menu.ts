import type { Category, MenuItem } from "./types";

export const categories: Category[] = [
  { id: "starters", name: "Starters" },
  { id: "main", name: "Main Course" },
  { id: "breads", name: "Breads & Rice" },
  { id: "beverages", name: "Beverages" },
  { id: "desserts", name: "Desserts" },
];

// Local image paths point at files in /public.
// Filenames are referenced verbatim — encodeURI handles spaces.
const localImg = (filename: string) => encodeURI(`/${filename}`);

export const menuItems: MenuItem[] = [
  {
    id: "s1",
    categoryId: "starters",
    name: "Paneer Tikka",
    price: 220,
    image: localImg("paneer-tikka-masala.webp"),
  },
  {
    id: "s2",
    categoryId: "starters",
    name: "Chicken 65",
    price: 260,
    image: localImg("chicken 65.webp"),
  },
  {
    id: "s3",
    categoryId: "starters",
    name: "Veg Spring Roll",
    price: 180,
    image: localImg("veg spring roll.webp"),
  },
  {
    id: "s4",
    categoryId: "starters",
    name: "Gobi Manchurian",
    price: 190,
    image: localImg("Gobi Manchurian.webp"),
  },

  {
    id: "m1",
    categoryId: "main",
    name: "Butter Chicken",
    price: 340,
    image: localImg("butter-chicken.webp"),
  },
  {
    id: "m2",
    categoryId: "main",
    name: "Paneer Butter Masala",
    price: 280,
    image: localImg("paneer butter masala.webp"),
  },
  {
    id: "m3",
    categoryId: "main",
    name: "Dal Tadka",
    price: 180,
    image: localImg("Dal tadka.webp"),
  },
  {
    id: "m4",
    categoryId: "main",
    name: "Veg Biryani",
    price: 240,
    image: localImg("veg biriyani.webp"),
  },
  { id: "m5", categoryId: "main", name: "Chicken Biryani", price: 290 },

  {
    id: "b1",
    categoryId: "breads",
    name: "Butter Naan",
    price: 50,
    image: localImg("butter naan .webp"),
  },
  { id: "b2", categoryId: "breads", name: "Garlic Naan", price: 70 },
  {
    id: "b3",
    categoryId: "breads",
    name: "Tandoori Roti",
    price: 30,
    image: localImg("tandoori roti .webp"),
  },
  { id: "b4", categoryId: "breads", name: "Jeera Rice", price: 140 },

  { id: "bv1", categoryId: "beverages", name: "Masala Chai", price: 40 },
  { id: "bv2", categoryId: "beverages", name: "Filter Coffee", price: 50 },
  {
    id: "bv3",
    categoryId: "beverages",
    name: "Fresh Lime Soda",
    price: 80,
    image: localImg("fresh lime soda.webp"),
  },
  { id: "bv4", categoryId: "beverages", name: "Mango Lassi", price: 110 },

  { id: "d1", categoryId: "desserts", name: "Gulab Jamun", price: 90 },
  { id: "d2", categoryId: "desserts", name: "Rasmalai", price: 120 },
  {
    id: "d3",
    categoryId: "desserts",
    name: "Ice Cream Scoop",
    price: 80,
    image: localImg("icecream scoop.webp"),
  },
];

export function itemsByCategory(categoryId: string): MenuItem[] {
  return menuItems.filter((m) => m.categoryId === categoryId);
}
