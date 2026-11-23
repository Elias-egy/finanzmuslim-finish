import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/data/land", async (original) => {
  const echt = await original<typeof import("@/data/land")>();
  // Test: Österreich hat fertige Depot- und Girokonto-Listen, die Schweiz nicht.
  return {
    ...echt,
    landFreigegeben: (land: string, pfad: string) =>
      land === "de" || (land === "at" && (pfad.includes("depot") || pfad.includes("girokonto"))),
    landHatFreigegebenes: (land: string) => land !== "ch",
  };
});

import { LandErkennung } from "@/components/land/LandErkennung";
import { LandWahl } from "@/components/land/LandWahl";

const Ort = () => <p data-testid="ort">{useLocation().pathname}</p>;

/** Ein Link im Text, wie ihn ein Blogbeitrag oder die Startseite setzt: immer die deutsche Adresse. */
let geheZu: (pfad: string) => void = () => {};
const Navigator = () => {
  const navigate = useNavigate();
  geheZu = (pfad) => navigate(pfad);
  return null;
};

/** Eine ganze Sitzung: Erkennung, Länderwahl und Seite in einem Router. */
const sitzung = (start: string) =>
  render(
    <MemoryRouter initialEntries={[start]}>
      <LandErkennung />
      <Navigator />
      <LandWahl />
      <Routes>
        <Route path="*" element={<Ort />} />
      </Routes>
    </MemoryRouter>,
  );

const zeige = (start: string) =>
  render(
    <MemoryRouter initialEntries={[start]}>
      <LandErkennung />
      <Routes>
        <Route path="*" element={<Ort />} />
      </Routes>
    </MemoryRouter>,
  );

const setzeBrowser = (sprachen: string[], ua = "Mozilla/5.0 (iPhone) Safari/604.1") => {
  Object.defineProperty(window.navigator, "languages", { value: sprachen, configurable: true });
  Object.defineProperty(window.navigator, "userAgent", { value: ua, configurable: true });
};

describe("Automatische Länderversion (DACH1)", () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.cookie = "fm_land=; Max-Age=0; Path=/";
  });
  afterEach(() => vi.restoreAllMocks());

  it("stellt einen Besucher aus Österreich auf der Depot-Seite um", () => {
    setzeBrowser(["de-AT"]);
    const { getByTestId } = zeige("/vergleich/depot");
    expect(getByTestId("ort").textContent).toBe("/at/vergleich/depot");
  });

  it("stellt nicht um, wenn die Länderversion dieser Seite nicht fertig ist (Schweiz)", () => {
    setzeBrowser(["de-CH"]);
    const { getByTestId } = zeige("/vergleich/depot");
    expect(getByTestId("ort").textContent).toBe("/vergleich/depot");
  });

  it("lässt Crawler und Vorschauen auf der deutschen Seite", () => {
    setzeBrowser(["de-AT"], "Mozilla/5.0 (compatible; Googlebot/2.1)");
    const { getByTestId } = zeige("/vergleich/depot");
    expect(getByTestId("ort").textContent).toBe("/vergleich/depot");
  });

  it("achtet auf die gemerkte Wahl Deutschland", () => {
    setzeBrowser(["de-AT"]);
    document.cookie = "fm_land=de; Path=/";
    const { getByTestId } = zeige("/vergleich/depot");
    expect(getByTestId("ort").textContent).toBe("/vergleich/depot");
  });

  it("Wahl Österreich gilt auf jeder weiteren Vergleichsseite derselben Sitzung (Prüfung M-4)", () => {
    setzeBrowser(["de-DE"]);
    const { getByTestId, getByLabelText } = sitzung("/vergleich/depot");
    // Erster deutscher Vergleich: die Erkennung lief, der Sitzungs-Merkzettel steht.
    expect(getByTestId("ort").textContent).toBe("/vergleich/depot");
    expect(sessionStorage.getItem("fm_land_geprueft")).toBe("1");
    fireEvent.click(getByLabelText("Österreich"));
    expect(document.cookie).toContain("fm_land=at");
    expect(getByTestId("ort").textContent).toBe("/at/vergleich/depot");
    // Danach führt ein Link auf die deutsche Girokonto-Seite in die Österreich-Version.
    act(() => geheZu("/vergleich/girokonto"));
    expect(getByTestId("ort").textContent).toBe("/at/vergleich/girokonto");
    act(() => geheZu("/vergleich/depot"));
    expect(getByTestId("ort").textContent).toBe("/at/vergleich/depot");
  });

  it("Wahl Deutschland bleibt auf jeder weiteren Seite, auch für Besucher aus Österreich", () => {
    setzeBrowser(["de-AT"]);
    const { getByTestId, getByLabelText } = sitzung("/vergleich/depot");
    expect(getByTestId("ort").textContent).toBe("/at/vergleich/depot");
    fireEvent.click(getByLabelText("Deutschland"));
    expect(document.cookie).toContain("fm_land=de");
    expect(getByTestId("ort").textContent).toBe("/vergleich/depot");
    act(() => geheZu("/vergleich/girokonto"));
    expect(getByTestId("ort").textContent).toBe("/vergleich/girokonto");
  });

  it("ohne Wahl stellt die Erkennung nur einmal je Sitzung um", () => {
    setzeBrowser(["de-AT"]);
    sessionStorage.setItem("fm_land_geprueft", "1");
    const { getByTestId } = zeige("/vergleich/girokonto");
    expect(getByTestId("ort").textContent).toBe("/vergleich/girokonto");
  });

  it("leitet Crawler nie um, auch nicht mit gemerkter Wahl", () => {
    setzeBrowser(["de-AT"], "Mozilla/5.0 (compatible; Googlebot/2.1)");
    document.cookie = "fm_land=at; Path=/";
    sessionStorage.setItem("fm_land_geprueft", "1");
    const { getByTestId } = zeige("/vergleich/girokonto");
    expect(getByTestId("ort").textContent).toBe("/vergleich/girokonto");
  });

  it("zeigt die Schweiz-Flagge nicht, solange kein Schweizer Vergleich öffentlich ist", () => {
    setzeBrowser(["de-DE"]);
    const { queryByLabelText } = sitzung("/vergleich/depot");
    expect(queryByLabelText("Österreich")).toBeTruthy();
    expect(queryByLabelText("Schweiz")).toBeNull();
  });

  it("fasst Seiten ohne Länderversion nicht an", () => {
    setzeBrowser(["de-AT"]);
    const { getByTestId } = zeige("/vergleich/steuersoftware");
    expect(getByTestId("ort").textContent).toBe("/vergleich/steuersoftware");
  });
});
