/**
 * Die Boykott-Liste, das Freebie zum Wort „Boykott“ (Sitzung BK1, 28.10.2026).
 *
 * Elias, 28.10.2026: „eine Liste mit Produkten, die man im Alltag hat … 20-30 Firmen, die am
 * stärksten im Boykott öffentlich verwickelt sind“, dazu der Aufruf „das gleiche ist auch bei Aktien
 * so … So investierst du halal“. Grundlage ist allein die Seite „What to boycott“ der BDS-Bewegung
 * (Wortlaut in `docs/freebies/quellen/bds-what-to-boycott-2026-10-28.txt`): 13 Firmen als
 * Boykott-Ziel, 7 im unterstützten Boykott von unten, 5 als Druck-Ziel. Jede Begründung gibt die
 * BDS-Seite wieder, kein eigenes Urteil. Belege je Zeile in `docs/freebies/boykott-liste.belege.md`.
 *
 * Gebaut im Stil von Fassung 5 des Portfolio-Plans. Liegt versteckt unter /deine-boykottliste/<schluessel>:
 * nicht in Navigation oder Sitemap, noindex. Wer den Schlüssel ändert, macht alle verschickten Links ungültig.
 */

export const BOYKOTT_SCHLUESSEL = "bk-7m4q";
export const BOYKOTT_PFAD = `/deine-boykottliste/${BOYKOTT_SCHLUESSEL}`;
export const BOYKOTT_STAND = "28.10.2026";

/** Jeder Link trägt seine Stelle, damit MC6 die Klicks je Stelle zählen kann. */
export const boykottLink = (ziel: string, stelle: string) => `${ziel}?src=gboykott-${stelle}`;

/**
 * boykott: BDS ruft zum Boykott auf (Boykott-Ziel oder unterstützter Boykott von unten).
 * meiden: Druck-Ziel, BDS ruft zum Boykott auf, „when reasonable alternatives exist“.
 */
export type BoykottArt = "boykott" | "meiden";
export type BdsGruppe = "ziel" | "vonUnten" | "druck";

export type BoykottFirma = {
  name: string;
  domain?: string;
  /** Was man davon im Alltag kennt, kurz. */
  alltag: string;
  /** Höchstens zwei Zeilen am Handy (Elias, 28.10.2026). */
  grund: string;
  gruppe: BdsGruppe;
  /** Zusatz, wo ein Boykott schaden kann (Medikamente). */
  hinweis?: string;
};

export const artVon = (f: BoykottFirma): BoykottArt => (f.gruppe === "druck" ? "meiden" : "boykott");

/** Für die Gruppe „von unten“ nennt BDS keinen Grund je Firma, nur diesen gemeinsamen. */
const VON_UNTEN = "Laut BDS hat die Firma oder ihr Partner in Israel den Staat offen unterstützt oder der Armee gespendet.";

/**
 * Alternative je Bereich (Elias, 28.10.2026: „Läden, die es in Deutschland gibt, die eigentlich super sind“,
 * raw/2026-10-28-elias-bk1-edelmetalle-und-alternativen.md). Jede steht in keiner der gesicherten Listen
 * (`docs/freebies/quellen/`, Test in boykottListe.test.ts), Eigentümer je Marke in
 * `docs/freebies/boykott-liste.belege.md`. Nicht anklickbar: Auf Freebie-Seiten führen nur Links zum Vergleich weg.
 */
export type Alternative = { name: string; domain: string; statt: string };

export type BoykottBereich = { id: string; titel: string; firmen: BoykottFirma[]; alternativen: Alternative[] };

