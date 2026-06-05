import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-between bg-gradient-to-b from-amber-50 to-amber-100 px-6 py-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="text-6xl">🍽️</div>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          Kiosk Café
        </h1>
        <p className="max-w-xs text-base text-zinc-600">
          Browse the menu, place your order, and pay — all from this screen.
        </p>
      </div>

      <Link
        href="/order"
        className="flex w-full max-w-sm items-center justify-center rounded-2xl bg-amber-500 px-8 py-6 text-2xl font-semibold text-white shadow-lg transition active:scale-[0.98] active:bg-amber-600"
      >
        Order Now
      </Link>

      <p className="mt-4 text-xs text-zinc-500">Tap the button to begin</p>
    </div>
  );
}
