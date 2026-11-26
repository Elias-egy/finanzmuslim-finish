import type { ReactNode } from "react";
import { girokontoAnzeige } from "@/data/anzeige/girokonto";
import { GIRO_FINANZ_MAX } from "@/data/finanzMax";
import { kostenKurz } from "@/data/kostenKurz";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { zinsHinweis } from "@/data/zinsHinweise";
import { auslandWerte } from "@/data/girokontoAusland";
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
/** „Konten im Test“: die drei vorn, aus der laufenden Rangfolge (PH2-01, 15.11.2026), nie von Hand eingetragen. */
export const giroTop3 = giroReihe.slice(0, 3);
export const giroSiegerId = sieger?.id ?? null;
// Seit VG2-04 (Regel 10) stehen auch Angebote mit belegtem, nicht abschaltbarem Zins auf der Liste, ganz hinten. Offen heißt: kein Beleg, kein Urteil.
const zins = (a: RohAnbieter) => a.werte.zinsfreiAbStart;
export const giroAbgeraten = rang.gerankt
  .filter((b) => zins(b.anbieter) === "schlecht")
  .map((b) => ({ anbieter: b.anbieter, grund: "Zinsen nicht abschaltbar" }));
export const giroOffen = rang.gerankt.filter((b) => zins(b.anbieter) !== "gut" && zins(b.anbieter) !== "teils" && zins(b.anbieter) !== "schlecht").length;
export const giroAnzahl = girokontoAnzeige.length;
export const giroOhneZinsen = rang.gerankt.filter((b) => zins(b.anbieter) === "gut" || zins(b.anbieter) === "teils").length;

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

/**
 * Der Text je Konto, je Satz ein Absatz (SEO86 reviewer, am Handy höchstens vier Zeilen): was du für null Zinsen tust und das Wichtigste
 * zum Dispo. Kontoführung und Karten stehen in der Häkchenliste und in der Kostentabelle und fallen aus dem Absatz.
 */
export const kontoText = (a: RohAnbieter): string[] => {
  const dispo =
    a.werte.keinDispoAbStart === "gut"
      ? "Ein Dispo wird dir nach der Eröffnung nicht eingeräumt."
      : a.werte.keinDispoAbStart === "teils"
        ? "Der Dispo wird dir ab Start eingeräumt und lässt sich abschalten."
        : "";
  return [zinsHinweis("girokonto", a) ?? "", dispo].filter((s): s is string => s !== "");
};

/**
 * Gebühren im Ausland eines Kontos als Satz, für die Porträts: Abheben im Euro-Ausland, Abheben in Fremdwährung, Bezahlen in
 * Fremdwährung. Die Werte stammen aus dem Finanzfluss-Vergleich (Stand 19.09.2026), dieselben wie in der Tabelle und in der Note.
 */
export const auslandSatz = (a: RohAnbieter): string | null => {
  const w = auslandWerte(a);
  if (!w) return null;
  if (w.every((x) => /^0\s*[€%]$/.test(x))) return "Im Ausland kosten Abheben und Bezahlen nichts, auch nicht in Fremdwährung.";
  return `Im Ausland kostet Abheben im Euro-Raum ${w[0]}, Abheben in Fremdwährung ${w[1]} und Bezahlen in Fremdwährung ${w[2]}.`;
};

/** Konten der Tabelle „Geld abheben im Ausland“: die fünf vorn, dazu bis zu zwei weitere aus den ersten fünfzehn, die im Ausland etwas kosten. */
export const giroAuslandListe: RohAnbieter[] = [
  ...giroVorn,
  ...giroReihe
    .slice(5, 15)
    .filter((a) => (auslandWerte(a) ?? []).some((x) => !/^0\s*[€%]$/.test(x)))
    .slice(0, 2),
];

/** Zeilen der Tabelle „Geld abheben im Ausland“: Konto und die drei Gebühren. `name` setzt den Namen der Zeile (Standard Text, in der Seite ein Partnerlink). */
export const auslandZeilen = (
  liste: RohAnbieter[],
  name: (a: RohAnbieter) => ReactNode = (a) => `${a.name} ${a.produkt}`,
): ReactNode[][] =>
  liste.flatMap((a) => {
    const w = auslandWerte(a);
    return w ? [[name(a), w[0], w[1], w[2]]] : [];
  });

/** Konten mit Kontoführung ohne Bedingung kostenlos, in der Reihenfolge der Rangfolge. */
const gratisKonten = giroReihe.filter(kontofuehrungGratis);

/**
 * PH1 (15.11.2026, Elias: „Girokonto … als SEO-Beitrag extrem gut“, Finanzfluss 1:1): Abschnitte, die Finanzfluss im
 * Girokonto-Vergleich hat und die unsere Daten tragen. Nebenwörter aus Ahrefs (31.10. und 15.11.) und Google-Vorschlägen:
 * kostenloses girokonto ohne mindesteingang, girokonto für junge leute (unter 30), girokonto ohne zinsen, ohne dispo,
 * girokonto wechseln, girokonto eröffnen.
 */

/** Kostenlos ohne Bedingung, also ohne Mindesteingang und ohne Altersgrenze; höchstens fünf. */
export const giroOhneMindesteingang = gratisKonten.slice(0, 5);
export const giroOhneMindesteingangAnzahl = gratisKonten.length;

