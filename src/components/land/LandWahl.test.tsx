import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { LandWahl } from "@/components/land/LandWahl";
import VergleichDepot from "@/pages/VergleichDepot";
import VergleichKrypto from "@/pages/VergleichKrypto";
import { landFreigegeben } from "@/data/land";
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
  it("zeigt drei Länder mit Flagge, der aktuelle ist markiert und jeder Eintrag ist ein Link auf dieselbe Seite", () => {
    const { container } = zeige("/at/vergleich/depot", <LandWahl />);
    const links = [...container.querySelectorAll("a")] as HTMLAnchorElement[];
    expect(links.map((a) => a.textContent)).toEqual(["DE", "AT", "CH"]);
    expect(links.map((a) => a.getAttribute("href"))).toEqual(["/vergleich/depot", "/at/vergleich/depot", "/ch/vergleich/depot"]);
    expect(links.map((a) => a.getAttribute("aria-current"))).toEqual([null, "true", null]);
    expect(container.querySelectorAll("svg").length).toBe(3);
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
    for (const pfad of ["/vergleich/krypto", "/vergleich/edelmetalle", "/vergleich/etf-sparplan"]) {
      expect(landFreigegeben("ch", pfad), pfad).toBe(false);
      expect(links.includes(`/ch${pfad}`), pfad).toBe(false);
    }
    expect(links.includes("/ch/vergleich/depot")).toBe(true);
    expect(container.querySelectorAll('[aria-disabled="true"]').length).toBeGreaterThan(0);
  });
});
