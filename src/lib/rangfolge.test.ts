import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nummerEins, rangfolge, sterne, type RangKategorie, type Rangliste } from "@/lib/rangfolge";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { brokerVergleich } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { steuersoftwareVergleich } from "@/data/steuersoftwareVergleich";
import { screenerVergleich } from "@/data/screenerVergleich";
import { edelmetallVergleich } from "@/data/edelmetallVergleich";

/**
 * Rechenkern der Rangfolge, Spezifikation `docs/rangfolge/P3-SPEC.md` (Abschnitt 10 hat Vorrang).
 * Jede erwartete Zahl ist von Hand gerechnet und steht als Rechnung daneben.
 */

const MAX_DEPOT = { depotgebuehr: 10, app: 10 };
const MAX_GIRO = { kontofuehrung: 10 };
const MAX_KRYPTO = { gebuehren: 100 };

const depot = (id: string, werte: RohAnbieter["werte"] = {}, extra: Partial<RohAnbieter> = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "Depot",
  werte: { zinsfreiAbStart: "gut", halalEtfsFonds: "12 von 12", halalSukuk: "3 von 3", halalEdelmetalle: "7 von 7", ...werte },
  halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 },
  finanzPunkte: { depotgebuehr: 10, app: 10 },
  ...extra,
});

const giro = (id: string, werte: RohAnbieter["werte"] = {}, extra: Partial<RohAnbieter> = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "Konto",
  werte: { zinsfreiAbStart: "gut", keinDispoAbStart: "gut", karteOhneKredit: "gut", ...werte },
  finanzPunkte: { kontofuehrung: 10 },
  ...extra,
});

const krypto = (id: string, werte: RohAnbieter["werte"] = {}, extra: Partial<RohAnbieter> = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "Börse",
  werte: { zinsfreiAbStart: "gut", echteCoins: "gut", eigeneWallet: "gut", zinsfreiesModell: "gut", ...werte },
  finanzPunkte: { gebuehren: 100 },
  ...extra,
});

const steuer = (id: string, werte: RohAnbieter["werte"] = {}, preisEinzel: number | null = 0): RohAnbieter => ({
  id,
  name: id,
  produkt: "Programm",
  werte: { plattform: "Web", kapital: "ja", selbststaendige: "ja", vermietung: "ja", belegabruf: true, ...werte },
  preisEinzel,
});

const screener = (id: string, werte: RohAnbieter["werte"] = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "App",
  werte: {
    gremium: "gut",
    begruendung: "gut",
    reinigung: "gut",
    etfs: true,
    depot: true,
    zakat: true,
    kostenlos: "unbegrenzte Prüfungen",
    ...werte,
  },
});

const metall = (id: string, werte: RohAnbieter["werte"] = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "Metall",
  werte: { uebergabe: "gut", echtesMetall: "gut", nachweis: "gut", ausliefern: "gut", ...werte },
});

const rDepot = (liste: RohAnbieter[], offeneAnfragen?: ReadonlySet<string>) =>
  rangfolge(liste, "depot", { finanzMax: MAX_DEPOT, offeneAnfragen });
const rGiro = (liste: RohAnbieter[]) => rangfolge(liste, "girokonto", { finanzMax: MAX_GIRO });
const rKrypto = (liste: RohAnbieter[]) => rangfolge(liste, "krypto", { finanzMax: MAX_KRYPTO });

/** Das eine Ergebnis eines Einzelanbieters in `gerankt`. */
const einzig = (r: Rangliste) => {
  expect(r.gerankt).toHaveLength(1);
  return r.gerankt[0];
};
const ids = (xs: Array<{ anbieter: RohAnbieter }>) => xs.map((x) => x.anbieter.id);

/* ------------------------------------------------------------------ Gruppen */

