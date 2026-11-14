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

describe("Girokonto-Bonus: norisbank allein ganz oben (RK1-B, Elias 14.11.2026)", () => {
  it("zeigt oben nur die norisbank über die ganze Breite, mit Bedingung und Knopf, ohne BBBank-Karte", () => {
    const { container } = zeige();
    const karten = Array.from(container.querySelectorAll("[data-bonus-kopfkarte]"));
    expect(karten.map((k) => k.getAttribute("data-bonus-kopfkarte"))).toEqual(["norisbank"]);
    const noris = within(karten[0] as HTMLElement);
    expect(noris.getByText(/Kostenlos unter 30 oder ab 500\s€ Geldeingang, sonst 3,90\s€ im Monat/)).toBeTruthy();
    expect(noris.getByRole("link", { name: /Bei norisbank eröffnen/ })).toBeTruthy();
    expect(container.querySelector("[data-bonus-kopf]")?.textContent).not.toMatch(/BBBank/);
  });

  it("lässt den BBBank-Knopf mit 50 € unten stehen", () => {
    const { container } = zeige();
    const warum = container.querySelector("[data-bonus-warum]") as HTMLElement;
    expect(within(warum).getByRole("link", { name: /Konto bei der BBBank eröffnen/ })).toBeTruthy();
    expect(warum.textContent).toMatch(/50\s€ Startprämie/);
  });

  it("nennt keine 200-€-Prämie der norisbank", () => {
    const { container } = zeige();
    expect(container.textContent).not.toMatch(/200\s?€/);
  });

  it("gibt der oberen norisbank-Karte eine eigene Kennung, die alten bleiben gültig", () => {
    expect(GIRO_BONUS_SRC.norisbankKopf).toBe("gbnoriskopf");
    expect(GIRO_BONUS_SRC.kopf).toBe("gbkopf");
    expect(GIRO_BONUS_SRC.norisbank).toBe("gbnoris");
    for (const s of [GIRO_BONUS_SRC.norisbankKopf, GIRO_BONUS_SRC.kopf, GIRO_BONUS_SRC.norisbank]) expect(istGueltigeQuelle(s), s).toBe(true);
  });

  it("verweist unten nicht mehr auf die zwei oben als „dahinter“", () => {
    zeige();
    expect(screen.queryByText(/Diese zwei stehen in meinem Vergleich gleich dahinter/)).toBeNull();
  });
});
