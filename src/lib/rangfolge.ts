import type { RohAnbieter, RohWert } from "@/data/vergleichHelfer";
import { DEPOT_FINANZ_MAX, EDELMETALL_FINANZ_MAX, GESCHAEFT_FINANZ_MAX, GIRO_FINANZ_MAX, KRYPTO_FINANZ_MAX } from "@/data/finanzMax";
import { finanzNote, kostenlosReicht } from "@/lib/vergleichLeser";
import { anzeigeNote, sterne } from "@/lib/anzeigeNote";
import { ROYAL_MINT_HAEUSER } from "@/data/royalMint";

/**
 * Rechenkern der Rangfolge für alle sechs Vergleiche (P3, 26.09.2026).
 * Spezifikation: `docs/rangfolge/P3-SPEC.md`, Abschnitt 10 hat Vorrang.
 *
 * Regeln, die hier gelten und getestet sind:
 *
 * 1. Nur Belegtes zählt. Fehlt ein Merkmal der Formel, gibt es keinen Platz und
 *    keine Note, sondern "noch nicht geprüft" mit der Liste, was fehlt.
 *    Ausnahme Depot (Elias, 06.10.2026: "Wir können mit diesem Depot-Ranking nicht an den
 *    Start gehen"): Jedes Depot, das nicht abgeraten ist, bekommt eine Note. In den
 *    Halal-Anteil zählen nur Anlagen mit Kaufbeleg, Unbelegtes zählt als nicht vorhanden
 *    (0 Punkte), nie als geschätzt. Dasselbe gilt für ein nicht belegtes Zins-Tor (Halal-Teil 0,
 *    nie Nummer 1) und fehlende Kosten-Punkte (Kosten 0). Edelmetall rechnet dieselben Depots
 *    nach derselben Regel, im Halal-Teil zählen aber nur die Gold- und Silber-ETCs und bei den
 *    Kosten nur, was ein Kauf kostet (`EDELMETALL_FINANZ_MAX`).
 *    Steuersoftware folgt seit 06.10.2026 derselben Regel: Unbelegte Leistungs- und Preiswerte
 *    zählen 0 Punkte und die Zelle zeigt einen Strich. Das Tor Anlage KAP bleibt: ohne Beleg
 *    dafür gibt es keinen Platz.
 * 2. Partner kaufen keine Note: Halal- und Kosten-Teil lesen weder `link` noch
 *    Finanzfluss-Rang, Etikett, alte Note, Partnerlinks oder Deals. Was wir verdienen, zählt nie. Seit 25.11.2026
 *    kennt die Note den Link gar nicht mehr: Das Kriterium „Bei meinen Lesern beliebt“ ist raus (Regel 8). Nur die Reihenfolge in
 *    Depot, Girokonto und Krypto kennt den eigenen Link (Elias, 06.10.2026: "Die Eins muss
 *    immer von uns kaufbar sein"): Bei gleicher Sternzahl (`sterne`, halbe Schritte) steht
 *    zuerst, was über unseren Link eröffnet werden kann, danach entscheidet die Note. Ein
 *    Link hebt nie über eine höhere Sternzahl. Steuer und Screener ordnen allein nach der
 *    Note (`LINK_VORRANG`). Edelmetall stellt seit 04.11.2026 die Depots mit belegtem Royal
 *    Mint Gold-ETC vor alle anderen, danach die Note (`royalMintKaufbar`).
 * 3. Jede Eingabe landet in genau einer Gruppe. Vorrang: abgeraten vor nicht
 *    bewertet vor gerankt.
 * 4. Reihenfolge: zuerst Regel 2 (`vorrang`), dann Note, Kosten, Halal, jeweils auf zwei
 *    Stellen gerundet und absteigend, dann Name, Produkt, id. Gleiche Note, Kosten und
 *    Halal teilen den Platz (1, 1, 3), wo Regel 2 gilt nur bei gleichem Link-Stand.
 * 5. Die Nummer 1 für Kasten und geführten Vergleich kommt nur aus Einträgen
 *    ohne Einschränkung: Zins-Tor grün und keine rote Grundlage (`BASIS`).
 *    So gilt "gelb halbiert" (Elias, 14.09.2026) für die Liste und "kein Mensch
 *    will Zinsen" (19.09.2026) für die Empfehlung.
 * 6. Platz 1 der Liste ist derselbe Eintrag: der erste ohne Einschränkung rückt nach vorn, alle anderen
 *    behalten ihre Reihenfolge (Elias, 07.11.2026, CV20F: "1 muss immer etwas für die Mehrheit kostengünstig
 *    sein", Regel "Platz 1 nur ohne Abstellen"). Seit 15.11.2026 zählt ein Kredit ab Start im Depot-Vergleich nicht
 *    mehr als Einschränkung (Elias, RN3-07: „Flatex als einzige Nummer 1 benutzen ist gut. Smartbroker als Nummer 2.“,
 *    raw/2026-11-15-elias-rn3-07-uebergabe-phase1-quiz-flatex-nr1-zwei-localhosts.md im Vault). Der Hinweis „Lehne
 *    ihn in Textform ab“ bleibt am Angebot. Im Edelmetall-Vergleich gilt die alte Regel weiter (`KREDIT_NIE_PLATZ_EINS`).
 * 7. Die Reihenfolge liest die angezeigte Note (`anzeigeNote`, eine Stelle, abgerundet), so stehen Zahl und Sterne
 *    immer absteigend (Elias, 08.11.2026, A11). Bei gleicher angezeigter Note steht zuerst der eigene Link (Regel 2),
 *    danach die genaue Note. Die feste Liste `LESER_REIHENFOLGE` (A9) ist seit 15.11.2026 abgelöst durch Regel 8:
 *    Die Reihenfolge entsteht aus der Note, nicht aus einer Liste.
 * 9. Geschäftskonto (Elias, 23.11.2026, VG2-04: „Ich will jeden einzelnen Anbieter ranken … mach es wirklich, wie du es machen würdest,
 *    unabhängig vom Link“, raw/2026-11-23-elias-vg2-04-alle-anbieter-rein-eine-mailrunde-dach.md im Vault): kein Link-Vorrang. Die Liste
 *    steht in drei Stufen (`geschaeftStufe`): erst alle mit belegt zinsfreiem Hauptkonto, dann alle, bei denen der Anbieter dazu nichts
 *    Ausdrückliches schreibt (`zinsfreiAbStart` "unbekannt", kein Urteil), ganz hinten, wer laut Anbieter Zinsen auf das Guthaben zahlt
 *    ("schlecht", nicht abgeraten: auch er bekommt einen Platz). In jeder Stufe gilt die normale Note, halb Halal, halb Kosten. Ein
 *    unbelegter Dispo oder eine unbelegte Karte zählt 0 Punkte. Nummer 1 wird nur, wer belegt zinsfrei ist.
 * 10. Depot und Girokonto (Elias, 23.11.2026, VG2-04: „Ich will jeden einzelnen Anbieter ranken … handle nicht immer mit deinen eigenen
 *    Gedanken, sondern bleib offen“): Jeder Anbieter steht auf der Liste (`NUR_VOLLSTAENDIG` gilt dort nicht mehr), in denselben drei Stufen
 *    wie Regel 9 (`stufe`): Zins belegt aus oder abschaltbar, dann offen (der Anbieter belegt dazu nichts), ganz hinten belegt verzinst. Was
 *    nicht belegt ist, zählt 0 Punkte, nie geschätzt. Der Link-Vorrang (Regel 2) bleibt innerhalb der Stufe, `LINK_VORRANG` ist unverändert.
 * 11. Depot (VG3, Elias 23.11.2026, VG2-05 zu S Broker: „Sparkassenbroker kann sogar ziemlich weit nach vorne … 11 von 12 wusste ich gar
 *    nicht“, raw/2026-11-23-elias-vg2-05-kt-bank-aussehen-sparplan-sbroker-fuehrung.md im Vault): Bei gleicher angezeigter Note und gleichem
 *    Link-Stand steht zuerst der größere Halal-Teil, dann wer mehr Halal-ETFs belegt kaufbar hat, erst danach die genaue Note. Die genaue Note
 *    trennt sonst nur der Feinwert (Regel 4). Die Sterne bleiben
 *    absteigend (Regel 7), Platz 1 bleibt Regel 6.
 * 8. Depot, Girokonto und Edelmetall: Die Note ist Halal-Teil und Kosten je zur Hälfte (Elias' Formel). Ein Kriterium „Bei meinen Lesern
 *    beliebt“ (5 % nach Eröffnungen über unsere Partnerlinks) gab es vom 15.11. bis 25.11.2026; seit 25.11.2026 entfernt, Elias VG5-05:
 *    „Nimm mal die Sternbewertung, wie beliebt was ist … die können keine Abzüge bekommen, weil wir noch keine Abschlüsse haben über die.
 *    Das ist kein faires Kriterium“ (raw/2026-11-25-elias-vg5-05-beliebt-raus-agenten-mailstand.md im Vault). Die Zahlen liegen weiter in
 *    `src/data/leserEroeffnungen.ts`, rechnen aber in keine Note und stehen auf keiner Seite.
 * 12. Halal-Teil der Depots seit 24.11.2026 (Elias, VG4-03, wörtlich: „ein Halal-ETF mehr zählt mehr als ein Sukuk oder Edelmetall mehr.
 *    Also das Doppelte. Außer der Han-ETF, der zählt so viel wie ein normaler ETF … Zinsen ausschalten ist ein riesen Minuspunkt … Dispo von
 *    Anfang an … ist auch ein relativ großer Minuspunkt“, raw/2026-11-24-elias-vg4-03-kriterien-halal-etf-doppelt-zinsen-dispo-kosten.md;
 *    VG5-01: „Flatex würde ich das mit dem Dispo 10 Prozent nur runternehmen“, raw/2026-11-24-elias-vg5-01-programme-dach-suchen-mailplan-
 *    reihenfolge-final.md, beide im Vault): Ein Halal-ETF oder Fonds zählt 2 Punkte, ein Sukuk und ein Edelmetall je 1 (`HALAL_GEWICHT`), der
 *    Royal Mint Gold-ETC von HANetf 2 (`GEWICHT_ROYAL_MINT`, nur mit Kaufbeleg und nur in den deutschen Listen). Kredit ab Start (Depot,
 *    Edelmetall) und abschaltbarer Dispo ab Start (Girokonto, Geschäftskonto) kosten je 10 % des Halal-Teils (`FAKTOR_KREDIT`,
 *    `FAKTOR_DISPO`), Zinsen, die erst abgeschaltet werden müssen, weiter die Hälfte (`FAKTOR_ABSCHALTBAR`).
 * 13. Depot Deutschland, feste Spitze (Elias, 24.11.2026, VG5-03, wörtlich: „Warum ist Smart Broker VS Broker? Ich würde es sonst
 *    andersrum machen. Dann Flatex, Traders Place, Trading, Scalable, BB Bank. Erstmal“, raw/2026-11-24-elias-vg5-03-ja-beides-s-broker-
 *    eins-feste-reihenfolge.md im Vault): Die Einträge aus `DEPOT_SPITZE` stehen in dieser Reihenfolge vorn, jeder auf eigenem Platz,
 *    alle anderen danach nach Note. Noten und Sterne rechnen weiter nach Regel 8 und 12; an der Spitze gilt die Liste vor Regel 7
 *    (S Broker 4,3 vor Smartbroker+ 4,4). Regel 6 bleibt Wächter für Platz 1. Gilt für Depot und ETF-Sparplan, nicht für Edelmetall.
 */

