/**
 * Ein Wortlaut für „Wie entsteht die Reihenfolge?“ im Depot- und Girokonto-Vergleich, auf der Methodik-Seite und im
 * Satz über der Liste. Pflicht nach UWG § 5b Abs. 2 (Hauptkriterien und Gewichte einer Rangliste nennen) und Anhang
 * Nr. 11a (bezahlte bessere Platzierung nie ohne Hinweis), Hermes RK1 ergebnisse/03 §3 und §4b. Die Zahlen kommen aus
 * `src/data/leserEroeffnungen.ts`, damit Text und Rechnung nicht auseinanderlaufen (Test in rangfolge.test.ts).
 */
import { BELIEBT_SEIT, BELIEBT_STAND, GEWICHT_BELIEBT } from "@/data/leserEroeffnungen";

const prozent = (x: number) => `${String(Math.round(x * 1000) / 10).replace(".", ",")} %`;

/** 47,5 % */
export const ANTEIL_HALAL_KOSTEN = prozent((1 - GEWICHT_BELIEBT) / 2);
/** 5 % */
export const ANTEIL_BELIEBT = prozent(GEWICHT_BELIEBT);

/** Der Satz über der Liste, vor dem Link zur Methodik. */
export const sortiertSatz = (): string =>
  `Sortiert nach unserer Note: Halal-Merkmale und Kosten je ${ANTEIL_HALAL_KOSTEN}, bei meinen Lesern beliebt ${ANTEIL_BELIEBT}. ` +
  "„Beliebt“ zählt Eröffnungen über unsere Links, dafür bekommen wir von einigen Anbietern eine Provision.";

/** Was „Bei meinen Lesern beliebt“ misst, in zwei Sätzen. */
export const beliebtErklaerung = (was: "Depot" | "Konto" | "Depot oder Konto"): string =>
  `„Bei meinen Lesern beliebt“ zählt, wie viele Leser nach einem Klick über finanzmuslim wirklich ein ${was} eröffnen ` +
  `(bestätigte und offene Abschlüsse seit ${BELIEBT_SEIT}, Stand ${BELIEBT_STAND}). Das sehen wir nur bei Anbietern, ` +
  "die uns für eine Eröffnung eine Provision zahlen. Ohne Partnerlink gibt es hier 0 Punkte.";

/** Antwort auf „Wie entsteht die Reihenfolge?“. */
export const reihenfolgeAntwort = (was: "Depot" | "Konto"): string =>
  [
    `Die Note besteht zu ${ANTEIL_HALAL_KOSTEN} aus Halal-Merkmalen, zu ${ANTEIL_HALAL_KOSTEN} aus Kosten und Konditionen und zu ${ANTEIL_BELIEBT} daraus, wie beliebt ein Angebot bei meinen Lesern ist.`,
    `Jedes Halal-Merkmal belegen wir beim Anbieter.`,
    beliebtErklaerung(was),
    `Wie viel wir an einem ${was} verdienen, zählt nie.`,
    "Die Liste steht nach der Note, die du siehst. Bei gleicher Note steht zuerst, was du über unseren Link eröffnen kannst.",
    was === "Depot"
      ? "Platz 1 bekommt nur ein Depot ohne Zinsen ab Start, das du über unseren Link eröffnen kannst."
      : "Platz 1 bekommt nur ein Konto, das ohne Zinsen, ohne Dispo und ohne Kartenkredit startet und das du über unseren Link eröffnen kannst.",
  ].join(" ");
