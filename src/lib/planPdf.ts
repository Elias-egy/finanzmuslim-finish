/**
 * PDF zum Halal-Investmentplan, im Browser gebaut, ohne Server: der Ausdruck des Dashboards (CV27P, 09.11.2026).
 *
 * Elias, 09.11.2026 (Vault raw/2026-11-09-elias-cv27p-dashboard-plan-nacht-onboarding-fakten-pdf-jarvis.md): „im
 * Endeffekt kann man es dann doch in eine PDF packen … Und dann kommen dazu noch die Basics dazu. Aber die Basics
 * werden dann auch ein bisschen neu designt, natürlich im neuen Stil.“ Darum drei Seiten im Stil des Dashboards
 * (weiß, Karten mit dünnem Rand, Farbe nur in den Daten): 1 Typ, Risiko, Richtung; 2 Anlagen, Schritte, Datenbank;
 * 3 die Basics, das Girokonto, der Hinweis. Die kopierten Blueprint-Seiten der ersten Fassung (CV26P) sind weg.
 * Nach außen keine Prozentzahlen, nur Richtung und Euro-Beispiele (Anlageberatung).
 */
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import kurse from "@/data/kurse.json";
import { BASICS } from "@/data/portfolioBasics";
import {
  anlegertyp,
  datenbankFakten,
  gewichtWort,
  heute,
  planTitel,
  risiko,
  risikoWort,
  stileFuer,
} from "@/data/portfolioDashboard";
import { bausteinById, SCHMERZ } from "@/data/portfolioPlan";
import { aufteilung, BEISPIEL, BROKER, euroText, inEuro, LAGEN, prozentText, type Anteil, type Antworten } from "@/data/portfolioQuiz";

const BLAU = rgb(0, 0x57 / 255, 0xfa / 255);
const SCHWARZ = rgb(0.07, 0.09, 0.15);
const GRAU = rgb(0.42, 0.45, 0.5);
const LINIE = rgb(0.9, 0.91, 0.93);
const BAHN = rgb(0.94, 0.95, 0.97);
const GRUEN = rgb(0.09, 0.5, 0.27);
const ROT = rgb(0.7, 0.15, 0.15);
const WEISS = rgb(1, 1, 1);

const BREITE = 594.96;
const HOEHE = 841.92;
const RAND = 44;
const INNEN = BREITE - 2 * RAND;

const farbe = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/** Standardschriften kennen nur WinAnsi; was dort fehlt, wird ersetzt statt den Bau abzubrechen. */
const sauber = (t: string) =>
  t
    .replace(/ /g, " ")
    .replace(/[‐-―]/g, "-")
    .replace(/×/g, "x")
    .replace(/[^\x20-\x7e -ÿ€‘’“”„…]/g, "");

const umbrechen = (text: string, font: PDFFont, groesse: number, breite: number): string[] => {
  const zeilen: string[] = [];
  let zeile = "";
  for (const wort of sauber(text).split(" ")) {
    const probe = zeile ? `${zeile} ${wort}` : wort;
    if (font.widthOfTextAtSize(probe, groesse) > breite && zeile) {
      zeilen.push(zeile);
      zeile = wort;
    } else zeile = probe;
  }
  if (zeile) zeilen.push(zeile);
  return zeilen;
};