/** Regel 13: feste Spitze im deutschen Depot-Vergleich (Elias VG5-03, 24.11.2026, „erstmal“). */
export const DEPOT_SPITZE: readonly string[] = [
  "s-broker-direkt-depot",
  "smartbroker-plus-depot",
  "flatex-depot",
  "traders-place-depot",
  "trading-212-depot",
  "scalable-capital-free-broker",
  "bbbank-depot",
];
export const spitzenRang = (kategorie: RangKategorie, id: string): number => (kategorie === "depot" ? DEPOT_SPITZE.indexOf(id) : -1);

export type RangKategorie = "depot" | "girokonto" | "krypto" | "steuer" | "screener" | "edelmetall" | "geschaeftskonto";

export type Bewertet = {
  anbieter: RohAnbieter;
  platz: number;
  /** 0 bis 5, zwei Nachkommastellen. */
  note: number;
  /** Halal-Teil nach der Halbierung. Bei Steuer die Leistung, beim Screener die Transparenz. */
  halal: number;
  /** Kosten-Teil. Bei Steuer der Preis, beim Screener der Nutzen. */
  kosten: number | null;
  /** Zins-Tor grün und keine rote Grundlage. Nur solche Einträge können Nummer 1 werden. */
  uneingeschraenkt: boolean;
  /**
   * Das Haus räumt Neukunden automatisch einen Kredit ein (`kreditAbStart` "teils"). Kostet seit 24.11.2026 10 % des Halal-Teils
   * (`FAKTOR_KREDIT`, Regel 12); nie Nummer 1 nur, wo `KREDIT_NIE_PLATZ_EINS` es sagt (Edelmetall).
   */
  kredit: boolean;
  /** Halal-Teil vor dem Abzug für den Kredit. Der geführte Test sortiert damit, wer möglichst viele Anlagen will. */
  halalVorKredit: number;
};
export type NichtBewertet = { anbieter: RohAnbieter; grund: "noch nicht geprüft" | "Anfrage läuft"; fehlt: string[] };
export type Abgeraten = { anbieter: RohAnbieter; grund: string };
export type Rangliste = { gerankt: Bewertet[]; nichtBewertet: NichtBewertet[]; abgeraten: Abgeraten[] };

