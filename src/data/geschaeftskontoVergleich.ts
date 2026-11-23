// Von Hand gepflegt (VG2, 23.11.2026). Wie bei der Steuersoftware steht hinter diesem Vergleich keine erzeugte Tabelle.
// Kosten und Leistungen: Finanzfluss-Vergleich Geschäftskonto, Stand 11.11.2026 (Quelle je Wert, Abruf 23.11.2026).
// Halal-Merkmale (Zinsen, Dispo, Karte): nur mit wörtlichem Beleg von der Seite des Anbieters, Stand 23.11.2026.
// Was null ist, ist nicht belegt: Der Tarif fällt aus der Anzeige (`anzeige/geschaeftskonto.ts`), nichts wird geschätzt.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { Quelle } from "@/components/vergleich/vergleichTypen";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";
import { geschaeftFinanzPunkte, type Gebuehr, type KostenEingabe } from "./geschaeftskontoKosten";
import { partnerLinks } from "./partnerLinks";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Geschäftskonten im Vergleich. Aufbau wie bei Finanzfluss (/vergleich/geschaeftskonto/), die Auswahl aber nach unserer Regel:
 * Aufgenommen ist nur, wessen Hauptkonto laut Anbieter ohne Guthabenzins ist. Die übrigen Anbieter des Finanzfluss-Vergleichs
 * stehen draußen, bis der Anbieter es belegt (Elias: „Nichts Unbelegtes reinpacken“, Abwesenheit ist kein Beleg).
 *
 * Zinssätze, Aktionszinsen und Renditen von Geldmarktfonds stehen nirgends als Vorteil, Etikett oder Bonus.
 */
export const GESCHAEFT_ZEILEN: VergleichsZeile[] = [
  { key: "__angebot", label: "Angebot", art: "text", gruppe: "angebot" },
  {
    key: "zinsfreiAbStart",
    label: "Ohne Zinsen nutzbar",
    art: "ampel",
    gruppe: "halal",
    imRaster: true,
    hinweis:
      "Grün: Das Konto zahlt keinen Guthabenzins. Zinsen gibt es höchstens auf einem eigenen Konto, bei dem du selbst entscheidest, ob du Geld einzahlst. Gelb: Zinsen laufen, lassen sich aber abschalten. Rot: nicht abschaltbar, dann gibt es keine Note.",
  },
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start", art: "ampel", gruppe: "halal", imRaster: true, hinweis: "Wird nach der Eröffnung kein Dispokredit eingeräumt? Ein Kredit nur auf eigenen Antrag zählt als erfüllt." },
  { key: "karteOhneKredit", label: "Karte ohne Kredit", art: "ampel", gruppe: "halal", hinweis: "Gibt es eine Debitkarte ohne Kreditrahmen? Gibt es nur eine Kreditkarte, ist das Merkmal nicht erfüllt." },
  { key: "kontofuehrung", label: "Kontoführung im Monat", art: "text", gruppe: "kosten", imRaster: true, hinweis: "Der Preis laut Finanzfluss-Vergleich. Gilt er nur mit einer Bedingung, steht sie dabei." },
  { key: "buchungen", label: "Buchungen im Monat", art: "text", gruppe: "kosten", imRaster: true, hinweis: "Wie viele beleglose Buchungen im Monat nichts kosten und was jede weitere kostet." },
  { key: "debitkarte", label: "Debitkarte im Monat", art: "text", gruppe: "kosten", hinweis: "Was die erste Debitkarte im Monat kostet." },
  { key: "abheben", label: "Bargeld abheben", art: "text", gruppe: "kosten" },
  { key: "einzahlen", label: "Bargeld einzahlen", art: "text", gruppe: "kosten" },
  { key: "unterkonten", label: "Unterkonten", art: "text", gruppe: "kosten", hinweis: "Wie viele Unterkonten du ohne Aufpreis anlegen kannst, zum Beispiel für Steuerrücklagen." },
  { key: "buchhaltung", label: "Buchhaltung", art: "text", gruppe: "angebot", hinweis: "Anbindungen an Buchhaltungsprogramme und Steuerberater." },
  { key: "einlagensicherung", label: "Einlagensicherung", art: "text", gruppe: "angebot", hinweis: "Angabe von Finanzfluss: ob die gesetzliche Einlagensicherung greift und in welchem Land sie sitzt. Was bei dir gilt, steht in den Bedingungen des Anbieters." },
  { key: "fuerWen", label: "Für wen", art: "text", gruppe: "angebot" },
  { key: "freiberufler", label: "Für Freiberufler", art: "janein", gruppe: "angebot" },
  { key: "gewerbe", label: "Für Gewerbe", art: "janein", gruppe: "angebot" },
  { key: "kapitalgesellschaft", label: "Für UG und GmbH", art: "janein", gruppe: "angebot" },
];

export const GESCHAEFT_FILTER = [
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start" },
  { key: "freiberufler", label: "Geeignet für Freiberufler", erlaubt: ["true"] },
  { key: "gewerbe", label: "Geeignet für Gewerbe", erlaubt: ["true"] },
  { key: "kapitalgesellschaft", label: "Geeignet für UG und GmbH", erlaubt: ["true"] },
];

/** Der Partnerlink steht erst da, wenn `partnerLinks.ts` den Partner aktiv führt. Vorher bleibt der Knopf aus. */
const partnerLink = (kurzname: string): string | undefined =>
  partnerLinks.some((p) => p.kurzname === kurzname && p.aktiv) ? `/out/${kurzname}` : undefined;

/* ------------------------------------------------------------------ Quellen */

