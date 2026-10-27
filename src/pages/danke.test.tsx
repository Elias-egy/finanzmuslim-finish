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

  it("zeigt auch aus der Karte keinen Schlüssellink, der Link kommt per Mail", () => {
    zeige({ pathname: "/danke/top-100-halal-aktien", state: { vorname: "", vorhaben: ["konto"] } });
    expect(schluesselLinks()).toHaveLength(0);
    expect(screen.getByRole("status").textContent).toContain("per Mail");
    const test = screen.getAllByRole("link", { name: /Jetzt testen/ });
    expect(test[0].getAttribute("href")).toBe("/vergleich/start?vorhaben=konto");
  });

  it("zeigt beim Guide keinen Schlüssellink, auch mit gewählter Stufe", () => {
    zeige({ pathname: "/danke/guide", state: { vorname: "", stufe: "profi" } });
    expect(schluesselLinks()).toHaveLength(0);
  });
});