export type RangOptionen = {
  /** Hausschlüssel (sonst id) mit laufender Anfrage, aus `src/data/anfragenOffen.ts`. */
  offeneAnfragen?: ReadonlySet<string>;
  /** Höchstpunkte der Finanzkriterien. Standard je Kategorie aus den Datendateien. */
  finanzMax?: Record<string, number>;
  /**
   * DACH1 (23.11.2026): Wie viele Anlagen je Halal-Zeile im Land zählen. Österreich und Schweiz zählen nur Papiere, die
   * dort zum Vertrieb zugelassen sind (Länderlisten in `src/data/land/`). Standard `ANTEIL_N` (Deutschland, 12, 3, 7).
   * Eine Zeile mit 0 fällt weg.
   */
  anteilN?: Record<string, number>;
};

/** Faktor auf den Halal-Teil, wenn Zinsen ab Start laufen und erst abgeschaltet werden müssen. */
export const FAKTOR_ABSCHALTBAR = 0.5;

/**
 * Faktor auf den Halal-Teil, wenn ein Depot Neukunden automatisch einen Kredit einräumt und Zinsen nur
 * bei Nutzung anfallen (flatex, flex-Kredit). Elias, 12.10.2026: Der Kredit zählt ins Zins-Kriterium,
 * "du musst halt ehrlich gucken". Elias, 28.09.2026 zum Dispo: "es macht es nicht haram wie zinsen, aber
 * natürlich werten" (kein Urteil eines Gelehrten). Deshalb ein Abzug und kein Tor. Erst ein Viertel (wie ein Dispo auf "gelb"), das ergab Platz 8. Elias am selben Abend:
 * "Platz 8 ist schon echt weit unten", er dachte an Platz 5. Platz 5 gibt es rechnerisch nicht (mit
 * Link steht flatex bei 4,5 Sternen auf 4, bei 4 Sternen auf 6). Ein Zehntel Abzug ergibt Platz 4.
 * Seit 07.11.2026 kein Abzug mehr: "fair ranken heißt ohne Abzug ... das ist ja easy abstellbar"
 * (raw/2026-11-07-elias-cv19f-rangfolge-traders-place-flatex-smartbroker.md im Vault, Ja in CV20F). Platz 1
 * blieb bis 15.11.2026 einem Eintrag ohne Abstellen vorbehalten; seither nur noch im Edelmetall-Vergleich
 * (Regel 6, `KREDIT_NIE_PLATZ_EINS`), dazu `nummerEins` und `siegerDerSeite` in `src/lib/vergleichAssistent.ts`.
 * Seit 24.11.2026 wieder ein Zehntel Abzug (Regel 12, Elias VG4-03: „Dispo von Anfang an … ist auch ein relativ großer Minuspunkt“, VG5-01:
 * „Flatex würde ich das mit dem Dispo 10 Prozent nur runternehmen, dass er ungefähr auf 3 bis 4 kommt“).
 */
export const FAKTOR_KREDIT = 0.9;

/**
 * Faktor auf den Halal-Teil im Geschäftskonto, wenn der Anbieter zum Guthabenzins nichts Ausdrückliches schreibt (`zinsfreiAbStart`
 * "unbekannt"). 1: Der Eintrag wird wie ein zinsfreier gerechnet und steht nur durch die Stufe hinter den belegten (Regel 9). Bei
 * "schlecht" (der Anbieter zahlt Zinsen) ist der Faktor 0.
 */
export const FAKTOR_ZINS_OFFEN = 1;

/**
 * Faktor auf den Halal-Teil im Girokonto, wenn der Dispo ab Start eingeräumt wird, sich aber abschalten lässt
 * (`keinDispoAbStart` "teils"). Vorbild `FAKTOR_KREDIT`. Elias, 13.10.2026: eine abschaltbare Ausnahme soll
 * "hoch ranken mit ehrlichem Hinweis", 28.09.2026: ein Dispo "macht es nicht haram wie Zinsen, aber natürlich
 * werten". Bisher zählte "teils" nur halb (ein Viertel Abzug vom Halal-Teil, ein ganzer Stern). Nie Nummer 1,
 * wie flatex. Seit 07.11.2026 kein Abzug mehr, dieselbe Regel wie beim Kredit: Abstellbares zählt nicht gegen
 * die Note (CV20F), Platz 1 bleibt ihm verwehrt (Regel 6). Seit 24.11.2026 wieder ein Zehntel Abzug wie beim Kredit (Regel 12: dieselben
 * Kriterien für alle Vergleiche).
 */
export const FAKTOR_DISPO = 0.9;

/** Halal-Grundlagen je Kategorie. Steht hier "schlecht", wird der Eintrag gerankt, aber nie Nummer 1. */
export const BASIS: Record<"depot" | "girokonto" | "krypto" | "geschaeftskonto", string[]> = {
  depot: [],
  girokonto: ["keinDispoAbStart", "karteOhneKredit"],
  krypto: ["zinsfreiesModell"],
  // VG2 (23.11.2026): dieselben Merkmale wie beim Girokonto, Vorbild Finanzfluss /vergleich/geschaeftskonto/.
  geschaeftskonto: ["keinDispoAbStart", "karteOhneKredit"],
};

/** Wie viele Anlagen je Zeile im Halal-Anlagen-Vergleich stehen (12, 3, 7). Gewichtet zählen sie nach `HALAL_GEWICHT`. */
export const ANTEIL_N: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 };

/** Regel 12: Punkte je belegt kaufbarer Anlage einer Zeile. Ein Halal-ETF oder Fonds zählt doppelt (Elias, VG4-03). */
export const HALAL_GEWICHT: Record<string, number> = { halalEtfsFonds: 2, halalSukuk: 1, halalEdelmetalle: 1 };

