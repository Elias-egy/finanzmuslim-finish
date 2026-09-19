import { describe, expect, it } from "vitest";
import { bewerte } from "@/lib/bewertung";
import { ampelGut, euro, finanzNote, mindestensEins, RANGFOLGE_FREI, werteAus, type Auswahl } from "@/lib/vergleichAssistent";
import { auswahlAus, ziele, type Antworten } from "@/data/vergleichAssistent";
import type { RohAnbieter } from "@/data/vergleichHelfer";

const MAX = { gebuehren: 100, sicherheit: 50 };

const krypto = (id: string, werte: RohAnbieter["werte"], punkte = { gebuehren: 50, sicherheit: 25 }, link?: string): RohAnbieter => ({
  id,
  name: id,
  produkt: "Test",
  link,
  werte: { zinsfreiAbStart: "gut", echteCoins: "gut", eigeneWallet: "gut", zinsfreiesModell: "gut", ...werte },
  finanzPunkte: punkte,
});

const leer: Auswahl = { wuensche: [], gewichte: [] };
const wallet: Auswahl = { wuensche: [{ id: "wallet", label: "Wallet", pruefe: ampelGut("eigeneWallet") }], gewichte: [] };

describe("geführter Vergleich", () => {
  it("zeigt die Rangfolge noch nicht, bis Elias sie freischaltet", () => {
    expect(RANGFOLGE_FREI).toEqual({ depot: false, girokonto: false, krypto: false });
  });

  it("empfiehlt nie einen Anbieter, dessen Zinsen sich nicht abschalten lassen", () => {
    const liste = [krypto("rot", { zinsfreiAbStart: "schlecht" }, { gebuehren: 100, sicherheit: 50 }), krypto("gruen", {})];
    for (const frei of [false, true]) {
      const e = werteAus(liste, "krypto", MAX, leer, frei);
      expect([...e.passt, ...e.ungeprueft].map((t) => t.anbieter.id)).toEqual(["gruen"]);
      expect(e.raus).toBe(1);
    }
  });

  it("lässt einen unbekannten Wert nie als erfüllt gelten", () => {
    const liste = [krypto("unbekannt", { eigeneWallet: null }), krypto("status-unbekannt", { eigeneWallet: "unbekannt" }), krypto("ja", {}), krypto("nein", { eigeneWallet: "schlecht" })];
    const e = werteAus(liste, "krypto", MAX, wallet, false);
    expect(e.passt.map((t) => t.anbieter.id)).toEqual(["ja"]);
    expect(e.ungeprueft.map((t) => t.anbieter.id).sort()).toEqual(["status-unbekannt", "unbekannt"]);
    expect(e.raus).toBe(1);
  });

  it("stellt einen ungeprüften Türsteher nicht unter die passenden", () => {
    const e = werteAus([krypto("offen", { zinsfreiAbStart: null })], "krypto", MAX, leer, false);
    expect(e.passt).toHaveLength(0);
    expect(e.ungeprueft).toHaveLength(1);
  });

  it("ändert nichts, wenn nur der Partnerlink dazukommt", () => {
    const ohne = [krypto("a", {}, { gebuehren: 80, sicherheit: 10 }), krypto("b", {}, { gebuehren: 60, sicherheit: 50 })];
    const mit = [krypto("a", {}, { gebuehren: 80, sicherheit: 10 }), krypto("b", {}, { gebuehren: 60, sicherheit: 50 }, "/out/b")];
    for (const frei of [false, true]) {
      const x = werteAus(ohne, "krypto", MAX, leer, frei);
      const y = werteAus(mit, "krypto", MAX, leer, frei);
      expect(y.passt.map((t) => [t.anbieter.id, t.sortWert, t.note])).toEqual(x.passt.map((t) => [t.anbieter.id, t.sortWert, t.note]));
    }
  });

  it("liefert bei gleichen Antworten dieselbe Reihenfolge, egal wie die Liste sortiert ist", () => {
    const liste = [krypto("c", {}), krypto("a", {}), krypto("b", {})];
    const vor = werteAus(liste, "krypto", MAX, leer, true).passt.map((t) => t.anbieter.id);
    const zurueck = werteAus([...liste].reverse(), "krypto", MAX, leer, true).passt.map((t) => t.anbieter.id);
    expect(vor).toEqual(["a", "b", "c"]);
    expect(zurueck).toEqual(vor);
  });

  it("bleibt ohne Freischaltung und ohne Priorität alphabetisch und zeigt keine Note", () => {
    const liste = [krypto("z", {}, { gebuehren: 100, sicherheit: 50 }), krypto("a", {}, { gebuehren: 0, sicherheit: 0 })];
    const e = werteAus(liste, "krypto", MAX, leer, false);
    expect(e.passt.map((t) => t.anbieter.id)).toEqual(["a", "z"]);
    expect(e.passt.every((t) => t.note === null)).toBe(true);
    expect(e.gerankt).toBe(false);
  });

  it("sortiert ohne Freischaltung nach der gewählten Priorität", () => {
    const liste = [krypto("teuer-sicher", {}, { gebuehren: 10, sicherheit: 50 }), krypto("guenstig", {}, { gebuehren: 90, sicherheit: 0 })];
    const kosten: Auswahl = { ...leer, prioritaet: { id: "k", label: "Kosten", gewichte: { gebuehren: 2 }, fakten: [] } };
    expect(werteAus(liste, "krypto", MAX, kosten, false).passt[0].anbieter.id).toBe("guenstig");
  });

  it("rechnet ohne Gewichte dieselbe Finanznote wie bewerte()", () => {
    const a = krypto("a", {}, { gebuehren: 70, sicherheit: 20 });
    const b = bewerte(a, "krypto", MAX);
    expect(b.status).toBe("bewertet");
    if (b.status === "bewertet") expect(finanzNote(a, MAX, [])).toBeCloseTo(b.finanz, 2);
  });

  it("verschiebt mit Gewichten die Rangfolge, aber nicht die Halal-Note", () => {
    const liste = [krypto("guenstig", {}, { gebuehren: 100, sicherheit: 0 }), krypto("sicher", {}, { gebuehren: 40, sicherheit: 50 })];
    const sicherheit: Auswahl = { ...leer, prioritaet: { id: "s", label: "Sicherheit", gewichte: { sicherheit: 5 }, fakten: [] } };
    const ohne = werteAus(liste, "krypto", MAX, leer, true);
    const mit = werteAus(liste, "krypto", MAX, sicherheit, true);
    expect(ohne.passt[0].anbieter.id).toBe("guenstig");
    expect(mit.passt[0].anbieter.id).toBe("sicher");
    expect(mit.passt.map((t) => t.note!.halal)).toEqual([5, 5]);
  });

  it("nimmt mit Freischaltung nur fertig bewertete Anbieter in die Rangfolge", () => {
    const liste = [krypto("fertig", {}), krypto("luecke", { zinsfreiesModell: null }, { gebuehren: 100, sicherheit: 50 })];
    const e = werteAus(liste, "krypto", MAX, leer, true);
    expect(e.passt.map((t) => t.anbieter.id)).toEqual(["fertig"]);
    expect(e.ungeprueft.map((t) => t.anbieter.id)).toEqual(["luecke"]);
  });

  it("liest Beträge und Mindestangaben richtig", () => {
    expect(euro("0€")).toBe(0);
    expect(euro("4,90€ + 0,25%")).toBe(4.9);
    expect(euro("kostenlos")).toBeNull();
    const a = krypto("a", { halalSukuk: "mind. 1 von 3", halalEtfsFonds: "0 von 12", halalEdelmetalle: null });
    expect(mindestensEins("halalSukuk")(a)).toBe(true);
    expect(mindestensEins("halalEtfsFonds")(a)).toBe(false);
    expect(mindestensEins("halalEdelmetalle")(a)).toBeNull();
  });
});

