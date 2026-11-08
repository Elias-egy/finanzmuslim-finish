/**
 * PDF zum persönlichen Portfolioplan, im Browser gebaut, ohne Server (CV26P, 08.11.2026).
 *
 * Vorne eine Seite mit seinem Plan, dahinter der Teil, der für alle gilt, aus dem Halal Investment Blueprint (Elias,
 * CV23S: „vorne sein Plan … den Rest der PDF, das sind ja diese Steuersachen und so weiter, die für jeden gelten“;
 * Vault raw/2026-11-08-elias-cv23s-bilder-kein-konto-blueprint-quiz-pdf.md): Seite 19 Dein fester Ablauf, 17 Steuer und
 * Förderung, 16 Bereinigung, 18 Zakat. Diese Seiten sind im XXL mit Beleg je Satz geprüft (MC7d8). Die Seite „Alle
 * Vergleiche“ bleibt draußen, ihre Zahlen sind überholt; ihre Links stehen auf Seite 1. Die alte Fußzeile wird
 * überdeckt und neu gesetzt, damit Name und Seitenzahl stimmen.
 */
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import kurse from "@/data/kurse.json";
import { bausteinById, SCHMERZ } from "@/data/portfolioPlan";
import {
  aufteilung,
  BEISPIEL,
  BROKER,
  euroText,
  inEuro,
  LAGEN,
  produktFuer,
  prozentText,
  type Antworten,
} from "@/data/portfolioQuiz";

const XXL = "/guides/finanzmuslim-xxl-guide-mt6puo.pdf";
/** Seiten im XXL, 1-basiert, in dieser Reihenfolge. */
const GEMEINSAM = [19, 17, 16, 18];

const BLAU = rgb(0, 0x57 / 255, 0xfa / 255);
const SCHWARZ = rgb(0.07, 0.09, 0.15);
const GRAU = rgb(0.42, 0.45, 0.5);
const HELL = rgb(0xeb / 255, 0xf2 / 255, 1);
const GRUEN = rgb(0.09, 0.5, 0.27);

const farbe = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/** Standardschriften kennen nur WinAnsi; was dort fehlt, wird ersetzt statt den Bau abzubrechen. */
const sauber = (t: string) =>
  t
    .replace(/\u00a0/g, " ")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[^\x20-\x7e\u00a0-\u00ff\u20ac\u2018\u2019\u201c\u201d\u201e\u2026]/g, "");

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

/** Ein Ringstück als SVG-Pfad (y nach unten, Mitte 0,0), Winkel im Uhrzeigersinn ab 12 Uhr. */
const ringStueck = (aussen: number, innen: number, von: number, bis: number) => {
  const p = (r: number, w: number) => `${(r * Math.sin(w)).toFixed(2)} ${(-r * Math.cos(w)).toFixed(2)}`;
  const gross = bis - von > Math.PI ? 1 : 0;
  return `M ${p(aussen, von)} A ${aussen} ${aussen} 0 ${gross} 1 ${p(aussen, bis)} L ${p(innen, bis)} A ${innen} ${innen} 0 ${gross} 0 ${p(innen, von)} Z`;
};

const fusszeile = (seite: PDFPage, font: PDFFont, nr: number) => {
  seite.drawText(sauber("finanzmuslim · Dein Halal-Portfolioplan"), { x: 48, y: 24, size: 9, font, color: GRAU });
  const t = `Seite ${nr}`;
  seite.drawText(t, { x: 547 - font.widthOfTextAtSize(t, 9), y: 24, size: 9, font, color: GRAU });
};

