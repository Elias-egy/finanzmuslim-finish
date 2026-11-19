import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import PortfolioPlan from "./PortfolioPlan";
import { PLAN_PFAD } from "@/data/portfolioPlan";

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
      <MemoryRouter initialEntries={[PLAN_PFAD]}>
        <Routes>
          <Route path="/dein-plan/:schluessel" element={<PortfolioPlan />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );

/** RN16-42 (Elias: „nur noch diesen einen Call to Action … immer gleich“): kein Girokonto- und kein Depot-Aufruf mehr, nur der Check-Kasten. */
describe("Plan: ein Aufruf", () => {
  it("hat weder Bankkarten noch Depot-Karten noch Vergleichs-Links", () => {
    const { container } = zeige();
    expect(container.querySelectorAll("[data-depot-karte]")).toHaveLength(0);
    expect(container.querySelectorAll("video")).toHaveLength(0);
    expect(container.querySelector("a[href*='/vergleich/'], a[href*='/out/']")).toBeNull();
    expect(container.querySelector("section[aria-labelledby=schritt-4]")).toBeNull();
  });

  it("zeigt genau einen großen Check-Kasten in der Mitte und unten den kleinen", () => {
    const { container } = zeige();
    const gross = container.querySelectorAll("[data-check-einstieg='portfolio-plan']");
    expect(gross).toHaveLength(1);
    const unten = container.querySelectorAll("[data-match-ende]");
    expect(unten).toHaveLength(1);
    expect(gross[0].compareDocumentPosition(unten[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector("section[aria-labelledby=schritt-2]")!.compareDocumentPosition(gross[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