/** Regel 12: Der Royal Mint Gold-ETC (HANetf, `ROYAL_MINT`) zählt wie ein Halal-ETF (Elias, VG4-03: „so viel wie ein richtiger ETF“). */
export const GEWICHT_ROYAL_MINT = 2;

/** Zeilen des Edelmetall-Teils: nur die Gold- und Silber-ETCs. */
const NUR_METALLE: Record<string, number> = { halalEdelmetalle: ANTEIL_N.halalEdelmetalle };

/** Royal Mint Gold-ETC beim Haus oder Finanzfluss-Produkt belegt kaufbar (`ROYAL_MINT_HAEUSER`, wie `belegt` in `edelmetallVergleich.ts`). */
export const royalMintBelegt = (a: RohAnbieter): boolean =>
  [a.haus, a.finanzfluss?.produkt].some((k) => typeof k === "string" && ROYAL_MINT_HAEUSER.includes(k));

const STANDARD_FINANZ_MAX: Partial<Record<RangKategorie, Record<string, number>>> = {
  depot: DEPOT_FINANZ_MAX,
  girokonto: GIRO_FINANZ_MAX,
  krypto: KRYPTO_FINANZ_MAX,
  edelmetall: EDELMETALL_FINANZ_MAX,
  geschaeftskonto: GESCHAEFT_FINANZ_MAX,
};

const TOR = "zinsfreiAbStart";

/** Sterne auf der Seite: angezeigte Note auf halbe Sterne gerundet (Definition in `anzeigeNote.ts`, dort liest sie auch die Sterne-Zeichnung). */
export { sterne };

/**
 * Vergleiche, in denen ein Kredit ab Start (`kreditAbStart` "teils") Platz 1 weiter ausschließt (Regel 6). Im Depot
 * nicht mehr seit 15.11.2026 (Elias, RN3-07: flatex „als einzige Nummer 1“).
 */
export const KREDIT_NIE_PLATZ_EINS: ReadonlySet<RangKategorie> = new Set<RangKategorie>(["edelmetall"]);

/** Vergleiche, in denen bei gleicher Sternzahl der eigene Link zuerst steht (Regel 2). */
// Geschäftskonto nicht mehr (Elias, 23.11.2026, VG2-04: „unabhängig vom Link“, raw/2026-11-23-elias-vg2-04-alle-anbieter-rein-eine-mailrunde-dach.md).
export const LINK_VORRANG: ReadonlySet<RangKategorie> = new Set<RangKategorie>(["depot", "girokonto", "krypto"]);

/** Regel 9: 0 belegt zinsfrei, 1 offen, 2 belegt mit Zins. */
export const geschaeftStufe = (a: RohAnbieter): number => (a.werte[TOR] === "gut" ? 0 : a.werte[TOR] === "schlecht" ? 2 : 1);

/**
 * Regel 10 (Elias, 23.11.2026, VG2-04, wörtlich: „Ich will jeden einzelnen Anbieter ranken. Und wenn dann einer sich rausstellt … der zahlt
 * Zinsen … Dann kommt der hinten auf die Liste … handle nicht immer mit deinen eigenen Gedanken, sondern bleib offen.“): Depot und Girokonto
 * zeigen jeden Anbieter und ordnen wie das Geschäftskonto in drei Stufen, der Link-Vorrang (Regel 2) bleibt innerhalb der Stufe.
 * Stufe 0: Zins belegt aus oder abschaltbar ("gut", "teils"). Stufe 1: offen, der Anbieter belegt dazu nichts (kein Urteil, kein Abzug).
 * Stufe 2: der Anbieter zahlt Zinsen, die sich nicht abschalten lassen ("schlecht"), er steht ganz hinten, bekommt aber einen Platz.
 */
export const STUFEN_ALLE_REIN: ReadonlySet<RangKategorie> = new Set<RangKategorie>(["depot", "girokonto"]);

/** Stufe nach Regel 9 (Geschäftskonto) und Regel 10 (Depot, Girokonto). */
export const stufe = (kategorie: RangKategorie, a: RohAnbieter): number =>
  kategorie === "geschaeftskonto"
    ? geschaeftStufe(a)
    : a.werte[TOR] === "gut" || a.werte[TOR] === "teils"
      ? 0
      : a.werte[TOR] === "schlecht"
        ? 2
        : 1;

type MitNote = { note: number; anbieter: RohAnbieter };

/**
 * Regel 2 und 7 als Vergleich: angezeigte Note absteigend, bei gleicher angezeigter Note zuerst der eigene Link.
 * 0 heißt, die genaue Note entscheidet. Liste, Kasten und geführter Vergleich nutzen dieselbe Funktion.
 */
export const vorrang = (kategorie: RangKategorie, p: MitNote, q: MitNote): number =>
  kategorie === "geschaeftskonto"
    ? geschaeftStufe(p.anbieter) - geschaeftStufe(q.anbieter)
    : LINK_VORRANG.has(kategorie)
    ? (STUFEN_ALLE_REIN.has(kategorie) ? stufe(kategorie, p.anbieter) - stufe(kategorie, q.anbieter) : 0) ||
      anzeigeNote(q.note) - anzeigeNote(p.note) ||
      Number(Boolean(q.anbieter.link)) - Number(Boolean(p.anbieter.link))
    : kategorie === "edelmetall"
      ? royalMintKaufbar(q.anbieter) - royalMintKaufbar(p.anbieter)
      : 0;

/**
 * Edelmetall: Depots, bei denen der Royal Mint Gold-ETC belegt kaufbar ist, stehen vor allen anderen, danach
 * entscheidet die Note (Elias, 04.11.2026: „Depots, wo man den Gold kaufen kann, sollten definitiv nach vorne
 * rücken“, raw/2026-11-04-elias-seo50-depots-mit-royal-mint-nach-vorne-sparplan.md im Vault).
 */
const royalMintKaufbar = (a: RohAnbieter): number => Number(String(a.werte.royalMint ?? "").startsWith("ja"));

/**
 * Kleinigkeiten, die nur bei sonst gleichem Stand entscheiden (Elias, 14.10.2026: "alles einbeziehen, aber nur
 * mini minimal", nie "nur weil der eine eine Plastikkarte hat"). Mittel aus App-Bewertung (iOS und Android),
 * kostenlosen Geldautomaten (10.000 und mehr gelten als voll) und Support-Wegen (drei Wege gelten als voll).
 * Es zählt nur, was belegt ist; ohne jede Angabe 0. Steht in `gleichauf` hinter Note, Kosten und Halal-Teil.
 */