const BELEG = "23.11.2026";
const FINANZFLUSS = "https://www.finanzfluss.de/vergleich/geschaeftskonto/";
const FF_STAND = "11.11.2026";

const beleg = (url: string, anzeige: string, hinweis: string): Quelle => ({ url, stand: BELEG, anzeige, hinweis });

type Halal = { zinsfreiAbStart: Quelle; keinDispoAbStart: Quelle; karteOhneKredit: Quelle };

const TIDE: Halal = {
  zinsfreiAbStart: beleg(
    "https://www.tide.co/de-DE/terms/membership-terms/",
    "Tide Mitgliedschaftsbedingungen 3.5 und Anhang 2",
    "Adyen-Geschäftskontovereinbarung 9.8: „Your Tide Business Account is subject to 0% interest, unless otherwise agreed between you and Tide.“ Mitgliedschaftsbedingungen 3.5: „Jedes Mitglied, das ein Tide Geschäftskonto eröffnet, erhält automatisch ein Tide Tagesgeldkonto („Tide Tagesgeldkonto“).“ Anhang 2, 2.: „Sämtliche Ein- und Auszahlungen müssen über das mit Adyen verknüpfte Tide Geschäftskonto des Mitglieds erfolgen.“ Zins gibt es nur auf Guthaben, das der Kunde selbst auf das Tagesgeldkonto bucht. Wie bei norisbank und 1822direkt zählt das als zinsfrei nutzbar, wenn man dort nichts einzahlt.",
  ),
  keinDispoAbStart: beleg(
    "https://assets.ctfassets.net/3h69mkdgxn20/36BiP6qMbKi2z9c8qcNrB8/763c91240816bdff49253922d963b52e/260716_DE_Preis-_und_Leistungsverzeichnis_DEU.pdf",
    "Tide Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis (Stand 16.07.2026): „Sollzins p.a. für Dispokredit Dispokredite nicht verfügbar“. Adyen-Vereinbarung 9.9: „You acknowledge and agree that it is not permitted to overdraw your Tide Business Account and that unless otherwise determined, it is not possible to have a negative balance on your Tide Business Account.“",
  ),
  karteOhneKredit: beleg(
    "https://www.tide.co/de-DE/business-current-account/",
    "Tide Geschäftskonto",
    "Tide Geschäftskonto-Seite: „Erhalten Sie eine kostenlose Debit Mastercard ohne SCHUFA-Prüfung“. Preisseite https://www.tide.co/de-DE/pricing/: „Physische Debitkarte 1 kostenlose blaue Karte“.",
  ),
};

const VIVID: Halal = {
  zinsfreiAbStart: beleg(
    "https://website-static.vivid.money/static/legal-docs/de-de/terms-and-conditions-vivid-money-sa.pdf",
    "Vivid AGB Ziffer 3.10",
    "AGB Vivid Money S.A. (Stand 12. Juni 2025, v.5), Ziffer 3.10: „Ihr Guthaben auf dem Vivid-Konto berechtigt Sie nicht zu Zinsen. Dies liegt daran, dass die Bestimmungen für elektronisches Geld die Zahlung von Zinsen auf elektronisches Geld verbieten.“ Zinsen gibt es nur auf dem Zinskonto, das man selbst eröffnet: „Sobald du ein Zinskonto eröffnet und deine erste Einzahlung gemacht hast, kann es losgehen mit dem Zinsensammeln.“ (https://vivid.money/de-de/business/interest/).",
  ),
  keinDispoAbStart: beleg(
    "https://help-business.vivid.money/en/articles/9786866-what-is-a-negative-balance-and-why-does-my-business-account-have-one",
    "Vivid Hilfe-Center Geschäftskunden",
    "Hilfe-Center, Artikel vom 26. August 2024: „While Vivid Business does not currently offer an overdraft service, there are instances where your business account may display a negative balance.“",
  ),
  karteOhneKredit: beleg(
    "https://vivid.money/de-de/business/cards/",
    "Vivid Karten-Seite",
    "Karten-Seite: „Bei den Visa-Karten von Vivid handelt es sich um Debitkarten auf Guthabenbasis. Das bedeutet: Es wird nur das Geld verwendet, das auf dem Geschäftskonto verfügbar ist, ohne Kreditrahmen und ohne Verschuldungsrisiko.“",
  ),
};

const N26_AGB = "https://docs.n26.com/legal/01+DE/01+Account/de/03account-terms-and-conditions-de.pdf";
const N26: Halal = {
  zinsfreiAbStart: beleg(N26_AGB, "N26 AGB Ziffer 2.5", "AGB „N26 Girokonto“ (Version 3.1, 19.11.2026), Ziffer 2.5: „Für das Guthaben auf dem Konto erhältst du keine Zinsen.“"),
  keinDispoAbStart: beleg(
    N26_AGB,
    "N26 AGB Ziffer 2.3",
    "AGB „N26 Girokonto“ (Version 3.1, 19.11.2026), Ziffer 2.3: „Das Konto wird als Guthabenkonto geführt. Bitte beachte die Überziehungsmöglichkeit aufgrund zeitlich versetzter Synchronisierungsvorgänge (Ziffer 11). Darüber hinaus kann abhängig von deiner Bonität separat ein Überziehungskreditvertrag mit uns geschlossen werden.“",
  ),
  karteOhneKredit: beleg(
    N26_AGB,
    "N26 AGB Ziffer 7.7",
    "AGB „N26 Girokonto“, Ziffer 7.7: „Eine N26 Business-MasterCard-Debitkarte darf nur von selbständigen natürlichen Personen (bspw. Freelancer und Selbständige) beantragt und genutzt werden.“",
  ),
};

