import { brokerVergleich, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { ROYAL_MINT } from "@/data/royalMint";
import { rangfolge } from "@/lib/rangfolge";

/**
 * Schlanke Startseite je Depot (CV21F, Elias 07.11.2026): Kopf mit Anbieter und Note, zwei Zeilen, Knopf direkt
 * zum Anbieter, Video im Querformat; die Seite endet sichtbar mit dem Video. Weit darunter eine kleine Liste der
 * kaufbaren Halal-Anlagen (nur Bestätigung, nicht antippbar) und die blauen Links. Wortlaut der Zeilen aus
 * raw/2026-11-07-elias-cv20f-unterseite-schlank-video-ablauf-fertig-guide.md und -originaldesign-anlagenliste.md
 * im Vault; Inhalt der Probeseiten ~/rebrand/neu-cv20f/.
 */
export type BrokerStart = {
  /** id in brokerVergleich, daraus Note und Anlagenliste. */
  vergleichId: string;
  /** Satz mit Note unter dem Titel; fehlt, wo die erste Zeile schon bestätigt (flatex, Elias 08.11.2026). */
  bestaetigung?: string;
  /** Genau zwei Zeilen mit Haken; Zahl und € mit geschütztem Leerzeichen, sonst steht das € am Handy allein. */
  zeilen: [string, string];
  /** Offizielle Seite des Anbieters zum Depotübertrag (Beleg). */
  wechselUrl: string;
  /** Fehlt, bis Elias das Video aufgenommen hat (08.11.2026). */
  video?: { src: string; poster?: string };
  /** Nur flatex: Verzicht auf den flex-Kredit in Textform. */
  kreditVerzicht?: boolean;
  /** Pflichttext aus den Vorgaben des Partners, steht unter dem Knopf in Textgröße. */
  pflicht?: string;
  /** Kostenhinweis des Partners zu einer 0-€-Angabe, steht in der Fußnote unten. */
  kostenHinweis?: string;
};

export const BROKER_START: Record<string, BrokerStart> = {
  "traders-place": {
    vergleichId: "traders-place-depot",
    bestaetigung: "Bestes Halal-Depot im Vergleich",
    zeilen: ["Halal-ETFs, zertifiziertes Gold, Sparplan ab 1\u00a0€", "Depot 0\u00a0€, Order ab 0\u00a0€"],
    // Direkt ins Online-Formular (Elias, CV22F: „die machen das für euch“): alte Bank wählen, Bestände abrufen, am Handy
    // unterschreiben; „Wir schicken Deinen Antrag an die abgebende Bank.“ Verlinkt von tradersplace.de/service/depotuebertrag,
    // dort: „Für die Einbuchung deiner Wertpapiere berechnen wir keine Kosten“.
    wechselUrl: "https://tradersplace.depotwechselservice24.de/",
  },
  flatex: {
    vergleichId: "flatex-depot",
    // Elias, CV21F 08.11.2026: Bestätigungssatz und ETF-Sparplan weg, je Haken eine Zeile, „weltweite Islamic-Anlagen
    // … ohne jetzt dieses 12 von 12“. „Größte Halal-Börse in Deutschland“ ist nicht belegbar; weltweit sind die
    // kaufbaren Islamic-ETFs (MSCI World Islamic, ACWI Islamic, Emerging Markets Islamic) und Sukuk.
    zeilen: ["Weltweite Halal-Anlagen", "Depot 0\u00a0€, ETF-Sparplan 0\u00a0€"],
    // Direkt das Formular „Konto-/Depotübertrag an flatexDEGIRO Bank SE“ (flatex kennt kein Online-Verfahren für den
    // Übertrag zu flatex): ausfüllen, unterschreiben, an die alte Bank. „Unsererseits werden für die Übertragung keine
    // Gebühren erhoben“ (flatex FAQ Depotübertrag).
    wechselUrl: "https://konto.flatex.de/formularcenter/public/1300002.pdf",
    kreditVerzicht: true,
    // flatex-Vorgaben für Partner (~/rebrand/data/vergleiche/belege/flatex/2026-10-12-info-flatex-disclaimers.txt):
    // Risikohinweis „deutlich sichtbar und in der gleichen Schriftgröße wie der Text“; bei 0 € Orderentgelt für ETFs der
    // Kostenhinweis (ohne Vorgabe zur Größe). Elias 08.11.2026: keine grauen Kleinzeilen oben, darum in der Fußnote.
    pflicht: "Investieren birgt Verlustrisiken.",
    kostenHinweis: "ETF-Sparplan bei flatex zzgl. marktüblicher Spreads, Zuwendungen, Produktkosten.",
  },
  smartbroker: {
    vergleichId: "smartbroker-plus-depot",
    bestaetigung: "Sehr gut im Vergleich, auch alle Sukuk",
    zeilen: ["Halal-ETFs, Sukuk, zertifiziertes Gold, Sparplan ab 1\u00a0€", "Depot 0\u00a0€, Order ab 0\u00a0€"],
    // Direkt ins Online-Formular wie bei Traders Place. „Der Übertrag innerhalb Deutschlands ist komplett kostenfrei“
    // (smartbrokerplus.de/de-de/depotuebertrag).
    wechselUrl: "https://smartbrokerplus.depotwechselservice24.de/",
  },
};

/**
 * Text für den Verzicht. flatex: „Für Neukunden mit Kontoeröffnung automatisch; eine Antragstellung ist nicht
 * notwendig“ und „teilen Sie uns dies bitte in Textform mit“ (flatex.de/produkte-handel/produkte/wertpapierkredite,
 * gelesen 07.11.2026). Kunden schreiben über „Kontaktanfrage in Ihrer Anwendung im Benutzermenü unter dem Menüpunkt
 * Support“ (flatex.de/service/kontakt).
 */
export const FLATEX_VERZICHT = {
  betreff: "Verzicht auf den flex-Kredit",
  text: [
    "Guten Tag,",
    "",
    "ich verzichte auf den Dispositionsrahmen (flex-Kredit) für mein Konto. Bitte richten Sie für mein Konto keine Kreditlinie ein und bestätigen Sie mir das kurz.",
    "",
    "Name:",
    "Kontonummer:",
    "",
    "Vielen Dank",
  ].join("\n"),
  weg: "In der flatex-App: Benutzermenü, Support, Kontaktanfrage",
};

export type AnlagenGruppe = { titel: string; namen: string[] };

/** „Kaufbar: A, B, C. Nicht im Angebot: …“ → [A, B, C], ohne Klammerzusätze. */
const kaufbarAus = (hinweis: string | undefined): string[] => {
  const m = hinweis?.match(/Kaufbar: (.*?)\.(?: |$)/);
  if (!m) return [];
  return m[1].split(", ").map((n) => n.replace(/\s*\(.*?\)\s*/g, "").trim());
};

const royalMintBei = (haus: string): boolean => Boolean(ANLAGEN_KAUFBAR[ROYAL_MINT]?.kaufbar.some((k) => k.haus === haus));

export const anlagenListe = (vergleichId: string): AnlagenGruppe[] => {
  const a = brokerVergleich.find((b) => b.id === vergleichId);
  if (!a) return [];
  const q = a.quellen as Record<string, { hinweis?: string } | undefined>;
  const gold = kaufbarAus(q.halalEdelmetalle?.hinweis);
  if (royalMintBei(a.haus)) gold.unshift("Royal Mint Physical Gold (zertifiziert)");
  return [
    { titel: "Halal-ETFs und Fonds", namen: kaufbarAus(q.halalEtfsFonds?.hinweis) },
    { titel: "Sukuk", namen: kaufbarAus(q.halalSukuk?.hinweis) },
    { titel: "Gold und Silber", namen: gold },
  ].filter((g) => g.namen.length > 0);
};

/** Note wie im Depot-Vergleich, dieselbe Rangfolge. */
export const noteImVergleich = (vergleichId: string): number | null => {
  const r = rangfolge(brokerVergleich, "depot", { finanzMax: DEPOT_FINANZ_MAX });
  return r.gerankt.find((b) => b.anbieter.id === vergleichId)?.note ?? null;
};
