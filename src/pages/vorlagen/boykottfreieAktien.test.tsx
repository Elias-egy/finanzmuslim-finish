import { render } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import BoykottfreieAktien from "./BoykottfreieAktien";
import BoykottfreieAktienVoll from "./BoykottfreieAktienVoll";
import { aktien } from "@/data/top100Aktien";
import {
  alleBoykottfrei,
  AUSGENOMMEN,
  BF_QUELLE,
  BF_VOLL_PFAD,
  NACHGEPRUEFT,
  neuListe,
  videoListe,
  videoNachgeprueft,
  weitereListe,
} from "@/data/boykottfreieAktien";
import { nichtIndexiert } from "@/data/routen";
import { stimmenAn, stimmenUnten } from "@/data/checkStimmen";
import { istGueltigeQuelle } from "@/lib/attribution";
import { checkSrc, quelleAus } from "@/data/halalFinanzCheck";

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

const zeige = (Seite: () => JSX.Element) =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Seite />
      </MemoryRouter>
    </HelmetProvider>,
  );

/** Die 26 aus dem Video in der Reihenfolge des Skripts (Vault fb8-05-rf-boykottfreie-aktien.md). */
const VIDEO_NAMEN = [
  "Zalando", "ASML", "Eli Lilly", "Lowe’s", "Adobe", "Shiseido", "Vestas", "Roblox", "Haleon", "Micron", "Makita", "Stryker",
  "Garmin", "Linde", "Essity", "Vertex Pharmaceuticals", "Best Buy", "Lam Research", "Crocs", "BHP", "Gilead Sciences", "Cummins",
  "Alcon", "Autoliv", "Atlassian", "ResMed",
];

describe("Freebie Halal und boykottfrei: Daten", () => {
  it("teilt die 26 aus dem Video in boykottfrei und nachgeprüft, beide in der Reihenfolge des Videos (BK6)", () => {
    expect(videoListe.length + videoNachgeprueft.length).toBe(26);
    expect(videoListe.map((z) => z.name)).toEqual(VIDEO_NAMEN.filter((n) => videoListe.some((z) => z.name === n)));
    expect([...videoListe, ...videoNachgeprueft].map((z) => z.name).sort()).toEqual([...VIDEO_NAMEN].sort());
    expect(videoNachgeprueft.map((z) => z.ticker).sort()).toEqual(Object.keys(NACHGEPRUEFT).sort());
    for (const z of [...videoListe, ...videoNachgeprueft]) expect(z.text.length).toBeGreaterThan(2);
  });

  it("nimmt Aktien der 100 Halal-Aktien plus die neu geprüften, ohne Doppelte (BK6)", () => {
    const halal = new Set(aktien.map((a) => a.ticker));
    const t = alleBoykottfrei.map((z) => z.ticker);
    expect(new Set(t).size).toBe(t.length);
    for (const z of [...videoListe, ...weitereListe]) expect(halal.has(z.ticker)).toBe(true);
    for (const z of neuListe) expect(halal.has(z.ticker)).toBe(false);
    expect(alleBoykottfrei).toHaveLength(videoListe.length + neuListe.length + weitereListe.length);
    expect(alleBoykottfrei).toHaveLength(40);
    for (const z of videoNachgeprueft) expect(t).not.toContain(z.ticker);
  });

  it("enthält keine der ausdrücklich ausgenommenen Aktien", () => {
    const t = new Set(alleBoykottfrei.map((z) => z.ticker));
    for (const x of AUSGENOMMEN) expect(t.has(x)).toBe(false);
    const namen = alleBoykottfrei.map((z) => z.name).join("|");
    for (const n of ["Ecolab", "AMD", "Lululemon", "Colgate", "Tesla", "Nike", "Oréal", "Monster"]) expect(namen).not.toContain(n);
  });

  it("hat zu jeder Aktie ein Logo", () => {
    for (const z of alleBoykottfrei) expect(existsSync(`public/logos/aktien/${z.ticker.replace(/[^A-Za-z0-9]+/g, "-")}.png`)).toBe(true);
  });

  it("legt den Pfad nach dem Muster der anderen Freebies an und hält ihn aus der Sitemap", () => {
    expect(BF_VOLL_PFAD).toMatch(/^\/vorlagen\/boykottfreie-aktien\/voll-[a-z0-9]{4}$/);
    expect(nichtIndexiert).toContain(BF_VOLL_PFAD);
    expect(readFileSync("public/sitemap.xml", "utf8")).not.toContain("boykottfreie-aktien");
  });

  it("hat eine eigene Stelle für Check und Stimmen", () => {
    expect(quelleAus(BF_QUELLE)).toBe(BF_QUELLE);
    const a = stimmenAn(BF_QUELLE, false).map((s) => s.id);
    const u = stimmenUnten(BF_QUELLE, false).map((s) => s.id);
    expect(a).toHaveLength(2);
    expect(u).toHaveLength(2);
    for (const id of u) expect(a).not.toContain(id);
    expect(istGueltigeQuelle(checkSrc(BF_QUELLE, { kurz: "fl" } as never))).toBe(true);
  });
});

