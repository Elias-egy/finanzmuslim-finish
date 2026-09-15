/**
 * Eine Stelle für alle Werbeplätze der Anlageseiten.
 *
 * Hintergrund: Der Depot-Vergleich ist noch eine Hülle, die Partnerlinks sind
 * beantragt, aber nicht da. Die Seite wird trotzdem jetzt fertig gebaut. Jeder
 * Platz steht schon in der endgültigen Größe und zeigt einen ruhigen Status
 * statt eines toten Knopfes. Wenn die Daten da sind, wird hier eine Zeile
 * geändert und nichts neu entworfen.
 *
 * Was sich später ändert:
 *   status              → "live"
 *   depotVergleichPfad  → "/vergleich/depot", sobald dort echte Daten stehen
 */

export type MonetarisierungStatus = "entwurf" | "in_vorbereitung" | "live";

export type Platzierung = "anlage_kopf" | "partner_streifen" | "chart_aktion";

export type MonetarisierungConfig = {
  status: MonetarisierungStatus;
  /** null, solange der Vergleich keine geprüften Anbieter enthält. */
  depotVergleichPfad: string | null;
  /** Entwurfsflächen nur in der lokalen Vorschau zeigen, nie öffentlich. */
  entwurfsflaechenZeigen: boolean;
};

export const monetarisierung: MonetarisierungConfig = {
  status: "live",
  depotVergleichPfad: "/vergleich/depot",
  entwurfsflaechenZeigen: false,
};

/** Texte je Platz. Zwei Zeilen, mehr braucht ein Status nicht. */
export const platzTexte: Record<Platzierung, { titel: string; text?: string }> = {
  anlage_kopf: {
    titel: "Depot-Vergleich in Vorbereitung",
    text: "Wir prüfen gerade, bei welchen Brokern diese Anlage handelbar ist.",
  },
  partner_streifen: {
    titel: "Partnerangebote werden vorbereitet",
    text: "Hier steht später ein gekennzeichnetes Angebot eines Brokers.",
  },
  chart_aktion: {
    titel: "Broker-Verfügbarkeit wird geprüft",
  },
};
