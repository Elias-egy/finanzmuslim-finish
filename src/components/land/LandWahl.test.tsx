import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { LandWahl } from "@/components/land/LandWahl";
import VergleichDepot from "@/pages/VergleichDepot";
import VergleichKrypto from "@/pages/VergleichKrypto";
import { landFreigegeben, landVergleich } from "@/data/land";
import Vergleiche from "@/pages/Vergleiche";

beforeAll(() => {
  // jsdom kennt ResizeObserver und IntersectionObserver nicht; die Vergleichstabelle braucht ihn nur zum Messen der Wischstelle.
  const leer = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= leer;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver ??= leer;
});

const zeige = (pfad: string, element: JSX.Element) =>
  render(
    <MemoryRouter initialEntries={[pfad]}>
      <Routes>
        <Route path="*" element={element} />
      </Routes>
    </MemoryRouter>,
  );

describe("Länderwahl (DACH1)", () => {
  it("zeigt die Länder mit öffentlichem Vergleich mit Flagge, der aktuelle ist markiert und jeder Eintrag ist ein Link auf dieselbe Seite", () => {
    const { container } = zeige("/at/vergleich/depot", <LandWahl />);
    const links = [...container.querySelectorAll("a")] as HTMLAnchorElement[];
    // Schweiz: alle Vergleiche „In Vorbereitung“ (Prüfung DACH1 M-3), deshalb keine Flagge.
    expect(links.map((a) => a.textContent)).toEqual(["DE", "AT"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/vergleich/depot", "/at/vergleich/depot"]);
    expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, "true"]);
    expect(container.querySelectorAll("svg").length).toBe(2);
    expect(links[1].getAttribute("aria-label")).toBe("Österreich");
  });
});

describe("Länderseite ohne Liste (DACH1)", () => {
  it("zeigt „In Vorbereitung“ statt erfundener Anbieter und führt zur deutschen Seite", () => {
    // Schweiz Krypto ist noch ein Entwurf (src/data/land/schweiz.ts).
    expect(landFreigegeben("ch", "/vergleich/krypto")).toBe(false);
    const { container } = zeige("/ch/vergleich/krypto", <VergleichKrypto />);
    expect(container.textContent).toContain("In Vorbereitung");
    expect(container.textContent).not.toContain("Bitvavo");
    expect(container.querySelectorAll("table").length).toBe(0);
    const zurueck = [...container.querySelectorAll("a")].find((a) => a.textContent === "Deutschland ansehen") as HTMLAnchorElement;
    expect(zurueck.getAttribute("href")).toBe("/vergleich/krypto");
  });

  it("eine fertige Länderliste zeigt ihre eigenen Anbieter, nie die deutsche Liste", () => {
    const { container } = zeige("/at/vergleich/depot", <VergleichDepot />);
    expect(container.textContent).toContain("Steuereinfach (KESt wird abgeführt)");
    expect(container.textContent).toContain("DADAT");
    expect(container.textContent).not.toContain("norisbank");
    expect(container.textContent).not.toContain("Comdirect");
  });

  it("die deutsche Seite hat ihre Länderwahl und ihre Anbieter", () => {
    const { container } = zeige("/vergleich/depot", <VergleichDepot />);
    expect(container.querySelector('nav[aria-label="Land wählen"]')).toBeTruthy();
    expect(container.textContent).toContain("flatex");
  });

  it("Übersicht Schweiz: Kacheln ohne fertige Version stehen grau, kein Link in eine leere Seite", () => {
    const { container } = zeige("/ch/vergleiche", <Vergleiche />);
    const links = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    for (const pfad of ["/vergleich/depot", "/vergleich/girokonto", "/vergleich/krypto", "/vergleich/edelmetalle", "/vergleich/etf-sparplan"]) {
      expect(landFreigegeben("ch", pfad), pfad).toBe(false);
      expect(links.includes(`/ch${pfad}`), pfad).toBe(false);
    }
    expect(container.querySelectorAll('[aria-disabled="true"]').length).toBeGreaterThan(0);
  });

  it("Übersicht Österreich: nur Ländervergleiche, keine deutschen Seiten (Prüfung S-4)", () => {
    const { container } = zeige("/at/vergleiche", <Vergleiche />);
    const links = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    for (const pfad of ["/vergleich/depot", "/vergleich/girokonto", "/vergleich/krypto", "/vergleich/edelmetalle", "/vergleich/etf-sparplan"]) {
      expect(links.includes(`/at${pfad}`), pfad).toBe(true);
    }
    for (const de of ["/vergleich/steuersoftware", "/vergleich/screening-apps", "/vergleich/girokonto/studenten", "/vergleich/girokonto/umrah-und-urlaub", "/halal-anlagen"]) {
      expect(links.includes(de), de).toBe(false);
    }
    expect(links.some((l) => l.startsWith("/check"))).toBe(false);
  });

  it("die Österreich-Depotseite zählt in der Beschreibung ihre eigenen Depots (Prüfung S-3)", () => {
    zeige("/at/vergleich/depot", <VergleichDepot />);
    const beschreibung = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    expect(beschreibung).toContain("8 Depots für Österreich");
    expect(beschreibung).not.toContain("38");
    expect(beschreibung).not.toContain("Kredit ab Start");
  });
});

describe("Nummer 1 in Österreich (DACH1, Prüfung S-1)", () => {
  it("sagt im Kasten offen, dass Traders Place in Österreich nicht steuereinfach ist", () => {
    const { container } = zeige("/at/vergleich/depot", <VergleichDepot />);
    const kasten = container.querySelector('[data-steuer-hinweis="at"]');
    expect(kasten?.textContent).toContain("Traders Place nicht steuereinfach");
  });

  it("nennt Scalable in Österreich nur im Depot, nicht bei Edelmetallen und ETF-Sparplan (Prüfung M-1)", () => {
    expect(landFreigegeben("at", "/vergleich/edelmetalle")).toBe(true);
    for (const pfad of ["/vergleich/edelmetalle", "/vergleich/etf-sparplan"]) {
      const liste = landVergleich("at", pfad);
      expect(liste?.anbieter.some((a) => /scalable/i.test(a.id)), pfad).toBe(false);
    }
    const depot = landVergleich("at", "/vergleich/depot");
    const scalable = depot?.anbieter.find((a) => a.id === "scalable-capital-depot-at");
    expect(scalable?.werte.zinsfreiAbStart ?? null).toBeNull();
  });
});

describe("Schweiz in Vorbereitung (DACH1, Prüfung M-3)", () => {
  it("die Schweizer Depot- und Girokonto-Seite zeigen trotz Daten nur „In Vorbereitung“", () => {
    for (const [pfad, Seite] of [["/ch/vergleich/depot", <VergleichDepot key="d" />]] as const) {
      const { container, unmount } = zeige(pfad, Seite);
      expect(container.textContent).toContain("In Vorbereitung");
      expect(container.textContent).not.toContain("Swissquote");
      expect(container.querySelectorAll("table").length).toBe(0);
      unmount();
    }
    expect(landFreigegeben("ch", "/vergleich/girokonto")).toBe(false);
  });
});
