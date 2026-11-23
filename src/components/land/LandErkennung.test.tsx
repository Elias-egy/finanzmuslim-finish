import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/data/land", async (original) => {
  const echt = await original<typeof import("@/data/land")>();
  // Test: Österreich hat eine fertige Depot-Liste, die Schweiz nicht.
  return { ...echt, landFreigegeben: (land: string, pfad: string) => land === "de" || (land === "at" && pfad.includes("depot")) };
});

import { LandErkennung } from "@/components/land/LandErkennung";

const Ort = () => <p data-testid="ort">{useLocation().pathname}</p>;

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

  it("fasst Seiten ohne Länderversion nicht an", () => {
    setzeBrowser(["de-AT"]);
    const { getByTestId } = zeige("/vergleich/steuersoftware");
    expect(getByTestId("ort").textContent).toBe("/vergleich/steuersoftware");
  });
});