describe("rangfolge: Gruppen", () => {
  it("legt jede Eingabe in genau eine Gruppe", () => {
    const liste = [depot("voll"), depot("rot", { zinsfreiAbStart: "schlecht" }), depot("offen", { zinsfreiAbStart: null })];
    const r = rDepot(liste);
    expect(ids(r.gerankt)).toEqual(["voll"]);
    expect(ids(r.abgeraten)).toEqual(["rot"]);
    expect(ids(r.nichtBewertet)).toEqual(["offen"]);
  });

  it("gibt nicht Bewerteten und Abgeratenen weder Platz noch Note", () => {
    const r = rDepot([depot("rot", { zinsfreiAbStart: "schlecht" }), depot("offen", { zinsfreiAbStart: null })]);
    for (const x of [...r.abgeraten, ...r.nichtBewertet]) {
      expect(x).not.toHaveProperty("platz");
      expect(x).not.toHaveProperty("note");
    }
  });

  it("rät ab vor nicht bewertet: rotes Zins-Tor mit Lücken ist abgeraten", () => {
    const r = rDepot([depot("ib", { zinsfreiAbStart: "schlecht", halalSukuk: null })]);
    expect(r.abgeraten).toEqual([{ anbieter: expect.objectContaining({ id: "ib" }), grund: "Zinsen nicht abschaltbar" }]);
    expect(r.nichtBewertet).toHaveLength(0);
  });

  it("übernimmt abgeraten aus den Daten", () => {
    const r = rDepot([depot("markiert", {}, { abgeraten: true })]);
    expect(ids(r.abgeraten)).toEqual(["markiert"]);
  });

  it("wertet einen ungeprüften oder unbekannten Türsteher als fehlend", () => {
    for (const tuer of [null, "unbekannt"] as const) {
      const r = rDepot([depot("x", { zinsfreiAbStart: tuer })]);
      expect(r.nichtBewertet).toEqual([{ anbieter: expect.objectContaining({ id: "x" }), grund: "noch nicht geprüft", fehlt: ["zinsfreiAbStart"] }]);
    }
  });

  it("setzt den Grund „Anfrage läuft“ nur, wenn das Haus angefragt ist", () => {
    const liste = [depot("a", { zinsfreiAbStart: null }, { haus: "haus-a" }), depot("b", { zinsfreiAbStart: null }, { haus: "haus-b" })];
    const r = rDepot(liste, new Set(["haus-a"]));
    expect(r.nichtBewertet.map((x) => [x.anbieter.id, x.grund])).toEqual([
      ["a", "Anfrage läuft"],
      ["b", "noch nicht geprüft"],
    ]);
  });

  it("nimmt ohne Haus die id als Schlüssel für offene Anfragen", () => {
    const r = rDepot([depot("ohne-haus", { zinsfreiAbStart: null })], new Set(["ohne-haus"]));
    expect(r.nichtBewertet[0].grund).toBe("Anfrage läuft");
  });

  it("lässt eine offene Anfrage auf Bewertete und Abgeratene ohne Wirkung", () => {
    const liste = [depot("fertig", {}, { haus: "h" }), depot("rot", { zinsfreiAbStart: "schlecht" }, { haus: "h" })];
    const r = rDepot(liste, new Set(["h"]));
    expect(ids(r.gerankt)).toEqual(["fertig"]);
    expect(r.abgeraten[0].grund).toBe("Zinsen nicht abschaltbar");
  });

  it("sortiert nicht Bewertete und Abgeratene nach Name", () => {
    const r = rDepot([
      depot("c", { zinsfreiAbStart: null }),
      depot("a", { zinsfreiAbStart: null }),
      depot("z", { zinsfreiAbStart: "schlecht" }),
      depot("m", { zinsfreiAbStart: "schlecht" }),
    ]);
    expect(ids(r.nichtBewertet)).toEqual(["a", "c"]);
    expect(ids(r.abgeraten)).toEqual(["m", "z"]);
  });
});

/* -------------------------------------------------------------------- Depot */

