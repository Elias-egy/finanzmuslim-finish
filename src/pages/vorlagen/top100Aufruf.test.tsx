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

  it("zeigt zuerst die 15 gefallenen Namen, dann den Aufruf, dann den Rest", () => {
    const { container } = zeige();
    const oben = container.querySelector("[data-top-gefallen]")!;
    const imRahmen = [...oben.querySelectorAll("[data-aktie]")].map((z) => z.getAttribute("data-aktie"));
    expect(imRahmen.length).toBeGreaterThan(5);
    expect(imRahmen.length).toBeLessThanOrEqual(15);
    for (const t of imRahmen) expect(TOP_GEFALLEN as readonly string[]).toContain(t);
    const aufruf = container.querySelector("[data-depot-aufruf]")!;
    expect(oben.compareDocumentPosition(aufruf) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(aufruf.textContent).toContain("In unter 10 Minuten");
    expect(aufruf.textContent).not.toMatch(/reich/i);
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

  it("zeigt genau zwei Karten, Smartbroker+ für den Start, flatex für Profis", () => {
    const { container } = zeige();
    const karten = [...container.querySelectorAll("[data-depot-karte]")];
    expect(karten).toHaveLength(2);
    expect(karten[0].textContent).toContain("Smartbroker+");
    expect(karten[0].textContent).toContain("Top für den Start");
    expect(karten[1].textContent).toContain("flatex");
    expect(karten[1].textContent).toContain("12 von 12");
    expect(karten[1].textContent).toContain("7 von 7");
    expect(container.querySelector("video")).toBeNull();
  });

  it("führt über die Partnerwege mit der Klickzählung der Seite", () => {
    const { container } = zeige();
    const ziele = [...container.querySelectorAll("[data-depot-karte] a")].map((a) => a.getAttribute("href"));
    expect(ziele[0]).toMatch(/^\/(depot-nummer-1|out\/smartbroker)\?src=ak(nr1|top3)$/);
    expect(ziele[1]).toMatch(/^\/(depot-nummer-1|out\/flatex)\?src=ak(nr1|top3)$/);
  });
});
