/**
 * Der Depot-Aufruf aller Freebies wie Seite 8 des XXL-Guides (Elias, 31.10.2026, MC7d13d: „Trade Republic … Zinsen bei
 * XTB, und dann hast du die drei besten da liegen. Das ist auch nicht schlecht.“; Vault
 * `raw/2026-10-31-elias-mc7d13d-werbung-plan-kasten-anleitung.md`, Regel `memory/freebie-top3-statt-rot-guide-unten.md`).
 * Erst der Check mit zwei bekannten Depots, dann die drei besten. Alles aus dem Depot-Vergleich gezählt, nichts von Hand.
 */
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { werteAus } from "@/lib/vergleichAssistent";

const werteVon = (id: string) => (depotAnzeige.find((a) => a.id === id)?.werte ?? {}) as Record<string, unknown>;

/**
 * Gezählt wie `scripts/xxl-schnappschuss.ts`: die drei besten Depots ohne automatischen Kredit, in der Reihenfolge des
 * Depot-Vergleichs. Der Test hält fest, dass alle drei ab dem ersten Tag ohne Zinsen sind.
 */
export const TOP3 = werteAus(depotAnzeige, "depot", DEPOT_FINANZ_MAX, { wuensche: [], gewichte: [] })
  .passt.filter((t) => !t.kredit)
  .slice(0, 3)
  .map((t, i) => {
    const w = t.anbieter.werte as Record<string, unknown>;
    return {
      id: t.anbieter.id,
      name: t.anbieter.name,
      domain: t.anbieter.domain ?? "",
      nr1: i === 0,
      zinsfreiAbStart: w.zinsfreiAbStart === "gut",
      haken: [
        w.halalEtfsFonds ? `${w.halalEtfsFonds} Islamic ETFs und Fonds` : null,
        String(w.sparrate ?? "").match(/^([\d.,]+)\s*€/) ? `Sparplan ab ${String(w.sparrate).match(/^([\d.,]+)/)![1]} €` : null,
        /^0\s*€$/.test(String(w.depotgebuehr ?? "")) ? "Keine Depotgebühr" : null,
      ].filter((h): h is string => h !== null),
    };
  });

export const DEPOT_ANZAHL = depotAnzeige.length;

/**
 * Der Check mit zwei bekannten Depots wie im XXL-Guide (Seite 8) und im Portfolio-Plan (Elias, 28.10.2026, MC3c:
 * Trade Republic gelb, XTB mit leichtem Rot, „nur“ klein davor). Zahl und Zinsen aus dem Depot-Vergleich: XTB steht dort
 * mit zinsfreiAbStart „schlecht“ (Anbieter-Beleg xtb.com/de/zinsen), Trade Republic mit seiner Zahl im Feld halalEtfsFonds.
 */
export const CHECK = [
  {
    id: "trade-republic-depot",
    name: "Trade Republic",
    domain: "traderepublic.com",
    vor: "nur",
    gross: String(werteVon("trade-republic-depot").halalEtfsFonds ?? ""),
    klein: "Islamic ETFs und Fonds",
    ton: "gelb",
  },
  {
    id: "xtb-depot",
    name: "XTB",
    domain: "xtb.com",
    vor: "",
    gross: werteVon("xtb-depot").zinsfreiAbStart === "schlecht" ? "Zinsen" : "",
    klein: "automatisch eingeschaltet",
    ton: "rot",
  },
] as const;