describe("rangfolge: Depot", () => {
  it("gibt vollem Paket und vollen Punkten die 5", () => {
    expect(einzig(rDepot([depot("voll")]))).toMatchObject({ platz: 1, note: 5, halal: 5, kosten: 5 });
  });

  it("rechnet Fonds gewichtet über alle 22 Anlagen", () => {
    // Halal 5 × (10,5 + 2,5 + 7) / 22 = 4,5454…, Kosten 5 × 15 / 20 = 3,75, Note 4,1477…
    const a = depot("fonds", {}, {
      halalAnlagenPunkte: { halalEtfsFonds: 10.5, halalSukuk: 2.5, halalEdelmetalle: 7 },
      finanzPunkte: { depotgebuehr: 5, app: 10 },
    });
    expect(einzig(rDepot([a]))).toMatchObject({ halal: 4.55, kosten: 3.75, note: 4.15 });
  });

  it("rechnet Teiltreffer: 6 von 22", () => {
    // Halal 5 × 6 / 22 = 1,3636…, Kosten 5, Note 3,1818…
    const a = depot("teil", { halalEtfsFonds: "5 von 12", halalSukuk: "1 von 3", halalEdelmetalle: "0 von 7" }, {
      halalAnlagenPunkte: { halalEtfsFonds: 5, halalSukuk: 1, halalEdelmetalle: 0 },
    });
    expect(einzig(rDepot([a]))).toMatchObject({ halal: 1.36, note: 3.18 });
  });

  it("lässt eine Zeile „mind. x von N“ offen", () => {
    const r = rDepot([depot("mind", { halalEtfsFonds: "mind. 3 von 12" })]);
    expect(r.nichtBewertet[0].fehlt).toEqual(["halalEtfsFonds"]);
  });

  it("fällt bei exakter Zeile ohne Punkte nie auf die Rohzahl zurück", () => {
    const ohneSchluessel = depot("ohne", {}, { halalAnlagenPunkte: { halalSukuk: 3, halalEdelmetalle: 7 } });
    const mitNull = depot("null", {}, { halalAnlagenPunkte: { halalEtfsFonds: null, halalSukuk: 3, halalEdelmetalle: 7 } });
    const ganzOhne = depot("ganz", {}, { halalAnlagenPunkte: undefined });
    const r = rDepot([ohneSchluessel, mitNull, ganzOhne]);
    expect(r.gerankt).toHaveLength(0);
    expect(r.nichtBewertet.find((x) => x.anbieter.id === "ohne")!.fehlt).toEqual(["halalEtfsFonds"]);
    expect(r.nichtBewertet.find((x) => x.anbieter.id === "null")!.fehlt).toEqual(["halalEtfsFonds"]);
    expect(r.nichtBewertet.find((x) => x.anbieter.id === "ganz")!.fehlt).toEqual(["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]);
  });

  it("verlangt N = 12, 3 und 7", () => {
    const r = rDepot([depot("acht", { halalEdelmetalle: "8 von 8" }, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8 } })]);
    expect(r.nichtBewertet[0].fehlt).toEqual(["halalEdelmetalle"]);
  });

  it("halbiert den Halal-Teil, wenn Zinsen erst abgeschaltet werden müssen, und gibt ihn halbiert aus", () => {
    // Halal 5 × 0,5 = 2,5, Kosten 5, Note 3,75
    expect(einzig(rDepot([depot("gelb", { zinsfreiAbStart: "teils" })]))).toMatchObject({ halal: 2.5, kosten: 5, note: 3.75 });
  });

  it("wertet fehlende oder leere Finanzpunkte als fehlend", () => {
    const r = rDepot([depot("ohne", {}, { finanzPunkte: undefined }), depot("leer", {}, { finanzPunkte: {} })]);
    expect(r.nichtBewertet.map((x) => x.fehlt)).toEqual([["finanzPunkte"], ["finanzPunkte"]]);
  });
});

