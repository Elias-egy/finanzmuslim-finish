import { readFileSync } from "node:fs";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ALTE_GUIDE_SCHLUESSEL } from "@/data/alteGuideAdressen";
import { quelleAus } from "@/data/halalFinanzCheckKern";
import { CHECK_SRC, checkSrc } from "@/data/halalFinanzCheck";
import { optinFreebie } from "@/data/optin";
import { festeRouten, nichtIndexiert, weiterleitungen } from "@/data/routen";
import { istGueltigeQuelle } from "@/lib/attribution";
import Guide from "./Guide";

// AG4 (23.11.2026; 24.11. Seite wie Acquisition.com, AG4-03): ein Guide, der Halal Starter Guide, Seite /guide, Vorname und E-Mail, keine Stufenfrage.
const Ort = () => <p data-testid="ort">{useLocation().pathname}</p>;

const zeige = () =>
  render(
    <MemoryRouter initialEntries={["/guide"]}>
      <Ort />
      <Routes>
        <Route path="/guide" element={<Guide />} />
        <Route path="/danke/:freebie" element={<p>danke</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe("Seite /guide", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("steht in den festen Routen, ist indexierbar und hat eine eigene Quelldatei", () => {
    const r = festeRouten.find((x) => x.pfad === "/guide");
    expect(r?.quelle).toEqual(["src/pages/Guide.tsx"]);
    expect(nichtIndexiert).not.toContain("/guide");
    expect(festeRouten.some((x) => x.pfad === "/halal-guide")).toBe(false);
  });

  it("alle alten Guide-Adressen führen auf /guide, ohne eigene Seite und ohne Schlüsselseite", () => {
    for (const von of ["/halal-guide", "/gratis/guide", "/anfaengerguide", ...ALTE_GUIDE_SCHLUESSEL.map((s) => `/dein-guide/${s}`)]) {
      expect(weiterleitungen, von).toContainEqual({ von, nach: "/guide" });
      expect(nichtIndexiert, von).not.toContain(von);
    }
    expect(ALTE_GUIDE_SCHLUESSEL).toEqual(expect.arrayContaining(["start-2026", "aufbau-2026", "tiefe-2026"]));
  });

  it("zeigt wie die Acquisition-Seite: Titel, Satz mit 30 Sekunden und Mail-Hinweis, Bild, Vorname, E-Mail, Knopf „Guide schicken“", () => {
    zeige();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Finde heraus, was dich vom Halal-Investieren abhält");
    expect(screen.getByText(/Hol dir deinen Halal Starter Guide in 30 Sekunden/).textContent).toBe(
      "Hol dir deinen Halal Starter Guide in 30 Sekunden. Bei Fragen antworte einfach auf meine Mail, ich helfe dir.",
    );
    expect(screen.getByRole("img", { name: /Halal Starter Guide/ })).toBeTruthy();
    expect(screen.getByLabelText("Vorname")).toBeTruthy();
    expect(screen.getByLabelText("E-Mail-Adresse")).toBeTruthy();
    expect(screen.queryByLabelText(/Nachname/i)).toBeNull();
    expect(screen.getByRole("button", { name: /^Guide schicken$/ })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/Fortgeschritten|Profi|Einsteiger|XXL|Blueprint|[–—]/);
  });

  it("schickt nach Vorname und E-Mail direkt auf /danke/guide, ohne Stufenfrage", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, text: async () => "{}" }));
    vi.stubGlobal("fetch", fetchMock);
    zeige();
    fireEvent.change(screen.getByLabelText("Vorname"), { target: { value: "Lea" } });
    fireEvent.change(screen.getByLabelText("E-Mail-Adresse"), { target: { value: "lea@example.com" } });
    expect(screen.queryByRole("checkbox")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^Guide schicken$/ }));
    await waitFor(() => expect(screen.getByTestId("ort").textContent).toBe("/danke/guide"));
    // Genau ein Aufruf (Make-Szenario Opt-in-Karte), kein Nachtrag mit Stufe.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("hook.eu1.make.com");
    const daten = JSON.parse(init.body as string);
    expect(daten).toMatchObject({ email: "lea@example.com", vorname: "Lea", freebie: "guide" });
    expect(daten).not.toHaveProperty("stufe");
    expect(daten).not.toHaveProperty("level");
  });

  it("der Guide ist der Halal Starter Guide mit Knopf „Guide schicken“", () => {
    const g = optinFreebie("guide")!;
    expect(g.name).toBe("Halal Starter Guide");
    expect(g.knopf).toBe("Guide schicken");
  });
});

describe("Guide-PDFs und Check-Quellen", () => {
  const lies = (p: string) => readFileSync(p);

  it("alle alten Starter-Guide-Adressen liefern denselben Guide", () => {
    const neu = lies("public/guides/finanzmuslim-halal-starter-guide.pdf");
    for (const alt of [
      "public/guides/finanzmuslim-einsteiger-guide.pdf",
      "public/guides/finanzmuslim-fortgeschritten-guide.pdf",
      "public/guides/finanzmuslim-profi-guide.pdf",
      "public/anfaengerguide.pdf",
    ])
      expect(lies(alt).equals(neu), alt).toBe(true);
  });

  it("der alte Belohnungslink liefert den Klartext-Guide, der nirgends verlinkt ist", () => {
    expect(lies("public/guides/finanzmuslim-xxl-guide-mt6puo.pdf").equals(lies("public/guides/finanzmuslim-halal-klartext-guide-k7r2xq.pdf"))).toBe(true);
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    expect(sitemap).not.toContain("klartext");
  });

  it("der Check nimmt quelle=guide und quelle=klartext an und zählt sie mit eigener Kennung", () => {
    expect(quelleAus("guide")).toBe("guide");
    expect(quelleAus("klartext")).toBe("klartext");
    for (const q of ["guide", "klartext"] as const) {
      const src = checkSrc(q, { kurz: "sb", out: "x", name: "x", domain: "x", produkt: "x" });
      expect(CHECK_SRC.test(src), src).toBe(true);
      expect(istGueltigeQuelle(src), src).toBe(true);
    }
  });
});