export const feinwert = (a: RohAnbieter): number => {
  const zahl = (w: RohWert | undefined) => (typeof w === "string" ? Number(w.match(/\d+(?:[.,]\d+)?/)?.[0].replace(/\./g, "").replace(",", ".")) : NaN);
  const teile: number[] = [];
  const apps = [a.werte.appIos, a.werte.appAndroid]
    .map((w) => (typeof w === "string" ? Number(w.match(/^\s*(\d+(?:,\d+)?)\s*\/\s*5/)?.[1]?.replace(",", ".")) : NaN))
    .filter((x) => Number.isFinite(x));
  if (apps.length > 0) teile.push(apps.reduce((s, x) => s + x, 0) / apps.length / 5);
  const automaten = zahl(a.werte.geldautomaten);
  if (Number.isFinite(automaten)) teile.push(Math.min(1, automaten / 10000));
  const dienst = a.werte.kundenservice;
  if (typeof dienst === "string" && dienst.trim()) teile.push(Math.min(1, dienst.split(",").filter((x) => x.trim()).length / 3));
  // Drei Stellen: Auf zwei Stellen gerundet fiel ein Zehntel Unterschied in der App-Bewertung weg (16.10.2026).
  return teile.length === 0 ? 0 : Math.round((teile.reduce((s, x) => s + x, 0) / teile.length) * 1000) / 1000;
};

export const AMPEL_GEWICHTE: Record<"girokonto" | "krypto" | "geschaeftskonto", Array<[string, number]>> = {
  girokonto: [
    ["keinDispoAbStart", 0.5],
    ["karteOhneKredit", 0.5],
  ],
  geschaeftskonto: [
    ["keinDispoAbStart", 0.5],
    ["karteOhneKredit", 0.5],
  ],
  krypto: [
    ["echteCoins", 0.4],
    ["eigeneWallet", 0.3],
    ["zinsfreiesModell", 0.3],
  ],
};

/** Steuer: Preis, ab dem es keine Preispunkte mehr gibt. */
export const PREIS_MAX_STEUER = 60;

type Urteil =
  | { art: "abgeraten"; grund: string }
  | { art: "offen"; fehlt: string[] }
  | {
      art: "bewertet";
      halal: number;
      kosten: number | null;
      note: number;
      uneingeschraenkt: boolean;
      kredit?: boolean;
      halalVorKredit?: number;
    };

const runde = (x: number) => Math.round(x * 100) / 100;
const begrenze = (x: number) => Math.min(5, Math.max(0, x));

/** Ampel: gut 1, teils 0,5, schlecht 0. null, "unbekannt" und alles andere fehlt. */
const ampel = (w: RohWert | undefined): number | null =>
  w === "gut" ? 1 : w === "teils" ? 0.5 : w === "schlecht" ? 0 : null;

const jaNein = (w: RohWert | undefined): number | null => (typeof w === "boolean" ? (w ? 1 : 0) : null);

/** Steuer-Texte: beginnt mit "ja" 1, mit "nur in der Fassung" 0,5, "nein" 0. Alles andere fehlt. */
const fassung = (w: RohWert | undefined): number | null => {
  if (typeof w !== "string") return null;
  const t = w.trim().toLowerCase();
  if (/^ja\b/.test(t)) return 1;
  if (t.startsWith("nur in der fassung")) return 0.5;
  if (/^nein\b/.test(t)) return 0;
  return null;
};

/** Liest Werte, merkt sich fehlende Schlüssel und summiert gewichtet. */
const sammler = () => {
  const fehlt: string[] = [];
  const lies = (key: string, wert: number | null) => {
    if (wert === null) fehlt.push(key);
    return wert ?? 0;
  };
  return { fehlt, lies };
};

const halbe = (halal: number, kosten: number) => 0.5 * halal + 0.5 * kosten;

const kostenAus = (a: RohAnbieter, finanzMax: Record<string, number>): number | null =>
  a.finanzPunkte && Object.keys(a.finanzPunkte).length > 0 ? finanzNote(a, finanzMax, []) : null;

/**
 * "x von N", "mind. x von N" und "x von N bestätigt": x ist die Zahl der belegten Treffer. Alles andere ist kein Beleg.
 * „bestätigt“ schreiben die Länderlisten statt „mind.“ (DACH1, Regelbuch Nie: keine „mindestens“-Angaben auf der Seite).
 */
const ANLAGEN_ZEILE = /^\s*(?:mind\.\s+)?(\d+)\s+von\s+(\d+)(?:\s+bestätigt)?\s*$/;

/** Belegte, gewichtete Punkte einer Halal-Anlagen-Zeile. Fehlt der Beleg oder passt N nicht, zählt die Zeile 0. */
const anlagenPunkte = (a: RohAnbieter, key: string, n: number): number => {
  const w = a.werte[key];
  const m = typeof w === "string" ? w.match(ANLAGEN_ZEILE) : null;
  const punkte = a.halalAnlagenPunkte?.[key];
  const belegt = m !== null && Number(m[2]) === n && Number(m[1]) <= n && typeof punkte === "number" && punkte >= 0 && punkte <= n;
  return belegt ? punkte : 0;
};

/**
 * Regel 12: gewichtete Halal-Punkte eines Depots über die genannten Zeilen und die Höchstpunkte dazu. Der Royal Mint Gold-ETC zählt nur
 * in den deutschen Listen (`ANTEIL_N` und `NUR_METALLE`), denn die Länderlisten zählen nur dort zugelassene Papiere, und für ihn liegt dort
 * kein Beleg vor. Deutschland: 12 × 2 + 3 + 7 + 2 = 36 Höchstpunkte.
 */
export const halalPunkte = (
  a: RohAnbieter,
  zeilen: Record<string, number> = ANTEIL_N,
  mitRoyalMint = zeilen === ANTEIL_N || zeilen === NUR_METALLE,
): { punkte: number; max: number } => {
  const rm = mitRoyalMint && "halalEdelmetalle" in zeilen;
  const max = Object.entries(zeilen).reduce((s, [key, n]) => s + n * (HALAL_GEWICHT[key] ?? 1), 0) + (rm ? GEWICHT_ROYAL_MINT : 0);
  const punkte =
    Object.entries(zeilen).reduce((s, [key, n]) => s + anlagenPunkte(a, key, n) * (HALAL_GEWICHT[key] ?? 1), 0) +
    (rm && royalMintBelegt(a) ? GEWICHT_ROYAL_MINT : 0);
  return { punkte, max };
};

