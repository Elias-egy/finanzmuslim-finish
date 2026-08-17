/**
 * Die drei Guides, die es auch als PDF gibt.
 *
 * Der `schluessel` steht in der Adresse: /dein-guide/<schluessel>. Er ist
 * bewusst nicht zu erraten und steht nirgends in der Navigation, in der
 * Sitemap oder im Vorrendern. Freigeschaltet wird weiterhin ueber Instagram
 * und die bestehende Kette ManyChat, Make, MailerLite. Die Seite selbst ist
 * nur die Zustelladresse, keine zweite Sperre.
 *
 * Wer den Schluessel aendert, macht damit alle bereits verschickten Links
 * ungueltig. Das ist Absicht: so laesst sich ein durchgereichter Link
 * abschalten, ohne dass etwas umgebaut werden muss.
 */
export type GuideStufe = {
  schluessel: string;
  stufe: "einsteiger" | "fortgeschritten" | "profi";
  titel: string;
  /** Steht klein unter dem Titel, eine Zeile. */
  untertitel: string;
  pdf: string;
  pdfName: string;
};

export const guides: GuideStufe[] = [
  {
    schluessel: "start-2026",
    stufe: "einsteiger",
    titel: "Halal Investment Guide, Einsteiger",
    untertitel: "Die Grundlagen und der erste Schritt",
    pdf: "/guides/finanzmuslim-einsteiger-guide.pdf",
    pdfName: "finanzmuslim-einsteiger-guide.pdf",
  },
  {
    schluessel: "aufbau-2026",
    stufe: "fortgeschritten",
    titel: "Halal Investment Guide, Fortgeschritten",
    untertitel: "Depot aufbauen und sauber halten",
    pdf: "/guides/finanzmuslim-fortgeschritten-guide.pdf",
    pdfName: "finanzmuslim-fortgeschritten-guide.pdf",
  },
  {
    schluessel: "tiefe-2026",
    stufe: "profi",
    titel: "Halal Investment Guide, Profi",
    untertitel: "Prüfen, reinigen, langfristig planen",
    pdf: "/guides/finanzmuslim-profi-guide.pdf",
    pdfName: "finanzmuslim-profi-guide.pdf",
  },
];

export const guideBySchluessel = (schluessel?: string) =>
  guides.find((g) => g.schluessel === schluessel);