export const bereiche: BoykottBereich[] = [
  {
    id: "essen",
    titel: "Essen, Trinken, Einkaufen",
    firmen: [
      { name: "McDonald's", domain: "mcdonalds.com", alltag: "Burger", grund: "Der frühere Partner in Israel kündigte Gratis-Essen für Soldaten an, McDonald's kaufte ihm danach alle Filialen ab.", gruppe: "vonUnten" },
      { name: "Coca-Cola", domain: "cocacola.de", alltag: "auch Fanta, Sprite, Powerade", grund: VON_UNTEN, gruppe: "vonUnten" },
      { name: "Burger King", domain: "burgerking.de", alltag: "Burger", grund: VON_UNTEN, gruppe: "vonUnten" },
      { name: "Pizza Hut", domain: "pizzahut.com", alltag: "Pizza", grund: VON_UNTEN, gruppe: "vonUnten" },
      { name: "Domino's", domain: "dominos.de", alltag: "Pizza", grund: VON_UNTEN, gruppe: "vonUnten" },
      { name: "Papa John's", domain: "papajohns.com", alltag: "Pizza", grund: VON_UNTEN, gruppe: "vonUnten" },
      { name: "SodaStream", domain: "sodastream.de", alltag: "Wassersprudler", grund: "Laut BDS beteiligt sich die Firma an der Vertreibung von Beduinen und benachteiligt palästinensische Arbeiter.", gruppe: "ziel" },
      { name: "Carrefour", domain: "carrefour.com", alltag: "Supermärkte", grund: "Der Partner in Israel hat Soldaten Pakete geschenkt, eine Filiale steht in einer Siedlung.", gruppe: "ziel" },
    ],
    alternativen: [
      { name: "Fritz-Kola", domain: "fritz-kola.com", statt: "Coca-Cola" },
      { name: "Vita Cola", domain: "vita-cola.de", statt: "Coca-Cola" },
      { name: "Peter Pane", domain: "peterpane.de", statt: "McDonald's und Burger King" },
      { name: "Call a Pizza", domain: "call-a-pizza.de", statt: "Pizza Hut, Domino's und Papa John's" },
    ],
  },
  {
    id: "technik",
    titel: "Technik und Streaming",
    firmen: [
      { name: "Microsoft", domain: "microsoft.com", alltag: "Xbox", grund: "Liefert Israels Armee Cloud und KI für den Krieg in Gaza.", gruppe: "ziel" },
      { name: "Google", domain: "google.com", alltag: "Suche, Maps, Cloud", grund: "Liefert mit Amazon Cloud und KI an Israels Armee (Projekt Nimbus).", gruppe: "druck" },
      { name: "Amazon", domain: "amazon.de", alltag: "auch Ring-Kameras", grund: "Liefert mit Google Cloud und KI an Israels Armee (Projekt Nimbus).", gruppe: "druck" },
      { name: "Intel", domain: "intel.de", alltag: "Prozessoren in vielen Laptops", grund: "Größter ausländischer Investor in Israel, das Werk steht auf dem Land eines zerstörten Dorfes.", gruppe: "ziel" },
      { name: "Dell", domain: "dell.com", alltag: "Laptops, Bildschirme", grund: "Liefert Server an Israels Armee.", gruppe: "ziel" },
      { name: "HP", domain: "hp.com", alltag: "Drucker, Laptops", grund: "Liefert Technik an Israels Armee, Polizei und Gefängnisse.", gruppe: "ziel" },
      { name: "Disney+", domain: "disneyplus.com", alltag: "Filme und Serien", grund: "Wirbt laut BDS in Disney- und Marvel-Filmen für Israel.", gruppe: "ziel" },
      { name: "Wix", domain: "wix.com", alltag: "Webseiten-Baukasten", grund: VON_UNTEN, gruppe: "vonUnten" },
    ],
    alternativen: [{ name: "LibreOffice", domain: "libreoffice.org", statt: "Microsoft Office, kostenlos" }],
  },
  {
    id: "reisen",
    titel: "Reisen, Wohnen, Tanken",
    firmen: [
      { name: "Booking.com", domain: "booking.com", alltag: "Hotels", grund: "Vermittelt Unterkünfte in Siedlungen, steht auf der Liste der UN zu Firmen in Siedlungen.", gruppe: "druck" },
      { name: "Airbnb", domain: "airbnb.de", alltag: "Ferienwohnungen", grund: "Vermittelt Unterkünfte in Siedlungen, steht auf der Liste der UN zu Firmen in Siedlungen.", gruppe: "druck" },
      { name: "Expedia", domain: "expedia.de", alltag: "Reisen und Hotels", grund: "Vermittelt Unterkünfte in Siedlungen, steht auf der Liste der UN zu Firmen in Siedlungen.", gruppe: "druck" },
      { name: "RE/MAX", domain: "remax.de", alltag: "Immobilienmakler", grund: "Verkauft Häuser in Siedlungen im Westjordanland.", gruppe: "ziel" },
      { name: "Chevron", domain: "chevron.com", alltag: "Tankstellen Texaco und Caltex", grund: "Fördert das Gas, das Israel im Mittelmeer für sich beansprucht.", gruppe: "ziel" },
    ],
    alternativen: [{ name: "HalalBooking", domain: "halalbooking.com", statt: "Booking.com, Airbnb und Expedia" }],
  },
  {
    id: "haushalt",
    titel: "Haushalt, Gesundheit, Sport, Versicherung",
    firmen: [
      { name: "Siemens", domain: "siemens.com", alltag: "Geräte mit dem Namen Siemens", grund: "Baut das Stromkabel, das Siedlungen mit Europa verbinden soll.", gruppe: "ziel" },
      { name: "Teva", domain: "teva.de", alltag: "Medikamente von ratiopharm", grund: "Israelische Firma, verdient laut BDS seit Jahrzehnten an der Besatzung.", gruppe: "ziel", hinweis: "Setz nie ein Medikament einfach ab. Frag in der Apotheke nach demselben Wirkstoff von einem anderen Hersteller." },
      { name: "Reebok", domain: "reebok.de", alltag: "Sportschuhe", grund: "Sponsert seit 2025 Israels Fußballverband, mit Vereinen aus Siedlungen.", gruppe: "ziel" },
      { name: "AXA", domain: "axa.de", alltag: "Versicherungen", grund: "Hält Anteile an Firmen, die Israel Waffen liefern.", gruppe: "ziel" },
    ],
    alternativen: [
      { name: "Miele", domain: "miele.de", statt: "Siemens-Geräten" },
      { name: "Jako", domain: "jako.de", statt: "Reebok bei Vereinskleidung" },
    ],
  },
];

