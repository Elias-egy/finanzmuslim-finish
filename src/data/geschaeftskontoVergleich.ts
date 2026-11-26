// Von Hand gepflegt (VG2, 23.11.2026). Wie bei der Steuersoftware steht hinter diesem Vergleich keine erzeugte Tabelle.
// Kosten und Leistungen: Finanzfluss-Vergleich Geschäftskonto, Stand 11.11.2026 (Quelle je Wert, Abruf 23.11.2026).
// Halal-Merkmale (Zinsen, Dispo, Karte): nur mit wörtlichem Beleg von der Seite des Anbieters, Stand 23.11.2026.
// Seit VG2-04 (Elias, 23.11.2026) stehen alle 71 Tarife der 23 Anbieter von Finanzfluss drin. Wo der Anbieter nichts Ausdrückliches
// schreibt, steht der Wert auf "unbekannt" (Zelle „Offen“, grau, kein Urteil). Was null ist, ist nicht belegt: Der Tarif fällt aus der
// Anzeige (`anzeige/geschaeftskonto.ts`), nichts wird geschätzt.
// Seit VG3 KT Bank (23.11.2026) steht zusätzlich das KT GeschäftsKonto der KT Bank drin: Finanzfluss führt es nicht, alle Angaben
// (auch die Kosten) stammen von kt-bank.de, Stand 23.11.2026. Kein Partnerprogramm (KT Bank, 26.10.2026), deshalb kein Link.
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { Quelle } from "@/components/vergleich/vergleichTypen";
import { GESCHAEFT_FINANZ_MAX } from "./finanzMax";
import { geschaeftFinanzPunkte, type Gebuehr, type KostenEingabe } from "./geschaeftskontoKosten";
import { mitIslamicKonto } from "./islamicKonto";
import { partnerLinks } from "./partnerLinks";
import type { RohAnbieter } from "./vergleichHelfer";

/**
 * Geschäftskonten im Vergleich. Aufbau wie bei Finanzfluss (/vergleich/geschaeftskonto/), alle 71 Tarife. Die Rangfolge ordnet in drei
 * Stufen (`src/lib/rangfolge.ts`): erst, wessen Hauptkonto laut Anbieter ohne Guthabenzins ist, dann die Häuser, bei denen der Anbieter
 * dazu nichts Ausdrückliches schreibt (offen), ganz hinten, wer laut Anbieter Zinsen auf das Guthaben zahlt (Wise).
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
      "Grün: Das Konto zahlt laut Anbieter keinen Guthabenzins. Zinsen gibt es höchstens auf einem eigenen Konto, bei dem du selbst entscheidest, ob du Geld einzahlst. Offen: Der Anbieter schreibt dazu bisher nichts Ausdrückliches, wir fragen nach. Das ist kein Urteil. Rot: Der Anbieter zahlt Zinsen auf das Guthaben, solche Konten stehen ganz hinten.",
  },
  { key: "keinDispoAbStart", label: "Kein Dispo ab Start", art: "ampel", gruppe: "halal", imRaster: true, hinweis: "Wird nach der Eröffnung kein Dispokredit eingeräumt? Ein Kredit nur auf eigenen Antrag zählt als erfüllt. Offen: Der Anbieter belegt es bisher nicht ausdrücklich." },
  { key: "karteOhneKredit", label: "Karte ohne Kredit", art: "ampel", gruppe: "halal", hinweis: "Gibt es eine Debitkarte ohne Kreditrahmen? Gibt es nur eine Kreditkarte, ist das Merkmal nicht erfüllt. Offen: Der Anbieter belegt es bisher nicht ausdrücklich." },
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
/** Schriftliche Antwort des Anbieters per Mail (Mailrunde VG10, 25.11.2026), Wortlaut unter ~/rebrand/data/vergleiche/belege/<haus>/. */
const MAILRUNDE = "25.11.2026";
const schriftlich = (url: string, anzeige: string, hinweis: string, stand: string = MAILRUNDE): Quelle => ({ url, stand, anzeige, hinweis });

type Halal = { zinsfreiAbStart: Quelle; keinDispoAbStart: Quelle; karteOhneKredit: Quelle };

