import { girokontoAnzeige } from "@/data/anzeige/girokonto";
import { GIRO_FINANZ_MAX } from "@/data/finanzMax";
import { kostenKurz } from "@/data/kostenKurz";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { zinsHinweis } from "@/data/zinsHinweise";
import { rangfolge } from "@/lib/rangfolge";
import { siegerDerSeite } from "@/lib/vergleichAssistent";

/**
 * Der Blogteil unter dem Girokonto-Vergleich, gebaut wie der Depot-Teil (`depotRatgeber.ts`), den Elias an Finanzfluss
 * ausgerichtet hat (RN1, 12.11.2026: „wie beim Depot, guck 1:1, wie es Finanzfluss gemacht hat“). Jeder Satz entsteht aus
 * denselben Daten wie die Tabelle und nennt nie einen Platz: Ändert sich die Rangfolge, ziehen Reihenfolge, Überschriften
 * und Texte mit. Nichts ist geschätzt; was nicht belegt ist, steht nicht da.
 */

const rang = rangfolge(girokontoAnzeige, "girokonto", { finanzMax: GIRO_FINANZ_MAX });
const sieger = siegerDerSeite(girokontoAnzeige, "girokonto", GIRO_FINANZ_MAX);

/** Reihenfolge wie in der Tabelle: die Nummer 1 zuerst, dann nach Platz. */
export const giroReihe: RohAnbieter[] = [
  ...(sieger ? [sieger] : []),
  ...rang.gerankt.map((b) => b.anbieter).filter((a) => a.id !== sieger?.id),
];
export const giroVorn = giroReihe.slice(0, 5);
export const giroSiegerId = sieger?.id ?? null;
export const giroAbgeraten = rang.abgeraten;
export const giroAnzahl = girokontoAnzeige.length;
export const giroOhneZinsen = rang.gerankt.length;

const text = (a: RohAnbieter, key: string) => String(a.werte[key] ?? "").trim();
/** „0 €“ und „0€“ sind dasselbe: Kontoführung ohne Bedingung kostenlos. */
const gratis = (wert: string) => /^0\s?€$/.test(wert);
export const kontofuehrung = (a: RohAnbieter) => kostenKurz(a.id, "kontofuehrung") ?? text(a, "kontofuehrung");
export const kontofuehrungGratis = (a: RohAnbieter) => gratis(text(a, "kontofuehrung"));
const keineAngabe = (wert: string) => wert === "" || wert === "–";

export type Nachteil = { art: "girocard" | "debitkarte" | "einzahlen"; text: string };

/** Höchstens ein Nachteil, in fester Folge: Girocard kostet, Debitkarte kostet, Bargeld einzahlen nicht möglich. Ohne Treffer kein Kreuz. */
export const nachteil = (a: RohAnbieter): Nachteil | null => {
  const gc = text(a, "girocard");
  if (/^\d/.test(gc) && !gratis(gc)) return { art: "girocard", text: `Girocard kostet ${gc.replace(/€$/, " €")} im Monat` };
  const dk = text(a, "debitkarte");
  const preis = /([\d.,]+\s?€)\s*$/.exec(dk)?.[1];
  if (preis && !gratis(preis)) return { art: "debitkarte", text: `Debitkarte kostet ${preis.replace(/€$/, " €").replace(/\s+€/, " €")} im Monat` };
  if (text(a, "bargeldEinzahlen") === "nicht möglich") return { art: "einzahlen", text: "Bargeld einzahlen nicht möglich" };
  return null;
};

export const vorteile = (a: RohAnbieter): Array<{ text: string }> => {
  const p: Array<{ text: string }> = [];
  if (a.werte.zinsfreiAbStart === "gut") p.push({ text: "Ohne Zinsen nutzbar" });
  if (a.werte.keinDispoAbStart === "gut") p.push({ text: "Kein Dispo ab Start" });
  if (a.werte.karteOhneKredit === "gut") p.push({ text: "Karte ohne Kredit" });
  const kf = kontofuehrung(a);
  if (!keineAngabe(kf)) p.push({ text: kontofuehrungGratis(a) ? "Kostenlose Kontoführung" : `Kontoführung: ${kf}` });
  if (text(a, "abhebungen") === "Unbegrenzt") p.push({ text: "Unbegrenzt kostenlos Bargeld abheben" });
  if (a.werte.applePay === true) p.push({ text: "Apple Pay oder Google Pay" });
  return p;
};

/** Der Text je Konto: was du für null Zinsen tust, was dazugehört, was es kostet. */
export const kontoText = (a: RohAnbieter): string[] => {
  const dispo =
    a.werte.keinDispoAbStart === "gut"
      ? "Ein Dispo wird dir nach der Eröffnung nicht eingeräumt."
      : a.werte.keinDispoAbStart === "teils"
        ? "Der Dispo wird dir ab Start eingeräumt und lässt sich abschalten."
        : "";
  const kf = kontofuehrung(a);
  const karten = [
    text(a, "girocard") ? `Girocard: ${text(a, "girocard")}` : "",
    text(a, "debitkarte") ? `Debitkarte: ${text(a, "debitkarte")}` : "",
  ].filter(Boolean);
  const kosten = keineAngabe(kf) ? "" : `Kontoführung im Monat: ${kf}.${karten.length ? ` ${karten.join(". ")}.` : ""}`;
  return [zinsHinweis("girokonto", a) ?? "", dispo, kosten].filter((s): s is string => s !== "");
};

