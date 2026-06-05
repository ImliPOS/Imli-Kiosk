// Minimal ESC/POS encoder. Produces a Uint8Array byte stream ready to ship
// over a bulk OUT endpoint. Targets generic 80mm/58mm thermal printers
// running in ESC/POS mode (which is what SK-POS shows for this device).

const ESC = 0x1b;
const GS = 0x1d;
const LF = 0x0a;

export class EscPos {
  private chunks: number[] = [];

  bytes(...bs: number[]): this {
    this.chunks.push(...bs);
    return this;
  }

  text(str: string): this {
    // The printer's default code page is CP437/Latin-1-ish. ASCII passes
    // through cleanly; the rupee glyph (₹) isn't in any default page, so
    // upstream code prints "Rs." instead.
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      this.chunks.push(code > 0xff ? 0x3f /* '?' */ : code);
    }
    return this;
  }

  line(str = ""): this {
    return this.text(str).bytes(LF);
  }

  init(): this {
    return this.bytes(ESC, 0x40);
  }

  align(a: "left" | "center" | "right"): this {
    const n = a === "left" ? 0 : a === "center" ? 1 : 2;
    return this.bytes(ESC, 0x61, n);
  }

  bold(on: boolean): this {
    return this.bytes(ESC, 0x45, on ? 1 : 0);
  }

  // size: 1-8 multiplier per axis. Most printers cap at 2x2 visually.
  size(width: 1 | 2, height: 1 | 2): this {
    const n = ((width - 1) << 4) | (height - 1);
    return this.bytes(GS, 0x21, n);
  }

  feed(lines = 1): this {
    for (let i = 0; i < lines; i++) this.chunks.push(LF);
    return this;
  }

  cut(): this {
    // GS V m=0  → full cut. Some printers feed-and-cut on m=66 n=lines.
    return this.bytes(GS, 0x56, 0x00);
  }

  build(): Uint8Array {
    return new Uint8Array(this.chunks);
  }
}
