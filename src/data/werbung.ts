import type { EmpfehlungsBoxProps } from "@/components/EmpfehlungsBox";

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
  text: "56 Broker im Vergleich, mit Halal-Merkmalen: ohne Zinsen nutzbar und welche Halal-Anlagen es dort gibt.",
  knopf: "Zum Depot-Vergleich",
  linkZiel: "/vergleich/depot",
};

const girokonto: EmpfehlungsBoxProps = {
  kategorie: "Girokonto",
  variante: "vergleich",
  ueberschrift: "Welches Konto kommt ohne Zinsen aus?",
  text: "56 Girokonten im Vergleich, mit Halal-Merkmalen: ohne Zinsen nutzbar, kein Dispo, Karte ohne Kredit.",
  knopf: "Zum Girokonto-Vergleich",
  linkZiel: "/vergleich/girokonto",
};

const krypto: EmpfehlungsBoxProps = {
  kategorie: "Krypto",
  variante: "vergleich",
  ueberschrift: "Wo kaufst du Krypto ohne Zinsen?",
  text: "27 Krypto-Anbieter im Vergleich, mit Halal-Merkmalen: echte Coins, keine Zinsen, kein Lending.",
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
  linkZiel: "/vergleich/start",
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