/**
 * Halal-Teil eines Depots über die genannten Zeilen der Halal-Anlagen, 0 bis 5: Anteil der belegten, gewichteten Anlagen
 * (`halalPunkte`, Regel 12), mal Zins-Tor, mal Abzug für den Kredit. Der Vergleich zählt alle 22 und Royal Mint, der
 * Edelmetall-Vergleich nur Gold, Silber und Royal Mint, der geführte Test die Zeilen, die der Besucher kaufen will (`werteAus`).
 */
export const depotHalal = (
  a: RohAnbieter,
  zeilen: Record<string, number> = ANTEIL_N,
  offenZaehlt = false,
  mitRoyalMint = zeilen === ANTEIL_N || zeilen === NUR_METALLE,
): { halal: number; halalVorKredit: number; kredit: boolean } => {
  const tuer = a.werte[TOR];
  const { punkte, max } = halalPunkte(a, zeilen, mitRoyalMint);
  const anteil = max > 0 ? punkte / max : 0;
  // Regel 10: Im Depot-Vergleich rechnet ein Depot, zu dessen Zins der Anbieter nichts belegt (offen), wie ein zinsfreies; die Stufe stellt es
  // hinter die belegten. Ein belegt verzinstes ("schlecht") rechnet mit 0.
  const faktor = tuer === "gut" ? 1 : tuer === "teils" ? FAKTOR_ABSCHALTBAR : offenZaehlt && tuer !== "schlecht" ? FAKTOR_ZINS_OFFEN : 0;
  const kredit = a.werte.kreditAbStart === "teils";
  const halalVorKredit = 5 * anteil * faktor;
  return { halal: halalVorKredit * (kredit ? FAKTOR_KREDIT : 1), halalVorKredit, kredit };
};

/** Depot zählt alle 22 Halal-Anlagen, Edelmetall nur die Zeile der Gold- und Silber-ETCs. */
const depotUrteil = (
  a: RohAnbieter,
  finanzMax: Record<string, number>,
  kategorie: RangKategorie,
  zeilen: Record<string, number> = ANTEIL_N,
): Urteil => {
  const tuer = a.werte[TOR];
  // Regel 10: Im Depot-Vergleich steht auch ein Depot mit belegtem Zins auf der Liste (Stufe 2, ganz hinten).
  const alleRein = kategorie === "depot";
  if (alleRein ? a.abgeraten && tuer !== "schlecht" : tuer === "schlecht" || a.abgeraten) return { art: "abgeraten", grund: "Zinsen nicht abschaltbar" };

  const kosten = kostenAus(a, finanzMax) ?? 0;
  const { halal, halalVorKredit, kredit } = depotHalal(a, zeilen, alleRein);
  const sperrt = kredit && KREDIT_NIE_PLATZ_EINS.has(kategorie);
  return { art: "bewertet", halal, kosten, note: halbe(halal, kosten), uneingeschraenkt: tuer === "gut" && !sperrt, kredit, halalVorKredit };
};

/**
 * Edelmetall seit 23.11.2026 (Elias, VG1: „Edelmetall, weiß ich nicht, ob das Ranking so gut ist.“, raw/2026-11-23-elias-vg1-01-
 * rankings-acht-vergleiche-naeher-am-sale.md im Vault): Gold kauft man im selben Depot, in dem man anlegt („Gold gehört zum
 * Anlegen und ist kein eigenes Ziel“, Regelbuch vergleiche-und-rangfolge.md). Der Halal-Teil zählt deshalb zur Hälfte die
 * Gold- und Silber-ETCs und zur Hälfte alle Halal-Anlagen des Depots, wie im Depot-Vergleich. Kosten bleiben die Kosten
 * eines Kaufs (`EDELMETALL_FINANZ_MAX`). Fast alle Depots haben jedes Metall, so entschied vorher allein der Orderpreis.
 */
const edelmetallUrteil = (a: RohAnbieter, finanzMax: Record<string, number>, anteilN: Record<string, number> = ANTEIL_N): Urteil => {
  const metalle = anteilN === ANTEIL_N ? NUR_METALLE : { halalEdelmetalle: anteilN.halalEdelmetalle ?? 0 };
  const u = depotUrteil(a, finanzMax, "edelmetall", metalle);
  if (u.art !== "bewertet") return u;
  const alle = depotHalal(a, anteilN);
  const halal = (u.halal + alle.halal) / 2;
  return {
    ...u,
    halal,
    halalVorKredit: ((u.halalVorKredit ?? u.halal) + alle.halalVorKredit) / 2,
    note: halbe(halal, u.kosten ?? 0),
  };
};

const zinsUrteil = (a: RohAnbieter, kategorie: "girokonto" | "krypto" | "geschaeftskonto", finanzMax: Record<string, number>): Urteil => {
  const tuer = a.werte[TOR];
  // Regel 9 und 10: Im Geschäftskonto und im Girokonto kommen auch offene und belegt verzinste Konten auf die Liste, die Stufe sortiert sie nach hinten.
  const alleRein = kategorie === "geschaeftskonto" || kategorie === "girokonto";
  if (alleRein ? a.abgeraten && tuer !== "schlecht" : tuer === "schlecht" || a.abgeraten) return { art: "abgeraten", grund: "Zinsen nicht abschaltbar" };

  const { fehlt, lies } = sammler();
  // Geschäftskonto: Ein fehlender Zins-Wert (null) heißt „nicht erfasst“, der Tarif fällt aus der Anzeige. Nur „unbekannt“ ist ein gesetzter Wert.
  if ((!alleRein && tuer !== "gut" && tuer !== "teils") || (kategorie === "geschaeftskonto" && (tuer === null || tuer === undefined))) fehlt.push(TOR);

  // Dispo "teils" im Girokonto: voller Punkt für das Merkmal, dafür ein Zehntel Abzug auf den ganzen Halal-Teil.
  const dispoAbschaltbar = (kategorie === "girokonto" || kategorie === "geschaeftskonto") && a.werte.keinDispoAbStart === "teils";
  let anteil = 0;
  for (const [key, gewicht] of AMPEL_GEWICHTE[kategorie]) {
    // Geschäftskonto und Girokonto: Was der Anbieter nicht ausdrücklich belegt ("unbekannt"), zählt 0 Punkte, nie geschätzt (wie im Depot).
    // Im Girokonto gilt ein fehlender Wert (null) ebenso als offen, im Geschäftskonto fällt der Tarif dann aus der Anzeige.
    const w = a.werte[key];
    const offen = w === "unbekannt" || (kategorie === "girokonto" && (w === null || w === undefined));
    const punkt = alleRein && offen ? 0 : ampel(w);
    anteil += gewicht * lies(key, key === "keinDispoAbStart" && dispoAbschaltbar ? 1 : punkt);
  }
  const kosten = kostenAus(a, finanzMax);
  if (kosten === null) fehlt.push("finanzPunkte");
  if (fehlt.length > 0) return { art: "offen", fehlt };

  const zinsFaktor = tuer === "teils" ? FAKTOR_ABSCHALTBAR : alleRein && tuer === "schlecht" ? 0 : alleRein && tuer !== "gut" ? FAKTOR_ZINS_OFFEN : 1;
  const halalVorDispo = 5 * anteil * zinsFaktor;
  const halal = halalVorDispo * (dispoAbschaltbar ? FAKTOR_DISPO : 1);
  const basisRot = BASIS[kategorie].some((k) => a.werte[k] === "schlecht");
  return {
    art: "bewertet",
    halal,
    kosten: kosten!,
    note: halbe(halal, kosten!),
    uneingeschraenkt: tuer === "gut" && !basisRot && !dispoAbschaltbar,
    halalVorKredit: halalVorDispo,
  };
};