const LEXWARE_FAQ = "https://help.lexware.de/de-form/articles/674427-lexware-geschaftskonto-haufige-fragen-zu-produktberatung-und-konditionen";
const LEXWARE: Halal = {
  zinsfreiAbStart: beleg(
    LEXWARE_FAQ,
    "Lexware Hilfe, Konditionen",
    "Hilfe-Artikel vom 4. September 2026: „Aktuell bieten wir keine Verzinsung auf das Guthaben des Lexware Geschäftskontos an.“ Weiter: „Wenn du dein Guthaben verzinslich anlegen möchtest, empfehlen wir die Nutzung eines separaten Anlage- oder Tagesgeldkontos bei einer Bank deiner Wahl.“",
  ),
  keinDispoAbStart: beleg(LEXWARE_FAQ, "Lexware Hilfe, Konditionen", "Hilfe-Artikel vom 4. September 2026: „Aktuell bieten wir keinen Dispokredit und keine direkte Überziehungsmöglichkeit auf dem Lexware Geschäftskonto an.“"),
  karteOhneKredit: beleg(
    "https://help.lexware.de/de-form/articles/548749-die-preisliste-fur-das-lexware-geschaftskonto",
    "Lexware Preisliste",
    "Preisliste Lexware Geschäftskonto: „Zum Lexware Geschäftskonto gehört eine VISA Business Debitkarte.“",
  ),
};

const SWAN = "https://www.swan.io/de/termsandconditions";
const ACCOUNTABLE: Halal = {
  zinsfreiAbStart: beleg(
    SWAN,
    "Swan Kontonutzungsbedingungen (gültig ab 1. April 2026)",
    "Allgemeine Kontonutzungsbedingungen Swan, gültig ab 1. April 2026: „Die Mittel auf dem Swan-Konto stellen keine rückzahlbaren Publikumseinlagen im Sinne der Bank- und Finanzvorschriften dar. Das Konto ist ein unverzinsliches Konto.“ Accountable: „Wenn Sie sich entscheiden, die Bankdienstleistungen zu nutzen, schließen Sie den Vertrag direkt mit Swan ab.“ (https://www.accountable.de/agb/).",
  ),
  keinDispoAbStart: beleg(
    SWAN,
    "Swan Kontonutzungsbedingungen (gültig ab 1. April 2026)",
    "Swan-Kontonutzungsbedingungen: „In Anbetracht der Tatsache, dass keine Überziehung auf dem Swan-Konto erlaubt ist, wird der Zahlungsauftrag per Überweisung automatisch verweigert, wenn ein unzureichender Saldo auf dem Konto vorhanden ist.“",
  ),
  karteOhneKredit: beleg(
    "https://www.accountable.de/preise/",
    "Accountable Preisseite",
    "Preisseite: „Kostenlose virtuelle Debit Card“ und „Physische Debit Card 7,5€“.",
  ),
};

const GRENKE_PLV = "https://atruvia.scene7.com/is/content/atruvia/grenke_bank_PLV_Geschaeftskonten_bf_20260730pdf";
const GRENKE_DISPO = "https://www.grenkebank.de/firmenkunden/kontokorrentkredit.html";
const GRENKE_KONTO = "https://www.grenkebank.de/firmenkunden/geschaeftskonto.html";
const grenke = (karte: "gut" | "schlecht"): Halal => ({
  zinsfreiAbStart: beleg(
    GRENKE_PLV,
    "Grenke Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis Geschäftskonten (gültig ab 05.10.2025): „Zinsen (pro Jahr) Zinssatz für Guthaben (variabel) 0,0 % 0,0 % 0,0 %“ (Spalten Business, Professional, Premium).",
  ),
  keinDispoAbStart: beleg(
    GRENKE_DISPO,
    "Grenke Kontokorrentkredit",
    "„Auf Antrag räumt Ihnen die grenke Bank einen individuell vereinbarten Verfügungsrahmen ein, der es Ihnen erlaubt, Ihr Geschäftskonto jederzeit bis zur festgesetzten Kreditlinie zu überziehen.“ „Bitte beachten Sie, dass es keinen generellen Anspruch auf einen Kontokorrentkredit für das Geschäftskonto der grenke Bank gibt.“ „Bei Neukunden wird eine aktiv genutzte Kontoverbindung von mindestens 6 Monaten vorausgesetzt.“",
  ),
  karteOhneKredit: beleg(
    GRENKE_KONTO,
    "Grenke Geschäftskonto",
    karte === "schlecht"
      ? "Geschäftskonto-Seite: „Die Kreditlinie und die Mastercard werden unter anderem nach Prüfkriterien, wie der Bonität vergeben. Ein Anspruch darauf ist nicht vorhanden.“ Der Finanzfluss-Vergleich (Stand 11.11.2026) führt bei allen drei Tarifen nur eine Kreditkarte und keine Debitkarte. Deshalb ist das Merkmal nicht erfüllt."
      : "",
  ),
});

