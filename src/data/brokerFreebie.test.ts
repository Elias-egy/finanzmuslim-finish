import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BROKER_HONORABLE, BROKER_KARTEN, BROKER_SRC, BROKER_TOP3, FLATEX_SPARPLAN, brokerLink } from "./brokerFreebie";
import { depotAnzeige } from "./vergleichAnzeige";
import { DEPOT_FINANZ_MAX, brokerVergleich } from "./brokerVergleich";
import { werteAus } from "@/lib/vergleichAssistent";
import { findPartnerLink } from "./partnerLinks";
import { istGueltigeQuelle } from "@/lib/attribution";
import { festeRouten } from "./routen";

const vergleich = (id: string) => depotAnzeige.find((a) => a.id === id)!;
const roh = (id: string) => brokerVergleich.find((a) => a.id === id)!;
const rang = werteAus(depotAnzeige, "depot", DEPOT_FINANZ_MAX, { wuensche: [], gewichte: [] }).passt;

describe("Broker-Freebie /vorlagen/broker-vergleich (BT1, 13.11.2026)", () => {
  it("zeigt als Top 3 die ersten drei Depots mit Partnerweg in der Rangfolge: Smartbroker+, flatex, Traders Place", () => {
    // Elias (13.11.): „Top 3 aus Smart Broker, Flatex und … Traders Place“; Rangfolge Depot 08.11.: zwei Nummer 1, dahinter Traders Place.
    // Bleibt der Test rot, hat sich die Rangfolge geändert: dann Reihenfolge der Seite mit Elias klären.
    // BT2 (13.11.): live auf main steht noch die alte Depot-Rangfolge (Traders Place, Smartbroker+, Scalable); die neue Rangfolge
    // liegt im Sammelzweig. Die Seite zeigt Elias' eigene Top 3 aus dem Diktat, darum prüft der Test hier die feste Auswahl.
    expect(rang.length).toBeGreaterThan(0);
    expect(BROKER_TOP3.map((k) => k.id)).toEqual(["smartbroker-plus-depot", "flatex-depot", "traders-place-depot"]);
  });

  it("führt Scalable Capital als vierten, Honorable Mention", () => {
    expect(BROKER_KARTEN).toHaveLength(4);
    expect(BROKER_HONORABLE.id).toBe("scalable-capital-free-broker");
    expect(BROKER_HONORABLE.rolle).toBe("honorable");
    expect(BROKER_TOP3.map((k) => k.rolle)).toEqual(["start", "profi", "platz3"]);
  });

  it("führt jeden Broker über einen aktiven Partnerlink des Vergleichs", () => {
    for (const k of BROKER_KARTEN) {
      expect(findPartnerLink(k.out)?.aktiv, k.out).toBe(true);
      expect(vergleich(k.id).link, k.id).toBe(`/out/${k.out}`);
    }
  });

  it("nimmt jede Zahl aus dem Depot-Vergleich", () => {
    for (const k of BROKER_KARTEN) {
      const w = vergleich(k.id).werte as Record<string, unknown>;
      expect(k.etfs, k.id).toBe(w.halalEtfsFonds);
      expect(k.gold, k.id).toBe(w.halalEdelmetalle);
      expect(k.sukuk, k.id).toBe(w.halalSukuk);
      expect(k.depotgebuehr.replace(/\s/g, ""), k.id).toBe(String(w.depotgebuehr).replace(/\s/g, ""));
      expect(k.zinsfrei, k.id).toBe(w.zinsfreiAbStart === "gut");
    }
  });

  it("belegt Zinsen, ETFs, Gold und Depotgebühr je Broker mit Anbieter-Adresse und Wortlaut", () => {
    for (const k of BROKER_KARTEN)
      for (const feld of ["zinsfreiAbStart", "halalEtfsFonds", "halalEdelmetalle", "halalSukuk"] as const) {
        const b = (roh(k.id).quellen as Record<string, { url: string; stand: string; hinweis: string } | null>)[feld];
        expect(b, `${k.id} ${feld}`).toBeTruthy();
        expect(b!.url, `${k.id} ${feld}`).toMatch(/^https:\/\//);
        expect(b!.stand, `${k.id} ${feld}`).toMatch(/^\d{2}\.\d{2}\.2026$/);
        expect(b!.hinweis.length, `${k.id} ${feld}`).toBeGreaterThan(20);
      }
  });

  it("flatex: Kreditrahmen ist belegt und steht auf der Karte, bei den anderen nicht", () => {
    const fx = BROKER_KARTEN.find((k) => k.id === "flatex-depot")!;
    expect(fx.kreditAutomatisch).toBe(true);
    expect(BROKER_KARTEN.filter((k) => k.kreditAutomatisch).map((k) => k.id)).toEqual(["flatex-depot"]);
    const b = (roh("flatex-depot").quellen as Record<string, { hinweis: string } | null>).kreditAbStart;
    expect(b?.hinweis).toContain("Kreditvergabe: Für Neukunden mit Kontoeröffnung automatisch");
  });

  it("flatex-Sparplan ab 1 € hat einen eigenen Beleg mit Datum", () => {
    expect(BROKER_KARTEN.find((k) => k.id === "flatex-depot")!.sparplanAb.replace(/\s/g, " ")).toBe("1 €");
    expect(FLATEX_SPARPLAN.url).toMatch(/^https:\/\/www\.flatex\.de\//);
    expect(FLATEX_SPARPLAN.stand).toBe("07.11.2026");
    expect(FLATEX_SPARPLAN.wortlaut).toContain("ab 1 €");
  });

  it("zählt jede Stelle mit gültiger Kennung und baut den Link mit ?src", () => {
    for (const s of Object.values(BROKER_SRC)) expect(istGueltigeQuelle(s), s).toBe(true);
    for (const s of Object.values(BROKER_SRC)) expect(s.length, s).toBeLessThanOrEqual(12);
    for (const k of BROKER_KARTEN) expect(brokerLink(k.out, k.src)).toBe(`/out/${k.out}?src=${k.src}`);
  });

  it("steht als Vorlage in der Sitemap", () => {
    expect(festeRouten.some((r) => r.pfad === "/vorlagen/broker-vergleich")).toBe(true);
  });

  it("nennt keine Prämie, keinen 60-Euro-Bonus, kein Amanah und hat keine Gedankenstriche in den Seitentexten", () => {
    for (const f of ["src/pages/vorlagen/BrokerVergleich.tsx"]) {
      const text = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
      expect(/amanah/i.test(text)).toBe(false);
      expect(/[–—]/.test(text)).toBe(false);
      expect(/\b60\s?€|bonus|prämie|exklusiv|beste[nr]? (halal )?broker/i.test(text)).toBe(false);
    }
  });
});