/* ------------------------------------------------------------------- Kosten */

describe("rangfolge: Kosten wie finanzNote", () => {
  const kosten = (finanzPunkte: Record<string, number>) => einzig(rDepot([depot("k", {}, { finanzPunkte })])).kosten;

  it("zählt nur Kriterien aus den Höchstpunkten und ignoriert einen positiven Abzug", () => {
    expect(kosten({ depotgebuehr: 10, app: 10, fremd: 50, abzug: 3 })).toBe(5);
  });

  it("zieht einen negativen Abzug voll ab", () => {
    // 5 × (20 − 4) / 20 = 4
    expect(kosten({ depotgebuehr: 10, app: 10, abzug: -4 })).toBe(4);
  });

  it("begrenzt auf 0 bis 5, auch bei negativem Einzelwert", () => {
    expect(kosten({ depotgebuehr: -1, app: 0 })).toBe(0);
    expect(kosten({ depotgebuehr: 10, app: 5 })).toBe(3.75);
  });
});

/* ---------------------------------------------------------- Giro und Krypto */

describe("rangfolge: Girokonto", () => {
  it("zählt Dispo „teils“ halb", () => {
    // Halal 5 × (0,5 × 0,5 + 0,5 × 1) = 3,75
    expect(einzig(rGiro([giro("haspa", { keinDispoAbStart: "teils" })])).halal).toBe(3.75);
  });

  it("rankt ein Konto mit Dispo ab Start, das Merkmal zählt 0", () => {
    // Halal 2,5, Kosten 5, Note 3,75
    expect(einzig(rGiro([giro("dkb", { keinDispoAbStart: "schlecht" })]))).toMatchObject({ halal: 2.5, note: 3.75 });
  });

  it("wertet „unbekannt“ als fehlend", () => {
    expect(rGiro([giro("x", { karteOhneKredit: "unbekannt" })]).nichtBewertet[0].fehlt).toEqual(["karteOhneKredit"]);
  });
});

describe("rangfolge: Krypto", () => {
  it("gewichtet echte Coins 0,4, Wallet 0,3, Modell 0,3", () => {
    // Halal 5 × 0,6 = 3
    expect(einzig(rKrypto([krypto("zertifikat", { echteCoins: "schlecht" })])).halal).toBe(3);
  });

  it("rankt ein zinsgebundenes Bezahlmodell als Abzug, nicht als Abraten", () => {
    // Halal 5 × 0,7 = 3,5
    const r = rKrypto([krypto("modell", { zinsfreiesModell: "schlecht" })]);
    expect(r.abgeraten).toHaveLength(0);
    expect(einzig(r).halal).toBe(3.5);
  });
});

/* ------------------------------------------------------------ Steuersoftware */

