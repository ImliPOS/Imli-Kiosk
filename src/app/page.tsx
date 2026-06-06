import Link from "next/link";
import { ChefHat, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top half — welcome imagery (sits behind the content panel) */}
      <div className="relative z-0 h-1/2 shrink-0">
        <img
          src="/chef-welcome.png"
          alt="Our head chef welcoming you to Kiosk Café"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom half — hero + call to action (layered above the image,
          pulled up to overlap the photo with a rounded top edge) */}
      <div className="relative z-10 -mt-10 flex flex-1 flex-col items-center justify-between overflow-hidden rounded-t-3xl bg-background px-6 pb-10 pt-12 shadow-[0_-12px_30px_rgba(0,0,0,0.35)]">
        {/* Subtle radial gold glow behind hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-card shadow-lg">
            <ChefHat className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Welcome
            </p>
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Kiosk Café
            </h1>
          </div>
          <p className="max-w-xs text-base text-muted-foreground">
            Browse the menu, place your order, and pay — all from this screen.
          </p>
        </div>

        <div
          className="relative mb-8 flex w-full max-w-sm flex-col items-center gap-3"
          style={{ marginBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        >
          <Button asChild size="xl" className="w-full text-xl font-semibold">
            <Link href="/order">
              Order Now
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
