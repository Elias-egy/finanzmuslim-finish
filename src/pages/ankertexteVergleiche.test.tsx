import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { ANKER_VERGLEICH } from "@/data/ankertexte";

// SEO81 (25.11.2026, data/seo/LINKS.md „Ankertexte ohne Suchwort“): Textlinks in den Blogbeiträgen auf Depot-, Girokonto-
// und Gold-Vergleich tragen das Suchwort der Zielseite, nicht „Zum Depot-Vergleich“ oder „Der passende Vergleich“.
const seiten = import.meta.glob(["./wissen/*.tsx", "./blog/HalalEtf.tsx"], { eager: true }) as Record<
  string,
  { default: React.ComponentType }
>;

const ZIELE = Object.keys(ANKER_VERGLEICH);
const ALT = /^(Zum (Depot|Girokonto)-Vergleich|Depot-Vergleich|Girokonto-Vergleich|Gold-Vergleich|Der passende Vergleich)/;

describe("Ankertexte der Vergleichs-Links in den Beiträgen", () => {
  beforeAll(() => {
    const leer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    vi.stubGlobal("ResizeObserver", leer);
    vi.stubGlobal("IntersectionObserver", leer);
  });
  afterAll(() => vi.unstubAllGlobals());

  it("kein Beitrag nennt die alten Ankertexte (außer dem schwebenden Kasten in /blog/halal-etf)", () => {
    expect(Object.keys(seiten).length).toBeGreaterThan(20);
    for (const [pfad, m] of Object.entries(seiten)) {
      const Seite = m.default;
      const { container } = render(
        <MemoryRouter>
          <Seite />
        </MemoryRouter>,
      );
      const alte = [...container.querySelectorAll("a")]
        .filter((a) => ZIELE.includes(a.getAttribute("href") ?? ""))
        .map((a) => (a.textContent ?? "").trim())
        .filter((t) => ALT.test(t));
      // Der Kasten in der Seitenleiste von /blog/halal-etf ist ein schwebender Knopf und bleibt unverändert.
      const erlaubt = pfad.endsWith("HalalEtf.tsx") ? 1 : 0;
      expect(alte.length, `${pfad}: ${alte.join(" | ")}`).toBe(erlaubt);
      cleanup();
    }
  });
});
