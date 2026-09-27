import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Danke from "./Danke";

const zeige = (eintrag: string | { pathname: string; state: unknown }) =>
  render(
    <MemoryRouter initialEntries={[eintrag]}>
      <Routes>
        <Route path="/danke/:freebie" element={<Danke />} />
      </Routes>
    </MemoryRouter>,
  );

const schluesselLinks = () =>
  screen.queryAllByRole("link").filter((a) => /\/voll-|\/dein-guide\//.test(a.getAttribute("href") ?? ""));

describe("Danke-Seite", () => {
  it("zeigt direkt aufgerufen keinen Schlüssellink", () => {
    zeige("/danke/top-100-halal-aktien");
    expect(schluesselLinks()).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toContain("Postfach");
  });

  it("öffnet aus der Karte das Freebie sofort", () => {
    zeige({ pathname: "/danke/top-100-halal-aktien", state: { vorname: "", vorhaben: ["konto"] } });
    const links = schluesselLinks();
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/vorlagen/top-100-halal-aktien/voll-8mq4");
    const test = screen.getAllByRole("link", { name: /Jetzt testen/ });
    expect(test[0].getAttribute("href")).toBe("/vergleich/start?vorhaben=konto");
  });

  it("führt beim Guide auf den Guide der gewählten Stufe", () => {
    zeige({ pathname: "/danke/guide", state: { vorname: "", stufe: "profi" } });
    expect(schluesselLinks()[0].getAttribute("href")).toBe("/dein-guide/tiefe-2026");
  });
});
