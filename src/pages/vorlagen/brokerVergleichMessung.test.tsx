import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ereignis = vi.fn();
vi.mock("@/lib/messung", () => ({ ereignis: (...a: unknown[]) => ereignis(...a) }));

// IntersectionObserver von Hand: der Test sagt, wann der letzte Abschnitt ins Bild kommt.
let melden: ((e: { isIntersecting: boolean }[]) => void) | null = null;
class Beobachter {
  constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
    melden = cb;
  }
  observe() {}
  disconnect() {}
}

const { default: BrokerVergleich } = await import("./BrokerVergleich");

const zeige = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/vorlagen/broker-vergleich"]}>
        <BrokerVergleich />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Broker-Freebie: Seite und Messung", () => {
  beforeEach(() => {
    ereignis.mockClear();
    melden = null;
    vi.stubGlobal("IntersectionObserver", Beobachter);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("zählt freebie_ende, wenn die zwei Regeln ins Bild kommen", () => {
    zeige();
    expect(ereignis).not.toHaveBeenCalledWith("freebie_ende", expect.anything());
    melden?.([{ isIntersecting: true }]);
    expect(ereignis).toHaveBeenCalledWith("freebie_ende", expect.objectContaining({ wort: "broker" }));
  });

  it("hat je Anbieter genau einen Knopf zum Partnerweg mit eigener Kennung", () => {
    const { container } = zeige();
    const knoepfe = [...container.querySelectorAll("a[data-broker-knopf]")];
    expect(knoepfe.map((k) => k.getAttribute("href"))).toEqual([
      "/out/flatex?src=bvfx",
      "/out/smartbroker?src=bvsb",
      "/out/traders-place?src=bvtp",
      "/out/scalable?src=bvsc",
    ]);
  });

  it("zeigt die vier Anbieter in der Reihenfolge der Seite und Scalable als Honorable Mention", () => {
    const { container } = zeige();
    const karten = [...container.querySelectorAll("[data-broker-karte]")].map((k) => k.getAttribute("data-broker-karte"));
    expect(karten).toEqual(["flatex", "smartbroker", "traders-place", "scalable"]);
    expect(screen.getAllByText("Honorable Mention")).toHaveLength(1);
  });

  it("setzt die drei im Vergleich als Einleitung vor die Karten und die zwei Auszeichnungen in der Reihenfolge Profis, Start", () => {
    const { container } = zeige();
    const tabelle = container.querySelector("[data-broker-tabelle]")!;
    const ersteKarte = container.querySelector("[data-broker-karte]")!;
    expect(tabelle.compareDocumentPosition(ersteKarte) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const ausz = [...container.querySelectorAll("[data-broker-auszeichnung]")].map((a) => a.textContent);
    expect(ausz).toEqual(["Nummer 1 für Profis", "Nummer 1 für den Start"]);
    expect(container.querySelector("[data-broker-karte='flatex'] [data-broker-auszeichnung]")).not.toBeNull();
    expect(container.querySelector("[data-broker-karte='smartbroker'] [data-broker-auszeichnung]")).not.toBeNull();
    const hm = screen.getByText("Honorable Mention");
    expect(hm.compareDocumentPosition(container.querySelector("[data-broker-karte='scalable']")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("nennt den Kreditrahmen nur bei flatex", () => {
    const { container } = zeige();
    expect(container.querySelectorAll("[data-broker-kredit]")).toHaveLength(1);
    expect(container.querySelector("[data-broker-karte='flatex'] [data-broker-kredit]")).not.toBeNull();
  });
});
