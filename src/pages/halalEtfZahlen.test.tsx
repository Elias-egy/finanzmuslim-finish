import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import HalalEtf from "./blog/HalalEtf";
import { anker, etfListe, kaufbarBei, sparplanAnzahl } from "@/data/halalEtfListe";

// SEO81 (25.11.2026): Fließtext und Tabelle von /blog/halal-etf nannten verschiedene Depotzahlen (Text 27, Tabelle 34).
// Der Text rechnet jetzt aus denselben Quellen wie Karte und Tabelle; dieser Test hält das fest.
describe("/blog/halal-etf: Zahlen in Text und Tabelle gleich", () => {
  beforeAll(() => {
    const leer = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    vi.stubGlobal("ResizeObserver", leer);
    vi.stubGlobal("IntersectionObserver", leer);
  });

  afterEach(() => {
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  });

  const zeige = () =>
    render(
      <MemoryRouter initialEntries={["/blog/halal-etf"]}>
        <HalalEtf />
      </MemoryRouter>,
    ).container;

  /** Zahl in der Spalte „Depots“ der ersten Tabelle, je ETF-Zeile. */
  const tabellenZahlen = (c: HTMLElement) => {
    const tabelle = c.querySelector("table")!;
    const kopf = [...tabelle.querySelectorAll("thead th")].map((th) => th.textContent ?? "");
    const spalte = kopf.findIndex((t) => t.startsWith("Depots"));
    expect(spalte).toBeGreaterThan(0);
    return [...tabelle.querySelectorAll("tbody tr")].map((tr) => Number(tr.querySelectorAll("td")[spalte - 1].textContent));
  };

  it("die Tabelle zeigt für jeden ETF die berechnete Zahl", () => {
    const c = zeige();
    expect(tabellenZahlen(c)).toEqual(etfListe.map((e) => kaufbarBei(e.isin).length));
  });

  it("jeder Eintrag nennt im Text dieselbe Kaufbar-Zahl wie die Tabelle", () => {
    const c = zeige();
    const tabelle = tabellenZahlen(c);
    etfListe.forEach((e, i) => {
      const text = c.querySelector(`article#${anker(e)}`)!.textContent ?? "";
      const treffer = [...text.matchAll(/(?:kannst du ihn bei|kaufbar bei) (\d+)/g)].map((m) => Number(m[1]));
      for (const zahl of treffer) expect(zahl, `Platz ${e.platz}`).toBe(tabelle[i]);
    });
    // Platz 1, 2 und 3 nennen die Zahl wirklich (nicht still weggefallen).
    expect(c.querySelector(`article#${anker(etfListe[0])}`)!.textContent).toMatch(/kannst du ihn bei \d+ Depots/);
  });

  it("„Das Wichtigste“ nennt die Zahl von Platz 1 aus der Tabelle", () => {
    const c = zeige();
    const wichtig = c.querySelector("section#das-wichtigste, #das-wichtigste")!.closest("section")!.textContent ?? "";
    const m = /bei (\d+) Depots zu haben/.exec(wichtig);
    expect(m, "Satz mit Depotzahl fehlt in „Das Wichtigste“").not.toBeNull();
    expect(Number(m![1])).toBe(tabellenZahlen(c)[0]);
  });

  it("jede Sparplan-Zahl im Text ist die berechnete", () => {
    const c = zeige();
    const alles = c.textContent ?? "";
    const erlaubt = new Set(etfListe.map((e) => sparplanAnzahl(e)));
    for (const m of alles.matchAll(/Sparplan (?:darauf )?(?:bieten|bei) (\d+) Depots|bei (\d+) Depots als Sparplan/g)) {
      expect(erlaubt.has(Number(m[1] ?? m[2]))).toBe(true);
    }
    const eins = c.querySelector(`article#${anker(etfListe[0])}`)!.textContent ?? "";
    expect(eins).toContain(`Einen Sparplan darauf bieten ${sparplanAnzahl(etfListe[0])} Depots`);
    // Aussage „so viele wie bei keinem anderen ETF“ stimmt nur, solange Platz 1 vorn liegt.
    expect(sparplanAnzahl(etfListe[0])).toBe(Math.max(...etfListe.map((e) => sparplanAnzahl(e))));
    expect(kaufbarBei(etfListe[0].isin).length).toBe(Math.max(...etfListe.map((e) => kaufbarBei(e.isin).length)));
  });

  it("kein Platzhalter bleibt im sichtbaren Text stehen", () => {
    const c = zeige();
    expect(c.textContent).not.toMatch(/\{(?:kaufbar|sparplan)\}/);
  });

  it("das Video steht bei etwa 30 % des Textes, nicht bei Platz 1", () => {
    const c = zeige();
    const video = c.querySelector("figure button[aria-label^='Video abspielen']")!.closest("figure")!;
    const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
    let gesamt = 0;
    let davor = 0;
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!davor && video.contains(n)) davor = gesamt;
      gesamt += (n.textContent ?? "").length;
    }
    const anteil = davor / gesamt;
    expect(anteil).toBeGreaterThan(0.25);
    expect(anteil).toBeLessThan(0.4);
    // Nicht direkt unter oder über einer Tabelle.
    expect(video.previousElementSibling?.tagName).not.toBe("TABLE");
    expect(video.nextElementSibling?.tagName).not.toBe("TABLE");
    // Klick-Vorschau bleibt: noch kein iframe.
    expect(c.querySelector("iframe")).toBeNull();
  });

  it("das Schema enthält einen VideoObject-Knoten mit echten Werten", () => {
    zeige();
    const knoten = [...document.head.querySelectorAll('script[type="application/ld+json"]')]
      .flatMap((s) => {
        const j = JSON.parse(s.textContent ?? "[]");
        return (Array.isArray(j) ? j : [j]).flatMap((k) => k["@graph"] ?? [k]);
      })
      .find((k) => k["@type"] === "VideoObject");
    expect(knoten).toBeTruthy();
    for (const f of ["name", "description", "thumbnailUrl", "uploadDate", "embedUrl", "contentUrl"]) expect(knoten[f]).toBeTruthy();
    expect(knoten.uploadDate).toMatch(/^2026-05-19T/);
    expect(knoten.embedUrl).toBe("https://www.youtube.com/embed/uO0ZnlaFolw");
  });
});
