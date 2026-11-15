import { brokerVergleich } from "@/data/brokerVergleich";

/**
 * Kleine Bewerbung für das Halal-Investment-OS statt Screenshot (Elias, RN4-01 15.11.2026: „im Anmeldeformular einfach
 * kein Screenshot, sondern hey, wo hast du denn ein Halal-Depot erstellt und welche Anlagen hast du gekauft … wie so
 * eine kleine Bewerbung. Dass die auch den Drang haben, ein schlechtes Gefühl, eine Lüge reinzuschreiben, ohne dass wir
 * die zu irgendwas zwingen.“). Keine Pflicht, über Elias' Link eröffnet zu haben (RN3-05: „nicht, dass man sagt, du musst
 * es über mich gemacht hat“), Zugang auch mit zinsfreiem Girokonto, egal bei welcher Bank (RN3-06).
 * Vault raw/2026-11-15-elias-rn4-01-…, raw/2026-11-15-elias-rn3-05-…, raw/2026-11-15-elias-rn3-06-…
 *
 * Eine Quelle für beide Formulare: OsAnfrage.tsx (Depot-Unterseiten) und public/investment-os/index.html (Verkaufsseite,
 * ohne Build, darum dort abgeschrieben; osBewerbung.test.ts hält beide gleich).
 * Datenschutz: hermes/renovierungskampagne/os-bewerbung-datenschutz.md im Vault.
 */

/** Wert der Auswahl, wenn jemand kein Depot, aber ein zinsfreies Girokonto hat. */
export const NUR_GIROKONTO = "nur-girokonto";
/** Wert der Auswahl für ein Depot, das nicht in der Liste steht. */
export const ANDERES_DEPOT = "anderes";

/**
 * Depots zur Auswahl: flatex zuerst (seit 15.11. einzige Nummer 1, Laufzettel rn4-rang), dann Smartbroker+, dann alle
 * übrigen Häuser aus dem Depot-Vergleich, von denen wir nicht abraten, nach dem Alphabet, je Haus einmal. Das ist nur
 * die Frage „wo liegt dein Depot“, keine Empfehlung und keine Halal-Aussage zum Anbieter.
 */
const ZUERST = ["flatex", "Smartbroker+"];
export const DEPOT_AUSWAHL: string[] = (() => {
  const rest = new Set<string>();
  for (const a of brokerVergleich) {
    if (a.abgeraten || ZUERST.includes(a.name)) continue;
    rest.add(a.name);
  }
  return [...ZUERST, ...[...rest].sort((x, y) => x.localeCompare(y, "de", { sensitivity: "base" }))];
})();

export const TEXT = {
  depotFrage: "Wo hast du dein Halal-Depot eröffnet?",
  depotLeer: "Bitte wählen",
  anderesDepot: "Anderes Depot",
  nurGirokonto: "Noch kein Depot, aber ein zinsfreies Girokonto",
  anderesFrage: "Welches Depot?",
  anlagenFrage: "Welche Anlagen hast du gekauft?",
  anlagenBeispiel: "z. B. iShares MSCI World Islamic",
  anlagenHinweis: "Nur die Namen, keine Beträge.",
  giroFrage: "Zinsfreies Girokonto, bei welcher Bank?",
  giroFreiwillig: "freiwillig",
  giroBeispiel: "Name deiner Bank",
  vorname: "Dein Vorname",
  email: "Deine E-Mail",
  /**
   * Ein Häkchen, wie Elias es will („Einfach nur ein Haken: Ich habe die Datenschutzerklärung zur Kenntnis genommen.
   * Das war's.“, 14.10., Regelbuch unterseiten-und-videos), erweitert um die ausdrückliche Einwilligung, weil die Angabe
   * „Halal-Depot“ und die Halal-Anlagen auf den Glauben schließen lassen können (Art. 9 Abs. 2 lit. a DSGVO). Frage an
   * Elias, Notiz os-bewerbung-datenschutz.md. Vor und nach dem Link steht der Text so in beiden Formularen.
   */
  hakenVor: "Ich habe die",
  hakenLink: "Datenschutzerklärung",
  hakenNach:
    "zur Kenntnis genommen und willige ein, dass Finanzmuslim meine Angaben, auch zu meinen Halal-Anlagen, für meine Bewerbung speichert.",
  senden: "Fertig",
  dankeTitel: "Danke für deine Bewerbung",
  dankeText: "Ich schaue mir deine Angaben an und schalte dich frei. Deinen Zugang bekommst du per Mail.",
  dankeKnopf: "Zurück zur Seite",
} as const;

export const MAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Bewerbung = {
  depot: string;
  anderesDepot: string;
  anlagen: string;
  girokonto: string;
  vorname: string;
  email: string;
  einwilligung: boolean;
};

/** Gibt den ersten fehlenden Punkt als Satz zurück, oder null, wenn die Bewerbung vollständig ist. */
export const pruefeBewerbung = (b: Bewerbung): string | null => {
  if (!b.depot) return "Bitte wähl aus, wo du dein Halal-Depot eröffnet hast.";
  if (b.depot === NUR_GIROKONTO) {
    if (!b.girokonto.trim()) return "Bitte schreib, bei welcher Bank dein zinsfreies Girokonto ist.";
  } else if (!b.anlagen.trim()) return "Bitte schreib, welche Anlagen du gekauft hast.";
  if (!b.vorname.trim()) return "Bitte gib deinen Vornamen ein.";
  if (!MAIL_OK.test(b.email.trim())) return "Bitte gib deine E-Mail-Adresse ein.";
  if (!b.einwilligung) return "Bitte setz das Häkchen.";
  return null;
};