const ETHIK_KONTO = "https://www.ethikbank.de/geschaeftskunden/konten/geschaeftskonto";
const ETHIKBANK: Halal = {
  zinsfreiAbStart: beleg(
    ETHIK_KONTO,
    "EthikBank Geschäftskonto",
    "Geschäftskonto-Seite (Stand 08.01.2026): „Guthabenzinsen 0,00 % p.a. 0,00 % p.a.“ Preis- und Leistungsverzeichnis (gültig ab 20.11.2026) 3.3: „Habenszinssatz 0,00% 0,00% 0,00% 0,00% 1,00%“, nur das eigene Zinskonto hat 1,00 %. Das ZinskontoBusiness ist „die passende Ergänzung zu Ihrem Geschäftskonto“ mit eigenem Referenzkonto (https://www.ethikbank.de/geschaeftskunden/businessanlagen/tagesgeld-fuer-firmenkunden).",
  ),
  keinDispoAbStart: beleg(ETHIK_KONTO, "EthikBank Geschäftskonto", "Geschäftskonto-Seite: „Auf Wunsch: Einrichtung eines Kreditrahmens mit dem Betriebsmittelkredit (Zusage und Bonität vorausgesetzt)“."),
  karteOhneKredit: beleg(ETHIK_KONTO, "EthikBank Geschäftskonto", "Geschäftskonto-Seite, Zusatzleistungen: „Ausgabe einer Debitkarte (girocard) 15,00 € p.a.“"),
};

const ING_VEREINBARUNG = "https://www.ing.de/dokumente/business-banking/vereinbarungen-geschaeftskonto/";
const ING: Halal = {
  zinsfreiAbStart: beleg(
    ING_VEREINBARUNG,
    "ING Vereinbarungen zum Geschäftskonto",
    "Vereinbarungen zum Geschäftskonto (Stand 02.09.2026): „Einen Zins auf Guthaben des ING Geschäftskontos gewährt die ING derzeit nicht.“ Preis- und Leistungsverzeichnis (Stand 12.11.2026): „Verzinsung des etwaigen Guthabens: 0,00 %“. Zinsen gibt es nur auf dem Business Extra-Konto: „Schon ein Geschäftskonto bei uns? Dann eröffnen Sie Ihr Business Extra-Konto innerhalb weniger Minuten im Business Banking Home unter „Produkte“.“ (https://www.ing.de/business/geldanlage/extra-konto/).",
  ),
  keinDispoAbStart: beleg(
    "https://www.ing.de/dokumente/business-banking/sonderbedingungen-ueberziehungs-kredit/",
    "ING Sonderbedingungen Überziehungs-Kredit",
    "Vereinbarungen zum Geschäftskonto (Stand 02.09.2026): „Überziehungen des ING Geschäftskontos sind nicht zulässig.“ Die Sonderbedingungen (Stand 16.11.2026) beschreiben einen Kontokorrentkredit nur auf Antrag: „Die Gewährung des Kontokorrentkredits steht unter dem Vorbehalt einer positiven Bonitätsprüfung durch die ING.“ und „Der Kontokorrentkredit ist als unverbindliche, nicht zugesagte Fazilität ausgestaltet.“ Beide Texte stimmen darin überein: Ein Dispo ab Start wird nicht eingeräumt.",
  ),
  karteOhneKredit: beleg("https://www.ing.de/business/geschaeftskonto/konditionen/", "ING Konditionen Geschäftskonto", "Konditionen-Seite: „VISA Business Debitkarte und Zahlungen im Euro-Raum mit der Karte“, in jedem Tarif enthalten."),
};

// DKB: dok.dkb.de war am 23.11.2026 vom Mac nicht erreichbar, gelesen wurde die Archivkopie derselben Datei
// (web.archive.org, Aufnahme 09.11.2026, PLV Stand 1. Oktober 2026). Vor dem Livegang einmal live gegenlesen.
const DKB_PLV = "https://dok.dkb.de/pdf/plv_gk.pdf";
const DKB_KONTO = "https://www.dkb.de/geschaeftskunden/konto-anlage/geschaeftskonto";
const DKB: Halal = {
  zinsfreiAbStart: beleg(
    DKB_PLV,
    "DKB Preis- und Leistungsverzeichnis Geschäftskunden 2.2",
    "Preis- und Leistungsverzeichnis für Geschäftskunden (Stand 1. Oktober 2026), DKB-Business, 2.2 Zinssätze: „Zinssatz für Guthaben (zu Gunsten des Kunden) 0,00 % p. a. auf dem Internet-Konto“. Das verzinste Business-Guthabenkonto ist laut 2.1 optional und „Produkt wird nicht mehr angeboten“; Tagesgeld ist ein eigenes Konto „nur in Verbindung mit aktivem DKB Referenzkonto“.",
  ),
  keinDispoAbStart: beleg(
    DKB_KONTO,
    "DKB Geschäftskonto DKB-Business",
    "Geschäftskonto-Seite: „Wenn Sie im Bereich der Heil- und freien Berufe tätig sind, können Sie auch eine Kreditlinie auf dem Konto erhalten. Den Antrag stellen Sie einfach online.“ Eine Kreditlinie gibt es also nur auf eigenen Antrag.",
  ),
  karteOhneKredit: beleg(
    DKB_KONTO,
    "DKB Geschäftskonto DKB-Business",
    "Geschäftskonto-Seite: „Zum DKB-Business können Sie Visa Geschäftskreditkarten und Girokarten hinzubuchen - direkt mit Kontoeröffnung oder auch danach.“ Preis- und Leistungsverzeichnis 9.1: Girokarte „p. a. 30,00 EUR“. Die Girokarte ist eine Debitkarte ohne Kreditrahmen.",
  ),
};