describe("rangfolge: Steuersoftware", () => {
  const r = (liste: RohAnbieter[]) => rangfolge(liste, "steuer");

  it("gibt kostenlosem Vollprogramm die 5", () => {
    expect(einzig(r([steuer("elster")]))).toMatchObject({ note: 5, halal: 5, kosten: 5 });
  });

  it("rechnet den Preis linear bis 60 €", () => {
    // Preis 5 × (1 − 34,95 / 60) = 2,0875, Note (5 + 2,0875) / 2 = 3,54375
    expect(einzig(r([steuer("mittel", {}, 34.95)]))).toMatchObject({ kosten: 2.09, halal: 5, note: 3.54 });
    expect(einzig(r([steuer("grenze", {}, 60)])).kosten).toBe(0);
    expect(einzig(r([steuer("teuer", {}, 75)])).kosten).toBe(0);
  });

  it("verlangt einen Einzelpreis als Zahl", () => {
    const ohne = steuer("ohne");
    delete ohne.preisEinzel;
    expect(r([ohne]).nichtBewertet[0].fehlt).toEqual(["preisEinzel"]);
    expect(r([steuer("null", {}, null)]).nichtBewertet[0].fehlt).toEqual(["preisEinzel"]);
  });

  it("wertet den Belegabruf als Ja/Nein", () => {
    // Leistung 5 × 0,65 = 3,25
    expect(einzig(r([steuer("ohne-abruf", { belegabruf: false })])).halal).toBe(3.25);
    expect(r([steuer("offen", { belegabruf: null })]).nichtBewertet[0].fehlt).toEqual(["belegabruf"]);
  });

  it("liest „ja, …“ als 1, „nur in der Fassung …“ als 0,5 und „nein“ als 0", () => {
    expect(einzig(r([steuer("deluxe", { selbststaendige: "ja, EÜR nur in der Fassung Deluxe" })])).halal).toBe(5);
    // Leistung 5 × (0,35 + 0,25 × 0,5 + 0,25 × 0,5 + 0,15) = 3,75
    const fassung = steuer("fassung", {
      selbststaendige: "nur in der Fassung für Selbstständige, 94,95 €",
      vermietung: "nur in der Fassung plus, 45,95 €",
    });
    expect(einzig(r([fassung])).halal).toBe(3.75);
    // Leistung 5 × (0,35 + 0,25 + 0,15) = 3,75
    expect(einzig(r([steuer("nein", { selbststaendige: "nein" })])).halal).toBe(3.75);
  });

  it("wertet einen unlesbaren Text als fehlend", () => {
    expect(r([steuer("x", { vermietung: "vielleicht" })]).nichtBewertet[0].fehlt).toEqual(["vermietung"]);
  });

  it("zählt „nur Windows“ als 0 und eine fehlende Plattform als fehlend", () => {
    // Leistung 5 × 0,85 = 4,25
    expect(einzig(r([steuer("win", { plattform: "nur Windows" })])).halal).toBe(4.25);
    expect(r([steuer("x", { plattform: null })]).nichtBewertet[0].fehlt).toEqual(["plattform"]);
  });

  it("rät bei „kapital = nein“ ab, auch mit Lücken, und lässt „kapital = null“ offen", () => {
    const e = r([steuer("steuerbot", { kapital: "nein", belegabruf: null }), steuer("offen", { kapital: null })]);
    expect(e.abgeraten).toEqual([{ anbieter: expect.objectContaining({ id: "steuerbot" }), grund: "kann keine Anlage KAP" }]);
    expect(e.nichtBewertet[0].fehlt).toContain("kapital");
  });
});

/* ------------------------------------------------------------------ Screener */

describe("rangfolge: Screener", () => {
  const r = (liste: RohAnbieter[]) => rangfolge(liste, "screener");

  it("gibt voller Transparenz und vollem Nutzen die 5", () => {
    expect(einzig(r([screener("musaffa")]))).toMatchObject({ note: 5, halal: 5, kosten: 5 });
  });

  it("zählt eine kostenlose Fassung mit nur einer Prüfung wie kostenlosReicht als 0", () => {
    // Nutzen 5 × (0,5 × 0 + 0,5 × 1) = 2,5, Note 3,75
    expect(einzig(r([screener("islamicly", { kostenlos: "eine Prüfung als Bericht, danach Abo" })]))).toMatchObject({ kosten: 2.5, note: 3.75 });
  });

  it("mittelt die Transparenz-Ampeln", () => {
    // Transparenz 5 × (0 + 1 + 0,5) / 3 = 2,5
    expect(einzig(r([screener("zoya", { gremium: "schlecht", reinigung: "teils" })])).halal).toBe(2.5);
  });

  it("mittelt ETFs, Depot und Zakat", () => {
    // Nutzen 5 × (0,5 + 0,5 × 2 / 3) = 4,1666…
    expect(einzig(r([screener("x", { zakat: false })])).kosten).toBe(4.17);
  });

  it("lässt fehlende Ampeln, Ja/Nein-Felder und die kostenlose Fassung offen", () => {
    const e = r([
      screener("a", { reinigung: null }),
      screener("b", { gremium: "unbekannt" }),
      screener("c", { etfs: null }),
      screener("d", { kostenlos: null }),
    ]);
    expect(e.nichtBewertet.map((x) => x.fehlt)).toEqual([["reinigung"], ["gremium"], ["etfs"], ["kostenlos"]]);
  });
});

