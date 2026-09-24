// Hier werden alle Partnerlinks gepflegt.
// Neue Partner nur hier eintragen, niemals direkt auf einer Inhaltsseite verlinken.
//
// Jeder Partner hat eine eigene Startseite unter /dein-investmentstart/<kurzname>
// (Scalable: /dein-investmentstart). /out/<kurzname> leitet dorthin weiter, der
// eigentliche Affiliate-Link steht nur auf der Startseite ("Mitnahme statt
// Direktlink"). Inhalte der Startseiten: src/data/investmentStart.ts.
//
// Netzwerk FinanceQuality (neqty), Partner-ID 8507, Projekt finanz.muslim 51087.
// Links am 15.09.2026 aus dem Portal (Werbemittel, Textlink) geholt und per
// Weiterleitung gegen die Zielseite geprüft.
//
// Netzwerk financeAds, Partner 64685, Werbeflaeche 87591 (finanzmuslim.com).
// Teilnahmebedingungen: keine Sub-IDs zur Verknuepfung von Besucherdaten, keine
// Links in Direktnachrichten. Links hier deshalb ohne {SUBID}.

export type PartnerLink = {
  kurzname: string;
  anbieter: string;
  ziel: string;
  aktiv: boolean;
  notiz: string;
};

export const partnerLinks: PartnerLink[] = [
  {
    kurzname: "kraken",
    anbieter: "Kraken",
    ziel: "/dein-investmentstart/kraken",
    aktiv: true,
    notiz: "MCANISM, Angebot 2906, Textlink Default. Werbeflaeche finanzmuslim.com (AdSpace 2016).",
  },
  {
    kurzname: "scalable",
    anbieter: "Scalable Capital",
    ziel: "/dein-investmentstart",
    aktiv: true,
    notiz: "Fuehrt bewusst auf die interne Seite. Der Affiliate-Deeplink liegt in investmentStart.ts.",
  },
  {
    kurzname: "traders-place",
    anbieter: "Traders Place",
    ziel: "/dein-investmentstart/traders-place",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1981, Werbemittel 23712 (Textlink Home).",
  },
  {
    kurzname: "dkb-depot",
    anbieter: "DKB",
    ziel: "/dein-investmentstart/dkb-depot",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 494 DKB-Broker, Werbemittel 3886.",
  },
  {
    kurzname: "finvesto",
    anbieter: "finvesto",
    ziel: "/dein-investmentstart/finvesto",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1806 finvesto Depot, Werbemittel 23138.",
  },
  {
    kurzname: "dkb-girokonto",
    anbieter: "DKB",
    ziel: "/dein-investmentstart/dkb-girokonto",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 14 DKB Girokonto, Werbemittel 23241 (Standard-Landingpage).",
  },
  {
    kurzname: "n26",
    anbieter: "N26",
    ziel: "/dein-investmentstart/n26",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1782, Werbemittel 24756 (N26 Standard DE).",
  },
  {
    kurzname: "bbbank",
    anbieter: "BBBank",
    ziel: "/dein-investmentstart/bbbank",
    aktiv: true,
    notiz: "FinanceQuality, Kampagne 1945 BBBank Girokonto, Werbemittel 23181 (Mehrwertkonto).",
  },
  {
    kurzname: "bunq",
    anbieter: "bunq",
    ziel: "/dein-investmentstart/bunq",
    aktiv: true,
    notiz: "financeAds, Programm 3156, Textlink 123231 (Sign up in 5 minutes, Tarif waehlt der Nutzer). Angenommen 24.09.2026.",
  },
  {
    kurzname: "joe-broker",
    anbieter: "JOE Broker",
    ziel: "/dein-investmentstart/joe-broker",
    aktiv: true,
    notiz: "financeAds, Programm 5496, Textlink 129308 (Depot). Angenommen 24.09.2026.",
  },
];

export const findPartnerLink = (kurzname?: string): PartnerLink | undefined =>
  partnerLinks.find((p) => p.kurzname === kurzname);