// Revolut: revolut.com war am 23.11.2026 gesperrt (403), gelesen wurden die Business Terms der Revolut Bank UAB von cdn.revolut.com,
// gültig ab 22.09.2026. Die Bank sitzt in Litauen und führt auch die Konten in Deutschland (Finanzfluss: Einlagensicherung LT).
const REVOLUT_TERMS = "https://cdn.revolut.com/terms_and_conditions/pdf/business_terms_86ed3cf7_1.5.1_1784223474_en.pdf";
const REVOLUT: Halal = {
  zinsfreiAbStart: beleg(
    REVOLUT_TERMS,
    "Revolut Business Terms",
    "Business Terms der Revolut Bank UAB (gültig ab 22. September 2026): „We do not pay interest on the deposits in your current account. You can earn interest by depositing your funds in one of our interest bearing products which we may offer from time to time.“ Zinsen gibt es also nur, wenn man selbst Geld in ein Zinsprodukt legt.",
  ),
  keinDispoAbStart: beleg(
    REVOLUT_TERMS,
    "Revolut Business Terms",
    "Business Terms der Revolut Bank UAB (gültig ab 22. September 2026): „You cannot borrow money on your account (for example, make payments of more than the value of the money in it), although you may be able to benefit from one of our credit products.“",
  ),
  karteOhneKredit: beleg(
    REVOLUT_TERMS,
    "Revolut Business Terms",
    "Business Terms der Revolut Bank UAB: Die Revolut Card greift auf das Kontoguthaben zu, und „You cannot borrow money on your account (for example, make payments of more than the value of the money in it)“. Ein Kreditrahmen an der Karte ist damit ausgeschlossen.",
  ),
};

/* ------------------------------------------------------------------ Tarife */

type Tarif = {
  id: string;
  haus: string;
  name: string;
  produkt: string;
  domain: string;
  partner?: string;
  halal: Halal;
  /** Karte ohne Kredit: gut bei belegter Debitkarte, sonst schlecht. */
  karte: "gut" | "schlecht";
  /** Marke der Debitkarte, nur wenn der Anbieter sie nennt. */
  marke?: string;
  kosten: KostenEingabe;
  /** Rechtsformen laut Finanzfluss, Stand 11.11.2026. */
  fuerWen: string[];
  /** Zeile im Finanzfluss-Vergleich, für die Quelle. */
  zeile: string;
  /** Nur wenn eine Bedingung zum Preis gehört: Text hinter dem Betrag. */
  kontofuehrungZusatz?: string;
  einlagenLand: string;
};

const euro = (x: number) => `${x.toLocaleString("de-DE", { minimumFractionDigits: x % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} €`;
const prozent = (x: number) => `${x.toLocaleString("de-DE")} %`;

const gebuehrText = (g: Gebuehr): string =>
  g === "nicht möglich" ? "Nicht möglich" : g === "Fremdbank" ? "Gebühr der Fremdbank" : "euro" in g ? euro(g.euro) : prozent(g.prozent);

const buchungenText = (k: KostenEingabe): string =>
  k.freieBuchungen === "unbegrenzt"
    ? "Unbegrenzt kostenlos"
    : k.freieBuchungen === 0
      ? `${euro(k.kostenBuchung)} je Buchung`
      : `${k.freieBuchungen} frei, danach ${euro(k.kostenBuchung)}`;

const einlagenText = (k: KostenEingabe, land: string): string =>
  `${k.einlagensicherung === "ja" ? "Ja" : k.einlagensicherung === "teilweise" ? "Teilweise" : "Nein"} (${land})`;

const RECHTSFORMEN_KOMPLETT = ["Freiberufler", "Gewerbe", "UG", "GmbH", "GbR", "OHG", "KG", "AG"];

const buchungFrei = (a: "unbegrenzt" | number, k: number): Pick<KostenEingabe, "freieBuchungen" | "kostenBuchung"> => ({
  freieBuchungen: a,
  kostenBuchung: a === "unbegrenzt" ? 0 : k,
});

const VIVID_ANBINDUNG = ["DATEV", "Lexware Office", "SevDesk", "Sonstige", "eigenes Tool"];
const vividKosten = (kontofuehrung: number, abheben: Gebuehr): KostenEingabe => ({
  kontofuehrung,
  ...buchungFrei("unbegrenzt", 0),
  debitkarte: 0,
  abheben,
  einzahlen: "nicht möglich",
  unterkonten: "unbegrenzt",
  buchhaltung: VIVID_ANBINDUNG,
  einlagensicherung: "teilweise",
});

const N26_ANBINDUNG = ["Lexware Office", "SevDesk", "Papierkram"];
const n26Kosten = (kontofuehrung: number, unterkonten: number): KostenEingabe => ({
  kontofuehrung,
  ...buchungFrei("unbegrenzt", 0),
  debitkarte: 0,
  abheben: { euro: 0 },
  einzahlen: { prozent: 1.5 },
  unterkonten,
  buchhaltung: N26_ANBINDUNG,
  einlagensicherung: "ja",
});

const GRENKE_ANBINDUNG = ["HBCI", "DATEV", "Lexware Office", "SevDesk"];
const ING_ANBINDUNG = ["DATEV", "Lexware Office", "SevDesk", "Sonstige"];
const ingKosten = (kontofuehrung: number, k: number): KostenEingabe => ({
  kontofuehrung,
  freieBuchungen: 0,
  kostenBuchung: k,
  debitkarte: 0,
  abheben: { euro: 0 },
  einzahlen: { euro: 9.5 },
  unterkonten: 5,
  buchhaltung: ING_ANBINDUNG,
  einlagensicherung: "ja",
});
const ING_FUER = ["Freiberufler", "Gewerbe", "GmbH", "OHG", "KG", "UG"];
const BUSINESS_FUER = ["GbR", "OHG", "KG", "UG", "GmbH", "AG"];
const FREELANCE_FUER = ["Freiberufler", "Gewerbe"];

const revolutKosten = (kontofuehrung: number, frei: number): KostenEingabe => ({
  kontofuehrung,
  ...buchungFrei(frei, 0.2),
  debitkarte: 0,
  abheben: { prozent: 2 },
  einzahlen: "nicht möglich",
  unterkonten: "unbegrenzt",
  buchhaltung: ["Sonstige"],
  einlagensicherung: "ja",
});