/** Altersgrenze aus der Kontoführung, etwa „unter 30“ oder „unter 31“. */
export const altersGrenze = (a: RohAnbieter): number | null => {
  const m = /unter (\d{2})/.exec(text(a, "kontofuehrung"));
  return m ? Number(m[1]) : null;
};
/** Mindesteingang in Euro aus der Kontoführung, etwa „ab 500 € Geldeingang“. */
export const mindestEingang = (a: RohAnbieter): string | null => {
  const m = /ab ([\d.]+) ?€ Geldeingang/.exec(text(a, "kontofuehrung"));
  return m ? `${m[1]} €` : null;
};
/** Was die Kontoführung ohne Bedingung kostet, etwa „sonst 3,90 €“. */
export const sonstPreis = (a: RohAnbieter): string | null => {
  const m = /sonst ([\d,]+) ?€/.exec(text(a, "kontofuehrung"));
  return m ? `${m[1]} €` : null;
};

/** Konten vorn im Vergleich, die für junge Leute ohne Geldeingang kostenlos sind. */
export const giroJung = giroReihe.filter((a) => altersGrenze(a) !== null).slice(0, 5);

/** Konten vorn im Vergleich mit Girocard und Debitkarte, beide 0 €. */
export const giroBeideKarten = giroReihe.filter(
  (a) => a.werte.karteOhneKredit === "gut" && gratis(text(a, "girocard")) && /,\s?0\s?€$/.test(text(a, "debitkarte")),
);

export const giroMitWechsel = girokontoAnzeige.filter((a) => a.werte.kontowechsel === true).length;
export const giroOhneDispo = girokontoAnzeige.filter((a) => a.werte.keinDispoAbStart === "gut").length;

/** Ident-Verfahren der Konten vorn, ohne Doppel, in der Folge ihres ersten Auftretens. */
export const giroIdents = Array.from(
  new Set(giroVorn.flatMap((a) => text(a, "ident").split(",").map((s) => s.trim()).filter(Boolean))),
);

/** Merkmale eines Kontos, die ein Leser sofort versteht, aus den Daten: für den Sieger-Satz und das Fazit. */
export const giroMerkmale = (a: RohAnbieter): string[] =>
  [
    a.werte.zinsfreiAbStart === "gut" ? "ohne Zinsen nutzbar" : "",
    a.werte.keinDispoAbStart === "gut" ? "kein Dispo ab Start" : "",
    a.werte.karteOhneKredit === "gut" ? "die Karte ohne Kredit" : "",
  ].filter(Boolean);

/** Der Sieger-Satz für den Anfang des Ratgebers, nie von Hand. Ohne Sieger kein Satz. */
export const giroSiegerSatz = (): string | null => {
  const a = giroVorn.find((x) => x.id === giroSiegerId);
  if (!a) return null;
  const m = giroMerkmale(a);
  const liste = m.length > 1 ? `${m.slice(0, -1).join(", ")} und ${m[m.length - 1]}` : (m[0] ?? "");
  return `In unserem Vergleich liegt ${a.name} vorn${liste ? `: ${liste}` : ""}.`;
};

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
  f.push({
    frage: "Gibt es Girokonten ohne Dispo?",
    antwort: `Bei ${giroOhneDispo} der ${giroAnzahl} Konten in unserem Vergleich wird dir nach der Eröffnung kein Dispo eingeräumt. Bei den übrigen lässt er sich abschalten.`,
  });
  // Quelle (SEO86, MUSS 6): ~/hourani/positionen/bankkonten.md, ilmCast Ep. 13, 00:16:41 („Deswegen ist die Dispo eine große Falle, eine Rieberfalle, nicht nur,
  // weil es haram ist.“); ~/hourani/positionen/schulden.md, Ep. 13, 00:19:48 („rufst bei der Bank an und sagst, ich möchte diesen Dispo-Kredit kündigen“), 00:20:49
  // („Also wichtig ist, dass man das aktiv bei der Bank kündigt.“), 00:20:56 bis 00:21:01 („sondern kündigen, damit du deiner Neffs gar nicht mehr die Möglichkeit
  // gibst, wieder in dieses Minus reinzugehen.“). Hourani wird im Lesetext einmal vorgestellt, Folge und Zeitmarke stehen nur hier. Die frühere zweite Frage
  // „Reicht es, den Dispo nicht zu nutzen?“ ist hier eingearbeitet; was Hourani dort nicht beantwortet, steht nirgends als Tatsache im Text.
  f.push({
    frage: "Ist ein Dispokredit haram?",
    antwort:
      "Der Dispo ist ein Kredit: Sobald du dein Konto überziehst, zahlst du Zinsen, und Zinsen meidest du als Muslim. Sheikh Ibrahim Hourani rät, einen Dispo nicht nur auf null zu bringen, sondern bei der Bank zu kündigen, damit du dir nicht die Möglichkeit gibst, wieder ins Minus zu gehen. Darum ist ein Konto ohne Dispo ab Start die sichere Wahl.",
  });
  if (giroOhneMindesteingang.length >= 2) {
    const namen = giroOhneMindesteingang.slice(0, 3).map((a) => a.name);
    f.push({
      frage: "Gibt es ein kostenloses Girokonto ohne Mindesteingang?",
      antwort: `Ja. Bei ${giroOhneMindesteingangAnzahl} Konten ohne Zinsen kostet die Kontoführung 0 €, egal wie viel Geld eingeht, zum Beispiel bei ${namen.slice(0, -1).join(", ")} und ${namen[namen.length - 1]}. Bei vielen anderen gilt 0 € erst ab einem monatlichen Geldeingang: Die Tabelle nennt die Bedingung beim Konto.`,
    });
  }
  // SEO86 (A14, höchstens 10 Fragen): „Welches Girokonto lohnt sich im Vergleich?“ (doppelt zu „Welches ist das beste“), „Bei welcher Bank zahlt man die
  // wenigsten Kontoführungsgebühren?“ (jetzt in der Frage zu Mindesteingang), „Was muss man beim Girokonto-Wechsel beachten?“ und „Wie eröffne ich ein
  // Girokonto?“ (stehen als Abschnitte im Ratgeber) fielen weg.
  return f;
};
