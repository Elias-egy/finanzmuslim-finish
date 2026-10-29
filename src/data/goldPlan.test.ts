import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  BEKANNTE_GOLD,
  BROKER_SATZ,
  DEPOTS_MIT_ALLEN,
  DEPOTS_ZINSFREI,
  ETC_BEISPIELE,
  GOLD_BETRAEGE,
  GOLD_DEPOT_LOGOS,
  GOLD_MONATLICH,
  GOLD_PFAD,
  gramm,
  grammText,
} from "./goldPlan";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { GOLD_ISINS, edelmetallVergleich } from "./edelmetallVergleich";
import { anlageBySlug } from "./halalAnlagen";
import { depotAnzeige } from "./vergleichAnzeige";
import { empfehlbar } from "./vergleichAssistent";
import { alleRouten, bewusstDraussen, nichtIndexiert } from "./routen";

describe("Gold-Plan", () => {
  it("die Geld-Frage hat drei Beträge, der Startwert ist einer davon", () => {
    expect(GOLD_BETRAEGE).toHaveLength(3);
    expect(GOLD_BETRAEGE).toContain(GOLD_MONATLICH);
  });

  it("Gramm rechnen mit dem Goldpreis und lesen sich deutsch", () => {
    expect(gramm(100)).toBeGreaterThan(0);
    expect(grammText(0.834)).toBe("0,8");
    expect(grammText(30.05)).toBe("30");
  });

  it("die Zahl bei finanzen.net zero stimmt mit den Kaufbar-Daten, jedes Stück mit Anbieter-Beleg", () => {
    const ja = GOLD_ISINS.filter((i) =>
      ANLAGEN_KAUFBAR[i]?.kaufbar.some((k) => k.anbieter === "finanzen.net zero" && k.beleg.quelle === "anbieter"),
    );
    const nicht = GOLD_ISINS.filter((i) => ANLAGEN_KAUFBAR[i]?.nichtImAngebot.includes("finanzen.net zero"));
    const zero = BEKANNTE_GOLD.find((d) => d.name === "finanzen.net zero")!;
    expect(ja.length + nicht.length).toBe(GOLD_ISINS.length);
    expect(zero.gross).toBe(`${ja.length} von ${GOLD_ISINS.length}`);
  });

  it("die Depot-Logos im Aufruf sind empfehlbar und haben alle Gold-ETCs", () => {
    for (const d of GOLD_DEPOT_LOGOS) {
      expect(depotAnzeige.find((a) => a.id === d.id)?.domain).toBe(d.domain);
      expect(empfehlbar(d.id)).toBe(true);
      const imVergleich = edelmetallVergleich.find((a) => a.id === d.id);
      expect(imVergleich?.werte.gold).toBe(`${GOLD_ISINS.length} von ${GOLD_ISINS.length}`);
    }
  });

  it("jedes ETC-Beispiel gibt es in der Anlagen-Datenbank, mit Zertifikat und unter den Gold-ETCs des Vergleichs", () => {
    for (const e of ETC_BEISPIELE) {
      const a = anlageBySlug(e.slug);
      expect(a).toBeDefined();
      expect(GOLD_ISINS).toContain(a!.isin);
    }
  });

  it("„nicht jeder Broker“: die Zahl kommt aus dem Edelmetall-Vergleich, alle Depots dort sind zinsfrei", () => {
    expect(DEPOTS_ZINSFREI).toBe(edelmetallVergleich.length);
    expect(DEPOTS_MIT_ALLEN).toBeGreaterThan(0);
    expect(DEPOTS_MIT_ALLEN).toBeLessThan(DEPOTS_ZINSFREI);
    for (const a of edelmetallVergleich) expect(a.werte.zinsfreiAbStart).not.toBe("schlecht");
    expect(BROKER_SATZ).toContain(`nur ${DEPOTS_MIT_ALLEN} alle`);
  });

  it("die Seite ist versteckt, aber vorgerendert: noindex, nicht in der Sitemap, bewusst draußen", () => {
    expect(nichtIndexiert).toContain(GOLD_PFAD);
    expect(alleRouten().map((r) => r.pfad)).not.toContain(GOLD_PFAD);
    expect(bewusstDraussen.map((b) => b.pfad)).toContain("/dein-gold/:schluessel");
    expect(readFileSync("src/pages/GoldPlan.tsx", "utf8")).toContain("noindex");
  });
});