/* --------------------------------------------------------------- Edelmetalle */

describe("rangfolge: Edelmetalle", () => {
  const r = (liste: RohAnbieter[]) => rangfolge(liste, "edelmetall");

  it("rechnet nur Halal und zeigt keine Kosten", () => {
    expect(einzig(r([metall("barren")]))).toMatchObject({ note: 5, halal: 5, kosten: null });
  });

  it("gewichtet die Auslieferung am niedrigsten", () => {
    // Halal 5 × (0,35 + 0,30 + 0,25 + 0,10 × 0,5) = 4,75
    expect(einzig(r([metall("etc", { ausliefern: "teils" })])).note).toBe(4.75);
  });

  it("rät ab ohne echtes Metall oder ohne Besitzübergang", () => {
    const e = r([
      metall("papier", { uebergabe: "schlecht" }),
      metall("wette", { uebergabe: "schlecht", echtesMetall: "schlecht" }),
      metall("zertifikat", { echtesMetall: "schlecht" }),
    ]);
    expect(e.abgeraten.map((x) => [x.anbieter.id, x.grund])).toEqual([
      ["papier", "kein Besitzübergang"],
      ["wette", "kein echtes Metall"],
      ["zertifikat", "kein echtes Metall"],
    ]);
  });

  it("lässt einen fehlenden Nachweis offen", () => {
    expect(r([metall("x", { nachweis: null })]).nichtBewertet[0].fehlt).toEqual(["nachweis"]);
  });
});

/* -------------------------------------------------------------- Reihenfolge */

