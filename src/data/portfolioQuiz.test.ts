import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { FERTIG_MAIL } from "@/data/brokerStart";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import {
  aufteilung,
  beantwortet,
  BROKER,
  FRAGEN,
  hausVon,
  inEuro,
  produktFuer,
  REGIONEN,
  type Antworten,
  type Wert,
} from "@/data/portfolioQuiz";
import {
  ALLE_BAUSTEINE,
  anlagenJeBaustein,
  anlegertyp,
  produkteFuerStil,
  richtungAendern,
  richtungsSatz,
  risiko,
  sauberName,
  STILE,
  stilVorwahl,
  topPerformer,
} from "@/data/portfolioDashboard";
import { planPdfBytes } from "@/lib/planPdf";

const ALLE_WERTE: Wert[][] = [[], ["gold"], ["ruhig"], ["aktien"], ["krypto"], ["gold", "ruhig", "aktien", "krypto"]];

describe("Portfolioplan (CV26P)", () => {
  it("jede Aufteilung ergibt 100 %, Einzelaktien und Krypto nur gewählt und zusammen höchstens 15 %", () => {
    for (const lage of ["bald", "mittel", "lang"] as const)
      for (const werte of ALLE_WERTE) {
        const t = aufteilung({ lage, werte });
        expect(t.reduce((s, x) => s + x.prozent, 0)).toBe(100);
        const spiel = t.filter((x) => x.baustein === "aktien" || x.baustein === "krypto");
        for (const x of spiel) expect(werte).toContain(x.baustein);
        expect(spiel.reduce((s, x) => s + x.prozent, 0)).toBeLessThanOrEqual(15);
        if (lage === "bald") expect(spiel).toHaveLength(0);
      }
  });

  it("Euro-Beträge ergeben genau den Betrag", () => {
    for (const betrag of [25, 50, 100, 250, 500, 1000, 5000, 10000])
      for (const werte of ALLE_WERTE) {
        const e = inEuro(aufteilung({ lage: "lang", werte }), betrag);
        expect(e.reduce((s, n) => s + n, 0)).toBe(betrag);
      }
  });

  it("jede vorgeschlagene Anlage ist beim gewählten Broker mit Einzelbeleg kaufbar", () => {
    for (const b of BROKER.filter((x) => x.id !== "anderer")) {
      const haus = hausVon(b.id);
      expect(haus).toBeTruthy();
      for (const baustein of ["etf", "sukuk", "gold"] as const) {
        const p = produktFuer(baustein, b.id);
        if (p) expect(ANLAGEN_KAUFBAR[p.anlage.isin!].kaufbar.some((k) => k.haus === haus)).toBe(true);
      }
      expect(produktFuer("etf", b.id)).toBeTruthy();
    }
  });

  it("FERTIG-Mail: Betreff FERTIG, nur „Fertig“ und der Hinweis, kurz genug für den Zoho-Antworter (220 Zeichen)", () => {
    const url = new URL(FERTIG_MAIL.href);
    expect(url.searchParams.get("subject")).toBe("FERTIG");
    const body = url.searchParams.get("body")!;
    expect(body.startsWith("Fertig")).toBe(true);
    expect(body).toContain("Screenshot hinzufügen und abschicken");
    expect(body.length).toBeLessThanOrEqual(220);
    expect(body.toLowerCase()).not.toMatch(/nicht\s+(noch\s+)?fertig|noch\s+nicht/);
  });

  it("PDF: drei Seiten im Stil des Dashboards, ohne kopierte Blueprint-Seiten (CV27P)", async () => {
    const a: Antworten = { broker: "traders-place", gekauft: "nichts", weise: "monatlich", betrag: 50, lage: "mittel", werte: ["gold"], region: "usa" };
    const bytes = await planPdfBytes(a, { name: "Elias", region: "usa", stile: { sukuk: "etf" } });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(3);
    expect(doc.getTitle()).toBe("Der Halal-Investmentplan von Elias");
    if (process.env.PLAN_PDF_AUS) writeFileSync(process.env.PLAN_PDF_AUS, bytes);
  });

  it("PDF: auch der längste Plan (alle Wünsche, Welt bei flatex) bleibt bei drei Seiten (CV28P)", async () => {
    for (const broker of ["flatex", "anderer", "smartbroker"] as const) {
      const a: Antworten = { broker, gekauft: "etf", weise: "einmal", betrag: 10000, lage: "lang", werte: ["gold", "ruhig", "aktien", "krypto"], region: "welt" };
      const bytes = await planPdfBytes(a, {});
      const doc = await PDFDocument.load(bytes);
      expect(doc.getPageCount()).toBe(3);
      if (process.env.PLAN_PDF_AUS_LANG && broker === "flatex") writeFileSync(process.env.PLAN_PDF_AUS_LANG, bytes);
    }
  });

  it("sieben Fragen, die siebte ist die Richtung; sie setzt den ETF-Stil vor (CV28P)", () => {
    expect(FRAGEN).toHaveLength(7);
    expect(FRAGEN[6].id).toBe("region");
    expect(REGIONEN.map((r) => r.id)).toEqual(STILE.etf!.map((s) => s.id));
    const a: Antworten = { broker: "traders-place", gekauft: "nichts", weise: "monatlich", betrag: 100, lage: "lang", werte: [] };
    expect(beantwortet(a, "region")).toBe(false);
    expect(stilVorwahl("etf", { ...a, region: "usa" })?.stil.id).toBe("usa");
    expect(stilVorwahl("etf", { ...a, region: "schwellen" })?.stil.id).toBe("schwellen");
    // Eigene Wahl im Dashboard geht vor.
    expect(stilVorwahl("etf", { ...a, region: "usa" }, "welt")?.stil.id).toBe("welt");
    // Europa gibt es bei Traders Place nicht: dann der erste Stil, und der Satz sagt „stattdessen“.
    const eu = stilVorwahl("etf", { ...a, region: "europa" });
    expect(eu?.stil.id).toBe("welt");
    expect(richtungsSatz({ ...a, region: "europa" }, eu?.stil, "Traders Place")).toBe("Du wolltest Europa. Bei Traders Place geht stattdessen:");
    expect(richtungsSatz({ ...a, region: "usa" }, stilVorwahl("etf", { ...a, region: "usa" })?.stil, "Traders Place")).toBe(
      "Du wolltest USA. Das geht bei Traders Place:",
    );
  });

  it("Prozente je Baustein summieren sich auf 100, mit jeder Richtung (CV28P)", () => {
    for (const lage of ["bald", "mittel", "lang"] as const)
      for (const werte of ALLE_WERTE)
        for (const r of REGIONEN) {
          const t = aufteilung({ lage, werte, region: r.id });
          expect(t.reduce((s, x) => s + x.prozent, 0)).toBe(100);
          for (const x of t) expect(Number.isInteger(x.prozent)).toBe(true);
        }
  });

  it("alle Anlagen eines Stils sind beim Depot mit Einzelbeleg kaufbar, Gold mit Royal Mint als Favorit (CV28P)", () => {
    for (const b of BROKER.filter((x) => x.id !== "anderer")) {
      const haus = hausVon(b.id);
      for (const stile of Object.values(STILE))
        for (const stil of stile!)
          for (const p of produkteFuerStil(stil, b.id))
            if (p.anlage.isin) expect(ANLAGEN_KAUFBAR[p.anlage.isin].kaufbar.some((k) => k.haus === haus), `${b.id} ${p.anlage.name}`).toBe(true);
    }
    const welt = produkteFuerStil(STILE.etf!.find((s) => s.id === "welt")!, "traders-place");
    expect(welt.length).toBeGreaterThan(1);
    const a: Antworten = { broker: "traders-place", lage: "mittel", werte: [], region: "usa" };
    const gold = anlagenJeBaustein(aufteilung(a), a).find((x) => x.anteil.baustein === "gold")!;
    expect(gold.favorit?.anlage.isin).toBe("XS2115336336");
    expect(gold.produkte.some((p) => p.anlage.isin === "XS2115336336")).toBe(false);
  });

  it("Top-Performer: fünf Anlagen mit Zertifikat, absteigend nach einem Jahr, jede mit Kurve (CV28P)", () => {
    const top = topPerformer(5);
    expect(top).toHaveLength(5);
    for (let i = 1; i < top.length; i++) expect(top[i - 1].r1!).toBeGreaterThanOrEqual(top[i].r1!);
    for (const p of top) {
      expect(p.anlage.zertifikatArt).toBeTruthy();
      expect(p.verlauf!.length).toBeGreaterThan(1);
    }
  });

  it("Richtung ändern: Summe bleibt 100, Einzelaktien und Krypto zusammen höchstens 15, Typ folgt der Richtung (CV27P)", () => {
    for (const lage of ["bald", "mittel", "lang"] as const) {
      let t = aufteilung({ lage, werte: [] });
      for (const b of ALLE_BAUSTEINE) for (let i = 0; i < 6; i++) t = richtungAendern(t, b, true);
      expect(t.reduce((s, x) => s + x.prozent, 0)).toBe(100);
      expect(t.filter((x) => x.baustein === "aktien" || x.baustein === "krypto").reduce((s, x) => s + x.prozent, 0)).toBeLessThanOrEqual(15);
      expect(risiko(t)).toBeGreaterThanOrEqual(5);
      expect(risiko(t)).toBeLessThanOrEqual(95);
    }
    expect(anlegertyp(aufteilung({ lage: "bald", werte: [] })).id).toBe("planer");
    expect(anlegertyp(aufteilung({ lage: "lang", werte: ["krypto"] })).id).toBe("pionier");
    expect(anlegertyp(aufteilung({ lage: "mittel", werte: [] })).id).toBe("baumeister");
  });

  it("Vorname aus der Mail: nur Buchstaben, groß am Anfang", () => {
    expect(sauberName("elias")).toBe("Elias");
    expect(sauberName("<script>")).toBe("Script");
    expect(sauberName("<>")).toBeUndefined();
    expect(sauberName(null)).toBeUndefined();
  });
});
