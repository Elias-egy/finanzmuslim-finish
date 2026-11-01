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
const GEREIHT = werteAus(depotAnzeige, "depot", DEPOT_FINANZ_MAX, { wuensche: [], gewichte: [] }).passt.filter((t) => !t.kredit);

const karte = (t: (typeof GEREIHT)[number], i: number, nr1Erlaubt = true) => {
  const w = t.anbieter.werte as Record<string, unknown>;
  const text = (k: string) => String(w[k] ?? "").replace(/(\d)€/g, "$1 €");
  const sparrate = text("sparrate").match(/^([\d.,]+) €/)?.[1];
  // Bis zum ersten Zusatz („, darunter …“ oder „. ETF-Kauf …“, nicht bei „min. 9,95 €“), wie die Zeile im Depot-Vergleich beginnt.
  const order = text("orderkosten").split(/, darunter|, dazu|\. (?=[A-ZÄÖÜ])/)[0].replace(/ je Order$/, "");
  return {
    id: t.anbieter.id,
    name: t.anbieter.name,
    domain: t.anbieter.domain ?? "",
    /** Partnerweg aus dem Depot-Vergleich (/out/…), sonst der Vergleich selbst. */
    link: t.anbieter.link ?? "/vergleich/depot",
    nr1: nr1Erlaubt && i === 0,
    zinsfreiAbStart: w.zinsfreiAbStart === "gut",
    /**
     * Sechs Zeilen wie die Depot-Karten von Finanzfluss (Elias, 01.11.2026, MC7d13e: „genauso viele Punkte
     * vielleicht, aber natürlich andere Punkte“; Vault raw/2026-11-01-elias-mc7d13d-top3-wie-finanzfluss.md).
     * Jede Zeile aus dem Depot-Vergleich; ok = false zeigt ein Kreuz. „Guthaben ohne Zinsen“ steht nur auf
     * zinsfreiAbStart mit Anbieter-Beleg (Halal-Prüfer r4: belegt sind Guthabenzinsen, nicht Zinsen allgemein).
     */
    punkte: [
      { text: "Guthaben ohne Zinsen", wert: "", ok: w.zinsfreiAbStart === "gut" },
      { text: "Islamic ETFs und Fonds:", wert: text("halalEtfsFonds"), ok: !/^0 von/.test(text("halalEtfsFonds")) },
      { text: "Gold und Edelmetalle:", wert: text("halalEdelmetalle"), ok: !/^0 von/.test(text("halalEdelmetalle")) },
      { text: "Depotgebühr:", wert: text("depotgebuehr"), ok: /^0 €$/.test(text("depotgebuehr")) },
      { text: "Kosten pro Order:", wert: order, ok: true },
      { text: "Sparplan ab", wert: sparrate ? `${sparrate} €` : "", ok: Boolean(sparrate) },
    ].filter((p) => !p.text.endsWith(":") || p.wert !== ""),
  };
};

export const TOP3 = GEREIHT.slice(0, 3).map((t, i) => karte(t, i));

/**
 * Die drei besten Depots für Sukuk auf der Gold-Seite (Elias, 02.11.2026, MC7d16: „Und einmal noch das gleiche als
 * Sukuk“; Vault `raw/2026-11-02-elias-mc7d16-feedback-runde-3.md`): dieselbe Reihenfolge, nur Depots mit allen
 * Sukuk-ETFs und Fonds aus dem Halal-Anlagen-Vergleich (Feld halalSukuk, Anbieter-Belege im Depot-Vergleich). Statt der
 * Gold-Zeile steht die Sukuk-Zeile in der Karte; kein Video, das steht schon in der Gold-Karte der Nummer 1.
 */
const sukukText = (t: (typeof GEREIHT)[number]) => String((t.anbieter.werte as Record<string, unknown>).halalSukuk ?? "");
export const SUKUK_ZAHL = Number(String(depotAnzeige[0]?.werte.halalSukuk ?? "").match(/von (\d+)/)?.[1] ?? 0);
const hatAlleSukuk = (wert: unknown) => wert === `${SUKUK_ZAHL} von ${SUKUK_ZAHL}`;
export const SUKUK_TOP3 = GEREIHT.filter((t) => hatAlleSukuk(sukukText(t)))
  .slice(0, 3)
  .map((t, i) => {
    const k = karte(t, i, false);
    return {
      ...k,
      punkte: k.punkte.map((p) =>
        p.text.startsWith("Gold") ? { text: "Sukuk-ETFs und Fonds:", wert: sukukText(t), ok: true } : p,
      ),
    };
  });
/** „Von 22 zinsfreien Depots haben nur 6 alle 3 Sukuk“: gezählt über die Depots mit Anbieter-Beleg „ohne Zinsen ab Start“. */
const zinsfrei = depotAnzeige.filter((a) => a.werte.zinsfreiAbStart === "gut");
export const SUKUK_DEPOTS_ZINSFREI = zinsfrei.length;
export const SUKUK_DEPOTS_MIT_ALLEN = zinsfrei.filter((a) => hatAlleSukuk(a.werte.halalSukuk)).length;

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