export const planPdfBytes = async (a: Antworten, xxl: ArrayBuffer | Uint8Array): Promise<Uint8Array> => {
  const doc = await PDFDocument.create();
  doc.setTitle("Dein Halal-Portfolioplan");
  doc.setAuthor("finanzmuslim");
  const normal = await doc.embedFont(StandardFonts.Helvetica);
  const fett = await doc.embedFont(StandardFonts.HelveticaBold);

  const seite = doc.addPage([594.96, 841.92]);
  const anteile = aufteilung(a);
  const betrag = a.betrag ?? 50;
  const euro = inEuro(anteile, betrag);
  const monatlich = a.weise !== "einmal";
  const broker = a.broker === "anderer" ? "dein Depot" : (BROKER.find((b) => b.id === a.broker)?.titel ?? "");
  const lage = LAGEN.find((l) => l.id === a.lage)?.titel ?? "";

  seite.drawText("finanzmuslim", { x: 48, y: 790, size: 14, font: fett, color: BLAU });
  seite.drawText("Dein Halal-Portfolioplan", { x: 48, y: 742, size: 30, font: fett, color: SCHWARZ });
  seite.drawText(
    sauber(`${broker}  ·  ${euroText(betrag)} ${monatlich ? "im Monat" : "einmal"}  ·  Geld gebraucht: ${lage.replace(/^In /, "in ")}`),
    { x: 48, y: 716, size: 12, font: normal, color: GRAU },
  );

  // Ring links
  const cx = 150;
  const cy = 560;
  let w = 0;
  const luecke = anteile.length > 1 ? 0.025 : 0;
  for (const x of anteile) {
    const breite = (x.prozent / 100) * Math.PI * 2;
    seite.drawSvgPath(ringStueck(96, 62, w + luecke / 2, w + breite - luecke / 2), {
      x: cx,
      y: cy,
      color: farbe(bausteinById(x.baustein).farbe),
      borderWidth: 0,
    });
    w += breite;
  }
  const mitte = euroText(betrag);
  seite.drawText(mitte, { x: cx - fett.widthOfTextAtSize(mitte, 22) / 2, y: cy - 2, size: 22, font: fett, color: SCHWARZ });
  const unter = monatlich ? "im Monat" : "einmal";
  seite.drawText(unter, { x: cx - normal.widthOfTextAtSize(unter, 11) / 2, y: cy - 20, size: 11, font: normal, color: GRAU });

  // Zeilen rechts
  let y = 660;
  anteile.forEach((x, i) => {
    const b = bausteinById(x.baustein);
    seite.drawCircle({ x: 284, y: y + 4, size: 5, color: farbe(b.farbe) });
    seite.drawText(sauber(b.name), { x: 296, y, size: 13, font: fett, color: SCHWARZ });
    const e = euroText(euro[i]);
    seite.drawText(sauber(e), { x: 547 - fett.widthOfTextAtSize(sauber(e), 13), y, size: 13, font: fett, color: SCHWARZ });
    const pz = `${x.prozent} %`;
    seite.drawText(pz, { x: 490 - normal.widthOfTextAtSize(pz, 10), y: y + 1, size: 10, font: normal, color: GRAU });
    const p = produktFuer(x.baustein, a.broker);
    y -= 15;
    const name = p ? p.anlage.name : (BEISPIEL[x.baustein] ?? "");
    for (const z of umbrechen(name, normal, 10, 250)) {
      seite.drawText(z, { x: 296, y, size: 10, font: normal, color: SCHWARZ });
      y -= 13;
    }
    if (p && (p.r1 !== undefined || p.r5 !== undefined)) {
      const r = [p.r1 !== undefined ? `1 Jahr ${prozentText(p.r1)}` : "", p.r5 !== undefined ? `5 Jahre ${prozentText(p.r5)}` : ""]
        .filter(Boolean)
        .join("   ");
      seite.drawText(sauber(r), { x: 296, y, size: 10, font: fett, color: GRUEN });
      y -= 13;
    }
    y -= 12;
  });

  // So machst du es
  y = Math.min(y, 430) - 10;
  seite.drawText("So machst du es", { x: 48, y, size: 16, font: fett, color: SCHWARZ });
  y -= 24;
  const anlagen = anteile
    .map((x, i) => ({ x, e: euro[i], p: produktFuer(x.baustein, a.broker) }))
    .filter((z) => z.p);
  const schritte = [
    `Öffne die App von ${broker === "dein Depot" ? "deinem Depot" : broker} und such die Anlage beim Namen.`,
    `${monatlich ? "Kauf jeden Monat" : "Kauf einmal"}: ${anlagen.map((z) => `${euroText(z.e)} ${z.p!.anlage.name}`).join(", ")}.${monatlich ? " Gibt es dafür einen Sparplan, läuft es von selbst." : ""}`,
  ];
  const konto = anteile.findIndex((x) => x.baustein === "konto");
  if (konto >= 0) schritte.push(`${euroText(euro[konto])} bleiben auf deinem Girokonto. Achte darauf, dass es dir keine Zinsen zahlt.`);
  if (anteile.some((x) => x.baustein === "aktien")) schritte.push("Einzelaktien prüfst du einzeln, zum Beispiel mit Zoya oder Musaffa.");
  schritte.forEach((s, i) => {
    seite.drawCircle({ x: 56, y: y + 4, size: 8, color: SCHWARZ });
    const n = String(i + 1);
    seite.drawText(n, { x: 56 - fett.widthOfTextAtSize(n, 10) / 2, y: y + 0.5, size: 10, font: fett, color: rgb(1, 1, 1) });
    for (const z of umbrechen(s, normal, 12, 470)) {
      seite.drawText(z, { x: 74, y, size: 12, font: normal, color: SCHWARZ });
      y -= 16;
    }
    y -= 6;
  });

  // Girokonto
  y -= 8;
  const kastenH = 92;
  seite.drawRectangle({ x: 48, y: y - kastenH + 14, width: 499, height: kastenH, color: HELL });
  seite.drawText("Fehlt noch: dein Girokonto ohne Zinsen", { x: 64, y: y - 8, size: 14, font: fett, color: SCHWARZ });
  let gy = y - 28;
  for (const z of umbrechen(`${SCHMERZ.girokonto} ${SCHMERZ.muslim}`, normal, 12, 460)) {
    seite.drawText(z, { x: 64, y: gy, size: 12, font: normal, color: SCHWARZ });
    gy -= 16;
  }
  seite.drawText("Die besten ohne Zinsen: finanzmuslim.com/vergleich/girokonto", { x: 64, y: gy - 2, size: 12, font: fett, color: BLAU });

  // Alle Vergleiche
  const vy = 92;
  seite.drawText(sauber("Alle Vergleiche: finanzmuslim.com/vergleich/depot  ·  /gold  ·  /girokonto"), {
    x: 48,
    y: vy,
    size: 10,
    font: normal,
    color: GRAU,
  });
  for (const [i, z] of umbrechen(
    `Ein Beispiel aus deinen Antworten, keine Anlageberatung. Wie es früher lief, ist keine Garantie für später. Renditen in Euro, Stand ${(kurse as { stand: string }).stand}. Alle Anlagen aus der Halal-Datenbank auf finanzmuslim.com.`,
    normal,
    9,
    499,
  ).entries()) {
    seite.drawText(z, { x: 48, y: 70 - i * 12, size: 9, font: normal, color: GRAU });
  }
  fusszeile(seite, normal, 1);

  // Gemeinsamer Teil aus dem Blueprint
  const quelle = await PDFDocument.load(xxl);
  const kopiert = await doc.copyPages(quelle, GEMEINSAM.map((n) => n - 1));
  kopiert.forEach((p, i) => {
    doc.addPage(p);
    p.drawRectangle({ x: 40, y: 16, width: 515, height: 22, color: rgb(1, 1, 1) });
    fusszeile(p, normal, i + 2);
  });

  return doc.save();
};

export const planPdf = async (a: Antworten) => {
  const xxl = await fetch(XXL).then((r) => r.arrayBuffer());
  const bytes = await planPdfBytes(a, xxl);
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "finanzmuslim-portfolioplan.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};
