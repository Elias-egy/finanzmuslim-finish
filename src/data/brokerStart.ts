import { brokerVergleich, DEPOT_FINANZ_MAX } from "@/data/brokerVergleich";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { ROYAL_MINT } from "@/data/royalMint";
import { halalAnlagen } from "@/data/halalAnlagen";
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
  /** Echtes Logo mit Schrift im Titel (Elias, CV23S 08.11.2026); verhaeltnis = Breite durch Höhe der viewBox. */
  logo: { src: string; verhaeltnis: number };
  /** App des Anbieters, die Elias im Video öffnet (Beleg: Store-Seiten, geprüft 08.11.2026). */
  app: { name: string; ios: string; android: string; zweck?: string };
  /** Ident-App, die Elias im Video nennt; fehlt, wo er keine eigene App braucht. */
  ident?: { name: string; ios: string; android: string };
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

/** POSTIDENT-App der Deutschen Post (Elias, CV23S 08.11.2026: „pack nur noch die App rein … Post-Ident“). Store-Seiten
 * geprüft 08.11.2026: apps.apple.com id999762739, Google Play de.deutschepost.postident. */
const POSTIDENT = {
  name: "POSTIDENT",
  ios: "https://apps.apple.com/de/app/postident/id999762739",
  android: "https://play.google.com/store/apps/details?id=de.deutschepost.postident",
};

export const BROKER_START: Record<string, BrokerStart> = {
  "traders-place": {
    vergleichId: "traders-place-depot",
    ident: POSTIDENT,
    logo: { src: "/bilder/logos/traders-place-wortmarke.svg", verhaeltnis: 200 / 52 },
    // tradersplace.de/app verlinkt beide Stores. Ausweisen per eID läuft in dieser App, keine Postident-App:
    // „Schritt 1: Traders Place App installieren … Du benötigst die App zum Scannen deines eID Online-Ausweises“
    // (Elias' Bildschirmaufnahme ~/Desktop/tradersplace/1108(1).mp4 bei 3:12).
    app: {
      name: "Traders Place",
      zweck: "auch zum Ausweisen",
      ios: "https://apps.apple.com/de/app/traders-place/id6450201119",
      android: "https://play.google.com/store/apps/details?id=de.tradersplace.tradingapp",
    },
    zeilen: ["Halal-ETFs, zertifiziertes Gold, Sparplan ab 1\u00a0€", "Depot 0\u00a0€, Order ab 0\u00a0€"],
    // Direkt ins Online-Formular (Elias, CV22F: „die machen das für euch“): alte Bank wählen, Bestände abrufen, am Handy
    // unterschreiben; „Wir schicken Deinen Antrag an die abgebende Bank.“ Verlinkt von tradersplace.de/service/depotuebertrag,
    // dort: „Für die Einbuchung deiner Wertpapiere berechnen wir keine Kosten“.
    wechselUrl: "https://tradersplace.depotwechselservice24.de/",
  },
  flatex: {
    vergleichId: "flatex-depot",
    ident: POSTIDENT,
    // Logo aus dem Seitenkopf von flatex.de (Inline-SVG, Farben wie dort auf Weiß).
    logo: { src: "/bilder/logos/flatex-wortmarke.svg", verhaeltnis: 244 / 54 },
    app: {
      name: "flatex next",
      ios: "https://apps.apple.com/de/app/flatex-next-aktien-etf/id1084714808",
      android: "https://play.google.com/store/apps/details?id=de.xcom.flatexde",
    },
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
    ident: POSTIDENT,
    logo: { src: "/bilder/logos/smartbroker-plus-wortmarke.svg", verhaeltnis: 1051 / 125 },
    app: {
      name: "Smartbroker+",
      ios: "https://apps.apple.com/de/app/smartbroker-aktien-etf/id1643142640",
      android: "https://play.google.com/store/apps/details?id=de.smartbroker",
    },
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

/**
 * FERTIG mit Nachweis (Elias, CV22F 08.11.2026): „Schreibe mir die Mail fertig mit einem Screenshot von deinem
 * Halal-ETF“. Seit CV26P steht in der Mail nur noch „Fertig“ und der Hinweis (Elias, CV25V: „im eigenen E-Mail-Provider
 * direkt sozusagen nur stehen fertig … und dann halt irgendwie noch unten als Hinweis … Screenshot hinzufügen und
 * abschicken … Das kann auch ruhig in den Text geschrieben werden“, Vault
 * raw/2026-11-08-elias-cv25v-portfolioplan-zuerst-fertig-mail-video.md). Belohnung ist der persönliche Portfolioplan
 * statt des XXL-Guides (Elias, CV25V: „dieses XXL-Guide … musst du auch alles wegmachen“). Der Zoho-Antworter am VPS
 * (scripts/scheduler/zoho_antworten.py, ist_fertig) erkennt Betreff FERTIG bei eigenem Text bis 220 Zeichen; seine
 * Antwort zeigt erst mit dem gemeinsamen Livegang auf den Plan.
 */
const FERTIG_TEXT = "Fertig\n\n(Screenshot hinzufügen und abschicken)\n";
export const FERTIG_MAIL = {
  link: "hier die Mail an mich",
  satz: "Screenshot deines Halal-ETFs hinzufügen, dann bekommst du deinen persönlichen Portfolioplan.",
  href: `mailto:elias@finanzmuslim.com?subject=FERTIG&body=${encodeURIComponent(FERTIG_TEXT)}`,
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

/**
 * Alle Halal-Anlagen der Datenbank, die beim Anbieter mit Einzelbeleg kaufbar sind (ANLAGEN_KAUFBAR), mit Link auf
 * /halal-anlagen/<slug> (Elias, CV23S 08.11.2026: „alle Anlagen … untereinander … als blauer Link … zur Datenbank“).
 */
export const anlagenMitLink = (vergleichId: string): { name: string; slug: string }[] => {
  const haus = brokerVergleich.find((b) => b.id === vergleichId)?.haus;
  if (!haus) return [];
  return halalAnlagen
    .filter((a) => a.isin && ANLAGEN_KAUFBAR[a.isin]?.kaufbar.some((k) => k.haus === haus))
    .map((a) => ({ name: a.name, slug: a.slug }));
};

/** Note wie im Depot-Vergleich, dieselbe Rangfolge. */
export const noteImVergleich = (vergleichId: string): number | null => {
  const r = rangfolge(brokerVergleich, "depot", { finanzMax: DEPOT_FINANZ_MAX });
  return r.gerankt.find((b) => b.anbieter.id === vergleichId)?.note ?? null;
};
