import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import ScalableVsTradeRepublic, { META, scalableVorn, TITEL } from "./ScalableVsTradeRepublic";

/**
 * SEO86: Die Paarseite sagt „Scalable Capital liegt vorn“ im ersten Satz. Das stimmt nur, solange die Daten des Depot-Vergleichs es
 * tragen (mehr Halal-ETFs und mindestens gleich viele Sukuk). Kippt das, muss der Text neu gedacht werden, nicht still stehen bleiben.
 */
describe("/blog/scalable-capital-vs-trade-republic", () => {
  beforeAll(() => {
    const leer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    vi.stubGlobal("ResizeObserver", leer);
    vi.stubGlobal("IntersectionObserver", leer);
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  });

  const zeige = () =>
    render(
      <MemoryRouter initialEntries={["/blog/scalable-capital-vs-trade-republic"]}>
        <ScalableVsTradeRepublic />
      </MemoryRouter>,
    ).container;

  it("die Daten tragen den Sieger im ersten Satz", () => {
    expect(scalableVorn).toBe(true);
  });

  it("Title unter 60 Zeichen, Meta 150 bis 160, genau eine H1 gleich dem Title", () => {
    expect(TITEL.length).toBeLessThan(60);
    expect(META.length).toBeGreaterThanOrEqual(150);
    expect(META.length).toBeLessThanOrEqual(160);
    const c = zeige();
    const h1 = c.querySelectorAll("h1");
    expect(h1.length).toBe(1);
    expect(h1[0].textContent).toBe(TITEL);
  });

  it("der erste Absatz nennt den Sieger und die Zahlen", () => {
    const c = zeige();
    const erster = [...c.querySelectorAll("article p")].map((p) => p.textContent ?? "").find((x) => x.startsWith("Scalable Capital vs")) ?? "";
    expect(erster).toMatch(/^Scalable Capital vs Trade Republic: Für Muslime liegt Scalable Capital vorn/);
    expect(erster).toMatch(/\d+ der 12 Halal-ETFs und Fonds/);
  });

  it("kein Gedankenstrich im Seitentext", () => {
    const c = zeige();
    expect(c.textContent ?? "").not.toMatch(/[–—]/);
  });

  it("nur Scalable Capital trägt einen Partnerlink, Trade Republic führt in den Vergleich", () => {
    const c = zeige();
    const partner = [...c.querySelectorAll('a[rel~="sponsored"]')].map((a) => a.getAttribute("href"));
    expect(partner.length).toBeGreaterThan(0);
    expect(partner.some((h) => /traderepublic/i.test(h ?? ""))).toBe(false);
    expect(partner).toContain("/out/scalable");
  });
});