describe("rangfolge: Reihenfolge", () => {
  it("sortiert nach Note", () => {
    const r = rKrypto([krypto("mittel", {}, { finanzPunkte: { gebuehren: 50 } }), krypto("gut"), krypto("schwach", { echteCoins: "schlecht" }, { finanzPunkte: { gebuehren: 0 } })]);
    expect(r.gerankt.map((x) => [x.anbieter.id, x.platz])).toEqual([
      ["gut", 1],
      ["mittel", 2],
      ["schwach", 3],
    ]);
  });

  it("entscheidet bei gleicher Note über die Kosten", () => {
    // a: Halal 3, Kosten 5, Note 4. b: Halal 5, Kosten 3, Note 4.
    const r = rKrypto([krypto("b", {}, { finanzPunkte: { gebuehren: 60 } }), krypto("a", { echteCoins: "schlecht" })]);
    expect(r.gerankt.map((x) => [x.anbieter.id, x.note, x.platz])).toEqual([
      ["a", 4, 1],
      ["b", 4, 2],
    ]);
  });

  it("teilt den Platz bei gleicher Note, gleichen Kosten und gleichem Halal-Teil", () => {
    const r = rKrypto([krypto("c", { echteCoins: "schlecht" }), krypto("b"), krypto("a")]);
    expect(r.gerankt.map((x) => [x.anbieter.id, x.platz])).toEqual([
      ["a", 1],
      ["b", 1],
      ["c", 3],
    ]);
  });

  it("ordnet einen Gleichstand nach Name, Produkt und id", () => {
    const r = rKrypto([
      krypto("z", {}, { name: "X", produkt: "A" }),
      krypto("y", {}, { name: "X", produkt: "A" }),
      krypto("w", {}, { name: "X", produkt: "B" }),
      krypto("v", {}, { name: "W", produkt: "Z" }),
    ]);
    expect(ids(r.gerankt)).toEqual(["v", "y", "z", "w"]);
  });

  it("sortiert auf gerundeten Werten", () => {
    // b: Kosten 5, a: Kosten 5 × 9999 / 10000 = 4,9995, gerundet beide 5,00
    const max = { gebuehren: 10000 };
    const liste = [krypto("b", {}, { finanzPunkte: { gebuehren: 10000 } }), krypto("a", {}, { finanzPunkte: { gebuehren: 9999 } })];
    const r = rangfolge(liste, "krypto", { finanzMax: max });
    expect(r.gerankt.map((x) => [x.anbieter.id, x.platz, x.kosten])).toEqual([
      ["a", 1, 5],
      ["b", 1, 5],
    ]);
  });

  it("hängt nicht von der Eingabereihenfolge ab", () => {
    const liste = [
      krypto("c", { echteCoins: "schlecht" }),
      krypto("a"),
      krypto("b", {}, { finanzPunkte: { gebuehren: 70 } }),
      krypto("offen", { eigeneWallet: null }),
      krypto("rot", { zinsfreiAbStart: "schlecht" }),
    ];
    expect(rKrypto([...liste].reverse())).toEqual(rKrypto(liste));
  });

  it("liest weder Partnerlink noch Finanzfluss-Rang, Etikett oder alte Note", () => {
    const ohne = [krypto("a", {}, { finanzPunkte: { gebuehren: 80 } }), krypto("b", {}, { finanzPunkte: { gebuehren: 60 } })];
    const mit = [
      krypto("a", {}, { finanzPunkte: { gebuehren: 80 }, finanzfluss: { produkt: "A", partnerlink: null, rang: 9 } }),
      krypto("b", {}, {
        finanzPunkte: { gebuehren: 60 },
        link: "/out/b",
        finanzfluss: { produkt: "B", partnerlink: "b", rang: 1 },
        etikett: { text: "Bester Anbieter", ton: "empfehlung" },
        note: 5,
        noteStand: "09/2026",
      }),
    ];
    const kurz = (r: Rangliste) => r.gerankt.map((x) => [x.anbieter.id, x.platz, x.note, x.halal, x.kosten]);
    expect(kurz(rKrypto(mit))).toEqual(kurz(rKrypto(ohne)));
  });
});

/* ------------------------------------------------- Nummer 1 und Einschränkung */

describe("rangfolge: Nummer 1 nur ohne Einschränkung (Spec 10.7)", () => {
  it("markiert Tor „teils“ und eine rote Grundlage als eingeschränkt", () => {
    const r = rGiro([giro("frei"), giro("gelb", { zinsfreiAbStart: "teils" }), giro("dispo", { keinDispoAbStart: "schlecht" })]);
    expect(Object.fromEntries(r.gerankt.map((x) => [x.anbieter.id, x.uneingeschraenkt]))).toEqual({ frei: true, gelb: false, dispo: false });
  });

  it("nimmt für die Nummer 1 den besten Eintrag ohne Einschränkung", () => {
    // dispo: Halal 2,5, Kosten 5, Note 3,75. frei: Halal 5, Kosten 1, Note 3.
    const r = rGiro([giro("dispo", { keinDispoAbStart: "schlecht" }), giro("frei", {}, { finanzPunkte: { kontofuehrung: 2 } })]);
    expect(ids(r.gerankt)).toEqual(["dispo", "frei"]);
    expect(ids(nummerEins(r))).toEqual(["frei"]);
  });

  it("liefert bei Gleichstand alle Gleichauf und ohne Kandidaten nichts", () => {
    expect(ids(nummerEins(rKrypto([krypto("b"), krypto("a")])))).toEqual(["a", "b"]);
    expect(nummerEins(rKrypto([krypto("gelb", { zinsfreiAbStart: "teils" })]))).toEqual([]);
  });

  it("kennt bei Steuer, Screener und Edelmetall keine Einschränkung", () => {
    expect(einzig(rangfolge([metall("etc", { uebergabe: "teils" })], "edelmetall")).uneingeschraenkt).toBe(true);
  });
});

