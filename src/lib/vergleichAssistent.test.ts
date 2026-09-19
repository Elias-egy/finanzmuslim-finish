import { describe, expect, it } from "vitest";
import { bewerte } from "@/lib/bewertung";
import { ampelGut, euro, finanzNote, mindestensEins, RANGFOLGE_FREI, werteAus, type Auswahl } from "@/lib/vergleichAssistent";
import { aktiveFragen, auswahlAus, bausteine, fragen, type Antworten, type BausteinId, type Wirkung } from "@/data/vergleichAssistent";
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

const baustein = (id: BausteinId) => bausteine.find((b) => b.id === id)!;

describe("Fragen zeigen nur auf Felder, die es gibt", () => {
  for (const frage of fragen) {
    it(frage.id, () => {
      for (const antwort of frage.antworten) {
        const wirkungen: [BausteinId, Wirkung][] = [
          ...(frage.fuer === "start" ? [] : ([[frage.fuer, antwort]] as [BausteinId, Wirkung][])),
          ...(Object.entries(antwort.auch ?? {}) as [BausteinId, Wirkung][]),
        ];
        for (const [id, w] of wirkungen) {
          const b = baustein(id);
          const zeilenKeys = new Set(b.zeilen.map((z) => z.key));
          const wo = `${frage.id}/${antwort.id} -> ${id}`;
          for (const k of Object.keys(w.gewichte ?? {})) expect(b.finanzMax, wo).toHaveProperty(k);
          for (const k of Object.keys(w.prioritaet?.gewichte ?? {})) expect(b.finanzMax, wo).toHaveProperty(k);
          for (const k of w.prioritaet?.fakten ?? []) expect(zeilenKeys.has(k), `${wo}: ${k}`).toBe(true);
          // Jeder Wunsch muss bei mindestens einem echten Anbieter erfüllt sein, sonst zeigt er ins Leere.
          for (const wunsch of w.wuensche ?? []) expect(b.anbieter.some((a) => wunsch.pruefe(a) === true), `${wo}: ${wunsch.id}`).toBe(true);
          // Ein Grund muss bei mindestens einem Anbieter einen Satz liefern.
          if (w.grund) expect(b.anbieter.some((a) => !!w.grund!(a)), `${wo}: grund`).toBe(true);
        }
      }
    });
  }

  it("Bausteine zeigen nur Zeilen, die es gibt", () => {
    for (const b of bausteine) for (const k of b.fakten) expect(b.zeilen.some((z) => z.key === k), `${b.id}: ${k}`).toBe(true);
  });
});

