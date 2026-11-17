/* Runde Logos getesteter Banken: Verkaufsseite vor dem Check und Check-Kasten in jedem Freebie (RN16-07). */

/**
 * RN15 (Elias RN14-02 „anstatt 35 Depot sind Girokonto selbst getestet, dann machst du da die Logos in dem Runden hin“): in der Zeile unter
 * dem Titel runde Logos getesteter Banken statt Bildern anderer Leute. Die Logo-Leiste neben „89 Angebote selbst getestet“ fällt dafür weg
 * (bei 390 gemessen: zwei Logo-Reihen übereinander wirken unruhig, Regelbuch look-und-design Nie „Nicht zu viel auf einmal“).
 * `w`: Breite des Schriftzugs im Kreis in Prozent, je nach Form der Datei.
 */
export const RUNDE_BANKEN: { src: string; alt: string; b: number; h: number; aus: [number, number, number, number] }[] = [
  // `aus`: Ausschnitt der Datei als Anteil (links, oben, rechts, unten), nur das Zeichen der Bank: ING der Löwe, Commerzbank das Band,
  // Deutsche Bank das Quadrat, DKB der Schriftzug ohne „Das kann Bank“. Maße der Dateien in px (naturalWidth × naturalHeight).
  { src: "/logos/ing.de.svg", alt: "ING", b: 2680, h: 500, aus: [0.42, 0.02, 0.66, 0.8] },
  { src: "/logos/commerzbank.de.svg", alt: "Commerzbank", b: 300, h: 40, aus: [0.865, 0, 1, 1] },
  { src: "/logos/deutsche-bank.de.svg", alt: "Deutsche Bank", b: 250, h: 52, aus: [0.785, 0, 1, 1] },
  { src: "/logos/dkb.de.svg", alt: "DKB", b: 265, h: 150, aus: [0, 0.02, 1, 0.55] },
];

/** Ausschnitt mittig in einem Quadrat von `s` px: Hintergrundbild so groß und so verschoben, dass genau der Ausschnitt hineinpasst. */
export const rundStil = (r: (typeof RUNDE_BANKEN)[number], s: number) => {
  const [x0, y0, x1, y1] = r.aus;
  const k = s / Math.max((x1 - x0) * r.b, (y1 - y0) * r.h);
  const breite = r.b * k;
  const hoehe = r.h * k;
  const links = -x0 * breite + (s - (x1 - x0) * breite) / 2;
  const oben = -y0 * hoehe + (s - (y1 - y0) * hoehe) / 2;
  return {
    width: `${s}px`,
    height: `${s}px`,
    backgroundImage: `url(${r.src})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${breite}px ${hoehe}px`,
    backgroundPosition: `${links}px ${oben}px`,
  };
};
