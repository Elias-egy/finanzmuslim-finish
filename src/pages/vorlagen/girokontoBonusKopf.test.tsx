import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { describe, expect, it } from "vitest";
import GirokontoBonus from "./GirokontoBonus";
import { GIRO_BONUS_SRC } from "@/data/girokontoBonus";
import { istGueltigeQuelle } from "@/lib/attribution";

const zeige = () =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/vorlagen/girokonto-bonus"]}>
        <GirokontoBonus />
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("Girokonto-Bonus: Vergleich zuerst, freie Wahl am Ende (GB1, Elias 20.11.2026)", () => {
  it("zeigt oben das Versprechen ohne Knopf, dann die Tabelle, dann drei gleiche Knöpfe in der Reihenfolge des Vergleichs", () => {
    const { container } = zeige();
    const kopf = container.querySelector("[data-gb-versprechen]")!;
    expect(kopf.querySelector("a")).toBeNull();
    const tabelle = container.querySelector("[data-bonus-tabelle]")!;
    const wahl = container.querySelector("[data-bonus-wahl]")!;
    expect(tabelle.compareDocumentPosition(wahl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const karten = [...wahl.querySelectorAll("[data-bonus-karte]")].map((k) => k.getAttribute("data-bonus-karte"));
    expect(karten).toEqual(["norisbank", "bbbank-bettersmart", "consorsbank-girokonto"]);
    expect(wahl.querySelectorAll("a").length).toBe(3);
  });

  it("nennt keine 200-€-Prämie der norisbank und die 50 € nur bei der BBBank", () => {
    const { container } = zeige();
    expect(container.textContent).not.toMatch(/200\s?€/);
    expect(container.querySelector('[data-bonus-karte="bbbank-bettersmart"]')!.textContent).toMatch(/50\s?€/);
  });

  it("hat den Test für Unsichere ganz unten und keine Newsletter-Box", () => {
    const { container } = zeige();
    const test = container.querySelector("[data-bonus-test]")!;
    expect(test.querySelector("a")!.getAttribute("href")).toContain("/check?start=2&a1=konto");
    expect(container.querySelector("[data-bonus-wahl]")!.compareDocumentPosition(test) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