describe("Ablauf und Paket", () => {
  const ids = (a: Antworten, tief = false) => aktiveFragen(a, tief).map((f) => f.id);
  const aktiv = (a: Antworten) => bausteine.filter((b) => b.aktiv(a)).map((b) => b.id);

  it("fragt nur, was zum Vorhaben gehört", () => {
    expect(ids({})).toEqual(["vorhaben"]);
    expect(ids({ vorhaben: ["konto"] })).toEqual(["vorhaben", "kontoPreis", "alltag", "kontoWichtig"]);
    expect(ids({ vorhaben: ["steuer"] })).toEqual(["vorhaben", "steuerLage"]);
    expect(ids({ vorhaben: ["anlegen"] })).toEqual(["vorhaben", "betrag", "dauer", "bestimmtes", "region", "wichtig"]);
  });

  it("stellt Folgefragen erst nach der passenden Antwort", () => {
    const nurGold: Antworten = { vorhaben: ["anlegen"], bestimmtes: ["metalle"] };
    expect(ids(nurGold)).not.toContain("region");
    const nurKrypto: Antworten = { vorhaben: ["anlegen"], bestimmtes: ["krypto"] };
    expect(ids(nurKrypto)).toContain("wallet");
    expect(ids(nurKrypto)).not.toContain("dauer");
    expect(ids(nurKrypto, true)).toContain("mussKrypto");
    expect(ids(nurKrypto, true)).not.toContain("mussDepot");
  });

  it("baut das Paket aus den Antworten", () => {
    expect(aktiv({ vorhaben: ["anlegen"] })).toEqual(["depot"]);
    expect(aktiv({ vorhaben: ["anlegen"], bestimmtes: ["aktien"] })).toEqual(["depot", "screener"]);
    expect(aktiv({ vorhaben: ["anlegen"], bestimmtes: ["krypto"] })).toEqual(["krypto"]);
    expect(aktiv({ vorhaben: ["anlegen", "konto", "steuer"], bestimmtes: ["etfs", "krypto"] })).toEqual(["depot", "krypto", "girokonto", "steuer"]);
  });

  it("vergisst Antworten, deren Frage nicht mehr gestellt wird", () => {
    const alt: Antworten = { vorhaben: ["konto"], bestimmtes: ["sukuk"], region: ["europa"], kontoPreis: ["kostenlos"] };
    expect(auswahlAus("depot", alt).wuensche).toEqual([]);
    expect(auswahlAus("girokonto", alt).wuensche.map((w) => w.id)).toEqual(["kostenlos"]);
  });

  it("gibt eine Antwort an mehrere Bausteine weiter", () => {
    const a: Antworten = { vorhaben: ["anlegen", "konto"], bestimmtes: ["krypto", "etfs"], wichtig: ["kosten"], betrag: ["klein"] };
    expect(auswahlAus("depot", a).prioritaet?.id).toBe("kosten");
    expect(auswahlAus("girokonto", a).prioritaet?.id).toBe("kosten");
    expect(auswahlAus("krypto", a).prioritaet?.id).toBe("kosten");
    expect(auswahlAus("krypto", a).wuensche.map((w) => w.id)).toContain("kryptoSparplan");
  });

  it("findet den Europa-Fonds dort, wo er kaufbar ist", () => {
    const a: Antworten = { vorhaben: ["anlegen"], region: ["europa"] };
    const d = baustein("depot");
    const e = werteAus(d.anbieter, d.kategorie, d.finanzMax, auswahlAus("depot", a));
    const namen = [...e.passt, ...e.ungeprueft].filter((t) => t.erfuellt.some((w) => w.id === "region-Europa")).map((t) => t.anbieter.name);
    expect(namen).toContain("Scalable Capital");
    expect(namen).not.toContain("Trade Republic");
    const scalable = [...e.passt, ...e.ungeprueft].find((t) => t.anbieter.id === "scalable-capital-free-broker")!;
    expect(scalable.gruende.join(" ")).toMatch(/Halal-Fonds für Europa kaufbar/);
  });

  it("rechnet jedes Paket durch, ohne dass ein abgeratener Anbieter auftaucht", () => {
    const faelle: Antworten[] = [
      { vorhaben: ["anlegen"], betrag: ["klein"], dauer: ["kurz"], bestimmtes: [], region: ["egal"], wichtig: ["kosten"] },
      { vorhaben: ["anlegen"], betrag: ["einmal"], dauer: ["lang"], bestimmtes: ["aktien", "krypto", "metalle"], wichtig: ["auswahl"], wallet: ["ja"], mussDepot: ["kredit"] },
      { vorhaben: ["anlegen", "konto", "steuer"], betrag: ["mittel"], dauer: ["mittel"], bestimmtes: ["etfs", "sukuk"], region: ["usa"], wichtig: ["app"], kontoPreis: ["kostenlos"], alltag: ["girocard", "handy"], steuerLage: ["kapital", "selbst"] },
      { vorhaben: ["steuer"], steuerLage: ["gratis"] },
      { vorhaben: ["konto"], kontoPreis: ["egal"], alltag: ["filiale", "bargeld"], kontoWichtig: ["service"], mussKonto: ["dispo", "karte"] },
    ];
    for (const a of faelle) {
      const aktive = bausteine.filter((b) => b.aktiv(a));
      expect(aktive.length).toBeGreaterThan(0);
      for (const b of aktive) {
        const e = werteAus(b.anbieter, b.kategorie, b.finanzMax, auswahlAus(b.id, a));
        expect(e.passt.length + e.ungeprueft.length + e.raus, b.id).toBe(b.anbieter.length);
        expect([...e.passt, ...e.ungeprueft].some((t) => t.anbieter.abgeraten), b.id).toBe(false);
      }
    }
  });

  it("zeigt kostenlose Steuerprogramme zuerst und in Preisreihenfolge", () => {
    const s = baustein("steuer");
    const e = werteAus(s.anbieter, null, {}, auswahlAus("steuer", { vorhaben: ["steuer"], steuerLage: ["kapital"] }));
    expect(e.passt[0].anbieter.name).toBe("Mein ELSTER");
    expect(e.passt.every((t) => t.note === null)).toBe(true);
  });
});

describe("Begründungen", () => {
  it("nennt dieselbe Tatsache nur einmal", () => {
    const a: Antworten = { vorhaben: ["anlegen"], dauer: ["kurz"], bestimmtes: ["metalle"] };
    const d = bausteine.find((b) => b.id === "depot")!;
    const e = werteAus(d.anbieter, d.kategorie, d.finanzMax, auswahlAus("depot", a));
    for (const t of [...e.passt, ...e.ungeprueft]) {
      expect(t.gruende.filter((g) => g.includes("Gold- und Silberpapieren")).length, t.anbieter.name).toBeLessThanOrEqual(1);
      expect(t.gruende.every((g) => g.trim().length > 10), t.anbieter.name).toBe(true);
    }
  });
});