export const alleFirmen = bereiche.flatMap((b) => b.firmen);

/** BDS nennt zusätzlich Ware, keine Firma: zählt nicht zu den 25. */
export const WARE = {
  name: "Obst, Gemüse und Wein aus Israel",
  alltag: "„Israel“ auf dem Etikett",
  grund: "Laut BDS steckt in Ware aus Israel oft auch Ware aus Siedlungen.",
};

/** Ein roter Schmerz (Elias, 28.10.2026): Marken, bei denen man den Konzern nicht sieht. */
export const VERSTECKT = [
  { name: "ratiopharm", domain: "ratiopharm.de", konzern: "Teva" },
  { name: "Ring", domain: "ring.com", konzern: "Amazon" },
  { name: "Texaco", domain: "texaco.com", konzern: "Chevron" },
] as const;

/** Nicht auf der BDS-Liste, aber im Reel genannt: ehrlich getrennt. */
export const AUCH_GENANNT = {
  name: "Starbucks",
  domain: "starbucks.de",
  satz: "Steht nicht auf der BDS-Liste. In Malaysia und Indonesien boykottieren ihn trotzdem viele: Der Betreiber in Malaysia machte 2025 Rekordverlust, auch wegen des Boykotts.",
};

export const alleAlternativen = bereiche.flatMap((b) => b.alternativen);

/** Die Listen, gegen die jede Alternative geprüft ist; gesichert in docs/freebies/quellen/ (LISTEN-INDEX.md). */
export const listenQuellen: { titel: string; url: string; datei: string }[] = [
  { titel: "BDS-Bewegung, What to boycott", url: "https://bdsmovement.net/get-involved/what-to-boycott", datei: "bds-what-to-boycott-2026-10-28.txt" },
  { titel: "Vereinte Nationen, Firmen in Siedlungen (2025)", url: "https://www.un.org/unispal/wp-content/uploads/2025/09/a-hrc-60-19-aev.pdf", datei: "un-ohchr-siedlungen-datenbank-2026-10-28.txt" },
  { titel: "Who Profits, Firmen-Datenbank", url: "https://www.whoprofits.org/companies/all", datei: "whoprofits-datenbank-2026-10-28.txt" },
  { titel: "AFSC Investigate, alle Firmen", url: "https://investigate.afsc.org/all-companies", datei: "afsc-investigate-2026-10-28.txt" },
  { titel: "Ethical Consumer, Palestine boycott list", url: "https://www.ethicalconsumer.org/ethical-campaigns-boycotts/palestine-boycott-list", datei: "ethical-consumer-palestine-boycott-list-2026-10-28.txt" },
  { titel: "Ethical Consumer, Boykott-Liste", url: "https://www.ethicalconsumer.org/ethicalcampaigns/boycotts", datei: "ethical-consumer-boycotts-list-2026-10-28.txt" },
];

export const boykottQuellen: { titel: string; url: string }[] = [
  { titel: "BDS-Bewegung, What to boycott (Stand 28.10.2026)", url: "https://bdsmovement.net/get-involved/what-to-boycott" },
  { titel: "Al Jazeera, McDonald's kauft alle 225 Filialen in Israel zurück (05.04.2024)", url: "https://www.aljazeera.com/news/2024/4/5/mcdonalds-buys-all-225-of-israeli-franchise-restaurants-after-boycotts" },
  { titel: "ratiopharm ist Teil des Teva-Konzerns", url: "https://www.ratiopharm.de/" },
  { titel: "Coca-Cola Deutschland, Marken", url: "https://www.coca-cola.com/de/de/brands" },
  { titel: "Malay Mail, Rekordverlust von Starbucks Malaysia durch den Boykott (28.08.2025)", url: "https://www.malaymail.com/news/money/2025/08/28/berjaya-food-posts-record-rm292m-loss-as-starbucks-malaysia-hit-by-boycott-impact-downsizing/189163" },
];
