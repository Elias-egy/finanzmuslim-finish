/**
 * Der Girokonto-Aufruf wie der Depot-Aufruf (Elias, 01.11.2026, MC7d15: „mit den zwei bekannten Bankkonten, die Zinsen
 * zahlen … und dann die zwei besten Bankkonten“; Vault `raw/2026-11-01-elias-mc7d15-feedback-alle-freebies.md`).
 * Alles aus dem Girokonto-Vergleich gezählt, nichts von Hand; die Anbieter-Belege stehen dort im Feld quellen.
 */
import { girokontoAnzeige } from "@/data/vergleichAnzeige";
import { GIRO_FINANZ_MAX } from "@/data/girokontoVergleich";
import { werteAus } from "@/lib/vergleichAssistent";
import type { CheckKarte } from "@/components/vorlagen/DepotAufruf";

const werteVon = (id: string) => (girokontoAnzeige.find((a) => a.id === id)?.werte ?? {}) as Record<string, unknown>;

/**
 * Nicht im Aufruf, bis ein Anbieter-Beleg vorliegt: Die Norisbank schreibt auf norisbank.de/produkte/girokonto.html
 * „Neukunden schließen mit dem Top-Girokonto in einem Schritt ebenfalls ein kostenloses Top-Zinskonto (Tagesgeldkonto)
 * ab.“ (Halal-Prüfer MC7d15, 01.11.2026). Der Vergleich führt sie über vergleichKorrekturenDaten.ts weiter als zinsfrei;
 * das ist eine offene Lücke im Vergleich.
 */
const OHNE_BELEG = new Set(["norisbank-top-girokonto"]);

/** Die zwei besten Girokonten ohne Kredit, in der Reihenfolge des Girokonto-Vergleichs. Der Test hält fest, dass beide ohne Zinsen sind. */
export const GIRO_TOP2 = werteAus(girokontoAnzeige, "girokonto", GIRO_FINANZ_MAX, { wuensche: [], gewichte: [] })
  .passt.filter((t) => !t.kredit && !OHNE_BELEG.has(t.anbieter.id))
  .slice(0, 2)
  .map((t) => {
    const w = t.anbieter.werte as Record<string, unknown>;
    const text = (k: string) => String(w[k] ?? "").replace(/(\d)€/g, "$1 €");
    return {
      id: t.anbieter.id,
      name: t.anbieter.name,
      domain: t.anbieter.domain ?? "",
      link: t.anbieter.link ?? "/vergleich/girokonto",
      zinsfreiAbStart: w.zinsfreiAbStart === "gut",
      // Die drei Halal-Zeilen des Vergleichs und die Kosten, jede mit Anbieter-Beleg im Vergleich.
      punkte: [
        { text: "Guthaben ohne Zinsen", wert: "", ok: w.zinsfreiAbStart === "gut" },
        { text: "Kein Dispo ab Start", wert: "", ok: w.keinDispoAbStart === "gut" },
        { text: "Karte ohne Kredit", wert: "", ok: w.karteOhneKredit === "gut" },
        { text: "Kontoführung:", wert: text("kontofuehrung"), ok: /^0 €/.test(text("kontofuehrung")) },
      ].filter((p) => !p.text.endsWith(":") || p.wert !== ""),
    };
  });

/**
 * Zwei bekannte Girokonten, die Zinsen zahlen (Anbieter-Belege in girokontoVergleich.ts, Feld quellen.zinsfreiAbStart:
 * C24 „Guthaben … wird automatisch verzinst“, BBVA „nicht möglich, die Rückerstattung der Zinsen … abzulehnen“).
 * ING, DKB und N26 zahlen laut Vergleich keine Zinsen, darum stehen sie hier nicht.
 */
export const GIRO_CHECK: CheckKarte[] = [
  {
    id: "c24-smart",
    name: "C24",
    domain: "c24.de",
    vor: "",
    gross: werteVon("c24-smart").zinsfreiAbStart === "schlecht" ? "Zinsen" : "",
    klein: "automatisch auf dein Guthaben",
    ton: "rot",
  },
  {
    id: "bbva-girokonto",
    name: "BBVA",
    domain: "bbva.de",
    vor: "",
    gross: werteVon("bbva-girokonto").zinsfreiAbStart === "schlecht" ? "Zinsen" : "",
    klein: "abwählen geht nicht",
    ton: "rot",
  },
];
