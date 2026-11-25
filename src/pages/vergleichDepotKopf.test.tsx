import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import VergleichDepot from "./VergleichDepot";

// SEO81 (25.11.2026): /vergleich/depot zielt auf „bestes depot“ (700 Suchen, CHANCEN.tsv): Title und H1 beginnen mit
// „Bestes Depot für Muslime“ plus Jahr, das Hauptwort „Depot-Vergleich“ bleibt im Title und in der Unterzeile.
describe("/vergleich/depot: Kopf für „bestes depot“", () => {
  beforeAll(() => {
    // jsdom kennt keine Beobachter; die Tabelle braucht sie nur für die Scroll-Stelle.
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
      <MemoryRouter initialEntries={["/vergleich/depot"]}>
        <VergleichDepot />
      </MemoryRouter>,
    );

  it("Title und H1 beginnen mit „Bestes Depot für Muslime 2026“, Title unter 60 Zeichen", () => {
    const { container } = zeige();
    const h1 = container.querySelector("h1")?.textContent ?? "";
    expect(h1).toBe("Bestes Depot für Muslime 2026");
    expect(document.title.startsWith("Bestes Depot für Muslime 2026")).toBe(true);
    expect(document.title).toContain("Depot-Vergleich");
    expect(document.title.length).toBeLessThan(60);
  });

  it("Meta-Beschreibung hat 150 bis 160 Zeichen und beginnt mit dem kaufnahen Wort", () => {
    zeige();
    const meta = document.head.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    expect(meta.startsWith("Bestes Depot für Muslime 2026")).toBe(true);
    expect(meta.length).toBeGreaterThanOrEqual(150);
    expect(meta.length).toBeLessThanOrEqual(160);
  });

  it("Schema: headline im WebPage-Knoten ist gleich der H1", () => {
    const { container } = zeige();
    const h1 = container.querySelector("h1")?.textContent;
    const knoten = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((s) => JSON.parse(s.textContent ?? "[]"))
      .find((k) => k["@type"] === "WebPage");
    expect(knoten?.headline).toBe(h1);
  });
});
