/**
 * Der Sukuk-Plan, das Freebie zum Wort „Sukuk“ (MC7f, 02.11.2026). Elias, 02.11.2026, MC7d17: „Ich wollte ein eigenes
 * Keyword mit Sukuk. Kommentiere Sukuk und ich schicke es dir kostenlos zu und dann kriegst du das gleiche, was wir für
 * ETFs und für Gold haben, nochmal für Sukuk, wo das ein bisschen erklärt wird“ (Vault
 * `raw/2026-11-02-elias-mc7d17-feedback-runde-4.md`).
 *
 * Gebaut wie der ETF-Plan und der Gold-Plan (Stil von Fassung 5 des Portfolio-Plans): oben die Geld-Frage, der eine rote
 * Schmerz (eine Anleihe ist ein Kredit mit Zinsen), was ein Sukuk ist, Anleihe und Sukuk nebeneinander mit dem Betrag,
 * was man erwarten kann, alle Sukuk-Fonds als Karten, der Broker-Aufruf. Jeder Satz der Erklärung steht so in
 * `src/pages/wissen/Sukuk.tsx`; nie „islamische Anleihe“, weil der Beitrag genau das Gegenteil sagt.
 *
 * Liegt versteckt unter /dein-sukuk/<schluessel>: nicht in Navigation oder Sitemap, noindex. Wer den Schlüssel ändert,
 * macht alle verschickten Links ungültig. Jede Halal- und Zinsaussage hat ihren Beleg in
 * `docs/freebies/sukuk-plan.txt.belege.md`.
 */
import { SUKUK_DEPOTS_MIT_ALLEN, SUKUK_DEPOTS_ZINSFREI, SUKUK_ZAHL } from "@/data/depotTop3";
import { listenGruppen } from "@/data/anlagenListe";

export const SUKUK_SCHLUESSEL = "sukuk-6tm2";
export const SUKUK_PFAD = `/dein-sukuk/${SUKUK_SCHLUESSEL}`;

/** Oben gewählt: Der Klick markiert nur und springt nicht (Elias, 28.10.2026, MC3c). */
export const SUKUK_BETRAEGE = [100, 300, 500] as const;
export const SUKUK_MONATLICH = 100;

export const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")} €`;

/** Der eine rote Schmerz, aus dem ersten Absatz des Beitrags. */
export const SCHMERZ = "Bei einer Anleihe leihst du einem Staat oder einer Firma Geld und bekommst dafür Zinsen.";
export const MUSLIM_SATZ = "Als Muslim musst du Zinsen meiden.";

/** Merksatz und Bildzeile wortgleich aus dem Beitrag (Abschnitt „Ein Sukuk ist kein Kredit“). */
export const MERKSATZ = "Ein Sukuk ist ein Anteil an einer Sache, nicht ein Anspruch auf Geld.";
export const BILD_SATZ = "Hinter dem Anteil steht ein Gebäude, das vermietet wird. Der Ertrag ist die Miete, nicht ein Zins.";

/**
 * Drei der fünf Zeilen aus der Tabelle „Sukuk und Anleihe nebeneinander“ im Beitrag, gekürzt wie auf Seite 9 des
 * Guides; die erste mit dem Betrag des Lesers.
 */
export const vergleich = (betrag: number) =>
  [
    { frage: "Was besitzt du?", anleihe: `Eine Forderung. Du hast ${euro(betrag)} verliehen.`, sukuk: "Einen Anteil an einer Sache." },
    { frage: "Woher kommt der Ertrag?", anleihe: "Zins.", sukuk: "Miete oder Gewinn aus der Sache." },
    // Statt „Was kommt am Ende zurück?“ die Risiko-Zeile: am Fonds liest sich der Rückkauf ohne Aufschlag wie eine
    // Zusage, dass das Geld zurückkommt (frischer Halal-Prüfer MC7f r1, docs/freebies/pruef/halal-sukuk-plan-r1.md).
    { frage: "Wer trägt das Risiko?", anleihe: "Der Schuldner zahlt, solange er zahlungsfähig ist.", sukuk: "Grundsätzlich trägst du das Risiko der Sache mit." },
  ] as const;

/** Wortgleich aus dem Hinweis „Was du realistisch erwarten solltest“, ehrlich wie der Steuerhinweis beim Gold. */
export const ERWARTUNG =
  "Sukuk-Fonds schwanken weniger als Aktienfonds, dafür ist auch der Ertrag deutlich kleiner. Die meisten notieren in US-Dollar, damit läuft der Wechselkurs mit.";

// Die Nebensätze zu Fonds und Kritik sind raus (Elias, 02.11.2026, MC7f: „diese Kleinigkeiten, das will keiner lesen“).

/**
 * „Nur 6 von 22 zinsfreien Depots haben alle 3“ (Elias, 02.11.2026, MC7d16: „Und einmal noch das gleiche als Sukuk“),
 * gezählt im Depot-Vergleich (depotTop3.ts), gelb wie die Zahl beim Gold.
 */
export const SUKUK_GESAMT_CHECK = [
  {
    id: "sukuk-gesamt",
    name: "",
    domain: "",
    vor: "nur",
    gross: `${SUKUK_DEPOTS_MIT_ALLEN} von ${SUKUK_DEPOTS_ZINSFREI}`,
    klein: `zinsfreien Depots haben alle ${SUKUK_ZAHL} Sukuk-ETFs und Fonds aus meiner Liste`,
    ton: "gelb" as const,
  },
];

/** Die Sukuk-Karten der Liste, jüngster Nachweis zuerst. */
export const SUKUK_ZEILEN = listenGruppen.find((g) => g.kategorie === "sukuk")!.zeilen;

/** Der Prüfnachweis je Fonds aus der Anlagen-Datenbank, dazu der eigene Beitrag. */
export const sukukQuellen: { titel: string; url: string }[] = [
  { titel: "Sukuk statt Anleihe, mein Beitrag", url: "https://finanzmuslim.com/wissen/sukuk" },
  ...SUKUK_ZEILEN.flatMap(({ anlage: a }) =>
    a.zertifikatLink ? [{ titel: `${a.name}, Nachweis der Prüfstelle`, url: a.zertifikatLink }] : [],
  ),
];
