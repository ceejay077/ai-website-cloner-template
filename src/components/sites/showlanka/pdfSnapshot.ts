import { WP_ORIGIN } from "@/lib/wp";

// html2canvas 1.x (used by html2pdf) cannot parse the modern colour functions
// that Tailwind v4 tokens compute to, so the brochure snapshot rewrites them.
const MODERN_COLOR = /(?:ok)?l(?:ab|ch)\([^)]*\)|color\([^)]*\)|color-mix\((?:[^()]|\([^)]*\))*\)/g;
const COLOR_PROPS = [
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "box-shadow",
  "text-shadow",
  "fill",
  "stroke",
] as const;

function toRgb(value: string, ctx: CanvasRenderingContext2D, cache: Map<string, string>): string {
  const known = cache.get(value);
  if (known) return known;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const rgb = `rgba(${r}, ${g}, ${b}, ${Math.round((a / 255) * 100) / 100})`;
  cache.set(value, rgb);
  return rgb;
}

/** Prepare html2canvas's cloned document: plain rgb colours and same-origin media. */
export function prepareSnapshot(doc: Document) {
  const view = doc.defaultView;
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (view && ctx) {
    const cache = new Map<string, string>();
    doc.querySelectorAll<HTMLElement | SVGElement>("*").forEach((el) => {
      const style = view.getComputedStyle(el);
      for (const prop of COLOR_PROPS) {
        const value = style.getPropertyValue(prop);
        if (value && MODERN_COLOR.test(value)) {
          MODERN_COLOR.lastIndex = 0;
          el.style.setProperty(prop, value.replace(MODERN_COLOR, (c) => toRgb(c, ctx, cache)), "important");
        }
        MODERN_COLOR.lastIndex = 0;
      }
    });
  }
  // Pseudo-elements can't take inline styles; their only modern colours are the base border/outline tokens.
  const reset = doc.createElement("style");
  reset.textContent = "*::before, *::after { border-color: currentColor; outline-color: currentColor; }";
  doc.head.appendChild(reset);

  // WordPress media has no CORS headers, so load it through the app's same-origin
  // /wp-content proxy (see next.config.ts) to keep it in the canvas.
  doc.querySelectorAll<HTMLImageElement>(`img[src^="${WP_ORIGIN}/wp-content/"]`).forEach((img) => {
    img.removeAttribute("srcset");
    img.src = img.src.slice(WP_ORIGIN.length);
  });
}
