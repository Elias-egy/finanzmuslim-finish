import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FREEBIE_PDFS } from "@/data/freebiePdfs";
import { optinFreebie, vollPfad } from "@/data/optin";
import { PLAN_PFAD } from "@/data/portfolioPlan";
import { ETF_PFAD } from "@/data/etfPlan";
import { GOLD_PFAD } from "@/data/goldPlan";
import { BOYKOTT_PFAD } from "@/data/boykottListe";

describe("PDF je Freebie (MC7d15)", () => {
  it("jede Seite stimmt mit ihrer Adresse überein", () => {
    expect(FREEBIE_PDFS.aktie.seite).toBe(vollPfad(optinFreebie("top-100-halal-aktien")!));
    expect(FREEBIE_PDFS.liste.seite).toBe(vollPfad(optinFreebie("halal-anlagen")!));
    expect(FREEBIE_PDFS.vertrag.seite).toBe(vollPfad(optinFreebie("vertrags-ampel")!));
    expect(FREEBIE_PDFS.plan.seite).toBe(PLAN_PFAD);
    expect(FREEBIE_PDFS.etf.seite).toBe(ETF_PFAD);
    expect(FREEBIE_PDFS.gold.seite).toBe(GOLD_PFAD);
    expect(FREEBIE_PDFS.boykott.seite).toBe(BOYKOTT_PFAD);
  });

  it("jedes PDF liegt unter /downloads/v/ und existiert als Datei, robots.txt sperrt den Ordner", () => {
    for (const pdf of Object.values(FREEBIE_PDFS)) {
      expect(pdf.datei.startsWith("/downloads/v/")).toBe(true);
      expect(existsSync(`public${pdf.datei}`)).toBe(true);
    }
    expect(readFileSync("public/robots.txt", "utf8")).toContain("Disallow: /downloads/v/");
  });
});