describe("Freebie Halal und boykottfrei: Seite", () => {
  it("zeigt alle Zeilen, genau einen Check-Kasten im ersten Drittel und keine Partnerknöpfe", () => {
    const { container } = zeige(BoykottfreieAktienVoll);
    const zeilen = container.querySelectorAll("[data-video-liste] [data-aktie], [data-neu-liste] [data-aktie], [data-weitere-liste] [data-aktie]");
    expect(zeilen).toHaveLength(alleBoykottfrei.length);
    expect(container.querySelectorAll("[data-nachgeprueft-liste] [data-aktie]")).toHaveLength(videoNachgeprueft.length);
    const kaesten = container.querySelectorAll(`[data-check-einstieg='${BF_QUELLE}']`);
    expect(kaesten).toHaveLength(1);
    const vorher = [...zeilen].filter((z) => kaesten[0].compareDocumentPosition(z) & Node.DOCUMENT_POSITION_PRECEDING);
    expect(vorher.length).toBeGreaterThan(0);
    expect(vorher.length).toBeLessThanOrEqual(Math.ceil(zeilen.length / 3));
    expect(container.querySelector("a[href*='/out/'], a[href*='/vergleich/'], a[href$='.pdf'], [download]")).toBeNull();
    expect(container.querySelector("[data-naechster-teil]")).not.toBeNull();
  });

  it("nennt die Zahl im Titel richtig und keine ausgenommene Aktie im Text", () => {
    const { container } = zeige(BoykottfreieAktienVoll);
    expect(container.querySelector("h1")?.textContent).toBe(`Halal und boykottfrei: ${alleBoykottfrei.length} Aktien`);
    const text = container.textContent ?? "";
    for (const n of ["Ecolab", "AMD", "Lululemon", "Colgate", "Tesla", "Nike", "Oréal", "Monster", "Microsoft", "Ferrari", "Amphenol", "Arista"]) expect(text).not.toContain(n);
  });

  it("zeigt „So haben wir geprüft“ mit den Quellen und Ständen, ohne Gedankenstrich", () => {
    const { container } = zeige(BoykottfreieAktienVoll);
    const p = container.querySelector("[data-pruefung]")!.textContent ?? "";
    for (const w of ["BDS", "Who Profits", "A/HRC/63/20", "AFSC", "06.12.2024", "21.11.2026"]) expect(p).toContain(w);
    expect(container.textContent).not.toMatch(/[–—]| - /);
    expect(container.textContent).toMatch(/Kein Boykott-Befund/);
  });

  it("der Teaser ist kurz, hat den Kasten und listet nur fünf", () => {
    const { container } = zeige(BoykottfreieAktien);
    expect(container.querySelectorAll("[data-aktie]")).toHaveLength(5);
    expect(container.querySelectorAll(`[data-check-einstieg='${BF_QUELLE}']`)).toHaveLength(1);
  });
});