describe("Fragen zeigen nur auf Felder, die es gibt", () => {
  for (const ziel of ziele) {
    if (ziel.art !== "fragen") continue;
    it(ziel.titel, () => {
      const zeilenKeys = new Set(ziel.zeilen.map((z) => z.key));
      for (const frage of ziel.fragen) {
        for (const antwort of frage.antworten) {
          for (const k of Object.keys(antwort.gewichte ?? {})) expect(ziel.finanzMax, `${frage.id}/${antwort.id}`).toHaveProperty(k);
          for (const k of Object.keys(antwort.prioritaet?.gewichte ?? {})) expect(ziel.finanzMax, `${frage.id}/${antwort.id}`).toHaveProperty(k);
          for (const k of antwort.prioritaet?.fakten ?? []) expect(zeilenKeys.has(k), `${frage.id}/${antwort.id}: ${k}`).toBe(true);
          // Jeder Wunsch muss bei mindestens einem echten Anbieter erfüllt sein, sonst zeigt er ins Leere.
          for (const w of antwort.wuensche ?? []) expect(ziel.anbieter.some((a) => w.pruefe(a) === true), `${frage.id}/${w.id}`).toBe(true);
        }
      }
    });

    it(`${ziel.titel}: jede Antwortkombination der Kernfragen rechnet durch`, () => {
      const kern = ziel.fragen.filter((f) => !f.vertiefung);
      const kombis = kern.reduce<Antworten[]>((acc, f) => acc.flatMap((k) => f.antworten.map((a) => ({ ...k, [f.id]: [a.id] }))), [{}]);
      for (const k of kombis) {
        const e = werteAus(ziel.anbieter, ziel.id, ziel.finanzMax, auswahlAus(ziel.fragen, k));
        expect(e.passt.length + e.ungeprueft.length + e.raus).toBe(ziel.anbieter.length);
        expect([...e.passt, ...e.ungeprueft].some((t) => t.anbieter.abgeraten)).toBe(false);
      }
    });
  }
});