const TIDE: Halal = {
  zinsfreiAbStart: beleg(
    "https://www.tide.co/de-DE/terms/membership-terms/",
    "Tide Mitgliedschaftsbedingungen 3.5 und Anhang 2",
    "Adyen-Geschäftskontovereinbarung 9.8: „Your Tide Business Account is subject to 0% interest, unless otherwise agreed between you and Tide.“ Mitgliedschaftsbedingungen 3.5: „Jedes Mitglied, das ein Tide Geschäftskonto eröffnet, erhält automatisch ein Tide Tagesgeldkonto („Tide Tagesgeldkonto“).“ Anhang 2, 2.: „Sämtliche Ein- und Auszahlungen müssen über das mit Adyen verknüpfte Tide Geschäftskonto des Mitglieds erfolgen.“ Zins gibt es nur auf Guthaben, das der Kunde selbst auf das Tagesgeldkonto bucht. Schriftlich bestätigt vom Tide Support am 25.11.2026: „Bei der Eröffnung eines Hauptkontos wird automatisch auch ein Tagesgeldkonto eröffnet. In der Regel muss der Kunde lediglich Guthaben auf das Tagesgeldkonto überweisen. Die Zinsen werden einmal im Monat automatisch ausgezahlt“. Wie bei norisbank und 1822direkt zählt das als zinsfrei nutzbar, wenn man dort nichts einzahlt.",
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

/* ------------------------------------------------------------------ Offene Häuser und Wise
 * Elias, 23.11.2026 (VG2-04): „Ich will jeden einzelnen Anbieter ranken. Und wenn dann einer sich rausstellt, der zahlt Zinsen, dann
 * kommt der hinten auf die Liste“ (raw/2026-11-23-elias-vg2-04-alle-anbieter-rein-eine-mailrunde-dach.md im Vault). Drei Stände beim
 * Zins: belegt ohne Zins (oben), offen (`unbekannt`, grau, kein Urteil), belegt mit Zins (`schlecht`, ganz hinten). Dispo und Karte
 * sind `gut`, wo der Anbieter es mit einem Zitat belegt, sonst `unbekannt`. Zitate stehen wortgleich in den Berichten
 * data/recherche/geschaeftskonto-vg2-2026-11-23.md und geschaeftskonto-vg2-tief-2026-11-23/ (Abruf 23.11.2026).
 */
/** Beleg zu einem offenen Wert: steht nur im Datensatz, die Zelle zeigt „Offen“. */
const offen = beleg;

const AGB_NICHT_VERPFLICHTET =
  "„Die Girokonten bei der Bank werden als Kontokorrentkonten im Sinne des § 355 des Handelsgesetzbuches (Konten in laufender Rechnung) geführt; zur Verzinsung der Guthaben ist die Bank nicht verpflichtet.“";

const FYRST: Halal = {
  zinsfreiAbStart: offen(
    "https://www.fyrst.de/dam/fyrst/pdf/fyrst_agbs.pdf",
    "FYRST AGB Abschnitt 7",
    `AGB, Abschnitt 7 Abs. 1: ${AGB_NICHT_VERPFLICHTET} Ein Satz, dass das Konto ohne Guthabenzins läuft, steht dort nicht. Zinsen gibt es laut Anbieter auf dem eigenen Tagesgeldkonto (https://www.fyrst.de/konten/tagesgeldkonto.html).`,
  ),
  keinDispoAbStart: beleg(
    "https://www.fyrst.de/finanzierung/businesskreditlinie.html",
    "FYRST Geschäfts-Kreditlinie",
    "Seite Geschäfts-Kreditlinie: „Die FYRST Geschäfts-Kreditlinie können Sie ganz einfach im Online-Banking beantragen.“ Ein Kredit gibt es also nur auf eigenen Antrag.",
  ),
  karteOhneKredit: beleg(
    "https://www.fyrst.de/konten/geschaeftskonten/fyrstcomplete.html",
    "FYRST Produktseiten",
    "Produktseiten BASE, COMPLETE und Gründerkonto: „Kostenfreie Debit Mastercard“. Eine Debitkarte hat keinen Kreditrahmen.",
  ),
};

const POSTBANK: Halal = {
  zinsfreiAbStart: schriftlich(
    "https://www.postbank.de/dam/postbank/pdf/geschaeftskunden/Postbank-AGB-Starterpaket-GK-FK-921-001-273-0926.pdf",
    "Postbank E-Mail-Team, Mail vom 26.11.2026",
    `Schriftlich bestätigt vom Postbank E-Mail-Team (business@postbank.de) am 26.11.2026: „Guthaben auf Geschäftskonten wird nicht verzinst.“ Dazu AGB Starterpaket (Version 09.26), Nr. 7 Abs. 1: ${AGB_NICHT_VERPFLICHTET} Zinsen gibt es laut Anbieter nur auf dem eigenen Business Tagesgeld.`,
    "26.11.2026",
  ),
  keinDispoAbStart: beleg(
    "https://www.postbank.de/geschaeftskunden/produkte/finanzierung/kredite/business-kreditlinie.html",
    "Postbank Business Kreditlinie",
    "Seite Business Kreditlinie: „Klicken Sie auf „Business Kreditlinie beantragen“ und füllen Sie das Antragsformular aus.“ Ein Kredit gibt es also nur auf eigenen Antrag.",
  ),
  karteOhneKredit: beleg(
    "https://www.postbank.de/geschaeftskunden/produkte/karten-konten/girokonten/business-giro-aktiv-plus.html",
    "Postbank Business Girokonten",
    "Seite Business Girokonten: „Postbank Card Business (Debitkarte) inklusive“. Die Kreditkarte Classic ist eine eigene Zeile mit „Bonität vorausgesetzt“.",
  ),
};

const dbKarte = (zitat: string): Quelle =>
  beleg(
    "https://www.deutsche-bank.de/ms/geschaeftskunden/produktloesungen/geschaeftskonten.html",
    "Deutsche Bank Geschäftskonten",
    `Seite Geschäftskonten: ${zitat}. Eine Debitkarte hat keinen Kreditrahmen.`,
  );
const deutscheBank = (karte: Quelle): Halal => ({
  zinsfreiAbStart: offen(
    "https://www.deutsche-bank.de/content/dam/deutschebank/de/shared/pdf/kontakt-und-service/preis-und-leistungsverzeichnis-der-deutsche-bank-ag.pdf",
    "Deutsche Bank Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis (Stand 1. Oktober 2026), Kontomodelle und AGB nennen keinen Guthabenzins für das Geschäftskonto. Ein Satz, dass es keinen gibt, steht auch nicht dort. Zinsen gibt es laut Anbieter auf dem eigenen Business Tagesgeld.",
  ),
  keinDispoAbStart: beleg(
    "https://www.deutsche-bank.de/gk/produktloesungen/finanzierung/geschaeftskreditlinie.html",
    "Deutsche Bank Geschäftskreditlinie",
    "Seite Geschäftskreditlinie: „Geschäftskreditlinie online beantragen“. Ein Kredit gibt es also nur auf eigenen Antrag.",
  ),
  karteOhneKredit: karte,
});

const COMMERZ_KONTEN = "https://www.commerzbank.de/unternehmerkunden/geschaeftskonten/";
const COMMERZ_KLASSIK = "https://www.commerzbank.de/kp/lp/af/klassikgeschaeftskonto/";
const COMMERZ_OHNE_SEITE = "Für dieses Angebot gibt es keine eigene Seite mit Konditionen. Kein ausdrücklicher Beleg gefunden.";
const COMMERZ_PREMIUM = "https://www.commerzbank.de/kp/lp/af/premiumgeschaeftskonto/";
/** `kartenzitat` und `kartenseite` nur, wo es einen Beleg gibt; GründerAngebot hat keine eigene Seite, dort bleiben Dispo und Karte offen. */
const commerzbank = (seite: string, kartenseite: string, kartenzitat: string | null): Halal => ({
  zinsfreiAbStart: offen(
    COMMERZ_KONTEN,
    "Commerzbank Geschäftskonten",
    "Die Seiten werben mit „3,75% p.a. Guthabenszins“. Gemeint ist ein eigenes Tagesgeldkonto: „Nach der Eröffnung des Geschäftskontos können Sie exklusiv das Tagesgeldkonto mit 3,75% p.a. auf bis zu 5 Mio. Euro eröffnen.“ Ein Satz zum Guthaben auf dem Geschäftskonto selbst steht dort nicht.",
  ),
  keinDispoAbStart: kartenzitat
    ? beleg(seite, "Commerzbank Geschäftskonto", "Landingpage: „Separater Kreditantrag und Bonität erforderlich.“ Ein Kredit gibt es also nur auf eigenen Antrag.")
    : offen(COMMERZ_KONTEN, "Commerzbank Geschäftskonten", COMMERZ_OHNE_SEITE),
  karteOhneKredit: kartenzitat
    ? beleg(kartenseite, "Commerzbank Geschäftskonto", `Seite: ${kartenzitat}. Eine Debitkarte hat keinen Kreditrahmen.`)
    : offen(COMMERZ_KONTEN, "Commerzbank Geschäftskonten", COMMERZ_OHNE_SEITE),
});

const TARGO_PLV = "https://www.targobank.de/de/download/Preisubersicht.pdf";
const TARGOBANK: Halal = {
  zinsfreiAbStart: offen(
    TARGO_PLV,
    "Targobank Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis (Stand 20. November 2026), Teil Geschäftskunden: Unter „Guthaben- und Sollzinsen“ stehen nur Sollzinsen, eine Zeile zum Guthabenzins des Business-Kontos gibt es nicht. Zinsen gibt es laut Anbieter auf dem eigenen Business-Tagesgeld-Konto.",
  ),
  keinDispoAbStart: beleg(
    "https://www.targobank.de/de/geschaeftskunden/konten.html",
    "Targobank Geschäftskonto",
    "Produktseite: „Bitte beachten Sie, dass online nur ein Business-Konto ohne Kontokorrentkredit beantragt werden kann.“ Ein Kredit gibt es also nur auf Antrag und nach Prüfung.",
  ),
  karteOhneKredit: beleg(
    TARGO_PLV,
    "Targobank Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis C 1.1.1: „Ausgabe einer Debitkarte (girocard V PAY/Visa) je Konto“, „Kostenlos“. Eine Debitkarte hat keinen Kreditrahmen.",
  ),
};

const HVB_PROFIL = "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/shared/pdf/Konto-UBK/HVB-BusinessKonto-4You-Produktprofil.pdf";
const HVB: Halal = {
  zinsfreiAbStart: offen(
    "https://www.hypovereinsbank.de/content/dam/hypovereinsbank/footer/Geschaeftsbedingungen/HVB-Aktuelles-Preis-Leistungs-Verzeichnis.pdf",
    "HVB Preis- und Leistungsverzeichnis",
    "Preis- und Leistungsverzeichnis (Stand 1. November 2026): Für das BusinessKonto 4You steht kein Zinssatz für Guthaben. Das Produktprofil sagt nur: „Neben der Abwicklung des betrieblichen Zahlungsverkehrs dient es zugleich der Verwahrung von Einlagen.“",
  ),
  keinDispoAbStart: offen(HVB_PROFIL, "HVB Produktprofil BusinessKonto 4You", "Ein Kontokorrentkredit läuft über einen eigenen Kreditvertrag. Dass er nur auf Antrag kommt, steht nicht ausdrücklich dort."),
  karteOhneKredit: beleg(
    HVB_PROFIL,
    "HVB Produktprofil BusinessKonto 4You",
    "Produktprofil: „Ausgabe einer Debitkarte UniCredit Card Business pro Monat 1,00 EUR (kostenfrei bis 31. Dezember 2027, danach Belastung einmal jährlich: 12 EUR)“. Eine Debitkarte hat keinen Kreditrahmen.",
  ),
};

const GLS: Halal = {
  zinsfreiAbStart: offen(
    "https://www.gls.de/media/PDF/uncached/134020_PAH_11.26_20261103.pdf",
    "GLS Preisaushang",
    "Preisaushang (gültig ab 1. November 2026): „Zinssatz für Guthaben (Sichteinlagen) pro Jahr 0,00 %“, aber unter der Überschrift Privatkonten. Für das GLS Konto Geschäft steht im Preis- und Leistungsverzeichnis nur ein Einlagenentgelt von 0,00 %.",
  ),
  keinDispoAbStart: beleg(
    "https://www.gls.de/konten-karten/konten/firmenkonto/",
    "GLS Firmenkonto",
    "Konto-Seite: „Das GLS Konto Geschäft bietet Dir darüber hinaus zusätzliche Funktionen wie Einrichtung einer Kontokorrentlinie“. Ein Kredit ist also eine eigene Einrichtung und kommt nicht von selbst.",
  ),
  karteOhneKredit: beleg(
    "https://www.gls.de/konten-karten/konten/geschaeftskonto/",
    "GLS Geschäftskonto",
    "Preis- und Leistungsverzeichnis 3.2.1: „girocard Debit Mastercard (GLS BankCard)“. Eine Debitkarte hat keinen Kreditrahmen.",
  ),
};

const HOLVI: Halal = {
  zinsfreiAbStart: schriftlich(
    "https://www.holvi.com/de/verdiene-rendite/",
    "Holvi Support, Mail vom 26.11.2026",
    "Schriftlich bestätigt vom Holvi Support am 26.11.2026 (Anfrage #1263808): „Holvi bietet keine Verzinsung an, da es sich hier um ein Geshäftskonto und kein Privatkonto handelt.“ Zinsen nennt Holvi nur für einen eigenen Geldmarktfonds, den der Kunde selbst wählt: „Aktuell steht das Angebot ausschließlich für Unternehmen mit der Rechtsform GmbH oder UG zur Verfügung.“",
    "26.11.2026",
  ),
  keinDispoAbStart: schriftlich(
    "https://www.holvi.com/de/geschaeftskonto/",
    "Holvi Support, Mail vom 26.11.2026, und Holvi Geschäftskonto",
    "Schriftlich bestätigt vom Holvi Support am 26.11.2026: „Eine Möglichkeit der Überziehung des Kontos ist nicht möglich.“ Geschäftskonto-Seite: „Holvi bietet keinen Dispokredit. Es kann nur ausgegeben werden, was auf dem Konto vorhanden ist.“",
    "26.11.2026",
  ),
  karteOhneKredit: beleg(
    "https://support.holvi.com/hc/de/articles/40582795829778-Holvi-Fee-Schedule-for-Germany",
    "Holvi Fee Schedule",
    "Fee Schedule for Germany (Version 1.13, 9. November 2026): „Holvi Business Debit Mastercard“. Eine Kreditkarte gibt es nur auf Antrag.",
  ),
};

const BUNQ_AGB = "https://www.bunq.com/en-us/documents/business-account-terms-conditions";
const BUNQ: Halal = {
  zinsfreiAbStart: schriftlich(
    BUNQ_AGB,
    "bunq Support, Mail vom 25.11.2026",
    "Schriftlich bestätigt vom bunq Support am 25.11.2026: „Nein, Guthaben auf dem regulären Bankkonto wird nicht automatisch verzinst. Zinsen gibt es ausschließlich auf einem separaten Sparkonto (Savings Account), das der Kunde selbst eröffnen muss.“ Dazu Business-AGB, Ziffer 17: „With MassInterest , you can earn interest by opening one or more dedicated savings accounts in the bunq app.“ Wer kein Sparkonto eröffnet, bekommt keinen Zins.",
  ),
  keinDispoAbStart: schriftlich(
    BUNQ_AGB,
    "bunq Support, Mail vom 25.11.2026, und Business AGB Ziffer 26",
    "Schriftlich bestätigt vom bunq Support am 25.11.2026: „bunq bietet weder Dispositionskredite noch Überziehungen noch persönliche Darlehen an.“ Business-AGB, Ziffer 26: „We usually don't offer an arranged overdraft, so negative balances are generally not allowed.“",
  ),
  karteOhneKredit: beleg(
    BUNQ_AGB,
    "bunq Business AGB",
    "Business-AGB, Kartenabschnitt: „To keep your card secure, we don't offer overdrafts or credit.“ In der Entgeltinformation steht „Ausgabe einer Debitkarte“.",
  ),
};

const QONTO_VERTRAG = "https://qonto.pactsafe.io/versions/6afd624d0caaf0ecff4178f4.pdf";
const QONTO: Halal = {
  zinsfreiAbStart: offen(
    QONTO_VERTRAG,
    "Qonto Rahmenvertrag Ziffer 2.5b",
    "Rahmenvertrag (wirksam ab 18. November 2026), Ziffer 2.5b: „Ein positiver Saldo auf einem Girokonto des Kunden kann, wenn eine bestimmte Höhe überschritten wird, dazu führen, dass Qonto zusätzliche Kosten für die Kontoführung entstehen.“ Ein Satz, dass das Konto ohne Guthabenzins läuft, steht nicht dort.",
  ),
  keinDispoAbStart: beleg(
    "https://qonto.com/de/financing/overdraft",
    "Qonto Kontokorrentkredit",
    "Seite Kontokorrentkredit: „Nach erfolgreichem Antrag ist Ihr Kontokorrentkredit direkt in Ihrem Konto verfügbar.“ Ein Kredit gibt es also nur auf eigenen Antrag.",
  ),
  karteOhneKredit: offen(QONTO_VERTRAG, "Qonto Rahmenvertrag", "Die Karten sind Mastercard-Karten am Konto. Das Wort Debit steht dort nicht, ein Kreditrahmen auch nicht. Kein ausdrücklicher Beleg."),
};

const KONTIST: Halal = {
  zinsfreiAbStart: offen(
    "https://www.solarisgroup.com/customer-information/germany/de-iban/german/preis-und-leistungsverzeichnis",
    "Kontist und Solaris Preis- und Leistungsverzeichnis",
    "Kontist und die Partnerbank Solaris nennen keinen Guthabenzins und auch keinen Satz, dass keiner gezahlt wird. Das Preis- und Leistungsverzeichnis der Solaris SE (Version 3.3) nennt ein Entgelt: „ein Verwahrentgelt i.H.v 0,5% p.a. auf die den Allgemeinen Freibetrag übersteigenden Einlagen“ (bei Geschäftskunden ab 100.000 €).",
  ),
  keinDispoAbStart: offen(
    "https://intercom.help/kontist/de/articles/11163669-zinsen-nachweise-und-eigenstandige-kundigung-deines-dispokredits",
    "Kontist Hilfe-Center",
    "Das Hilfe-Center (Stand 1. Juli 2026) sagt, dass es derzeit keine Möglichkeit gibt, einen Dispokredit zu beantragen. Auf der Preisseite steht kein Dispo. Kein ausdrücklicher Beleg.",
  ),
  karteOhneKredit: beleg("https://kontist.com/pricing/", "Kontist Preisseite", "Preisseite: Free „Physische Visa Debitkarte“, Start und Plus „Physische & Virtuelle Visa Debitkarten“."),
};

const finom = (dispoSolo: boolean): Halal => ({
  zinsfreiAbStart: schriftlich(
    "https://help.finom.co/de/articles/13653128-was-ist-das-zinskonto-interest-wallet-und-wie-funktioniert-es",
    "Finom Support, Mail vom 25.11.2026",
    "Schriftlich bestätigt vom Finom Support (KI-Assistent Fin) am 25.11.2026: „Nein. Auf dem normalen Geschäftskonto werden keine Zinsen gewährt; Zinsen entstehen nur, wenn Sie Geld aktiv in das Interest Wallet übertragen.“ Hilfe-Center: „Um ein Interest Wallet zu eröffnen, müssen Sie der Kontoinhaber sein.“ Gilt für Solo, Basic und Smart; für den Tarif Core nennt das Hilfe-Center einen Zins auf dem Kontoguthaben, er steht nicht in diesem Vergleich.",
  ),
  keinDispoAbStart: beleg(
    "https://help.finom.co/de/articles/17463404-wie-aktiviere-ich-den-dispokredit",
    "Finom Hilfe, Dispokredit",
    dispoSolo
      ? "Hilfe-Center: Der Dispokredit setzt voraus, „Bestehender Finom-Kunde mit einem kostenpflichtigen Tarif sein (Basic und höher)“. Im Tarif Solo gibt es ihn damit nicht."
      : "Hilfe-Center: „Wir schalten den Dispokredit nie ohne Ihre Bestätigung frei.“ Schriftlich bestätigt vom Finom Support am 25.11.2026: „Der Dispokredit wird nicht automatisch eingerichtet; er erscheint in der App als Angebot und muss vom Kontoinhaber aktiviert werden.“",
  ),
  karteOhneKredit: beleg(
    "https://help.finom.co/de/articles/4815568-kann-ich-eine-kreditkarte-bekommen",
    "Finom Hilfe, Karten",
    "Hilfe-Center: „Mit Finom können Sie außerdem sowohl physische als auch virtuelle Visa Debitkarten bestellen“. Die Kreditkarte ist optional.",
  ),
});

const WISE_AGB = "https://wise.com/eu/legal/terms-of-use-business";
const WISE: Halal = {
  zinsfreiAbStart: beleg(
    "https://wise.com/help/articles/b8sVSdAzytqVamfajSirb/how-does-balance-cashback-work",
    "Wise Hilfe, Cashback auf Guthaben",
    "Hilfe-Artikel: „As interest rates rise, we believe it’s right to share the interest from the money you hold with us. Cashback is available to all customers in the European Economic Area (EEA).“ und „Wise pays cashback each month based on the EUR, GBP and USD you hold in your Wise account.“ Die Business Customer Agreement (7. August 2026, 12.1 c) sagt dagegen: „The funds held on your Wise Business Account will not earn any interest.“ Ob sich das Cashback abschalten lässt, ist offen.",
  ),
  keinDispoAbStart: beleg(WISE_AGB, "Wise Business Customer Agreement 14.7", "Business Customer Agreement (7. August 2026), 14.7: „You promise to always have a zero or positive balance in your Wise Business Account“. Ein Dispo wird nicht angeboten."),
  karteOhneKredit: beleg(
    WISE_AGB,
    "Wise Business Customer Agreement 17.1",
    "Business Customer Agreement (7. August 2026), 17.1: „The Wise Business Card is a Debit/ Prepaid card that can be used to access and spend the funds in your Wise Business Account“.",
  ),
};

/* ------------------------------------------------------------------ KT Bank (VG3, 23.11.2026) */

const KT = "https://www.kt-bank.de";
const KT_PRODUKT = `${KT}/firmenkunden/konten/geschaeftskonto/`;
const KT_ANTRAG = `${KT}/dokumente/antrag-geschaeftskonto/`;
const KT_PLV = `${KT}/dokumente/preis-und-leistungsverzeichnis/`;
const KT_MC = `${KT}/firmenkunden/konten/mastercard-business/`;

const KT_BANK: Halal = {
  zinsfreiAbStart: beleg(
    KT_ANTRAG,
    "KT Bank Antrag Geschäftskonto Nr. 5",
    "Antrag Geschäftskonto (Fußzeile „Antrag-GiroKonto - GK - 01.05.2023“), Nr. 5: „Die Kontoführung erfolgt unverzinslich.“ Das Formular ist von 2023, Produktseite und aktuelles Preis- und Leistungsverzeichnis nennen den Zins für das Geschäftskonto nicht. Beim separaten BeteiligungsKonto Business (https://www.kt-bank.de/firmenkunden/sparen/beteiligungskonto/) steht: „Aufgrund der Islamkonformität können wir keine festgelegten Renditen für die Einlagen zusagen.“ Das ist ein eigenes Konto, das nur nutzt, wer es selbst eröffnet.",
  ),
  keinDispoAbStart: beleg(
    KT_ANTRAG,
    "KT Bank Antrag Geschäftskonto Nr. 8",
    "Antrag Geschäftskonto, Nr. 8: „Der Kontoinhaber ist/Die Kontoinhaber sind verpflichtet, das Konto ausschließlich im Guthaben zu führen.“ „Ein Dispositionskredit wird nicht eingeräumt.“ Weiter: „Barverfügungen und Überweisungen sind nur im Rahmen des jeweiligen Kontoguthabens zulässig.“ Gleiche Fassung (01.05.2023) wie beim Zins.",
  ),
  karteOhneKredit: beleg(
    KT_MC,
    "KT Bank Mastercard Business",
    "Offen, weil die Quellen sich widersprechen. Mastercard-Business-Seite: „KT Mastercard Business ist Geschäftskonto-Girokarte und international einsetzbare Debitkarte in einem.“ Produktseite: „Tägliche Abrechnung vom Guthaben auf Ihrem KT GiroKonto“. Dagegen ist das PDF „Bedingungen für die Debit Mastercard“ (https://www.kt-bank.de/dokumente/bedingungen-fuer-die-debit-mastercard/) mit „Bedingungen für die MasterCard (Kreditkarte)“ überschrieben und nennt „Die MasterCard ist eine Kreditkarte.“ und eine „geduldete Kontoüberziehung“ bei Kartenumsätzen über dem Guthaben. Wir fragen bei der KT Bank nach.",
  ),
};

const ktBeleg = (url: string, anzeige: string, hinweis: string): Quelle => ({ url, stand: BELEG, anzeige, hinweis });

const KT_QUELLEN: Record<string, Quelle> = {
  kontofuehrung: ktBeleg(KT_PRODUKT, "KT Bank Produktseite GeschäftsKonto", "Produktseite KT GeschäftsKonto: „Keine Kontoführungsgebühren.“"),
  buchungen: ktBeleg(
    KT_PRODUKT,
    "KT Bank Produktseite GeschäftsKonto",
    "Produktseite: „Beleglose Buchungen, kostenfrei und ohne Obergrenze.“ Preis- und Leistungsverzeichnis (gültig ab 23.06.2026), Teil B 2: „Beleglose Überweisung kostenfrei“, „Per Dauerauftrag kostenfrei“. Eine beleghafte Überweisung kostet 5,00 €.",
  ),
  debitkarte: ktBeleg(
    KT_PLV,
    "KT Bank Preis- und Leistungsverzeichnis, Teil B 5.1",
    "Preis- und Leistungsverzeichnis (gültig ab 23.06.2026), Teil B 5.1: „KT Bank Debit Mastercard Business Jahresentgelt für Haupt- bzw. Zusatzkarte 50,00“. Die Produktseite nennt zusätzlich „Maestro“, dessen Preis das Verzeichnis nicht aufführt.",
  ),
  abheben: ktBeleg(
    KT_PLV,
    "KT Bank Preis- und Leistungsverzeichnis, Teil B 1 b",
    "Die Angaben widersprechen sich. Preis- und Leistungsverzeichnis, Teil B 1 b: „mit KT Bank Debit Mastercard Business (Debitkarte) im In- und Ausland - eine Bargeldauszahlung pro Kalendermonat in Euro kostenfrei, entfällt pro Auszahlung 3,00“. Mastercard-Business-Seite (https://www.kt-bank.de/firmenkunden/konten/mastercard-business/): „Weltweit Bargeld abheben (dreimal im Monat gebührenfrei)*“. Deshalb steht hier kein Wert, bis die Bank es klärt.",
  ),
  einzahlen: ktBeleg(KT_PLV, "KT Bank Preis- und Leistungsverzeichnis, Teil B 1", "Preis- und Leistungsverzeichnis, Teil B 1 a: „Bargeldeinzahlungen derzeit nicht möglich“. Teil B 1 c: „auf das eigene Konto bei der KT Bank derzeit nicht verfügbar“."),
  unterkonten: ktBeleg(KT_PRODUKT, "KT Bank Produktseite GeschäftsKonto", "Die Produktseite nennt keine Unterkonten, deshalb steht hier kein Wert. Sie nennt Fremdwährungskonten: „Zusätzlich zu Ihrem KT GeschäftsKonto in Euro bieten wir Ihnen auch die Möglichkeit, Ihr Konto in folgenden Währungen zu führen“."),
  buchhaltung: ktBeleg(KT_PRODUKT, "KT Bank Produktseite GeschäftsKonto", "Die Produktseite führt keine DATEV-, HBCI- oder Buchhaltungsanbindung auf. Das Preis- und Leistungsverzeichnis nennt EBICS für Geschäftskunden und „Elektronischer Kontoauszug MT 940 (EBICS) kostenfrei“."),
  einlagensicherung: ktBeleg(
    `${KT}/dokumente/informationsbogen-fuer-den-einleger/`,
    "KT Bank Informationsbogen für den Einleger",
    "Informationsbogen: „Einlagen bei der KT Bank AG sind geschützt durch: Entschädigungseinrichtung deutscher Banken GmbH“, „Sicherungsobergrenze 100.000 Euro pro Einleger pro Kreditinstitut“. Ein Beleg für den freiwilligen Einlagensicherungsfonds liegt nicht vor.",
  ),
  fuerWen: ktBeleg(
    KT_PRODUKT,
    "KT Bank Produktseite GeschäftsKonto",
    "Produktseite: „Mit dem KT GeschäftsKonto bieten wir eine Lösung zur Abwicklung Ihrer täglichen Bankgeschäfte.“ Antrag: „Das Konto wird ausschließlich für geschäftliche Zwecke genutzt und in laufender Rechnung geführt.“ Welche Rechtsformen (Freiberufler, GbR, UG, GmbH) das Konto eröffnen können, nennt die Bank nicht. Eröffnung: „Für die Eröffnung Ihres KT GeschäftsKontos stehen wir Ihnen persönlich in unseren Filialen gerne zur Verfügung.“",
  ),
};
for (const k of ["freiberufler", "gewerbe", "kapitalgesellschaft"]) KT_QUELLEN[k] = KT_QUELLEN.fuerWen;

/* ------------------------------------------------------------------ Tarife */

type Stand = "gut" | "unbekannt" | "schlecht";

type Tarif = {
  id: string;
  haus: string;
  name: string;
  produkt: string;
  domain: string;
  partner?: string;
  halal: Halal;
  /** Zins ab Start: gut belegt ohne Zins (Standard), unbekannt offen, schlecht belegt mit Zins. */
  zins?: Stand;
  /** Dispo ab Start: gut, wo der Anbieter „nicht verfügbar“ oder „nur auf Antrag“ belegt (Standard), sonst unbekannt. */
  dispo?: Stand;
  /** Karte ohne Kredit: gut bei belegter Debitkarte, schlecht bei nur einer Kreditkarte, sonst unbekannt. */
  karte: Stand;
  /** Marke der Debitkarte, nur wenn der Anbieter sie nennt. */
  marke?: string;
  kosten: KostenEingabe;
  /** Rechtsformen laut Finanzfluss, Stand 11.11.2026. */
  fuerWen: string[];
  /** Zeile im Finanzfluss-Vergleich, für die Quelle. */
  zeile: string;
  /** Nur wenn eine Bedingung zum Preis gehört: Text hinter dem Betrag. */
  kontofuehrungZusatz?: string;
  /** Eigener Text für die Zeile Buchungen, wenn Finanzfluss „im Jahr“ nennt. */
  buchungenText?: string;
  einlagenLand: string;
  /** VG3 KT Bank: Der Tarif steht nicht im Finanzfluss-Vergleich, es gibt keine Finanzfluss-Zeile. */
  ohneFinanzfluss?: boolean;
  /** VG3 KT Bank: Quellen, die für die Werte dieses Tarifs gelten, statt der Finanzfluss-Quelle (Schlüssel wie in `GESCHAEFT_ZEILEN`). */
  eigeneQuellen?: Record<string, Quelle>;
  /** Eigener Text statt der berechneten Zelle (nur wo der Anbieter einen Wert anders angibt, als die Rechnung ihn zeigt). */
  texte?: Partial<Record<"debitkarte" | "abheben" | "unterkonten" | "einlagensicherung", string>>;
  /** Der Anbieter nennt die Rechtsformen nicht: Die drei Ja/Nein-Zeilen stehen auf „unbekannt“, nichts wird geraten. */
  rechtsformenOffen?: boolean;
};

const euro = (x: number) => `${x.toLocaleString("de-DE", { minimumFractionDigits: x % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })} €`;
const prozent = (x: number) => `${x.toLocaleString("de-DE")} %`;

const gebuehrText = (g: Gebuehr): string =>
  g === "nicht möglich"
    ? "Nicht möglich"
    : g === "Fremdbank"
      ? "Gebühr der Fremdbank"
      : g === "keine Angabe"
        ? "Nicht angegeben"
        : "euro" in g
          ? euro(g.euro)
          : prozent(g.prozent);

const buchungenText = (k: KostenEingabe): string =>
  k.freieBuchungen === null || k.kostenBuchung === null
    ? "Nicht angegeben"
    : k.freieBuchungen === "unbegrenzt"
      ? "Unbegrenzt kostenlos"
      : k.freieBuchungen === 0
        ? `${euro(k.kostenBuchung)} je Buchung`
        : `${k.freieBuchungen} frei, danach ${euro(k.kostenBuchung)}`;

const einlagenText = (k: KostenEingabe, land: string): string =>
  k.einlagensicherung === "nein" ? "Nein" : `${k.einlagensicherung === "ja" ? "Ja" : "Teilweise"} (${land})`;

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

/* Hilfen für die Zeilen der übrigen Anbieter: Werte aus Finanzfluss Teil A (data/recherche/geschaeftskonto-vg2-2026-11-23.md). */
const e = (x: number): Gebuehr => ({ euro: x });
const p = (x: number): Gebuehr => ({ prozent: x });
const ke = (o: {
  f: number;
  frei: number | "unbegrenzt" | null;
  kb: number | null;
  debit: number | null;
  ab: Gebuehr;
  ein: Gebuehr;
  unter: number | "unbegrenzt";
  buch: string[];
  sich: KostenEingabe["einlagensicherung"];
}): KostenEingabe => ({
  kontofuehrung: o.f,
  freieBuchungen: o.frei,
  kostenBuchung: o.kb,
  debitkarte: o.debit,
  abheben: o.ab,
  einzahlen: o.ein,
  unterkonten: o.unter,
  buchhaltung: o.buch,
  einlagensicherung: o.sich,
});
const FF_ALLE = RECHTSFORMEN_KOMPLETT;
const FF_SIEBEN = ["Freiberufler", "Gewerbe", "UG", "GmbH", "GbR", "OHG", "KG"];
const BUNQ_FUER = ["Freiberufler", "Gewerbe", "GbR", "UG", "GmbH"];
const HBCI5 = ["HBCI", "DATEV", "Lexware Office", "SevDesk", "Sonstige"];
const HBCI6 = [...HBCI5, "eigenes Tool"];
const DATEV_ALLE = ["DATEV", "Lexware Office", "SevDesk", "Sonstige", "eigenes Tool"];

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
  { id: "n26-business-standard", haus: "n26", name: "N26", produkt: "Business Standard", domain: "n26.com", partner: "n26-business", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Standard", kosten: n26Kosten(0, 0), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-smart", haus: "n26", name: "N26", produkt: "Business Smart", domain: "n26.com", partner: "n26-business", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Smart", kosten: n26Kosten(4.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-go", haus: "n26", name: "N26", produkt: "Business Go", domain: "n26.com", partner: "n26-business", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Go", kosten: n26Kosten(9.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
  { id: "n26-business-metal", haus: "n26", name: "N26", produkt: "Business Metal", domain: "n26.com", partner: "n26-business", halal: N26, karte: "gut", marke: "Mastercard", zeile: "N26 Business Metal", kosten: n26Kosten(16.9, 10), fuerWen: FREELANCE_FUER, einlagenLand: "Deutschland" },
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
  // VG3 KT Bank (23.11.2026): kein Finanzfluss-Tarif, Werte von kt-bank.de. Zins und Dispo wörtlich im Antrag (Fassung 2023), die Karte ist
  // offen (die Bedingungen widersprechen sich), Bargeld abheben ebenso (Produktseite dreimal, Verzeichnis einmal im Monat frei), Unterkonten
  // und Rechtsformen nennt die Bank nicht. Debit Mastercard Business: 50 € im Jahr. Kein Partnerprogramm, kein Link.
  {
    id: "kt-bank-geschaeftskonto", haus: "kt-bank", name: "KT Bank", produkt: "GeschäftsKonto", domain: "kt-bank.de", halal: KT_BANK, karte: "unbekannt", marke: "Mastercard", zeile: "KT GeschäftsKonto",
    kosten: { kontofuehrung: 0, ...buchungFrei("unbegrenzt", 0), debitkarte: 50 / 12, abheben: "keine Angabe", einzahlen: "nicht möglich", unterkonten: null, buchhaltung: [], einlagensicherung: "ja" },
    texte: { debitkarte: "Mastercard, 50 € im Jahr", abheben: "Nicht eindeutig angegeben", unterkonten: "Nicht angegeben" },
    fuerWen: ["Firmenkunden, Rechtsform nicht angegeben"], rechtsformenOffen: true, einlagenLand: "Deutschland",
    ohneFinanzfluss: true, eigeneQuellen: KT_QUELLEN,
  },
  /* ---------------------------------------------------------------- Offene Häuser (Zins ohne ausdrücklichen Satz) und Wise */
  { id: "fyrst-base", haus: "fyrst", name: "FYRST", produkt: "BASE", domain: "fyrst.de", halal: FYRST, zins: "unbekannt", karte: "gut", marke: "Mastercard", zeile: "FYRST BASE", kosten: ke({ f: 0, frei: 50, kb: 0.19, debit: 0, ab: e(0), ein: e(3), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "fyrst-complete", haus: "fyrst", name: "FYRST", produkt: "Complete (Gründerkonto)", domain: "fyrst.de", halal: FYRST, zins: "unbekannt", karte: "gut", marke: "Mastercard", zeile: "Fyrst Complete (Gründerkonto)", kosten: ke({ f: 10, frei: 75, kb: 0.08, debit: 0, ab: e(0), ein: e(2.5), unter: 1, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "fyrst-premium", haus: "fyrst", name: "FYRST", produkt: "Premium", domain: "fyrst.de", halal: FYRST, zins: "unbekannt", karte: "gut", marke: "Mastercard", zeile: "Fyrst Premium", kosten: ke({ f: 24, frei: 0, kb: 0.04, debit: 0, ab: e(0), ein: e(2.5), unter: 5, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },

  { id: "postbank-business-giro", haus: "postbank", name: "Postbank", produkt: "Business Giro", domain: "postbank.de", halal: POSTBANK, karte: "gut", zeile: "Postbank Business Giro", kosten: ke({ f: 12.9, frei: 0, kb: 0.28, debit: 2, ab: e(0), ein: e(3), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "postbank-business-giro-aktiv", haus: "postbank", name: "Postbank", produkt: "Business Giro aktiv", domain: "postbank.de", halal: POSTBANK, karte: "gut", zeile: "Postbank Business Giro aktiv", kosten: ke({ f: 16.9, frei: 0, kb: 0.22, debit: 2, ab: e(0), ein: e(3), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "postbank-gruenderkonto", haus: "postbank", name: "Postbank", produkt: "Gründerkonto", domain: "postbank.de", halal: POSTBANK, karte: "gut", zeile: "Postbank Gründerkonto", kosten: ke({ f: 16.9, frei: 0, kb: 0.22, debit: 2, ab: e(0), ein: e(3), unter: 0, buch: HBCI5, sich: "ja" }), kontofuehrungZusatz: "(im ersten Jahr 0 €)", fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "postbank-business-giro-aktiv-plus", haus: "postbank", name: "Postbank", produkt: "Business Giro aktiv plus", domain: "postbank.de", halal: POSTBANK, karte: "gut", zeile: "Postbank Business Giro aktiv plus", kosten: ke({ f: 24.9, frei: 0, kb: 0.12, debit: 2, ab: e(0), ein: e(3), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },

  { id: "deutsche-bank-business-basickonto", haus: "deutsche-bank", name: "Deutsche Bank", produkt: "Business BasicKonto", domain: "deutsche-bank.de", halal: deutscheBank(dbKarte("„Deutsche Bank Card Business (Debitkarte) inklusive“")), zins: "unbekannt", karte: "gut", zeile: "Deutsche Bank Business BasicKonto", kosten: ke({ f: 14.9, frei: 0, kb: 0.3, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "deutsche-bank-business-classickonto", haus: "deutsche-bank", name: "Deutsche Bank", produkt: "Business ClassicKonto", domain: "deutsche-bank.de", halal: deutscheBank(dbKarte("„Bis zu zwei Deutsche Bank Card Business (Debitkarte) inklusive“")), zins: "unbekannt", karte: "gut", zeile: "Deutsche Bank Business ClassicKonto", kosten: ke({ f: 24.9, frei: 0, kb: 0.2, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "deutsche-bank-business-premiumkonto", haus: "deutsche-bank", name: "Deutsche Bank", produkt: "Business PremiumKonto", domain: "deutsche-bank.de", halal: deutscheBank(dbKarte("„Zwei Deutsche Bank Card Business (Debitkarte) und zwei BusinessCard (Kreditkarten) inklusive“")), zins: "unbekannt", karte: "gut", zeile: "Deutsche Bank Business PremiumKonto", kosten: ke({ f: 39.9, frei: 0, kb: 0.1, debit: 0, ab: e(0), ein: e(0), unter: 1, buch: HBCI5, sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "deutsche-bank-gruenderkonto", haus: "deutsche-bank", name: "Deutsche Bank", produkt: "Gründerkonto", domain: "deutsche-bank.de", halal: deutscheBank(dbKarte("„Bis zu 2 Deutsche Bank Card Business (Debitkarte) inkl.“")), zins: "unbekannt", karte: "gut", zeile: "Deutsche Bank Gründerkonto", kosten: ke({ f: 24.9, frei: 0, kb: 0.2, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: [...HBCI5, "eigenes Tool"], sich: "ja" }), kontofuehrungZusatz: "(im ersten Jahr 0 €)", fuerWen: FF_ALLE, einlagenLand: "Deutschland" },

  { id: "commerzbank-klassikgeschaeftskonto", haus: "commerzbank", name: "Commerzbank", produkt: "KlassikGeschäftskonto", domain: "commerzbank.de", halal: commerzbank(COMMERZ_KLASSIK, COMMERZ_KLASSIK, "„Girocard mit Visa-Funktion (Debitkarte)“"), zins: "unbekannt", karte: "gut", zeile: "Commerzbank KlassikGeschäftskonto", kosten: ke({ f: 15.9, frei: 10, kb: 0.2, debit: 5.9, ab: e(2.5), ein: e(2.5), unter: 0, buch: HBCI5, sich: "ja" }), kontofuehrungZusatz: "(im ersten Jahr 0 €)", fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "commerzbank-premiumgeschaeftskonto", haus: "commerzbank", name: "Commerzbank", produkt: "PremiumGeschäftskonto", domain: "commerzbank.de", halal: commerzbank(COMMERZ_PREMIUM, COMMERZ_KONTEN, "„Girocard mit Visa-Funktion (Debitkarte)“"), zins: "unbekannt", karte: "gut", zeile: "Commerzbank PremiumGeschäftskonto", kosten: ke({ f: 34.9, frei: 50, kb: 0.15, debit: 0, ab: e(2.5), ein: e(2.5), unter: 0, buch: HBCI5, sich: "ja" }), kontofuehrungZusatz: "(in den ersten 2 Jahren 8,90 €)", fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "commerzbank-premiumgeschaeftskonto-plus", haus: "commerzbank", name: "Commerzbank", produkt: "PremiumGeschäftskonto Plus", domain: "commerzbank.de", halal: commerzbank(COMMERZ_PREMIUM, COMMERZ_KONTEN, "„2 Girocards mit Visa-Funktion (Debitkarte)“"), zins: "unbekannt", karte: "gut", zeile: "Commerzbank PremiumGeschäftskonto Plus", kosten: ke({ f: 54.9, frei: 250, kb: 0.1, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "commerzbank-gruenderangebot", haus: "commerzbank", name: "Commerzbank", produkt: "GründerAngebot", domain: "commerzbank.de", halal: commerzbank(COMMERZ_KONTEN, COMMERZ_KONTEN, null), zins: "unbekannt", dispo: "unbekannt", karte: "unbekannt", zeile: "Commerzbank GründerAngebot", kosten: ke({ f: 34.9, frei: 50, kb: 0.15, debit: 0, ab: e(2.5), ein: e(2.5), unter: 0, buch: HBCI5, sich: "ja" }), kontofuehrungZusatz: "(in den ersten 2 Jahren 8,90 €)", fuerWen: FF_ALLE, einlagenLand: "Deutschland" },

  { id: "targobank-business-konto-plus", haus: "targobank", name: "Targobank", produkt: "Business-Konto Plus", domain: "targobank.de", halal: TARGOBANK, zins: "unbekannt", karte: "gut", marke: "Visa", zeile: "Targobank Business-Konto Plus", kosten: ke({ f: 9.9, frei: 0, kb: 0.2, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "targobank-business-konto-komfort", haus: "targobank", name: "Targobank", produkt: "Business-Konto Komfort", domain: "targobank.de", halal: TARGOBANK, zins: "unbekannt", karte: "gut", marke: "Visa", zeile: "Targobank Business-Konto Komfort", kosten: ke({ f: 14.9, frei: 30, kb: 0.15, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },
  { id: "targobank-business-konto-premium", haus: "targobank", name: "Targobank", produkt: "Business-Konto Premium", domain: "targobank.de", halal: TARGOBANK, zins: "unbekannt", karte: "gut", marke: "Visa", zeile: "Targobank Business-Konto Premium", kosten: ke({ f: 26.9, frei: 75, kb: 0.1, debit: 0, ab: e(0), ein: e(0), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_SIEBEN, einlagenLand: "Deutschland" },

  { id: "hvb-businesskonto-4you", haus: "hvb", name: "HVB", produkt: "BusinessKonto 4You", domain: "hypovereinsbank.de", halal: HVB, zins: "unbekannt", dispo: "unbekannt", karte: "gut", zeile: "HVB BusinessKonto 4You", kosten: ke({ f: 25, frei: 50, kb: 0.4, debit: 0, ab: e(0), ein: e(2.5), unter: 1, buch: HBCI5, sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "gls-geschaeftskonto", haus: "gls", name: "GLS Bank", produkt: "Geschäftskonto", domain: "gls.de", halal: GLS, zins: "unbekannt", karte: "gut", marke: "Mastercard", zeile: "GLS Geschäftskonto", kosten: ke({ f: 15, frei: 0, kb: 0.14, debit: 1.25, ab: e(0), ein: e(9.5), unter: 0, buch: HBCI5, sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },

  { id: "holvi-flex", haus: "holvi", name: "Holvi", produkt: "Flex", domain: "holvi.com", halal: HOLVI, karte: "gut", marke: "Mastercard", zeile: "Holvi Flex", kosten: ke({ f: 0, frei: 0, kb: 0.25, debit: 0, ab: p(2.5), ein: "nicht möglich", unter: 0, buch: ["DATEV", "SevDesk", "Sonstige"], sich: "teilweise" }), fuerWen: FF_SIEBEN, einlagenLand: "Finnland" },
  { id: "holvi-lite", haus: "holvi", name: "Holvi", produkt: "Lite", domain: "holvi.com", halal: HOLVI, karte: "gut", marke: "Mastercard", zeile: "Holvi Lite", kosten: ke({ f: 5.36, frei: 100, kb: 0.25, debit: 0, ab: p(2.5), ein: p(2.5), unter: 2, buch: DATEV_ALLE, sich: "teilweise" }), fuerWen: FF_SIEBEN, einlagenLand: "Finnland" },
  { id: "holvi-pro", haus: "holvi", name: "Holvi", produkt: "Pro", domain: "holvi.com", halal: HOLVI, karte: "gut", marke: "Mastercard", zeile: "Holvi Pro", kosten: ke({ f: 10.71, frei: "unbegrenzt", kb: 0, debit: 0, ab: p(2), ein: p(2), unter: 5, buch: DATEV_ALLE, sich: "teilweise" }), fuerWen: FF_SIEBEN, einlagenLand: "Finnland" },
  { id: "holvi-business", haus: "holvi", name: "Holvi", produkt: "Business", domain: "holvi.com", halal: HOLVI, karte: "gut", marke: "Mastercard", zeile: "Holvi Business", kosten: ke({ f: 70.21, frei: "unbegrenzt", kb: 0, debit: 0, ab: p(0), ein: p(2), unter: 15, buch: DATEV_ALLE, sich: "teilweise" }), fuerWen: FF_SIEBEN, einlagenLand: "Finnland" },

  { id: "bunq-free-business", haus: "bunq", name: "bunq", produkt: "Free Business", domain: "bunq.com", partner: "bunq", halal: BUNQ, karte: "gut", zeile: "bunq Free Business", kosten: ke({ f: 0, frei: 0, kb: 0.13, debit: 0, ab: e(2.99), ein: p(0.5), unter: 3, buch: [], sich: "ja" }), fuerWen: BUNQ_FUER, einlagenLand: "Niederlande" },
  { id: "bunq-core-business", haus: "bunq", name: "bunq", produkt: "Core Business", domain: "bunq.com", partner: "bunq", halal: BUNQ, karte: "gut", zeile: "bunq Core Business", kosten: ke({ f: 7.99, frei: 250 / 12, kb: 0.13, debit: 0, ab: e(0.99), ein: e(0), unter: 5, buch: [], sich: "ja" }), buchungenText: "250 im Jahr frei, danach 0,13 €", fuerWen: BUNQ_FUER, einlagenLand: "Niederlande" },
  { id: "bunq-pro-business", haus: "bunq", name: "bunq", produkt: "Pro Business", domain: "bunq.com", partner: "bunq", halal: BUNQ, karte: "gut", zeile: "bunq Pro Business", kosten: ke({ f: 13.99, frei: 250 / 12, kb: 0.13, debit: 0, ab: e(0), ein: p(0.5), unter: 25, buch: ["SevDesk", "Sonstige"], sich: "ja" }), buchungenText: "250 im Jahr frei, danach 0,13 €", fuerWen: BUNQ_FUER, einlagenLand: "Niederlande" },
  { id: "bunq-elite-business", haus: "bunq", name: "bunq", produkt: "Elite Business", domain: "bunq.com", partner: "bunq", halal: BUNQ, karte: "gut", zeile: "bunq Elite Business", kosten: ke({ f: 23.99, frei: 500 / 12, kb: 0.13, debit: 0, ab: e(0), ein: p(0.5), unter: 25, buch: ["SevDesk", "Sonstige"], sich: "ja" }), buchungenText: "500 im Jahr frei, danach 0,13 €", fuerWen: BUNQ_FUER, einlagenLand: "Niederlande" },

  { id: "finom-solo", haus: "finom", name: "Finom", produkt: "Solo", domain: "finom.co", halal: finom(true), karte: "gut", marke: "Visa", zeile: "Finom Solo", kosten: ke({ f: 0, frei: "unbegrenzt", kb: 0, debit: 3, ab: p(1), ein: "nicht möglich", unter: "unbegrenzt", buch: DATEV_ALLE, sich: "nein" }), fuerWen: FREELANCE_FUER, einlagenLand: "keins" },
  { id: "finom-basic", haus: "finom", name: "Finom", produkt: "Basic", domain: "finom.co", halal: finom(false), karte: "gut", marke: "Visa", zeile: "Finom Basic", kosten: ke({ f: 10.71, frei: "unbegrenzt", kb: 0, debit: 0, ab: e(0), ein: "nicht möglich", unter: "unbegrenzt", buch: DATEV_ALLE, sich: "nein" }), fuerWen: FF_ALLE, einlagenLand: "keins" },
  { id: "finom-smart", haus: "finom", name: "Finom", produkt: "Smart", domain: "finom.co", halal: finom(false), karte: "gut", marke: "Visa", zeile: "Finom Smart", kosten: ke({ f: 28.56, frei: "unbegrenzt", kb: 0, debit: 0, ab: e(0), ein: "nicht möglich", unter: "unbegrenzt", buch: DATEV_ALLE, sich: "nein" }), fuerWen: FF_ALLE, einlagenLand: "keins" },

  { id: "kontist-free", haus: "kontist", name: "Kontist", produkt: "Free", domain: "kontist.com", halal: KONTIST, zins: "unbekannt", dispo: "unbekannt", karte: "gut", marke: "Visa", zeile: "Kontist Free", kosten: ke({ f: 0, frei: 5, kb: 0.4, debit: 0, ab: e(2), ein: p(2.9), unter: 0, buch: ["SevDesk"], sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "kontist-start", haus: "kontist", name: "Kontist", produkt: "Start", domain: "kontist.com", halal: KONTIST, zins: "unbekannt", dispo: "unbekannt", karte: "gut", marke: "Visa", zeile: "Kontist Start", kosten: ke({ f: 13.09, frei: 30, kb: 0.4, debit: 0, ab: e(2), ein: p(2.9), unter: 3, buch: ["DATEV", "SevDesk", "Sonstige"], sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },
  { id: "kontist-plus", haus: "kontist", name: "Kontist", produkt: "Plus", domain: "kontist.com", halal: KONTIST, zins: "unbekannt", dispo: "unbekannt", karte: "gut", marke: "Visa", zeile: "Kontist Plus", kosten: ke({ f: 29.75, frei: 100, kb: 0.4, debit: 0, ab: e(2), ein: p(2.9), unter: 5, buch: ["DATEV", "SevDesk", "Sonstige", "eigenes Tool"], sich: "ja" }), fuerWen: FF_ALLE, einlagenLand: "Deutschland" },

  { id: "qonto-starter", haus: "qonto", name: "Qonto", produkt: "Starter", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Starter", kosten: ke({ f: 0, frei: 5, kb: 0.2, debit: 5, ab: e(2), ein: "nicht möglich", unter: 0, buch: HBCI6, sich: "teilweise" }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "qonto-basic", haus: "qonto", name: "Qonto", produkt: "Basic", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Basic", kosten: ke({ f: 10.71, frei: 30, kb: 0.2, debit: 0, ab: e(2), ein: "nicht möglich", unter: 0, buch: HBCI6, sich: "teilweise" }), fuerWen: FREELANCE_FUER, einlagenLand: "Frankreich" },
  { id: "qonto-smart", haus: "qonto", name: "Qonto", produkt: "Smart", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Smart", kosten: ke({ f: 22.61, frei: 60, kb: 0.2, debit: 0, ab: e(2), ein: "nicht möglich", unter: 1, buch: HBCI6, sich: "teilweise" }), fuerWen: FF_ALLE, einlagenLand: "Frankreich" },
  { id: "qonto-premium", haus: "qonto", name: "Qonto", produkt: "Premium", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Premium", kosten: ke({ f: 46.41, frei: 200, kb: 0.1, debit: 0, ab: e(2), ein: "nicht möglich", unter: 4, buch: HBCI6, sich: "teilweise" }), fuerWen: FF_ALLE, einlagenLand: "Frankreich" },
  { id: "qonto-essential", haus: "qonto", name: "Qonto", produkt: "Essential", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Essential", kosten: ke({ f: 58.31, frei: 150, kb: 0.15, debit: 0, ab: e(2), ein: "nicht möglich", unter: 9, buch: HBCI6, sich: "teilweise" }), fuerWen: FF_ALLE, einlagenLand: "Frankreich" },
  { id: "qonto-business", haus: "qonto", name: "Qonto", produkt: "Business", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Business", kosten: ke({ f: 117.81, frei: 500, kb: 0.15, debit: 0, ab: e(2), ein: "nicht möglich", unter: 29, buch: HBCI6, sich: "teilweise" }), fuerWen: FF_ALLE, einlagenLand: "Frankreich" },
  { id: "qonto-enterprise", haus: "qonto", name: "Qonto", produkt: "Enterprise", domain: "qonto.com", halal: QONTO, zins: "unbekannt", karte: "unbekannt", zeile: "Qonto Enterprise", kosten: ke({ f: 236.81, frei: 10000, kb: 0.1, debit: 0, ab: e(2), ein: "nicht möglich", unter: 99, buch: HBCI6, sich: "teilweise" }), fuerWen: FF_ALLE, einlagenLand: "Frankreich" },

  // Wise: Finanzfluss nennt keine Werte für Buchungen und Bargeld, das zählt 0 Punkte (`keine Angabe`). Zins: Cashback auf Guthaben (Hilfe-Artikel).
  { id: "wise-business", haus: "wise", name: "Wise", produkt: "Business", domain: "wise.com", halal: WISE, zins: "schlecht", karte: "gut", zeile: "Wise Business", kosten: ke({ f: 0, frei: null, kb: null, debit: 0, ab: "keine Angabe", ein: "keine Angabe", unter: 0, buch: ["Sonstige"], sich: "nein" }), fuerWen: FF_ALLE, einlagenLand: "keins" },
];

const finanzfluss = (t: Tarif, hinweis: string, anzeige?: string): Quelle => ({
  url: FINANZFLUSS,
  stand: FF_STAND,
  hinweis: `Finanzfluss-Vergleich Geschäftskonto (aktualisiert 11.11.2026), Zeile „${t.zeile}“, abgerufen 23.11.2026: ${hinweis}`,
  ...(anzeige ? { anzeige } : {}),
});

const zuAnbieter = (t: Tarif): RohAnbieter => {
  const k = t.kosten;
  const debit = t.texte?.debitkarte ?? (k.debitkarte === null ? "Keine" : t.marke ? `${t.marke}, ${euro(k.debitkarte)}` : euro(k.debitkarte));
  const abheben = t.texte?.abheben ?? gebuehrText(k.abheben);
  const unterkonten = t.texte?.unterkonten ?? (k.unterkonten === "unbegrenzt" ? "Unbegrenzt" : k.unterkonten === 0 ? "Keine" : String(k.unterkonten));
  const rechts3 = (form: string): boolean | "unbekannt" => (t.rechtsformenOffen ? "unbekannt" : t.fuerWen.includes(form));
  const link = t.partner ? partnerLink(t.partner) : undefined;
  const kontofuehrung = `${euro(k.kontofuehrung)}${t.kontofuehrungZusatz ? ` ${t.kontofuehrungZusatz}` : ""}`;
  return {
    id: t.id,
    name: t.name,
    produkt: t.produkt,
    domain: t.domain,
    haus: t.haus,
    ...(link ? { link } : {}),
    ...(t.ohneFinanzfluss ? {} : { finanzfluss: { produkt: t.zeile, partnerlink: null } }),
    finanzPunkte: geschaeftFinanzPunkte(k, GESCHAEFT_FINANZ_MAX),
    werte: {
      zinsfreiAbStart: t.zins ?? "gut",
      keinDispoAbStart: t.dispo ?? "gut",
      karteOhneKredit: t.karte,
      kontofuehrung,
      buchungen: t.buchungenText ?? buchungenText(k),
      debitkarte: debit,
      abheben,
      einzahlen: gebuehrText(k.einzahlen),
      unterkonten,
      buchhaltung: k.buchhaltung.length > 0 ? k.buchhaltung.join(", ") : "Keine angegeben",
      einlagensicherung: einlagenText(k, t.einlagenLand),
      fuerWen: t.fuerWen.join(", "),
      freiberufler: rechts3("Freiberufler"),
      gewerbe: rechts3("Gewerbe"),
      kapitalgesellschaft: t.rechtsformenOffen ? "unbekannt" : rechts3("UG") === true || rechts3("GmbH") === true,
    },
    quellen: {
      zinsfreiAbStart: t.halal.zinsfreiAbStart,
      keinDispoAbStart: t.halal.keinDispoAbStart,
      karteOhneKredit: t.halal.karteOhneKredit,
      kontofuehrung: finanzfluss(t, `Kontoführung ${euro(k.kontofuehrung)} im Monat.`, "Finanzfluss-Vergleich Geschäftskonto"),
      buchungen: finanzfluss(t, t.buchungenText ?? buchungenText(k)),
      debitkarte: finanzfluss(t, `Debitkarte ${debit}.`),
      abheben: finanzfluss(t, `Bargeld abheben ${abheben}.`),
      einzahlen: finanzfluss(t, `Bargeld einzahlen ${gebuehrText(k.einzahlen)}.`),
      unterkonten: finanzfluss(t, `Unterkonten ${unterkonten}.`),
      buchhaltung: finanzfluss(t, k.buchhaltung.length > 0 ? k.buchhaltung.join(", ") : "Keine angegeben"),
      einlagensicherung: finanzfluss(t, einlagenText(k, t.einlagenLand)),
      fuerWen: finanzfluss(t, t.fuerWen.join(", ")),
      freiberufler: finanzfluss(t, t.fuerWen.join(", ")),
      gewerbe: finanzfluss(t, t.fuerWen.join(", ")),
      kapitalgesellschaft: finanzfluss(t, t.fuerWen.join(", ")),
      ...t.eigeneQuellen,
    },
  };
};

/** Alphabetisch wie die übrigen Datendateien. Die Reihenfolge der Seite kommt aus der Rangfolge. */
export const geschaeftskontoVergleich: RohAnbieter[] = mitIslamicKonto(TARIFE.map(zuAnbieter)).sort(
  (a, b) => `${a.name} ${a.produkt}`.localeCompare(`${b.name} ${b.produkt}`, "de"),
);
