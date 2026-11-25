import type { EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";
import { ANZAHL_DEPOTS, ANZAHL_KONTEN, ANZAHL_KRYPTO } from "./anzahlen";
import { ANKER_VERGLEICH } from "./ankertexte";

/**
 * Werbe-Box in jedem Wissensbeitrag, direkt nach Kapitel 1 (Elias, 15.09.2026: der erste Aufruf muss
 * früh kommen, wenn der Leser drin ist, aber noch am Anfang).
 *
 * Heute ein Platzhalter auf den Vergleich. Später bekommt jeder Beitrag hier seine eigene Aktion
 * (Anbieter, Vorteil, Angebot), dann wird aus dem Vergleichs-Hinweis eine Empfehlung mit Werbekennzeichnung.
 * Nur hier eintragen, nicht in den Beiträgen.
 */
const depot: EmpfehlungsBoxProps = {
  kategorie: "Depot",
  variante: "vergleich",
  ueberschrift: "Welches Depot passt zu dir?",
  text: `${ANZAHL_DEPOTS} Broker im Vergleich, mit Halal-Merkmalen: ohne Zinsen nutzbar und welche Halal-Anlagen es dort gibt.`,
  knopf: ANKER_VERGLEICH["/vergleich/depot"],
  linkZiel: "/vergleich/depot",
};

const girokonto: EmpfehlungsBoxProps = {
  kategorie: "Girokonto",
  variante: "vergleich",
  ueberschrift: "Welches Konto kommt ohne Zinsen aus?",
  text: `${ANZAHL_KONTEN} Girokonten im Vergleich, mit Halal-Merkmalen: ohne Zinsen nutzbar, kein Dispo, Karte ohne Kredit.`,
  knopf: ANKER_VERGLEICH["/vergleich/girokonto"],
  linkZiel: "/vergleich/girokonto",
};

const krypto: EmpfehlungsBoxProps = {
  kategorie: "Krypto",
  variante: "vergleich",
  ueberschrift: "Wo kaufst du Krypto ohne Zinsen?",
  text: `${ANZAHL_KRYPTO} Krypto-Anbieter im Vergleich, mit Halal-Merkmalen: echte Coins, keine Zinsen, kein Lending.`,
  knopf: "Zum Krypto-Vergleich",
  linkZiel: "/vergleich/krypto",
};

/** Der geführte Vergleich. Wechselt sich mit dem Depot-Vergleich ab, damit nicht jeder Beitrag
 *  denselben Aufruf trägt (Elias, 21.09.2026: „ein bisschen mehr Abwechslung“). */
const test: EmpfehlungsBoxProps = {
  kategorie: "Depot",
  variante: "vergleich",
  ueberschrift: "Was passt zu dir?",
  text: "Beantworte ein paar einfache Fragen. Du siehst, welches Depot, welches Konto und welche App ohne Zinsen zu dir passen.",
  knopf: "Jetzt herausfinden",
  linkZiel: "/check?quelle=quiz",
};

/** Hauptaufruf nach Kapitel 1, passend zum Thema. Alle anderen zeigen das Depot. */
const jeBeitrag: Record<string, EmpfehlungsBoxProps> = {
  "girokonto-ohne-zinsen": girokonto,
  "dispo-und-schulden": girokonto,
  "kreditkarte-halal": girokonto,
  "ratenzahlung-haram": girokonto,
  "ist-bitcoin-halal": krypto,
  "zinsen-im-islam": test,
  "haeufige-fehler": test,
  "gharar": test,
  "maysir": test,
  "ist-leasing-haram": test,
  "halal-kredit-ohne-zinsen": test,
  "sind-aktien-halal": test,
  "ist-versicherung-haram": test,
};

export const werbungFuer = (slug: string): EmpfehlungsBoxProps => jeBeitrag[slug] ?? depot;

/**
 * Der passende Vergleich je Beitrag (RN19): steht als eine Zeile oben unter der Überschrift, vor jedem Anbieter-Kasten,
 * damit jeder Beitrag früh auf seine Money Page führt (Elias RN19: „dass die Blogs mindestens sitzen“). Schlüssel ist
 * der Schlüssel aus `wissenBeitraege`. Keine Werbung im Sinn der Kästen: ein Textlink ohne Anbieter.
 */
export type VergleichsZeile = { pfad: string; text: string };

const VERGLEICH = {
  depot: { pfad: "/vergleich/depot", text: ANKER_VERGLEICH["/vergleich/depot"] },
  girokonto: { pfad: "/vergleich/girokonto", text: ANKER_VERGLEICH["/vergleich/girokonto"] },
  krypto: { pfad: "/vergleich/krypto", text: "Der passende Vergleich: Krypto-Börsen mit echten Coins" },
  edelmetalle: { pfad: "/vergleich/edelmetalle", text: ANKER_VERGLEICH["/vergleich/edelmetalle"] },
} satisfies Record<string, VergleichsZeile>;

const vergleichJeBeitrag: Record<string, VergleichsZeile> = {
  "sukuk": VERGLEICH.depot,
  "ist-bitcoin-halal": VERGLEICH.krypto,
  "ertraege-reinigen": VERGLEICH.depot,
  "girokonto-ohne-zinsen": VERGLEICH.girokonto,
  "kreditkarte-halal": VERGLEICH.girokonto,
  "dispo-und-schulden": VERGLEICH.girokonto,
  "ratenzahlung-haram": VERGLEICH.girokonto,
  "zinsen-im-islam": VERGLEICH.girokonto,
  "auto-kaufen-ohne-zinsen": VERGLEICH.depot,
  "haus-kaufen-ohne-zinsen": VERGLEICH.depot,
  "haeufige-fehler": VERGLEICH.depot,
  "gharar": VERGLEICH.depot,
  "maysir": VERGLEICH.depot,
  "trading-forex-cfd": VERGLEICH.depot,
  "zakat-auf-aktien-etf-krypto": VERGLEICH.depot,
  "nisab": VERGLEICH.edelmetalle,
  "erbe": VERGLEICH.depot,
};

export const vergleichFuer = (slug: string): VergleichsZeile => vergleichJeBeitrag[slug] ?? VERGLEICH.depot;