const TARIFE: Tarif[] = [
  {
    id: "tide-lite", haus: "tide", name: "Tide", produkt: "Lite", domain: "tide.co", partner: "tide", halal: TIDE, karte: "gut", zeile: "Tide Geschäftskonto",
    kosten: { kontofuehrung: 0, ...buchungFrei(5, 0.2), debitkarte: 0, abheben: { euro: 2 }, einzahlen: "nicht möglich", unterkonten: 0, buchhaltung: ["DATEV", "eigenes Tool"], einlagensicherung: "ja" },
    fuerWen: ["Freiberufler", "Gewerbe", "UG", "GmbH"], einlagenLand: "Niederlande",
  },
  {
    id: "tide-smart", haus: "tide", name: "Tide", produkt: "Smart", domain: "tide.co", partner: "tide", halal: TIDE, karte: "gut", zeile: "Tide Smart Plan",
    kosten: { kontofuehrung: 9.99, ...buchungFrei(75, 0.2), debitkarte: 0, abheben: { euro: 2 }, einzahlen: "nicht möglich", unterkonten: 5, buchhaltung: ["DATEV", "eigenes Tool"], einlagensicherung: "ja" },
    fuerWen: ["Freiberufler", "Gewerbe", "UG", "GmbH"], einlagenLand: "Niederlande",
  },
  { id: "vivid-freelance-standard", haus: "vivid", name: "Vivid", produkt: "Freelance Standard", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Freelance Standard", kosten: vividKosten(0, { euro: 0 }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-business-free-start", haus: "vivid", name: "Vivid", produkt: "Business Free Start", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Business Free Start", kosten: vividKosten(0, { euro: 0 }), fuerWen: BUSINESS_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-business-basic", haus: "vivid", name: "Vivid", produkt: "Business Basic", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Business Basic", kosten: vividKosten(8.21, { euro: 0 }), fuerWen: BUSINESS_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-freelance-prime", haus: "vivid", name: "Vivid", produkt: "Freelance Prime", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Freelance Prime", kosten: vividKosten(8.21, { euro: 0 }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-business-pro", haus: "vivid", name: "Vivid", produkt: "Business Pro", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Business Pro", kosten: vividKosten(22.49, { prozent: 0 }), fuerWen: BUSINESS_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-freelance-pro", haus: "vivid", name: "Vivid", produkt: "Freelance Pro", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Freelance Pro", kosten: vividKosten(22.49, { euro: 0 }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-freelance-pro-plus", haus: "vivid", name: "Vivid", produkt: "Freelance Pro+", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Freelance Pro+", kosten: vividKosten(48.79, { euro: 0 }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-business-enterprise", haus: "vivid", name: "Vivid", produkt: "Business Enterprise", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Business Enterprise", kosten: vividKosten(94.01, { prozent: 1 }), fuerWen: BUSINESS_FUER, einlagenLand: "Frankreich" },
  { id: "vivid-business-enterprise-plus", haus: "vivid", name: "Vivid", produkt: "Business Enterprise+", domain: "vivid.money", partner: "vivid-business", halal: VIVID, karte: "gut", marke: "VISA", zeile: "Vivid Business Enterprise+", kosten: vividKosten(296.31, { prozent: 0 }), fuerWen: BUSINESS_FUER, einlagenLand: "Frankreich" },
  { id: "n26-business-standard", haus: "n26", name: "N26", produkt: "Business Standard", domain: "n26.com", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Standard", kosten: n26Kosten(0, 0), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-smart", haus: "n26", name: "N26", produkt: "Business Smart", domain: "n26.com", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Smart", kosten: n26Kosten(4.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-go", haus: "n26", name: "N26", produkt: "Business Go", domain: "n26.com", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Go", kosten: n26Kosten(9.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-metal", haus: "n26", name: "N26", produkt: "Business Metal", domain: "n26.com", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Metal", kosten: n26Kosten(16.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  {
    // Unterkonten: Finanzfluss 4, Lexware selbst „Solo bis 2“ (Recherche 23.11.2026). Bei Widerspruch zählt der niedrigere Wert.
    id: "lexware-solo", haus: "lexware", name: "Lexware", produkt: "Geschäftskonto Solo", domain: "lexware.de", halal: LEXWARE, karte: "gut", marke: "VISA", zeile: "Lexware Solo",
    kosten: { kontofuehrung: 21.18, freieBuchungen: "unbegrenzt", kostenBuchung: 0, debitkarte: 0, abheben: { euro: 0 }, einzahlen: "nicht möglich", unterkonten: 2, buchhaltung: ["DATEV", "Lexware Office", "eigenes Tool"], einlagensicherung: "ja" },
    fuerWen: ["Freiberufler", "Gewerbe", "UG", "GmbH"], kontofuehrungZusatz: "mit Lexware Office", einlagenLand: "Deutschland",
  },
  {
    id: "lexware-plus", haus: "lexware", name: "Lexware", produkt: "Geschäftskonto Plus", domain: "lexware.de", halal: LEXWARE, karte: "gut", marke: "VISA", zeile: "Lexware Plus",
    kosten: { kontofuehrung: 33.08, freieBuchungen: "unbegrenzt", kostenBuchung: 0, debitkarte: 0, abheben: { euro: 0 }, einzahlen: "nicht möglich", unterkonten: 4, buchhaltung: ["DATEV", "Lexware Office", "eigenes Tool"], einlagensicherung: "ja" },
    fuerWen: RECHTSFORMEN_KOMPLETT, kontofuehrungZusatz: "mit Lexware Office", einlagenLand: "Deutschland",
  },
  {
    // Unterkonten: Finanzfluss 1, Accountable selbst „bis zu 10 virtuelle Unterkonten“. Bei Widerspruch zählt der niedrigere Wert.
    // Debitkarte: die virtuelle ist kostenlos, die physische kostet 7,50 € (Preisseite). Gerechnet wird wie bei Finanzfluss mit 0 €.
    id: "accountable-geschaeftskonto", haus: "accountable", name: "Accountable", produkt: "Geschäftskonto", domain: "accountable.de", partner: "accountable", halal: ACCOUNTABLE, karte: "gut", marke: "Mastercard", zeile: "Accountable Geschäftskonto",
    kosten: { kontofuehrung: 0, freieBuchungen: "unbegrenzt", kostenBuchung: 0, debitkarte: 0, abheben: { euro: 1 }, einzahlen: "nicht möglich", unterkonten: 1, buchhaltung: ["Sonstige", "eigenes Tool"], einlagensicherung: "teilweise" },
    fuerWen: ["Freiberufler", "Gewerbe", "GbR"], einlagenLand: "Frankreich",
  },
  {
    id: "grenke-business", haus: "grenke", name: "Grenke", produkt: "Business", domain: "grenkebank.de", halal: grenke("schlecht"), karte: "schlecht", zeile: "Grenke Business",
    kosten: { kontofuehrung: 0, ...buchungFrei(50, 0.1), debitkarte: null, abheben: "nicht möglich", einzahlen: { euro: 0 }, unterkonten: 0, buchhaltung: GRENKE_ANBINDUNG, einlagensicherung: "ja" },
    fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland",
  },
  {
    id: "grenke-business-professional", haus: "grenke", name: "Grenke", produkt: "Business Professional", domain: "grenkebank.de", halal: grenke("schlecht"), karte: "schlecht", zeile: "Grenke Business Professional",
    kosten: { kontofuehrung: 7.9, ...buchungFrei(100, 0.1), debitkarte: null, abheben: "Fremdbank", einzahlen: { euro: 0 }, unterkonten: 0, buchhaltung: GRENKE_ANBINDUNG, einlagensicherung: "ja" },
    fuerWen: RECHTSFORMEN_KOMPLETT, einlagenLand: "Deutschland",
  },
  {
    id: "grenke-business-premium", haus: "grenke", name: "Grenke", produkt: "Business Premium", domain: "grenkebank.de", halal: grenke("schlecht"), karte: "schlecht", zeile: "Grenke Business Premium",
    kosten: { kontofuehrung: 14.9, ...buchungFrei(200, 0.1), debitkarte: null, abheben: "Fremdbank", einzahlen: { euro: 0 }, unterkonten: 0, buchhaltung: GRENKE_ANBINDUNG, einlagensicherung: "ja" },
    fuerWen: ["Freiberufler", "Gewerbe", "UG", "GmbH", "GbR", "OHG"], einlagenLand: "Deutschland",
  },
  {
    id: "ethikbank-geschaeftskonto", haus: "ethikbank", name: "EthikBank", produkt: "Geschäftskonto", domain: "ethikbank.de", halal: ETHIKBANK, karte: "gut", zeile: "EthikBank Geschäftskonto",
    kosten: { kontofuehrung: 10, freieBuchungen: 0, kostenBuchung: 0.16, debitkarte: 1.25, abheben: { euro: 0 }, einzahlen: { euro: 9.5 }, unterkonten: 0, buchhaltung: ["HBCI"], einlagensicherung: "ja" },
    fuerWen: ["Freiberufler", "Gewerbe", "GmbH", "GbR", "OHG", "KG", "AG"], einlagenLand: "Deutschland",
  },
  { id: "ing-geschaeftskonto-s", haus: "ing", name: "ING", produkt: "Geschäftskonto Tarif S", domain: "ing.de", halal: ING, karte: "gut", marke: "VISA", zeile: "ING Geschäftskonto Tarif S", kosten: ingKosten(0, 0.3), fuerWen: ING_FUER, einlagenLand: "Deutschland" },
  { id: "ing-geschaeftskonto-m", haus: "ing", name: "ING", produkt: "Geschäftskonto Tarif M", domain: "ing.de", halal: ING, karte: "gut", marke: "VISA", zeile: "ING Geschäftskonto Tarif M", kosten: ingKosten(4.9, 0.2), fuerWen: ING_FUER, einlagenLand: "Deutschland" },
  { id: "ing-geschaeftskonto-l", haus: "ing", name: "ING", produkt: "Geschäftskonto Tarif L", domain: "ing.de", halal: ING, karte: "gut", marke: "VISA", zeile: "ING Geschäftskonto Tarif L", kosten: ingKosten(14.9, 0.1), fuerWen: ING_FUER, einlagenLand: "Deutschland" },
  { id: "revolut-business-basic", haus: "revolut", name: "Revolut", produkt: "Business Basic", domain: "revolut.com", halal: REVOLUT, karte: "gut", zeile: "Revolut Business Basic", kosten: revolutKosten(10, 10), fuerWen: RECHTSFORMEN_KOMPLETT, einlagenLand: "Litauen" },
  { id: "revolut-business-grow", haus: "revolut", name: "Revolut", produkt: "Business Grow", domain: "revolut.com", halal: REVOLUT, karte: "gut", zeile: "Revolut Business Grow", kosten: revolutKosten(30, 100), fuerWen: RECHTSFORMEN_KOMPLETT, einlagenLand: "Litauen" },
  { id: "revolut-business-scale", haus: "revolut", name: "Revolut", produkt: "Business Scale", domain: "revolut.com", halal: REVOLUT, karte: "gut", zeile: "Revolut Business Scale", kosten: revolutKosten(90, 1000), fuerWen: RECHTSFORMEN_KOMPLETT, einlagenLand: "Litauen" },
  {
    // Für wen: Finanzfluss nennt alle Rechtsformen, das Preisverzeichnis „nur für Freie Berufe, Selbstständige und gewerbliche
    // Immobilienverwalter“. Bei Widerspruch zählt der engere Wert. Debitkarte: Girokarte 30 € im Jahr (PLV 9.1), also 2,50 € im Monat.
    id: "dkb-business", haus: "dkb", name: "DKB", produkt: "Business", domain: "dkb.de", halal: DKB, karte: "gut", zeile: "DKB-Business",
    kosten: { kontofuehrung: 15, freieBuchungen: "unbegrenzt", kostenBuchung: 0, debitkarte: 2.5, abheben: { euro: 0 }, einzahlen: { prozent: 1.5 }, unterkonten: 0, buchhaltung: ["HBCI", "DATEV", "Lexware Office", "SevDesk", "Sonstige"], einlagensicherung: "ja" },
    fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland",
  },
];

const finanzfluss = (t: Tarif, hinweis: string, anzeige?: string): Quelle => ({
  url: FINANZFLUSS,
  stand: FF_STAND,
  hinweis: `Finanzfluss-Vergleich Geschäftskonto (aktualisiert 11.11.2026), Zeile „${t.zeile}“, abgerufen 23.11.2026: ${hinweis}`,
  ...(anzeige ? { anzeige } : {}),
});

const zuAnbieter = (t: Tarif): RohAnbieter => {
  const k = t.kosten;
  const debit = k.debitkarte === null ? "Keine" : t.marke ? `${t.marke}, ${euro(k.debitkarte)}` : euro(k.debitkarte);
  const link = t.partner ? partnerLink(t.partner) : undefined;
  const rechts = (form: string) => t.fuerWen.includes(form);
  const kontofuehrung = `${euro(k.kontofuehrung)}${t.kontofuehrungZusatz ? ` ${t.kontofuehrungZusatz}` : ""}`;
  return {
    id: t.id,
    name: t.name,
    produkt: t.produkt,
    domain: t.domain,
    haus: t.haus,
    ...(link ? { link } : {}),
    finanzfluss: { produkt: t.zeile, partnerlink: null },
    finanzPunkte: geschaeftFinanzPunkte(k, GESCHAEFT_FINANZ_MAX),
    werte: {
      zinsfreiAbStart: "gut",
      keinDispoAbStart: "gut",
      karteOhneKredit: t.karte,
      kontofuehrung,
      buchungen: buchungenText(k),
      debitkarte: debit,
      abheben: gebuehrText(k.abheben),
      einzahlen: gebuehrText(k.einzahlen),
      unterkonten: k.unterkonten === "unbegrenzt" ? "Unbegrenzt" : k.unterkonten === 0 ? "Keine" : String(k.unterkonten),
      buchhaltung: k.buchhaltung.join(", "),
      einlagensicherung: einlagenText(k, t.einlagenLand),
      fuerWen: t.fuerWen.join(", "),
      freiberufler: rechts("Freiberufler"),
      gewerbe: rechts("Gewerbe"),
      kapitalgesellschaft: rechts("UG") || rechts("GmbH"),
    },
    quellen: {
      zinsfreiAbStart: t.halal.zinsfreiAbStart,
      keinDispoAbStart: t.halal.keinDispoAbStart,
      karteOhneKredit: t.halal.karteOhneKredit,
      kontofuehrung: finanzfluss(t, `Kontoführung ${euro(k.kontofuehrung)} im Monat.`, "Finanzfluss-Vergleich Geschäftskonto"),
      buchungen: finanzfluss(t, buchungenText(k)),
      debitkarte: finanzfluss(t, `Debitkarte ${debit}.`),
      abheben: finanzfluss(t, `Bargeld abheben ${gebuehrText(k.abheben)}.`),
      einzahlen: finanzfluss(t, `Bargeld einzahlen ${gebuehrText(k.einzahlen)}.`),
      unterkonten: finanzfluss(t, `Unterkonten ${k.unterkonten}.`),
      buchhaltung: finanzfluss(t, k.buchhaltung.join(", ")),
      einlagensicherung: finanzfluss(t, einlagenText(k, t.einlagenLand)),
      fuerWen: finanzfluss(t, t.fuerWen.join(", ")),
      freiberufler: finanzfluss(t, t.fuerWen.join(", ")),
      gewerbe: finanzfluss(t, t.fuerWen.join(", ")),
      kapitalgesellschaft: finanzfluss(t, t.fuerWen.join(", ")),
    },
  };
};

/** Alphabetisch wie die übrigen Datendateien. Die Reihenfolge der Seite kommt aus der Rangfolge. */
export const geschaeftskontoVergleich: RohAnbieter[] = TARIFE.map(zuAnbieter).sort(
  (a, b) => `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de"),
);

/** Anbieter des Finanzfluss-Vergleichs, die hier fehlen, weil ihr Hauptkonto laut Anbieter nicht belegt ohne Guthabenzins ist. */
export const GESCHAEFT_DRAUSSEN = [
  "FYRST", "Holvi", "bunq", "Targobank", "Commerzbank", "Finom", "Deutsche Bank", "Postbank", "GLS Bank", "HypoVereinsbank",
  "Wise", "Kontist", "Qonto",
] as const;