/* -------------------------------------------------------------------- Sterne */

describe("sterne", () => {
  it("rundet die Note auf halbe Sterne", () => {
    expect([4.24, 4.25, 4.74, 4.75, 0, 5].map(sterne)).toEqual([4, 4.5, 4.5, 5, 0, 5]);
  });
});

/* ---------------------------------------------------------- Reinheit, Daten */

const tiefGefroren = <T,>(x: T): T => {
  if (x && typeof x === "object") {
    Object.values(x).forEach(tiefGefroren);
    Object.freeze(x);
  }
  return x;
};

describe("rangfolge: Reinheit", () => {
  it("verändert die Eingabe nicht", () => {
    const liste = tiefGefroren([krypto("b"), krypto("a", { eigeneWallet: null }), krypto("c", { zinsfreiAbStart: "schlecht" })]);
    expect(() => rKrypto(liste)).not.toThrow();
  });

  it("importiert weder Partnerlinks, Deals noch das Anfragen-Log", () => {
    const quelltext = readFileSync(join(process.cwd(), "src/lib/rangfolge.ts"), "utf8");
    expect(quelltext).not.toMatch(/partnerLinks|deals|anfragenLog/);
  });
});

const ECHT: Array<[RangKategorie, RohAnbieter[]]> = [
  ["depot", brokerVergleich],
  ["girokonto", girokontoVergleich],
  ["krypto", kryptoVergleich],
  ["steuer", steuersoftwareVergleich],
  ["screener", screenerVergleich],
  ["edelmetall", edelmetallVergleich],
];

describe("rangfolge: echte Daten", () => {
  it.each(ECHT)("%s: jeder Anbieter steht in genau einer Gruppe", (kategorie, liste) => {
    const r = rangfolge(liste, kategorie);
    const alle = [...ids(r.gerankt), ...ids(r.nichtBewertet), ...ids(r.abgeraten)];
    expect(alle.sort()).toEqual(liste.map((a) => a.id).sort());
  });

  it.each(ECHT)("%s: Noten, Halal und Kosten liegen zwischen 0 und 5 mit höchstens zwei Nachkommastellen", (kategorie, liste) => {
    for (const x of rangfolge(liste, kategorie).gerankt) {
      for (const w of [x.note, x.halal, x.kosten]) {
        if (w === null) continue;
        expect(w).toBeGreaterThanOrEqual(0);
        expect(w).toBeLessThanOrEqual(5);
        expect(Math.round(w * 100) / 100).toBe(w);
      }
    }
  });

  it("Depot: jede exakte Anlagenzeile hat gewichtete Punkte", () => {
    for (const a of brokerVergleich) {
      for (const k of ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]) {
        const w = a.werte[k];
        if (typeof w === "string" && /^\d+ von \d+$/.test(w)) expect(typeof a.halalAnlagenPunkte?.[k], `${a.id} ${k}`).toBe("number");
      }
    }
  });

  it("Steuer: jeder Anbieter hat einen Einzelpreis als Zahl oder ausdrücklich null", () => {
    for (const a of steuersoftwareVergleich) expect(a.preisEinzel === null || typeof a.preisEinzel === "number", a.id).toBe(true);
  });

  it("Steuer: ELSTER und CHECK24 teilen sich Platz 1", () => {
    const r = rangfolge(steuersoftwareVergleich, "steuer");
    expect(r.gerankt.filter((x) => x.platz === 1).map((x) => x.anbieter.id).sort()).toEqual(["check24-steuer", "elster"]);
  });

  it("Screener: Musaffa steht allein auf Platz 1, Finispia ist nicht bewertet", () => {
    const r = rangfolge(screenerVergleich, "screener");
    expect(ids(nummerEins(r))).toEqual(["musaffa"]);
    expect(ids(r.nichtBewertet)).toContain("finispia");
  });
});
