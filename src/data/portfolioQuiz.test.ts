import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { FERTIG_MAIL } from "@/data/brokerStart";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { aufteilung, BROKER, hausVon, inEuro, produktFuer, type Antworten, type Wert } from "@/data/portfolioQuiz";
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

  it("PDF: vorne der Plan, dahinter vier Seiten aus dem Blueprint", async () => {
    const xxl = readFileSync("public/guides/finanzmuslim-xxl-guide-mt6puo.pdf");
    const a: Antworten = { broker: "traders-place", gekauft: "nichts", weise: "monatlich", betrag: 50, lage: "mittel", werte: ["gold"] };
    const bytes = await planPdfBytes(a, new Uint8Array(xxl));
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(5);
    if (process.env.PLAN_PDF_AUS) writeFileSync(process.env.PLAN_PDF_AUS, bytes);
  });
});
