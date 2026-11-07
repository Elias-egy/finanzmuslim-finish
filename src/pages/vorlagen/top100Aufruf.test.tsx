import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import Top100Voll from "./Top100Voll";

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

/** Elias, 07.11.2026 (FA-01, FA-02): nur zwei kleine Angebote, Traders Place und flatex, ohne Video und Orderkosten. */
describe("Freebie Aktie: Depot-Aufruf", () => {
  it("zeigt genau zwei Karten, Traders Place zuerst, flatex als zweites", () => {
    const { container } = zeige();
    const karten = [...container.querySelectorAll("[data-depot-karte]")];
    expect(karten).toHaveLength(2);
    expect(karten[0].textContent).toContain("Traders Place");
    expect(karten[1].textContent).toContain("flatex");
  });

  it("zeigt kein Video, keine Kosten pro Order und keine Depotgebühr", () => {
    const { container } = zeige();
    const kasten = container.querySelector("[data-depot-kasten]")!;
    expect(container.querySelector("video")).toBeNull();
    expect(kasten.textContent).not.toMatch(/Kosten pro Order|Depotgebühr/);
  });

  it("nennt bei Traders Place nur Guthaben ohne Zinsen, Islamic und Gold", () => {
    const { container } = zeige();
    const tp = container.querySelectorAll("[data-depot-karte]")[0];
    const haken = [...tp.querySelectorAll("li")].map((li) => li.textContent);
    expect(haken).toHaveLength(3);
    expect(haken[0]).toBe("Guthaben ohne Zinsen");
    expect(haken[1]).toMatch(/^Islamic ETFs und Fonds: \d+ von \d+$/);
    expect(haken[2]).toMatch(/^Gold und Edelmetalle: \d+ von \d+$/);
  });

  it("nennt bei flatex 12 von 12, 7 von 7 und den Sparplan", () => {
    const { container } = zeige();
    const fx = container.querySelectorAll("[data-depot-karte]")[1];
    expect(fx.textContent).toContain("12 von 12");
    expect(fx.textContent).toContain("7 von 7");
    expect(fx.textContent).toContain("Sparplan ab 1 €");
    expect(fx.textContent).toContain("HSBC");
  });

  it("führt über die Partnerwege mit der Klickzählung der Seite", () => {
    const { container } = zeige();
    const ziele = [...container.querySelectorAll("[data-depot-karte] a")].map((a) => a.getAttribute("href"));
    expect(ziele[0]).toMatch(/^\/(depot-nummer-1|out\/traders-place)\?src=ak(nr1|top3)$/);
    expect(ziele[1]).toBe("/out/flatex?src=aktop3");
  });
});