/** Konten mit Kontoführung ohne Bedingung kostenlos, in der Reihenfolge der Rangfolge. */
const gratisKonten = giroReihe.filter(kontofuehrungGratis);

const halalSatz = (a: RohAnbieter) =>
  [
    zinsHinweis("girokonto", a),
    a.werte.keinDispoAbStart === "gut" ? "Ein Dispo wird dir nach der Eröffnung nicht eingeräumt." : "",
    a.werte.karteOhneKredit === "gut" ? "Die Standardkarte kommt ohne Kreditrahmen." : "",
  ]
    .filter(Boolean)
    .join(" ");

export const giroFragen = (): Array<{ frage: string; antwort: string }> => {
  const f: Array<{ frage: string; antwort: string }> = [];
  const eins = giroVorn[0];
  if (eins) {
    const merkmale = [
      eins.werte.zinsfreiAbStart === "gut" ? "ohne Zinsen nutzbar" : "",
      eins.werte.keinDispoAbStart === "gut" ? "kein Dispo ab Start" : "",
      eins.werte.karteOhneKredit === "gut" ? "Karte ohne Kredit" : "",
    ].filter(Boolean);
    f.push({
      frage: "Welches ist das beste Girokonto für Muslime?",
      antwort: `In unserem Vergleich liegt ${eins.name} vorn${merkmale.length ? `: ${merkmale.join(", ")}` : ""}. Welches Konto zu dir passt, hängt auch davon ab, ob du Bargeld einzahlen willst, eine Filiale brauchst oder mit Apple Pay zahlst. Die Tabelle oben zeigt alle ${giroAnzahl} Konten.`,
    });
  }
  f.push({
    frage: "Was ist ein halal Girokonto?",
    antwort: `Ein Girokonto ist nicht von sich aus halal. Es zählt, ob dein Guthaben ohne Zinsen liegt, ob dir kein Dispo ab Start eingeräumt wird und ob die Karte ohne Kredit kommt. Von den ${giroAnzahl} Konten in unserem Vergleich kannst du ${giroOhneZinsen} ohne Zinsen nutzen.`,
  });
  for (const id of ["norisbank-top-girokonto", "bbbank-bettersmart"]) {
    const a = girokontoAnzeige.find((x) => x.id === id);
    if (!a) continue;
    f.push({
      frage: `Ist ${a.name} halal?`,
      antwort: ["Ob ein Konto halal ist, hängt davon ab, ob dein Guthaben Zinsen bringt, ob dir ein Dispo eingeräumt wird und ob die Karte ohne Kredit kommt.", `Bei ${a.name}: ${halalSatz(a)}`].join(" "),
    });
  }
  f.push({
    frage: "Muss ich das Tagesgeld nutzen, das mit dem Konto kommt?",
    antwort:
      "Nein. Oft legt die Bank mit dem Girokonto ein Tagesgeld an. Zinsen gibt es nur auf Geld, das du dort einzahlst: Ignoriere das Tagesgeld und zahle nichts ein.",
  });
  const ohneDispo = girokontoAnzeige.filter((a) => a.werte.keinDispoAbStart === "gut").length;
  f.push({
    frage: "Gibt es Girokonten ohne Dispo?",
    antwort: `Bei ${ohneDispo} der ${giroAnzahl} Konten in unserem Vergleich wird dir nach der Eröffnung kein Dispo eingeräumt. Bei den übrigen lässt er sich abschalten.`,
  });
  if (gratisKonten.length >= 2) {
    const namen = gratisKonten.slice(0, 3).map((a) => a.name);
    f.push({
      frage: "Bei welcher Bank zahlt man die wenigsten Kontoführungsgebühren?",
      antwort: `Bei ${gratisKonten.length} der ${giroAnzahl} Konten kostet die Kontoführung ohne Bedingung 0 €, zum Beispiel bei ${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}. Bei vielen anderen gilt 0 € erst ab einem monatlichen Geldeingang: Die Tabelle nennt die Bedingung beim Konto.`,
    });
  }
  const wechsel = girokontoAnzeige.filter((a) => a.werte.kontowechsel === true).length;
  f.push({
    frage: "Was muss man beim Girokonto-Wechsel beachten?",
    antwort: `Bei ${wechsel} der ${giroAnzahl} Konten gibt es einen Kontowechsel-Service, der dir den Umzug abnimmt. Ändere regelmäßige Lastschriften und den Gehaltseingang auf das neue Konto, bevor du das alte schließt.`,
  });
  f.push({
    frage: "Wie eröffne ich ein Girokonto?",
    antwort:
      "Du eröffnest das Konto online beim Anbieter und bestätigst deinen Ausweis, je nach Bank per Video-Ident, Post-Ident oder E-Ident. Was du tun musst, damit keine Zinsen anfallen, steht oben bei jedem Konto.",
  });
  return f;
};
