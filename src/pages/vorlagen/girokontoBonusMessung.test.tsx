import { fireEvent, render, screen } from "@testing-library/react";
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

const { default: GirokontoBonus } = await import("./GirokontoBonus");

const zeige = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/vorlagen/girokonto-bonus"]}>
        <GirokontoBonus />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Girokonto-Bonus: Messung (S6)", () => {
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
    expect(ereignis).toHaveBeenCalledWith("freebie_ende", expect.objectContaining({ wort: "girokonto" }));
  });

  it("partner_klick nennt Konto und Stelle statt des Netzwerk-Servers", () => {
    zeige();
    const knopf = screen.getByRole("link", { name: /Konto bei der BBBank eröffnen/ });
    knopf.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(knopf);
    const klick = ereignis.mock.calls.find(([n]) => n === "partner_klick");
    if (knopf.getAttribute("href")?.startsWith("http")) {
      expect(klick?.[1]).toMatchObject({ anbieter: "bbbank-bettersmart", knopf: "gbwarum", weg: "direkt", von: "girokonto-bonus" });
    } else {
      expect(knopf.getAttribute("href")).toContain("/out/bbbank-bettersmart");
    }
  });
});