const steuerUrteil = (a: RohAnbieter): Urteil => {
  if (fassung(a.werte.kapital) === 0) return { art: "abgeraten", grund: "kann keine Anlage KAP" };
  // Das Tor Anlage KAP bleibt: ohne Beleg dafür gibt es keinen Platz.
  if (fassung(a.werte.kapital) !== 1) return { art: "offen", fehlt: ["kapital"] };
  // Wie beim Depot: Was nicht belegt ist, zählt 0 Punkte und nie geschätzt. Jedes Programm mit
  // belegter Anlage KAP bekommt eine Note, die Zelle zeigt dann einen Strich.
  const belegt = (wert: number | null) => wert ?? 0;
  const plattform = a.werte.plattform;
  const leistung =
    5 *
    (0.35 * belegt(jaNein(a.werte.belegabruf)) +
      0.25 * belegt(fassung(a.werte.vermietung)) +
      0.25 * belegt(fassung(a.werte.selbststaendige)) +
      0.15 * belegt(typeof plattform === "string" && plattform.trim() ? (/nur Windows/i.test(plattform) ? 0 : 1) : null));
  const p = a.preisEinzel;
  const preis = belegt(typeof p === "number" && Number.isFinite(p) && p >= 0 ? begrenze(5 * (1 - p / PREIS_MAX_STEUER)) : null);
  return { art: "bewertet", halal: leistung, kosten: preis, note: halbe(leistung, preis), uneingeschraenkt: true };
};

const screenerUrteil = (a: RohAnbieter): Urteil => {
  const { fehlt, lies } = sammler();
  const transparenz = (5 * ["gremium", "begruendung", "reinigung"].reduce((s, k) => s + lies(k, ampel(a.werte[k])), 0)) / 3;
  const extras = ["etfs", "depot", "zakat"].reduce((s, k) => s + lies(k, jaNein(a.werte[k])), 0) / 3;
  const frei = a.werte.kostenlos;
  const reicht = lies("kostenlos", typeof frei === "string" && frei.trim() ? (kostenlosReicht(a) ? 1 : 0) : null);
  if (fehlt.length > 0) return { art: "offen", fehlt };
  const nutzen = 5 * (0.5 * reicht + 0.5 * extras);
  return { art: "bewertet", halal: transparenz, kosten: nutzen, note: halbe(transparenz, nutzen), uneingeschraenkt: true };
};

const urteil = (a: RohAnbieter, kategorie: RangKategorie, finanzMax: Record<string, number>, anteilN: Record<string, number> = ANTEIL_N): Urteil => {
  switch (kategorie) {
    case "steuer":
      return steuerUrteil(a);
    case "screener":
      return screenerUrteil(a);
    case "edelmetall":
      return edelmetallUrteil(a, finanzMax, anteilN);
    case "depot":
      return depotUrteil(a, finanzMax, kategorie, anteilN);
    default:
      return zinsUrteil(a, kategorie, finanzMax);
  }
};

/**
 * Welche Eingaben der Note bei diesem Angebot nicht belegt sind. Depot, Edelmetall und Steuer
 * zählen so etwas als 0 Punkte, Girokonto, Krypto und Screener vergeben dann keinen Platz. Leer
 * heißt: Jeder Wert, aus dem die Note entsteht, ist belegt. Darauf baut `src/lib/vollstaendig.ts`.
 */
export const unbelegteWerte = (a: RohAnbieter, kategorie: RangKategorie, opt: RangOptionen = {}): string[] => {
  const finanzMax = opt.finanzMax ?? STANDARD_FINANZ_MAX[kategorie] ?? {};
  const anteilN = opt.anteilN ? Object.fromEntries(Object.entries(opt.anteilN).filter(([, n]) => n > 0)) : ANTEIL_N;
  if (kategorie === "depot" || kategorie === "edelmetall") {
    const tuer = a.werte[TOR];
    // Edelmetall rechnet seit 23.11.2026 alle Halal-Anlagen mit (`edelmetallUrteil`). Eine unbelegte ETF- oder Sukuk-Zeile
    // zählt dort 0 Punkte wie im Depot-Vergleich, nimmt das Depot aber nicht aus der Gold-Liste: Gefordert sind nur die Metalle.
    const zeilen = kategorie === "depot" ? anteilN : opt.anteilN ? { halalEdelmetalle: anteilN.halalEdelmetalle ?? 0 } : NUR_METALLE;
    return [
      ...(tuer === "gut" || tuer === "teils" || tuer === "schlecht" ? [] : [TOR]),
      ...Object.entries(zeilen)
        .filter(([key, n]) => {
          const w = a.werte[key];
          const m = typeof w === "string" ? w.match(ANLAGEN_ZEILE) : null;
          return !(m !== null && Number(m[2]) === n && typeof a.halalAnlagenPunkte?.[key] === "number");
        })
        .map(([key]) => key),
      ...(kostenAus(a, finanzMax) === null ? ["finanzPunkte"] : []),
    ];
  }
  if (kategorie === "steuer") {
    const plattform = a.werte.plattform;
    const p = a.preisEinzel;
    return [
      ...(["kapital", "vermietung", "selbststaendige"] as const).filter((k) => fassung(a.werte[k]) === null),
      ...(jaNein(a.werte.belegabruf) === null ? ["belegabruf"] : []),
      ...(typeof plattform === "string" && plattform.trim() ? [] : ["plattform"]),
      ...(typeof p === "number" && Number.isFinite(p) && p >= 0 ? [] : ["preisEinzel"]),
    ];
  }
  const u = urteil(a, kategorie, finanzMax, anteilN);
  return u.art === "offen" ? u.fehlt : [];
};

