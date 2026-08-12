// Hier werden alle Partnerlinks gepflegt.
// Neue Partner nur hier eintragen, niemals direkt auf einer Inhaltsseite verlinken.

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
    notiz:
      "Fuehrt bewusst auf die interne Seite. Der eigentliche Affiliate-Deeplink bleibt dort unveraendert liegen.",
  },
];

export const findPartnerLink = (kurzname?: string): PartnerLink | undefined =>
  partnerLinks.find((p) => p.kurzname === kurzname);