/** Abgerundetes Rechteck als Pfad (y nach unten ab Startpunkt oben links). */
const rundeck = (w: number, h: number, r: number) =>
  `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;

/** Ein Ringstück als Pfad (Mitte 0,0, y nach unten), Winkel im Uhrzeigersinn ab 12 Uhr. */
const ringStueck = (aussen: number, innen: number, von: number, bis: number) => {
  const p = (r: number, w: number) => `${(r * Math.sin(w)).toFixed(2)} ${(-r * Math.cos(w)).toFixed(2)}`;
  const gross = bis - von > Math.PI ? 1 : 0;
  return `M ${p(aussen, von)} A ${aussen} ${aussen} 0 ${gross} 1 ${p(aussen, bis)} L ${p(innen, bis)} A ${innen} ${innen} 0 ${gross} 0 ${p(innen, von)} Z`;
};

type Stift = { normal: PDFFont; fett: PDFFont };

class Blatt {
  constructor(
    public seite: PDFPage,
    public s: Stift,
  ) {}

  text(t: string, x: number, y: number, groesse: number, opt: { fett?: boolean; farbe?: RGB; rechts?: boolean; mitte?: boolean } = {}) {
    const font = opt.fett ? this.s.fett : this.s.normal;
    const tt = sauber(t);
    const w = font.widthOfTextAtSize(tt, groesse);
    const xx = opt.rechts ? x - w : opt.mitte ? x - w / 2 : x;
    this.seite.drawText(tt, { x: xx, y, size: groesse, font, color: opt.farbe ?? SCHWARZ });
    return w;
  }

  /** Mehrzeiliger Text; gibt die Höhe zurück, die er gebraucht hat. */
  absatz(t: string, x: number, y: number, groesse: number, breite: number, opt: { fett?: boolean; farbe?: RGB; zeilenhoehe?: number } = {}) {
    const font = opt.fett ? this.s.fett : this.s.normal;
    const zh = opt.zeilenhoehe ?? groesse * 1.35;
    const zeilen = umbrechen(t, font, groesse, breite);
    zeilen.forEach((z, i) => this.seite.drawText(z, { x, y: y - i * zh, size: groesse, font, color: opt.farbe ?? SCHWARZ }));
    return zeilen.length * zh;
  }

  /** Karte wie im Dashboard: weißer Grund, dünner Rand, runde Ecken. `oben` ist die obere Kante. */
  karte(x: number, oben: number, w: number, h: number) {
    this.seite.drawSvgPath(rundeck(w, h, 14), { x, y: oben, color: WEISS, borderColor: LINIE, borderWidth: 1 });
  }

  label(t: string, x: number, oben: number) {
    this.text(t.toUpperCase(), x, oben - 22, 8.5, { fett: true, farbe: GRAU });
  }

  fuss(nr: number) {
    this.text("finanzmuslim  ·  Dein Halal-Investmentplan", RAND, 26, 8.5, { farbe: GRAU });
    this.text(`Seite ${nr} von 3`, BREITE - RAND, 26, 8.5, { farbe: GRAU, rechts: true });
  }

  kopf(titel: string, unter?: string) {
    this.text("finanzmuslim", RAND, HOEHE - 50, 13, { fett: true });
    this.text(heute(), BREITE - RAND, HOEHE - 50, 10, { farbe: GRAU, rechts: true });
    this.text(titel, RAND, HOEHE - 96, 24, { fett: true });
    if (unter) this.text(unter, RAND, HOEHE - 116, 11, { farbe: GRAU });
  }
}

export type PdfOptionen = { anteile?: Anteil[]; name?: string };

export const planPdfBytes = async (a: Antworten, opt: PdfOptionen = {}): Promise<Uint8Array> => {
  const doc = await PDFDocument.create();
  doc.setTitle(planTitel(opt.name));
  doc.setAuthor("finanzmuslim");
  const s: Stift = {
    normal: await doc.embedFont(StandardFonts.Helvetica),
    fett: await doc.embedFont(StandardFonts.HelveticaBold),
  };

  const anteile = opt.anteile ?? aufteilung(a);
  const betrag = a.betrag ?? 50;
  const euro = inEuro(anteile, betrag);
  const monatlich = a.weise !== "einmal";
  const brokerName = !a.broker || a.broker === "anderer" ? "dein Depot" : (BROKER.find((b) => b.id === a.broker)?.titel ?? "");
  const lage = LAGEN.find((l) => l.id === a.lage)?.titel.replace(/^In /, "in ") ?? "";
  const typ = anlegertyp(anteile);
  const risk = risiko(anteile);
  const meta = `${brokerName === "dein Depot" ? "Dein Depot" : brokerName}  ·  ${euroText(betrag)} ${monatlich ? "im Monat" : "einmal"}  ·  Geld gebraucht ${lage}`;

  // ---------------------------------------------------------------- Seite 1: Typ, Risiko, Richtung
  {
    const b = new Blatt(doc.addPage([BREITE, HOEHE]), s);
    b.kopf(planTitel(opt.name), meta);

    // Anlegertyp links, Risiko rechts
    const kOben = HOEHE - 150;
    const kH = 190;
    const wL = INNEN * 0.58 - 6;
    const wR = INNEN - wL - 12;
    b.karte(RAND, kOben, wL, kH);
    b.label("Dein Anlegertyp", RAND + 18, kOben);
    b.text(typ.name, RAND + 18, kOben - 62, 26, { fett: true });
    let y = kOben - 90;
    y -= b.absatz(typ.seele, RAND + 18, y, 11, wL - 36);
    y -= 4;
    b.absatz(typ.tut, RAND + 18, y, 10, wL - 36, { farbe: GRAU });

    const xR = RAND + wL + 12;
    b.karte(xR, kOben, wR, kH);
    b.label("Risikobereitschaft", xR + 18, kOben);
    const cx = xR + wR / 2;
    const cy = kOben - 128;
    const r = 56;
    // Bahn und Wert als halber Ring
    b.seite.drawSvgPath(ringStueck(r, r - 12, -Math.PI / 2, Math.PI / 2), { x: cx, y: cy, color: BAHN, borderWidth: 0 });
    b.seite.drawSvgPath(ringStueck(r, r - 12, -Math.PI / 2, -Math.PI / 2 + (Math.PI * risk) / 100), { x: cx, y: cy, color: BLAU, borderWidth: 0 });
    b.text(`${risk} %`, cx, cy - 6, 24, { fett: true, mitte: true });
    b.text(risikoWort(risk), cx, cy - 22, 10, { farbe: GRAU, mitte: true });
    b.absatz("Je mehr Aktien und Krypto, desto höher. Je mehr Sukuk und Konto, desto ruhiger.", xR + 18, kOben - 160, 9, wR - 36, { farbe: GRAU });

    // Richtung
    const rOben = kOben - kH - 14;
    const rH = 250;
    b.karte(RAND, rOben, INNEN, rH);
    b.label("Deine Richtung", RAND + 18, rOben);
    const rcx = RAND + 96;
    const rcy = rOben - 140;
    let w = 0;
    const luecke = anteile.length > 1 ? 0.03 : 0;
    for (const x of anteile) {
      const breite = (x.prozent / 100) * Math.PI * 2;
      b.seite.drawSvgPath(ringStueck(66, 46, w + luecke / 2, w + breite - luecke / 2), { x: rcx, y: rcy, color: farbe(bausteinById(x.baustein).farbe), borderWidth: 0 });
      w += breite;
    }
    b.text(euroText(betrag), rcx, rcy - 4, 15, { fett: true, mitte: true });
    b.text(monatlich ? "im Monat" : "einmal", rcx, rcy - 18, 9, { farbe: GRAU, mitte: true });

    let ly = rOben - 52;
    const lx = RAND + 196;
    for (const [i, x] of anteile.entries()) {
      const bs = bausteinById(x.baustein);
      b.seite.drawCircle({ x: lx + 5, y: ly + 4, size: 4.5, color: farbe(bs.farbe) });
      b.text(bs.name, lx + 16, ly, 11.5, { fett: true });
      b.text(gewichtWort(x.baustein, x.prozent), lx + 16, ly - 13, 9.5, { farbe: GRAU });
      b.text(`z. B. ${euroText(euro[i])}`, BREITE - RAND - 18, ly, 11, { farbe: SCHWARZ, rechts: true });
      ly -= 34;
    }
    b.absatz("Richtung statt fester Prozente: ein Wort je Baustein sagt, wie viel Gewicht er hat. Die Euro-Beträge sind ein Beispiel.", RAND + 18, rOben - rH + 30, 9, INNEN - 36, { farbe: GRAU });

    b.fuss(1);
  }

  // ---------------------------------------------------------------- Seite 2: Anlagen, Schritte, Datenbank
  {
    const b = new Blatt(doc.addPage([BREITE, HOEHE]), s);
    b.kopf(`Deine Anlagen bei ${brokerName === "dein Depot" ? "deinem Depot" : brokerName}`, "Aus der Halal-Datenbank, mit Einzelbeleg kaufbar, je mit dem Weg zur Anlage.");

    const anlagen = anteile
      .filter((x) => x.baustein !== "konto")
      .map((x) => ({ x, p: stileFuer(x.baustein, a.broker)[0]?.produkt }));
    const zeileH = 58;
    const aOben = HOEHE - 150;
    const aH = 30 + anlagen.length * zeileH;
    b.karte(RAND, aOben, INNEN, aH);
    let y = aOben - 40;
    for (const [i, z] of anlagen.entries()) {
      const bs = bausteinById(z.x.baustein);
      b.seite.drawCircle({ x: RAND + 24, y: y + 4, size: 4.5, color: farbe(bs.farbe) });
      b.text(bs.name, RAND + 36, y, 10, { fett: true, farbe: GRAU });
      b.text(`z. B. ${euroText(euro[anteile.indexOf(z.x)])}`, BREITE - RAND - 18, y, 11, { fett: true, rechts: true });
      if (z.p) {
        b.text(z.p.anlage.name, RAND + 36, y - 16, 12.5, { fett: true });
        const rendite: string[] = [];
        if (z.p.r1 !== undefined) rendite.push(`1 Jahr ${prozentText(z.p.r1)}`);
        if (z.p.r5 !== undefined) rendite.push(`5 Jahre ${prozentText(z.p.r5)}`);
        let rx = RAND + 36;
        if (rendite.length) {
          const t = rendite.join("   ");
          const schlecht = (z.p.r1 ?? 0) < 0 && (z.p.r5 ?? 0) < 0;
          rx += b.text(t, rx, y - 31, 9.5, { fett: true, farbe: schlecht ? ROT : GRUEN }) + 12;
        }
        b.text(`finanzmuslim.com/halal-anlagen/${z.p.anlage.slug}`, rx, y - 31, 8.5, { farbe: BLAU });
      } else {
        b.text(BEISPIEL[z.x.baustein] ?? "", RAND + 36, y - 16, 11, { farbe: SCHWARZ });
      }
      if (i < anlagen.length - 1) b.seite.drawLine({ start: { x: RAND + 18, y: y - 44 }, end: { x: BREITE - RAND - 18, y: y - 44 }, thickness: 0.6, color: LINIE });
      y -= zeileH;
    }

    // So machst du es
    const sOben = aOben - aH - 14;
    const konto = anteile.findIndex((x) => x.baustein === "konto");
    const kauf = anlagen.filter((z) => z.p).map((z) => `${euroText(euro[anteile.indexOf(z.x)])} ${z.p!.anlage.name}`);
    const schritte = [
      `Öffne die App von ${brokerName === "dein Depot" ? "deinem Depot" : brokerName} und such die Anlage beim Namen.`,
      `${monatlich ? "Kauf jeden Monat zum Beispiel" : "Kauf einmal zum Beispiel"} ${kauf.join(", ")}.${monatlich ? " Gibt es dafür einen Sparplan, läuft es von selbst." : ""}`,
    ];
    if (konto >= 0) schritte.push(`Etwa ${euroText(euro[konto])} bleiben auf deinem Girokonto. Achte darauf, dass es dir keine Zinsen zahlt.`);
    if (anteile.some((x) => x.baustein === "aktien")) schritte.push("Einzelaktien prüfst du einzeln, zum Beispiel mit Zoya oder Musaffa.");
    const sZeilen = schritte.map((t) => umbrechen(t, s.normal, 11, INNEN - 70).length);
    const sH = 48 + sZeilen.reduce((sum, n) => sum + n * 15 + 8, 0);
    b.karte(RAND, sOben, INNEN, sH);
    b.label("So machst du es", RAND + 18, sOben);
    y = sOben - 46;
    schritte.forEach((t, i) => {
      b.seite.drawCircle({ x: RAND + 27, y: y + 4, size: 8, color: SCHWARZ });
      b.text(String(i + 1), RAND + 27, y + 0.5, 9.5, { fett: true, farbe: WEISS, mitte: true });
      y -= b.absatz(t, RAND + 44, y, 11, INNEN - 70, { zeilenhoehe: 15 }) + 8;
    });

    // Datenbank
    const f = datenbankFakten(a.broker);
    const dOben = sOben - sH - 14;
    const dH = 118;
    if (dOben - dH > 60) {
      b.karte(RAND, dOben, INNEN, dH);
      b.label("Aus meiner Datenbank", RAND + 18, dOben);
      const spalten: [string, string][] = [
        [String(f.gesamt), "Halal-Anlagen geprüft"],
        [String(f.kaufbar ?? f.etfs), f.kaufbar !== undefined ? `davon bei ${brokerName === "dein Depot" ? "deinem Depot" : brokerName}` : "Islamic ETFs und Fonds"],
        [String(f.zertifikat), "mit eigenem Zertifikat"],
      ];
      const sw = (INNEN - 36) / 3;
      spalten.forEach(([zahl, text], i) => {
        const x = RAND + 18 + i * sw;
        b.text(zahl, x, dOben - 62, 26, { fett: true });
        b.text(text, x, dOben - 78, 9.5, { farbe: GRAU });
      });
      b.text("Alle Anlagen: finanzmuslim.com/halal-anlagen", RAND + 18, dOben - 102, 10, { fett: true, farbe: BLAU });
    }

    b.fuss(2);
  }

  // ---------------------------------------------------------------- Seite 3: Basics, Girokonto, Hinweis
  {
    const b = new Blatt(doc.addPage([BREITE, HOEHE]), s);
    b.kopf("Die Basics dahinter", "Vier Dinge, die deinen Plan halal halten. Kurz, zum Nachsehen.");

    const kw = (INNEN - 12) / 2;
    const kh = 236;
    BASICS.forEach((basic, i) => {
      const x = RAND + (i % 2) * (kw + 12);
      const oben = HOEHE - 150 - Math.floor(i / 2) * (kh + 12);
      b.karte(x, oben, kw, kh);
      b.text(basic.titel, x + 16, oben - 30, 14, { fett: true });
      let y = oben - 44;
      y -= b.absatz(basic.kurz, x + 16, y, 9.5, kw - 32, { farbe: GRAU }) + 6;
      const sw = (kw - 32) / 3;
      basic.zahlen.forEach((z, j) => {
        b.text(z.wert, x + 16 + j * sw, y - 10, z.wert.length > 7 ? 12 : 15, { fett: true });
        b.absatz(z.label, x + 16 + j * sw, y - 23, 7.5, sw - 6, { farbe: GRAU, zeilenhoehe: 9 });
      });
      y -= 52;
      basic.schritte.forEach((t, j) => {
        b.seite.drawCircle({ x: x + 22, y: y + 3, size: 5.5, color: SCHWARZ });
        b.text(String(j + 1), x + 22, y + 0.5, 7, { fett: true, farbe: WEISS, mitte: true });
        y -= b.absatz(t, x + 34, y, 8.5, kw - 50, { zeilenhoehe: 11 }) + 4;
      });
      if (basic.hinweis) b.absatz(basic.hinweis, x + 16, y - 2, 7.5, kw - 32, { farbe: GRAU, zeilenhoehe: 10 });
    });

    // Girokonto
    const gOben = HOEHE - 150 - 2 * (kh + 12);
    const gH = 92;
    b.karte(RAND, gOben, INNEN, gH);
    b.label("Fehlt noch", RAND + 18, gOben);
    b.text("Dein Girokonto ohne Zinsen", RAND + 18, gOben - 44, 14, { fett: true });
    b.absatz(`${SCHMERZ.girokonto} ${SCHMERZ.muslim}`, RAND + 18, gOben - 60, 10, INNEN - 36);
    b.text("Die besten ohne Zinsen: finanzmuslim.com/vergleich/girokonto", RAND + 18, gOben - 80, 10, { fett: true, farbe: BLAU });

    b.absatz(
      `Ein Beispiel aus deinen Antworten, keine Anlageberatung. Wie es früher lief, ist keine Garantie für später. Renditen in Euro, Stand ${(kurse as { stand: string }).stand}. Alle Anlagen aus der Halal-Datenbank auf finanzmuslim.com.`,
      RAND,
      gOben - gH - 22,
      8.5,
      INNEN,
      { farbe: GRAU, zeilenhoehe: 11 },
    );
    b.fuss(3);
  }

  return doc.save();
};

export const planPdf = async (a: Antworten, opt: PdfOptionen = {}) => {
  const bytes = await planPdfBytes(a, opt);
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = opt.name ? `halal-investmentplan-${opt.name.toLowerCase()}.pdf` : "halal-investmentplan.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};
