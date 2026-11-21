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
    expect(ereignis).toHaveBeenCalledWith("freebie_ende", expect.objectContaining({ wort: "broker-vergleich" }));
  });

  it("führt mit dem Vergleich ein und gibt am Ende die freie Wahl: flatex, Smartbroker+, Traders Place (GB1)", () => {
    const { container } = zeige();
    expect(container.querySelector("[data-broker-versprechen] a")).toBeNull();
    const wahl = container.querySelector("[data-broker-wahl]")!;
    const karten = [...wahl.querySelectorAll("[data-broker-karte]")].map((k) => k.getAttribute("data-broker-karte"));
    expect(karten).toEqual(["flatex", "smartbroker", "traders-place"]);
    expect(wahl.querySelector('[data-broker-karte="flatex"] a')!.getAttribute("href")).toBe("/out/flatex?src=bvfx");
    expect(wahl.querySelector("[data-broker-weitere] a")!.getAttribute("href")).toBe("/out/scalable?src=bvsc");
  });

  it("zeigt die Order als Grundpreis ohne „ab“ und nennt den Kreditrahmen nur bei flatex", () => {
    const { container } = zeige();
    const zeile = [...container.querySelectorAll("tr")].find((t) => t.textContent?.startsWith("Order ab"))!;
    expect([...zeile.querySelectorAll("td")].map((t) => t.textContent)).toEqual(["5,90 €", "1 €", "0,95 €"]);
    expect(container.querySelector("[data-broker-regeln]")!.textContent).toMatch(/flatex lehnst du den Kreditrahmen ab/);
  });

  it("hat den Test für Unsichere ganz unten", () => {
    const { container } = zeige();
    expect(container.querySelector("[data-broker-test] a")!.getAttribute("href")).toContain("/check?quelle=broker-vergleich");
    screen.getByText("Noch unsicher, welcher?");
  });
});
