import { render, screen } from "@testing-library/react";
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

/** Elias, 04.11.2026, Freebie Plan: kleiner Girokonto-Aufruf statt zwei Banken, Video bei den drei Depots raus. */
describe("Plan: Aufrufe", () => {
  it("zeigt im Girokonto-Schritt nur den kleinen Aufruf, keine Bankkarten", () => {
    const { container } = zeige();
    const schritt1 = container.querySelector("section[aria-labelledby=schritt-1]")!;
    expect(schritt1.querySelector("[data-depot-karte]")).toBeNull();
    expect(schritt1.textContent).not.toMatch(/Consorsbank|Zum Angebot/);
    const link = [...schritt1.querySelectorAll("a")].find((a) => a.textContent?.includes("Zum Vergleich"));
    expect(link?.getAttribute("href")).toBe("/vergleich/girokonto?src=plgalle");
  });

  it("zeigt bei den drei Depots die drei Anbieter, aber kein Video", () => {
    const { container } = zeige();
    expect(container.querySelectorAll("video")).toHaveLength(0);
    const schritt4 = container.querySelector("section[aria-labelledby=schritt-4]")!;
    expect(schritt4.querySelectorAll("[data-depot-karte]")).toHaveLength(3);
    expect(screen.queryByText(/Das Video zeigt die Einrichtung/)).toBeNull();
  });
});
