import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import Top100Voll from "./Top100Voll";
import { TOP_GEFALLEN } from "@/data/top100Aktien";

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const zeige = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Top100Voll />
      </MemoryRouter>
    </HelmetProvider>,
  );

/**
 * AF1 (Elias, 12.11.2026, Vault raw/2026-11-12-elias-af1-01-… und -af1-02-…): alle 100 offen mit Logo und Kurs, zuerst
 * 15 gefallene große Namen im Rahmen, direkt danach „Werde Teil davon. In unter 10 Minuten.“ mit Smartbroker+ und flatex.
 */
describe("Freebie Aktie: Liste und Depot-Aufruf", () => {
  it("zeigt alle 100 Aktien offen, ohne Aufklappen", () => {
    const { container } = zeige();
    expect(container.querySelectorAll("[data-aktie]")).toHaveLength(100);
    expect(container.querySelector("details")).toBeNull();
    expect(container.textContent).not.toMatch(/weitere anzeigen/);
  });

  it("zeigt zuerst die 15 gefallenen Namen, dann den einen Check-Kasten, dann den Rest", () => {
    const { container } = zeige();
    const oben = container.querySelector("[data-top-gefallen]")!;
    const imRahmen = [...oben.querySelectorAll("[data-aktie]")].map((z) => z.getAttribute("data-aktie"));
    expect(imRahmen.length).toBeGreaterThan(5);
    expect(imRahmen.length).toBeLessThanOrEqual(15);
    for (const t of imRahmen) expect(TOP_GEFALLEN as readonly string[]).toContain(t);
    // RN16-42: nur noch ein großer Aufruf (Check), keine Depot-Karten.
    const checks = container.querySelectorAll("[data-check-einstieg='aktienliste']");
    expect(checks).toHaveLength(1);
    expect(oben.compareDocumentPosition(checks[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector("[data-depot-aufruf]")).toBeNull();
    expect(container.querySelectorAll("[data-depot-karte]")).toHaveLength(0);
    expect(container.querySelector("a[href*='/vergleich/'], a[href*='/out/']")).toBeNull();
  });

  it("Nvidia steht im Rahmen auf Platz 1 (Elias, AF1-03: „nvidia und co auf 1“)", () => {
    const { container } = zeige();
    const erste = container.querySelector("[data-top-gefallen] [data-aktie]");
    expect(erste?.getAttribute("data-aktie")).toBe("NVDA");
  });

  it("zeigt je Zeile Logo, Kurs und Veränderung in 7 Tagen", () => {
    const { container } = zeige();
    const z = container.querySelector("[data-aktie='NKE']")!;
    expect(z.querySelector("img")?.getAttribute("src")).toBe("/logos/aktien/NKE.png");
    expect(z.textContent).toMatch(/€/);
    expect(z.textContent).toMatch(/[−+]?\d+,\d %/);
  });
});
