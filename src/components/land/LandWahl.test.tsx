import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { LandWahl } from "@/components/land/LandWahl";
import VergleichDepot from "@/pages/VergleichDepot";
import VergleichKrypto from "@/pages/VergleichKrypto";
import VergleichGirokonto from "@/pages/VergleichGirokonto";
import VergleichEdelmetalle from "@/pages/VergleichEdelmetalle";
import { VergleichEtfSparplan } from "@/pages/VergleichAbgeleitet";
import { findPartnerLink } from "@/data/partnerLinks";
import { findStartPartner } from "@/data/investmentStart";
import { ZURUECKGESTELLT } from "@/data/land/zurueckgestellt";
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
    expect(container.textContent).toContain("flatex");
    // Prüfung 2: DADAT ist zurückgestellt (Halal-Kauf ohne Beleg).
    expect(container.textContent).not.toContain("DADAT");
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
    // VG7 (25.11.2026): Scalable ist mit dem Zinsbeleg für Österreich wieder im Depot, also 6. VG8-01 (25.11.2026): dazu Trading 212, Bitpanda, N26, Erste Bank, Bank Direkt und Börse Live (offen ist nicht draußen), also 12.
    expect(beschreibung).toContain("12 Depots für Österreich");
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
    // VG7 (25.11.2026): Der Zinsbeleg für Österreich liegt vor (Preis- und Leistungsverzeichnis Österreich „Verrechnungskonten: 0,00 % p.a.“), Scalable steht wieder im Depot.
    expect(landVergleich("at", "/vergleich/depot")?.anbieter.some((a) => /scalable/i.test(a.id))).toBe(true);
  });
});

const AT_SEITEN = [
  ["/at/vergleich/depot", <VergleichDepot key="d" />],
  ["/at/vergleich/girokonto", <VergleichGirokonto key="g" />],
  ["/at/vergleich/krypto", <VergleichKrypto key="k" />],
  ["/at/vergleich/edelmetalle", <VergleichEdelmetalle key="e" />],
  ["/at/vergleich/etf-sparplan", <VergleichEtfSparplan key="s" />],
] as const;

describe("Österreich nach Prüfung 2 (DACH1, 23.11.2026)", () => {
  it("nimmt zurückgestellte Anbieter aus jeder Liste, schaltet ihren Link ab und ihre Startseite aus", () => {
    const alle = AT_SEITEN.flatMap(([pfad]) => landVergleich("at", pfad.replace(/^\/at/, ""))?.anbieter ?? []);
    for (const z of ZURUECKGESTELLT) {
      for (const id of z.ids) expect(alle.some((a) => a.id === id), id).toBe(false);
      for (const k of z.kurznamen) {
        expect(findPartnerLink(k)?.aktiv, k).toBe(false);
        expect(findStartPartner(k), k).toBeUndefined();
      }
    }
    for (const a of alle) expect(a.link ?? "", a.id).not.toMatch(/easybank/);
  });

  it("zählt nur Papiere mit Zulassungsbeleg des Herausgebers und zeigt ihren Namen statt eines Bruchs", () => {
    for (const pfad of ["/vergleich/depot", "/vergleich/edelmetalle", "/vergleich/etf-sparplan"]) {
      const liste = landVergleich("at", pfad)!;
      expect(liste.anteilN, pfad).toEqual({ halalEtfsFonds: 1, halalSukuk: 1, halalEdelmetalle: 1 });
      for (const a of liste.anbieter)
        for (const k of ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]) expect([null, "1 von 1"], `${a.id} ${k}`).toContain(a.werte[k] ?? null);
    }
    const { container } = zeige("/at/vergleich/depot", <VergleichDepot />);
    expect(container.textContent).toContain("World Islamic");
    // „1 von 12 Angeboten“ (Seitenzähler) enthält „1 von 1“: nur die Anlagenzählung „1 von 1“ ohne weitere Ziffer ist verboten.
    expect(container.textContent).not.toMatch(/1 von 1(?!\d)/);
    expect(container.textContent).not.toMatch(/von 4|bestätigt|mind\./);
  });

  it("sagt bei der DKB in Österreich: nicht steuereinfach", () => {
    for (const pfad of ["/vergleich/depot", "/vergleich/edelmetalle"]) {
      const dkb = landVergleich("at", pfad)!.anbieter.find((a) => a.id.startsWith("dkb-"));
      expect(dkb?.werte.kapest, pfad).toBe(false);
      expect(dkb?.quellen?.kapest?.hinweis, pfad).toContain("Kapitalertragsteuer nicht automatisch");
    }
    expect(findStartPartner("dkb-depot-at")?.fakten.some((f) => f.titel === "Nicht steuereinfach")).toBe(true);
  });

  it("führt auf keiner AT-Seite in den Blog, die Methodik oder den deutschen Check, und sagt nie „Dispo“ oder „Silber“", () => {
    for (const [pfad, Seite] of AT_SEITEN) {
      const { container, unmount } = zeige(pfad, Seite);
      // Die Flagge „DE“ der Länderwahl führt gewollt zur deutschen Fassung, alle anderen Links bleiben in Österreich.
      const links = [...container.querySelectorAll("a")]
        .filter((a) => !a.closest('nav[aria-label="Land wählen"]'))
        .map((a) => a.getAttribute("href") ?? "");
      for (const l of links) {
        expect(l, pfad).not.toMatch(/^\/(blog|halal-anlagen|check|vergleiche\/methodik)/);
        expect(l, pfad).not.toMatch(/^\/vergleich\//);
      }
      expect(container.textContent, pfad).not.toContain("Dispo");
      expect(container.textContent, pfad).not.toContain("Silber");
      unmount();
    }
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