const nachName = (p: RohAnbieter, q: RohAnbieter) =>
  p.name.localeCompare(q.name, "de") || p.produkt.localeCompare(q.produkt, "de") || p.id.localeCompare(q.id, "de");

/** Belegt kaufbare Halal-ETFs und Fonds („11 von 12“ wird 11), sonst 0. */
export const halalEtfZahl = (a: RohAnbieter): number => {
  const m = String(a.werte.halalEtfsFonds ?? "").match(/^(\d+) von \d+/);
  return m ? Number(m[1]) : 0;
};

/** Regel 11: im Depot bei gleicher angezeigter Note und gleichem Link-Stand zuerst Halal-Teil, dann Zahl der Halal-ETFs. */
export const depotGleichstand = (
  kategorie: RangKategorie,
  p: { halal: number; anbieter: RohAnbieter },
  q: { halal: number; anbieter: RohAnbieter },
): number =>
  kategorie !== "depot"
    ? 0
    : q.halal - p.halal || (p.halal > 0 ? halalEtfZahl(q.anbieter) - halalEtfZahl(p.anbieter) : 0);

export const rangfolge = (liste: readonly RohAnbieter[], kategorie: RangKategorie, opt: RangOptionen = {}): Rangliste => {
  const finanzMax = opt.finanzMax ?? STANDARD_FINANZ_MAX[kategorie] ?? {};
  const anteilN = opt.anteilN ? Object.fromEntries(Object.entries(opt.anteilN).filter(([, n]) => n > 0)) : ANTEIL_N;
  const bewertet: Array<Omit<Bewertet, "platz">> = [];
  const nichtBewertet: NichtBewertet[] = [];
  const abgeraten: Abgeraten[] = [];

  for (const anbieter of liste) {
    const u = urteil(anbieter, kategorie, finanzMax, anteilN);
    if (u.art === "abgeraten") abgeraten.push({ anbieter, grund: u.grund });
    else if (u.art === "offen") {
      const angefragt = opt.offeneAnfragen?.has(anbieter.haus ?? anbieter.id) ?? false;
      nichtBewertet.push({ anbieter, grund: angefragt ? "Anfrage läuft" : "noch nicht geprüft", fehlt: u.fehlt });
    } else {
      // Regel 8: Halal-Teil und Kosten je zur Hälfte, kein weiteres Kriterium (seit 25.11.2026).
      bewertet.push({
        anbieter,
        note: runde(u.note),
        halal: runde(u.halal),
        kosten: u.kosten === null ? null : runde(u.kosten),
        uneingeschraenkt: u.uneingeschraenkt,
        kredit: u.kredit ?? false,
        halalVorKredit: runde(u.halalVorKredit ?? u.halal),
      });
    }
  }

  const gleichauf = (p: Omit<Bewertet, "platz">, q: Omit<Bewertet, "platz">) =>
    vorrang(kategorie, p, q) ||
    depotGleichstand(kategorie, p, q) ||
    q.note - p.note || (q.kosten ?? 0) - (p.kosten ?? 0) || q.halal - p.halal || feinwert(q.anbieter) - feinwert(p.anbieter);
  bewertet.sort((p, q) => gleichauf(p, q) || nachName(p.anbieter, q.anbieter));
  // Regel 13: feste Spitze im deutschen Depot, alle anderen behalten ihre Reihenfolge dahinter.
  const spitze = bewertet
    .filter((b) => spitzenRang(kategorie, b.anbieter.id) >= 0)
    .sort((p, q) => spitzenRang(kategorie, p.anbieter.id) - spitzenRang(kategorie, q.anbieter.id));
  if (spitze.length > 0) bewertet.splice(0, bewertet.length, ...spitze, ...bewertet.filter((b) => !spitze.includes(b)));
  // Regel 6: Platz 1 nur ohne Einschränkung und, wo Regel 2 gilt, über unseren Link (Elias 06.10.: „Die Eins muss immer von uns kaufbar sein“,
  // A11: „nicht etwas auf die 1 packen, wo wir keinen Link haben“). Hat keiner ohne Einschränkung einen Link, zählt nur die Einschränkung.
  const mitLink = bewertet.findIndex((b) => b.uneingeschraenkt && (!LINK_VORRANG.has(kategorie) || Boolean(b.anbieter.link)));
  const ersterFrei = mitLink >= 0 ? mitLink : bewertet.findIndex((b) => b.uneingeschraenkt);
  if (ersterFrei > 0) bewertet.unshift(...bewertet.splice(ersterFrei, 1));
  const vorgezogen = ersterFrei > 0;

  const gerankt: Bewertet[] = [];
  bewertet.forEach((b, i) => {
    const vorher = gerankt[i - 1];
    const inSpitze = spitzenRang(kategorie, b.anbieter.id) >= 0 || (vorher && spitzenRang(kategorie, vorher.anbieter.id) >= 0);
    const platz = vorher && !inSpitze && !(vorgezogen && i === 1) && gleichauf(vorher, b) === 0 ? vorher.platz : i + 1;
    gerankt.push({ ...b, platz });
  });

  nichtBewertet.sort((p, q) => nachName(p.anbieter, q.anbieter));
  abgeraten.sort((p, q) => nachName(p.anbieter, q.anbieter));
  return { gerankt, nichtBewertet, abgeraten };
};

/**
 * Wer im Kasten "Unsere Nummer 1" steht: die besten Einträge ohne Einschränkung.
 * Mehr als einer heißt gleichauf, keiner heißt kein Kasten.
 */
export const nummerEins = (r: Rangliste): Bewertet[] => {
  const kandidaten = r.gerankt.filter((b) => b.uneingeschraenkt);
  if (kandidaten.length === 0) return [];
  const erster = kandidaten[0];
  // Derselbe Platz heißt gleichauf in allem, was die Reihenfolge bestimmt (Regel 4).
  return kandidaten.filter((b) => b.platz === erster.platz);
};
