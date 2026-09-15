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

export type PartnerLink = {
  kurzname: string;
  anbieter: string;
  ziel: string;
  aktiv: boolean;
  notiz: string;
};

export const partnerLinks: PartnerLink[] = [
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
];

export const findPartnerLink = (kurzname?: string): PartnerLink | undefined =>
  partnerLinks.find((p) => p.kurzname === kurzname);
