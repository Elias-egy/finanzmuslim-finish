import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { LandWahl } from "@/components/land/LandWahl";
import VergleichDepot from "@/pages/VergleichDepot";
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
    const { container } = zeige("/at/vergleich/depot", <VergleichDepot />);
    expect(container.textContent).toContain("In Vorbereitung");
    expect(container.textContent).not.toContain("flatex");
    expect(container.querySelectorAll("table").length).toBe(0);
    const zurueck = [...container.querySelectorAll("a")].find((a) => a.textContent === "Deutschland ansehen") as HTMLAnchorElement;
    expect(zurueck.getAttribute("href")).toBe("/vergleich/depot");
  });

  it("die deutsche Seite hat ihre Länderwahl und ihre Anbieter", () => {
    const { container } = zeige("/vergleich/depot", <VergleichDepot />);
    expect(container.querySelector('nav[aria-label="Land wählen"]')).toBeTruthy();
    expect(container.textContent).toContain("flatex");
  });

  it("Übersicht Österreich: Kacheln ohne fertige Version stehen grau, kein Link in eine leere Seite", () => {
    const { container } = zeige("/at/vergleiche", <Vergleiche />);
    const links = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
    expect(links.some((h) => h.startsWith("/at/vergleich/"))).toBe(false);
    expect(container.querySelectorAll('[aria-disabled="true"]').length).toBeGreaterThan(0);
  });
});
