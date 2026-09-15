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
  text: "56 Broker im Vergleich, mit Halal-Merkmalen: ohne Zinsen nutzbar, kein Kredit, welche Halal-Anlagen es dort gibt.",
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

/** Beiträge, in denen das Konto näher liegt als das Depot. Alle anderen zeigen das Depot. */
const jeBeitrag: Record<string, EmpfehlungsBoxProps> = {
  "girokonto-ohne-zinsen": girokonto,
  "dispo-und-schulden": girokonto,
  "kreditkarte-halal": girokonto,
};

export const werbungFuer = (slug: string): EmpfehlungsBoxProps => jeBeitrag[slug] ?? depot;
