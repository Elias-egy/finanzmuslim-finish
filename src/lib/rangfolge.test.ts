import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { FAKTOR_DISPO, FAKTOR_KREDIT, feinwert, KREDIT_NIE_PLATZ_EINS, nummerEins, rangfolge, sterne, STUFEN_ALLE_REIN, stufe, type RangKategorie, type Rangliste } from "@/lib/rangfolge";
import { reihenfolgeAntwort, SPITZE_SATZ_GIRO, sortiertSatz } from "@/data/reihenfolgeText";
import { LESER_EROEFFNUNGEN } from "@/data/leserEroeffnungen";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { anzeigeNote } from "@/lib/anzeigeNote";
import { siegerDerSeite } from "@/lib/vergleichAssistent";
import { meisteHalalVon } from "@/data/vergleichHelfer";
import { depotAnzeige } from "@/data/vergleichAnzeige";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { steuersoftwareVergleich } from "@/data/steuersoftwareVergleich";
import { screenerVergleich } from "@/data/screenerVergleich";
import { edelmetallVergleich, EDELMETALL_FINANZ_MAX } from "@/data/edelmetallVergleich";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { ROYAL_MINT, ROYAL_MINT_HAEUSER } from "@/data/royalMint";
import { DEPOT_SPITZE, GIRO_SPITZE, GEWICHT_ROYAL_MINT, HALAL_GEWICHT, halalPunkte, spitzenRang } from "@/lib/rangfolge";

/**
 * Rechenkern der Rangfolge, Spezifikation `docs/rangfolge/P3-SPEC.md` (Abschnitt 10 hat Vorrang).
 * Jede erwartete Zahl ist von Hand gerechnet und steht als Rechnung daneben.
 */

const MAX_DEPOT = { depotgebuehr: 10, app: 10 };
const MAX_GIRO = { kontofuehrung: 10 };
const MAX_KRYPTO = { gebuehren: 100 };

// Haus „flatex“: Royal Mint Gold ist dort belegt kaufbar (`ROYAL_MINT_HAEUSER`), so hat das volle Paket 36 von 36 Halal-Punkten (Regel 12).
const depot = (id: string, werte: RohAnbieter["werte"] = {}, extra: Partial<RohAnbieter> = {}): RohAnbieter => ({
  id,
  name: id,
  produkt: "Depot",
  haus: "flatex",
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

// Die Rechnungen von Hand prüfen Halal- und Kosten-Teil; Regel 8 (kein Kriterium „beliebt“ mehr, seit 25.11.2026) prüft ein eigener Block unten.
const rDepot = (liste: RohAnbieter[], offeneAnfragen?: ReadonlySet<string>) =>
  rangfolge(liste, "depot", { finanzMax: MAX_DEPOT, offeneAnfragen });
const rGiro = (liste: RohAnbieter[], offeneAnfragen?: ReadonlySet<string>) =>
  rangfolge(liste, "girokonto", { finanzMax: MAX_GIRO, offeneAnfragen });
const rKrypto = (liste: RohAnbieter[], offeneAnfragen?: ReadonlySet<string>) =>
  rangfolge(liste, "krypto", { finanzMax: MAX_KRYPTO, offeneAnfragen });

/** Das eine Ergebnis eines Einzelanbieters in `gerankt`. */
const einzig = (r: Rangliste) => {
  expect(r.gerankt).toHaveLength(1);
  return r.gerankt[0];
};
const ids = (xs: Array<{ anbieter: RohAnbieter }>) => xs.map((x) => x.anbieter.id);

/**
 * Regel 10: Im Depot und Girokonto fällt die Note nur innerhalb einer Stufe. Eine höhere Stufe steht nie vor einer niedrigeren, die Note darf
 * beim Stufenwechsel wieder steigen. In den anderen Vergleichen gibt es keine Stufen.
 */
const gleicheStufe = (kategorie: RangKategorie, p: RohAnbieter, q: RohAnbieter): boolean =>
  !STUFEN_ALLE_REIN.has(kategorie) || stufe(kategorie, p) === stufe(kategorie, q);
const stufenAufsteigend = (kategorie: RangKategorie, r: Rangliste) =>
  STUFEN_ALLE_REIN.has(kategorie) &&
  r.gerankt.slice(1).forEach((x, i) => expect(stufe(kategorie, x.anbieter), x.anbieter.id).toBeGreaterThanOrEqual(stufe(kategorie, r.gerankt[i].anbieter)));

/* ------------------------------------------------------------------ Gruppen */

// Depot und Girokonto kennen seit VG2-04 (Regel 10) keine Gruppen „abgeraten“ und „nicht bewertet“ mehr, sie stehen auf der Liste. Die Gruppen
// prüft hier Krypto, dort gilt Regel 10 nicht. Regel 10 selbst prüft der Block „Regel 10“ weiter unten.
describe("rangfolge: Gruppen", () => {
  it("legt jede Eingabe in genau eine Gruppe", () => {
    const liste = [krypto("voll"), krypto("rot", { zinsfreiAbStart: "schlecht" }), krypto("offen", { zinsfreiAbStart: null })];
    const r = rKrypto(liste);
    expect(ids(r.gerankt)).toEqual(["voll"]);
    expect(ids(r.abgeraten)).toEqual(["rot"]);
    expect(ids(r.nichtBewertet)).toEqual(["offen"]);
  });

  it("gibt nicht Bewerteten und Abgeratenen weder Platz noch Note", () => {
    const r = rKrypto([krypto("rot", { zinsfreiAbStart: "schlecht" }), krypto("offen", { zinsfreiAbStart: null })]);
    for (const x of [...r.abgeraten, ...r.nichtBewertet]) {
      expect(x).not.toHaveProperty("platz");
      expect(x).not.toHaveProperty("note");
    }
  });

  it("rät ab vor nicht bewertet: rotes Zins-Tor mit Lücken ist abgeraten (Krypto)", () => {
    const r = rKrypto([krypto("ib", { zinsfreiAbStart: "schlecht", echteCoins: null })]);
    expect(r.abgeraten).toEqual([{ anbieter: expect.objectContaining({ id: "ib" }), grund: "Zinsen nicht abschaltbar" }]);
    expect(r.nichtBewertet).toHaveLength(0);
  });

  it("übernimmt abgeraten aus den Daten", () => {
    const r = rDepot([depot("markiert", {}, { abgeraten: true })]);
    expect(ids(r.abgeraten)).toEqual(["markiert"]);
  });

  it("wertet einen ungeprüften oder unbekannten Türsteher bei Krypto als fehlend", () => {
    for (const tuer of [null, "unbekannt"] as const) {
      const r = rKrypto([krypto("x", { zinsfreiAbStart: tuer })]);
      expect(r.nichtBewertet).toEqual([{ anbieter: expect.objectContaining({ id: "x" }), grund: "noch nicht geprüft", fehlt: ["zinsfreiAbStart"] }]);
    }
  });

  it("setzt den Grund „Anfrage läuft“ nur, wenn das Haus angefragt ist", () => {
    const liste = [krypto("a", { zinsfreiAbStart: null }, { haus: "haus-a" }), krypto("b", { zinsfreiAbStart: null }, { haus: "haus-b" })];
    const r = rKrypto(liste, new Set(["haus-a"]));
    expect(r.nichtBewertet.map((x) => [x.anbieter.id, x.grund])).toEqual([
      ["a", "Anfrage läuft"],
      ["b", "noch nicht geprüft"],
    ]);
  });

  it("nimmt ohne Haus die id als Schlüssel für offene Anfragen", () => {
    const r = rKrypto([krypto("ohne-haus", { zinsfreiAbStart: null })], new Set(["ohne-haus"]));
    expect(r.nichtBewertet[0].grund).toBe("Anfrage läuft");
  });

  it("lässt eine offene Anfrage auf Bewertete und Abgeratene ohne Wirkung", () => {
    const liste = [krypto("fertig", {}, { haus: "h" }), krypto("rot", { zinsfreiAbStart: "schlecht" }, { haus: "h" })];
    const r = rKrypto(liste, new Set(["h"]));
    expect(ids(r.gerankt)).toEqual(["fertig"]);
    expect(r.abgeraten[0].grund).toBe("Zinsen nicht abschaltbar");
  });

  it("sortiert nicht Bewertete und Abgeratene nach Name", () => {
    const r = rKrypto([
      krypto("c", { zinsfreiAbStart: null }),
      krypto("a", { zinsfreiAbStart: null }),
      krypto("z", { zinsfreiAbStart: "schlecht" }),
      krypto("m", { zinsfreiAbStart: "schlecht" }),
    ]);
    expect(ids(r.nichtBewertet)).toEqual(["a", "c"]);
    expect(ids(r.abgeraten)).toEqual(["m", "z"]);
  });
});

/* ------------------------------------------------ Regel 10: alle Anbieter in Stufen */

describe("Regel 10: Depot und Girokonto zeigen jeden Anbieter in drei Stufen (Elias, 23.11.2026, VG2-04)", () => {
  it("Girokonto: belegt, offen und belegt verzinst stehen alle auf der Liste, in dieser Reihenfolge", () => {
    const r = rGiro([
      giro("rot", { zinsfreiAbStart: "schlecht" }),
      giro("offen", { zinsfreiAbStart: null }),
      giro("unbekannt", { zinsfreiAbStart: "unbekannt" }),
      giro("gut"),
    ]);
    expect(r.abgeraten).toHaveLength(0);
    expect(r.nichtBewertet).toHaveLength(0);
    expect(ids(r.gerankt)).toEqual(["gut", "offen", "unbekannt", "rot"]);
    expect(r.gerankt.map((b) => b.platz)).toEqual([1, 2, 2, 4]);
    expect(ids(nummerEins(r))).toEqual(["gut"]);
  });

  it("Girokonto: ein offener Dispo oder eine offene Karte zählt 0 Punkte, nie geschätzt, und der Eintrag bekommt trotzdem einen Platz", () => {
    for (const werte of [{ keinDispoAbStart: "unbekannt" }, { keinDispoAbStart: null }, { karteOhneKredit: "unbekannt" }, { karteOhneKredit: null }] as const) {
      const x = einzig(rGiro([giro("x", werte)]));
      // Halal 5 × (0,5 + 0) = 2,5, Kosten 5, Note 3,75
      expect(x).toMatchObject({ halal: 2.5, kosten: 5, note: 3.75, platz: 1 });
    }
  });

  it("Girokonto: ein belegt verzinstes Konto rechnet Halal 0 und steht ganz hinten, auch mit höherer Note als ein offenes", () => {
    const r = rGiro([giro("rot", { zinsfreiAbStart: "schlecht" }, { finanzPunkte: { kontofuehrung: 10 } }), giro("offen", { zinsfreiAbStart: null }, { finanzPunkte: { kontofuehrung: 0 } })]);
    expect(ids(r.gerankt)).toEqual(["offen", "rot"]);
    expect(r.gerankt[1]).toMatchObject({ halal: 0, kosten: 5, note: 2.5, uneingeschraenkt: false });
  });

  it("Depot: ein belegt verzinstes Depot steht in Stufe 2 mit Platz, ein offenes in Stufe 1, beide ohne Nummer 1", () => {
    const r = rDepot([depot("rot", { zinsfreiAbStart: "schlecht" }), depot("offen", { zinsfreiAbStart: null }), depot("gut"), depot("teils", { zinsfreiAbStart: "teils" })]);
    expect(r.abgeraten).toHaveLength(0);
    expect(ids(r.gerankt)).toEqual(["gut", "teils", "offen", "rot"]);
    expect(r.gerankt.find((b) => b.anbieter.id === "rot")).toMatchObject({ halal: 0, kosten: 5, note: 2.5, uneingeschraenkt: false });
    expect(ids(nummerEins(r))).toEqual(["gut"]);
  });

  it("Depot: die Stufe schlägt die Note, der Link ändert die Stufe nicht (LINK_VORRANG bleibt innerhalb der Stufe)", () => {
    const schwach = depot("schwach", { halalEtfsFonds: "0 von 12" }, { halalAnlagenPunkte: { halalEtfsFonds: 0, halalSukuk: 0, halalEdelmetalle: 0 } });
    const r = rDepot([depot("offen-mit-link", { zinsfreiAbStart: null }, { link: "/out/x" }), schwach]);
    expect(ids(r.gerankt)).toEqual(["schwach", "offen-mit-link"]);
    // Gleiche Stufe, gleiche Sterne: der eigene Link steht zuerst.
    const g = rDepot([depot("ohne"), depot("mit", {}, { link: "/out/m" })]);
    expect(ids(g.gerankt)).toEqual(["mit", "ohne"]);
  });

  it("Edelmetall und Krypto bleiben, wie sie waren: ein rotes Zins-Tor ist dort abgeraten", () => {
    expect(rangfolge([depot("rot", { zinsfreiAbStart: "schlecht" })], "edelmetall", { finanzMax: MAX_DEPOT }).abgeraten).toHaveLength(1);
    expect(rKrypto([krypto("rot", { zinsfreiAbStart: "schlecht" })]).abgeraten).toHaveLength(1);
  });
});

/* -------------------------------------------------------------------- Depot */

describe("rangfolge: Depot", () => {
  it("gibt vollem Paket und vollen Punkten die 5", () => {
    expect(einzig(rDepot([depot("voll")]))).toMatchObject({ platz: 1, note: 5, halal: 5, kosten: 5 });
  });

  it("rechnet Fonds gewichtet über alle 22 Anlagen, Halal-ETFs doppelt, Royal Mint 2 (Regel 12)", () => {
    // Halal 5 × (2 × 10,5 + 2,5 + 7 + 2) / 36 = 4,5138…, Kosten 5 × 15 / 20 = 3,75, Note 4,1319…
    const a = depot("fonds", {}, {
      halalAnlagenPunkte: { halalEtfsFonds: 10.5, halalSukuk: 2.5, halalEdelmetalle: 7 },
      finanzPunkte: { depotgebuehr: 5, app: 10 },
    });
    expect(einzig(rDepot([a]))).toMatchObject({ halal: 4.51, kosten: 3.75, note: 4.13 });
  });

  it("rechnet Teiltreffer: 6 von 22", () => {
    // Halal 5 × (2 × 5 + 1 + 0 + 2) / 36 = 1,8055…, Kosten 5, Note 3,4027…
    const a = depot("teil", { halalEtfsFonds: "5 von 12", halalSukuk: "1 von 3", halalEdelmetalle: "0 von 7" }, {
      halalAnlagenPunkte: { halalEtfsFonds: 5, halalSukuk: 1, halalEdelmetalle: 0 },
    });
    expect(einzig(rDepot([a]))).toMatchObject({ halal: 1.81, note: 3.4 });
  });

  it("zählt bei „mind. x von N“ nur die belegten Punkte", () => {
    // Halal 5 × (2 × 3 + 3 + 7 + 2) / 36 = 2,5, Kosten 5, Note 3,75
    const a = depot("mind", { halalEtfsFonds: "mind. 3 von 12" }, { halalAnlagenPunkte: { halalEtfsFonds: 3, halalSukuk: 3, halalEdelmetalle: 7 } });
    expect(einzig(rDepot([a]))).toMatchObject({ halal: 2.5, kosten: 5, note: 3.75 });
  });

  it("zählt unbelegte Zeilen als nicht vorhanden und rät nie", () => {
    // Fehlender Schlüssel, null und gar keine Punkte: jede Zeile zählt 0, das Depot bekommt trotzdem eine Note.
    const ohneSchluessel = depot("ohne", {}, { halalAnlagenPunkte: { halalSukuk: 3, halalEdelmetalle: 7 } });
    const mitNull = depot("null", {}, { halalAnlagenPunkte: { halalEtfsFonds: null, halalSukuk: 3, halalEdelmetalle: 7 } });
    const ganzOhne = depot("ganz", {}, { halalAnlagenPunkte: undefined });
    const leereZeilen = depot("leer", { halalEtfsFonds: null, halalSukuk: null, halalEdelmetalle: null });
    const r = rDepot([ohneSchluessel, mitNull, ganzOhne, leereZeilen]);
    expect(r.nichtBewertet).toHaveLength(0);
    const nach = (id: string) => r.gerankt.find((x) => x.anbieter.id === id)!;
    // Halal 5 × (0 + 3 + 7 + 2) / 36 = 1,6666…, Note 3,33. Ohne jede belegte Zeile bleibt nur Royal Mint: 5 × 2 / 36 = 0,2777…, Note 2,64
    expect(nach("ohne")).toMatchObject({ halal: 1.67, note: 3.33 });
    expect(nach("null")).toMatchObject({ halal: 1.67, note: 3.33 });
    expect(nach("ganz")).toMatchObject({ halal: 0.28, kosten: 5, note: 2.64 });
    expect(nach("leer")).toMatchObject({ halal: 0.28, kosten: 5, note: 2.64 });
  });

  it("zählt eine Zeile mit falschem N oder Punkten über N als nicht belegt", () => {
    // 8 von 8 Edelmetalle passt nicht zu N = 7, Punkte 8 liegen über 7: Zeile zählt 0, Halal 5 × (24 + 3 + 2) / 36 = 4,0277…
    const falschesN = depot("acht", { halalEdelmetalle: "8 von 8" }, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8 } });
    const zuViel = depot("viel", {}, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 9 } });
    const r = rDepot([falschesN, zuViel]);
    expect(r.nichtBewertet).toHaveLength(0);
    for (const x of r.gerankt) expect(x.halal).toBe(4.03);
  });

  it("gibt jedem Depot eine Note, auch ohne Beleg für das Tor (Regel 10)", () => {
    const r = rDepot([depot("gut"), depot("teils", { zinsfreiAbStart: "teils" }), depot("offen", { zinsfreiAbStart: null }), depot("unbekannt", { zinsfreiAbStart: "unbekannt" })]);
    expect(r.nichtBewertet).toHaveLength(0);
    expect(r.gerankt).toHaveLength(4);
    // Nicht belegtes Tor: Der Halal-Teil rechnet mit den belegten Anlagen (5), Kosten 5, Note 5. Nie Nummer 1, und die Stufe stellt es hinter die belegten.
    for (const id of ["offen", "unbekannt"]) {
      const x = r.gerankt.find((y) => y.anbieter.id === id)!;
      expect(x).toMatchObject({ halal: 5, kosten: 5, note: 5, uneingeschraenkt: false });
    }
    expect(ids(r.gerankt)).toEqual(["gut", "teils", "offen", "unbekannt"]);
    expect(ids(nummerEins(r))).toEqual(["gut"]);
  });

  it("stellt bei gleichen Kosten kein Depot ohne belegte Anlage vor eines mit belegten", () => {
    const keine = { halalEtfsFonds: 0, halalSukuk: 0, halalEdelmetalle: 0 };
    const etwas = { halalEtfsFonds: 1, halalSukuk: 0, halalEdelmetalle: 0 };
    const viel = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 };
    // Ohne Haus: auch Royal Mint ist nicht belegt, beide haben 0 Halal-Punkte.
    const r = rDepot([
      depot("keine", {}, { halalAnlagenPunkte: keine, haus: undefined }),
      depot("null", { halalEtfsFonds: null, halalSukuk: null, halalEdelmetalle: null }, { halalAnlagenPunkte: undefined, haus: undefined }),
      depot("etwas", {}, { halalAnlagenPunkte: etwas }),
      depot("viel", {}, { halalAnlagenPunkte: viel }),
    ]);
    expect(ids(r.gerankt)).toEqual(["viel", "etwas", "keine", "null"]);
    expect(r.gerankt.find((x) => x.anbieter.id === "keine")!.platz).toBe(r.gerankt.find((x) => x.anbieter.id === "null")!.platz);
  });

  it("halbiert den Halal-Teil, wenn Zinsen erst abgeschaltet werden müssen, und gibt ihn halbiert aus", () => {
    // Halal 5 × 0,5 = 2,5, Kosten 5, Note 3,75
    expect(einzig(rDepot([depot("gelb", { zinsfreiAbStart: "teils" })]))).toMatchObject({ halal: 2.5, kosten: 5, note: 3.75 });
  });

  it("zählt fehlende oder leere Finanzpunkte als Kosten 0", () => {
    // Halal 5, Kosten 0, Note 2,5
    const r = rDepot([depot("ohne", {}, { finanzPunkte: undefined }), depot("leer", {}, { finanzPunkte: {} })]);
    expect(r.nichtBewertet).toHaveLength(0);
    for (const x of r.gerankt) expect(x).toMatchObject({ halal: 5, kosten: 0, note: 2.5 });
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
  it("zieht für einen abschaltbaren Dispo („teils“) seit 24.11.2026 wieder ein Zehntel ab (Regel 12, Elias VG4-03 und VG5-01)", () => {
    // Halal 5 × (0,5 × 1 + 0,5 × 1) × 0,9 = 4,5; vom 07.11. bis 24.11.2026 ohne Abzug (5)
    const b = einzig(rGiro([giro("haspa", { keinDispoAbStart: "teils" })]));
    expect(FAKTOR_DISPO).toBe(0.9);
    expect(b.halal).toBe(4.5);
    expect(b.halalVorKredit).toBe(5);
    expect(b.uneingeschraenkt).toBe(false);
  });

  it("macht ein Konto mit abschaltbarem Dispo nie zur Nummer 1, auch mit Link und bester Note", () => {
    const r = rGiro([giro("ohne"), giro("mit-dispo", { keinDispoAbStart: "teils" }, { link: "/out/x" })]);
    expect(r.gerankt.find((b) => b.anbieter.id === "mit-dispo")!.uneingeschraenkt).toBe(false);
    expect(ids(nummerEins(r))).toEqual(["ohne"]);
  });

  it("wirkt nur auf das Girokonto: Dispo „teils“ im Krypto-Vergleich ändert nichts", () => {
    const b = einzig(rKrypto([krypto("k", { keinDispoAbStart: "teils" })]));
    expect(b.uneingeschraenkt).toBe(true);
  });

  it("rankt ein Konto mit Dispo ab Start, das Merkmal zählt 0", () => {
    // Halal 2,5, Kosten 5, Note 3,75
    expect(einzig(rGiro([giro("dkb", { keinDispoAbStart: "schlecht" })]))).toMatchObject({ halal: 2.5, note: 3.75 });
  });

  it("wertet „unbekannt“ als 0 Punkte, der Eintrag bleibt auf der Liste (Regel 10)", () => {
    const r = rGiro([giro("x", { karteOhneKredit: "unbekannt" })]);
    expect(r.nichtBewertet).toHaveLength(0);
    expect(einzig(r).halal).toBe(2.5);
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

  it("zählt einen fehlenden Einzelpreis als 0 Kostenpunkte", () => {
    const ohne = steuer("ohne");
    delete ohne.preisEinzel;
    expect(einzig(r([ohne]))).toMatchObject({ kosten: 0, halal: 5, note: 2.5 });
    expect(einzig(r([steuer("null", {}, null)])).kosten).toBe(0);
    expect(r([steuer("null", {}, null)]).nichtBewertet).toEqual([]);
  });

  it("wertet den Belegabruf als Ja/Nein", () => {
    // Leistung 5 × 0,65 = 3,25
    expect(einzig(r([steuer("ohne-abruf", { belegabruf: false })])).halal).toBe(3.25);
    // Nicht belegt zählt 0 und der Anbieter bekommt trotzdem eine Note.
    const ungeprueft = r([steuer("ungeprueft", { belegabruf: null })]);
    expect(ungeprueft.nichtBewertet).toEqual([]);
    expect(einzig(ungeprueft).halal).toBe(3.25);
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

  it("wertet einen unlesbaren Text als nicht belegt (0 Punkte)", () => {
    // Leistung 5 × (0,35 + 0,25 + 0,15) = 3,75
    expect(einzig(r([steuer("x", { vermietung: "vielleicht" })])).halal).toBe(3.75);
  });

  it("zählt „nur Windows“ als 0 und eine fehlende Plattform als nicht belegt (0 Punkte)", () => {
    // Leistung 5 × 0,85 = 4,25
    expect(einzig(r([steuer("win", { plattform: "nur Windows" })])).halal).toBe(4.25);
    expect(einzig(r([steuer("x", { plattform: null })])).halal).toBe(4.25);
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
  // Dieselben Depots wie im Depot-Vergleich (Elias, 06.10.2026). Seit 23.11.2026 (VG1) zählt der Halal-Teil zur Hälfte die
  // 7 Gold- und Silber-ETCs und zur Hälfte alle 22 Halal-Anlagen des Depots („Gold gehört zum Anlegen“). Das Kriterium
  const r = (liste: RohAnbieter[]) => rangfolge(liste, "edelmetall", { finanzMax: MAX_DEPOT });

  it("zählt im Halal-Teil halb Gold und Silber, halb alle Halal-Anlagen des Depots", () => {
    // Regel 12: Metalle (7 + Royal Mint 2) von 9 = 5, alle 5 × (7 + 2) / 36 = 1,25, Halal 3,125, Kosten 5, Note 4,0625
    const ohneRest = depot("metall", { halalEtfsFonds: "0 von 12", halalSukuk: "0 von 3" }, { halalAnlagenPunkte: { halalEtfsFonds: 0, halalSukuk: 0, halalEdelmetalle: 7 } });
    expect(einzig(r([ohneRest]))).toMatchObject({ note: 4.06, halal: 3.13, kosten: 5, uneingeschraenkt: true });
    const voll = depot("voll", {}, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 7 } });
    expect(einzig(r([voll]))).toMatchObject({ note: 5, halal: 5, kosten: 5 });
  });

  it("rechnet den Anteil der belegten Papiere und teilt mit den Kosten", () => {
    // Metalle 5 × (5 + 2) / 9 = 3,8888…, alle 5 × (24 + 3 + 5 + 2) / 36 = 4,7222…, Halal 4,3055…, Kosten 5 × 10/20 = 2,5, Note 3,4027…
    const a = depot("teil", { halalEdelmetalle: "5 von 7" }, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 5 }, finanzPunkte: { depotgebuehr: 10, app: 0 } });
    expect(einzig(r([a]))).toMatchObject({ halal: 4.31, kosten: 2.5, note: 3.4 });
  });

  it("zählt bei „mind. x von 7“ nur die belegten Papiere und Unbelegtes als 0", () => {
    // Metalle 5 × (6 + 2) / 9 = 4,4444…, alle 5 × 35/36 = 4,8611…, Halal 4,6527…; leer: Metalle 5 × 2/9, alle 5 × 29/36, Halal 2,5694…
    const mind = depot("mind", { halalEdelmetalle: "mind. 6 von 7" }, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 6 } });
    const leer = depot("leer", { halalEdelmetalle: null }, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 3 } });
    const e = r([mind, leer]);
    expect(e.nichtBewertet).toEqual([]);
    expect(e.gerankt.map((x) => [x.anbieter.id, x.halal])).toEqual([
      ["mind", 4.65],
      ["leer", 2.57],
    ]);
  });

  it("halbiert bei abschaltbaren Zinsen und rät bei rotem Zins-Tor ab", () => {
    // Halal 5 × 7/7 × 0,5 = 2,5
    const e = r([depot("gelb", { zinsfreiAbStart: "teils" }), depot("rot", { zinsfreiAbStart: "schlecht" })]);
    expect(einzig(e)).toMatchObject({ halal: 2.5, uneingeschraenkt: false });
    expect(e.abgeraten.map((x) => [x.anbieter.id, x.grund])).toEqual([["rot", "Zinsen nicht abschaltbar"]]);
  });

  it("rechnet die Kosten ohne Sparplan-Kriterien", () => {
    expect(Object.keys(EDELMETALL_FINANZ_MAX).filter((k) => /spar/i.test(k))).toEqual([]);
    for (const [k, m] of Object.entries(EDELMETALL_FINANZ_MAX)) expect(m, k).toBe(DEPOT_FINANZ_MAX[k]);
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

  it("rechnet Note, Halal und Kosten ohne Partnerlink, Finanzfluss-Rang, Etikett oder alte Note", () => {
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
    const kurz = (r: Rangliste) => r.gerankt.map((x) => [x.anbieter.id, x.note, x.halal, x.kosten]).sort();
    expect(kurz(rKrypto(mit))).toEqual(kurz(rKrypto(ohne)));
  });
});

/* ------------------------------------------- Eigener Link bei gleichen Sternen */

describe("rangfolge: eigener Link bei gleicher Sternzahl (Regel 2, Elias 06.10.2026)", () => {
  // a: Kosten 5, Note 5. b: Kosten 5 × 96 / 100 = 4,8, Note 4,9. Beide 5 Sterne.
  const a = krypto("a");
  const b = krypto("b", {}, { finanzPunkte: { gebuehren: 96 }, link: "/out/b" });

  it("stellt bei gleicher Sternzahl zuerst, was einen eigenen Link hat, die Noten bleiben", () => {
    const r = rKrypto([a, b]);
    expect(r.gerankt.map((x) => [x.anbieter.id, x.platz, x.note])).toEqual([
      ["b", 1, 4.9],
      ["a", 2, 5],
    ]);
    expect(ids(nummerEins(r))).toEqual(["b"]);
  });

  it("hebt mit Link nie über eine höhere Sternzahl, außer auf Platz 1 (Regel 6)", () => {
    // c: Kosten 5 × 60 / 100 = 3, Note 4, also 4 Sterne. a hat 5. Platz 1 nur mit Link (Elias 08.11.2026, A11:
    // „wir können nicht etwas auf die 1 packen, wo wir keinen Link haben“), dahinter wieder nach der Note.
    const c = krypto("c", {}, { finanzPunkte: { gebuehren: 60 }, link: "/out/c" });
    const d = krypto("d", {}, { finanzPunkte: { gebuehren: 50 }, link: "/out/d" });
    expect(ids(rKrypto([c, a]).gerankt)).toEqual(["c", "a"]);
    expect(ids(rKrypto([d, c, a]).gerankt)).toEqual(["c", "a", "d"]);
  });

  it("ordnet unter mehreren mit Link nach der Note", () => {
    // d: Kosten 4,6, Note 4,8, 5 Sterne, mit Link. b hat 4,9.
    const d = krypto("d", {}, { finanzPunkte: { gebuehren: 92 }, link: "/out/d" });
    // Angezeigt a 5,0, b 4,9, d 4,8: nach der angezeigten Note (A11), b als erster mit Link auf Platz 1.
    expect(ids(rKrypto([a, d, b]).gerankt)).toEqual(["b", "a", "d"]);
  });

  it("teilt den Platz nur bei gleichem Link-Stand", () => {
    const r = rKrypto([krypto("x"), krypto("y", {}, { link: "/out/y" }), krypto("z", {}, { link: "/out/z" })]);
    expect(r.gerankt.map((x) => [x.anbieter.id, x.platz])).toEqual([
      ["y", 1],
      ["z", 1],
      ["x", 3],
    ]);
    expect(ids(nummerEins(r))).toEqual(["y", "z"]);
  });

  it("gilt in Depot und Girokonto, nicht in Steuer, Screener und Edelmetall", () => {
    const mitLink = { link: "/out/x" };
    // Depot: zweiter Kosten 5 × 19 / 20 = 4,75, Note 4,88, 5 Sterne.
    expect(ids(rDepot([depot("a"), depot("b", {}, { ...mitLink, finanzPunkte: { depotgebuehr: 10, app: 9 } })]).gerankt)).toEqual(["b", "a"]);
    // Girokonto: zweiter Kosten 4,5, Note 4,75, 5 Sterne.
    expect(ids(rGiro([giro("a"), giro("b", {}, { ...mitLink, finanzPunkte: { kontofuehrung: 9 } })]).gerankt)).toEqual(["b", "a"]);
    // Edelmetall: dieselben Depots, die Note entscheidet allein.
    const metall = rangfolge([depot("a"), depot("b", {}, { ...mitLink, finanzPunkte: { depotgebuehr: 10, app: 9 } })], "edelmetall", { finanzMax: MAX_DEPOT });
    expect(ids(metall.gerankt)).toEqual(["a", "b"]);
    // Steuer: 3 € kosten Note 4,88, 5 Sterne wie das kostenlose Programm.
    expect(ids(rangfolge([steuer("a"), { ...steuer("b", {}, 3), ...mitLink }], "steuer").gerankt)).toEqual(["a", "b"]);
    // Screener: ohne Zakat Nutzen 4,17, Note 4,58, das sind 4,5 Sterne; mit gleicher Note bleibt der Name.
    expect(ids(rangfolge([screener("a"), { ...screener("b"), ...mitLink }], "screener").gerankt)).toEqual(["a", "b"]);
  });

  it("echte Daten: Die Nummer 1 in Depot, Girokonto und Krypto hat einen eigenen Link", () => {
    const eins = (liste: RohAnbieter[], kategorie: RangKategorie) => nummerEins(rangfolge(liste, kategorie));
    // Seit 24.11.2026 (Regel 13, Elias VG5-03): feste Spitze, S Broker auf 1.
    expect(ids(eins(brokerVergleich, "depot"))).toEqual(["s-broker-direkt-depot"]);
    // Elias, 12.11.2026 (RN1): „Pack Norris Bank auf die 1“. Seit 25.11.2026 (VG5-05, „beliebt“ raus) hatte BBBank BetterSmart dieselbe Note
    // wie norisbank (4,89) und stand durch den Feinwert vorn. Seit 25.11.2026 (Regel 15, Elias VG5-07) steht norisbank fest auf 1.
    expect(ids(eins(girokontoVergleich, "girokonto"))).toEqual(["norisbank-top-girokonto"]);
    expect(ids(eins(kryptoVergleich, "krypto"))).toEqual(["finst-standard"]);
    for (const [liste, kategorie] of [[brokerVergleich, "depot"], [girokontoVergleich, "girokonto"], [kryptoVergleich, "krypto"]] as const) {
      const r = rangfolge(liste, kategorie);
      for (const x of eins(liste, kategorie)) expect(x.anbieter.link, x.anbieter.id).toBeTruthy();
      // Nie steht ein Eintrag mit weniger Sternen vor einem mit mehr, außer der vorgezogenen Nummer 1 (Regel 6).
      stufenAufsteigend(kategorie, r);
      r.gerankt.slice(1).forEach((x, i) => i > 0 && gleicheStufe(kategorie, x.anbieter, r.gerankt[i].anbieter) && expect(sterne(x.note), x.anbieter.id).toBeLessThanOrEqual(sterne(r.gerankt[i].note)));
    }
  });
});

/* ------------------------------------------------- Nummer 1 und Einschränkung */

describe("rangfolge: Nummer 1 nur ohne Einschränkung (Spec 10.7)", () => {
  it("markiert Tor „teils“ und eine rote Grundlage als eingeschränkt", () => {
    const r = rGiro([giro("frei"), giro("gelb", { zinsfreiAbStart: "teils" }), giro("dispo", { keinDispoAbStart: "schlecht" })]);
    expect(Object.fromEntries(r.gerankt.map((x) => [x.anbieter.id, x.uneingeschraenkt]))).toEqual({ frei: true, gelb: false, dispo: false });
  });

  it("nimmt für die Nummer 1 den besten Eintrag ohne Einschränkung, und die Liste stellt ihn auf Platz 1 (Regel 6, Elias, 07.11.2026, raw/2026-11-07-elias-cv20f-rangfolge-ja-trading212-videos-direkt-rein.md)", () => {
    // dispo: Halal 2,5, Kosten 5, Note 3,75. frei: Halal 5, Kosten 1, Note 3. Ohne Regel 6 stünde dispo vorn.
    const r = rGiro([giro("dispo", { keinDispoAbStart: "schlecht" }), giro("frei", {}, { finanzPunkte: { kontofuehrung: 2 } })]);
    expect(ids(r.gerankt)).toEqual(["frei", "dispo"]);
    expect(r.gerankt.map((b) => b.platz)).toEqual([1, 2]);
    expect(ids(nummerEins(r))).toEqual(["frei"]);
  });

  it("lässt die Liste unverändert, wenn vorn schon ein Eintrag ohne Einschränkung steht, und ohne Kandidaten auch", () => {
    const vorn = rGiro([giro("frei"), giro("dispo", { keinDispoAbStart: "schlecht" }, { finanzPunkte: { kontofuehrung: 1 } })]);
    expect(ids(vorn.gerankt)).toEqual(["frei", "dispo"]);
    const keiner = rKrypto([krypto("gelb", { zinsfreiAbStart: "teils" })]);
    expect(ids(keiner.gerankt)).toEqual(["gelb"]);
  });

  it("liefert bei Gleichstand alle Gleichauf und ohne Kandidaten nichts", () => {
    expect(ids(nummerEins(rKrypto([krypto("b"), krypto("a")])))).toEqual(["a", "b"]);
    expect(nummerEins(rKrypto([krypto("gelb", { zinsfreiAbStart: "teils" })]))).toEqual([]);
  });

  it("kennt bei Steuer und Screener keine Einschränkung", () => {
    expect(einzig(rangfolge([steuer("a")], "steuer")).uneingeschraenkt).toBe(true);
    expect(einzig(rangfolge([screener("a")], "screener")).uneingeschraenkt).toBe(true);
  });
});

/* -------------------------------------------------------------------- Sterne */

describe("sterne", () => {
  it("rundet die Note auf halbe Sterne", () => {
    // Erst auf die angezeigte Note abgerundet (A11): 4,25 zeigt 4,2, 4,75 zeigt 4,7.
    expect([4.24, 4.25, 4.74, 4.75, 0, 5].map(sterne)).toEqual([4, 4, 4.5, 4.5, 0, 5]);
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

  it("Depot: jede Anlagenzeile mit Zahl hat gewichtete Punkte, auch „mind. x von N“", () => {
    for (const a of brokerVergleich) {
      for (const k of ["halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]) {
        const w = a.werte[k];
        if (typeof w === "string" && /^(mind\. )?\d+ von \d+$/.test(w)) expect(typeof a.halalAnlagenPunkte?.[k], `${a.id} ${k}`).toBe("number");
      }
    }
  });

  it("Depot: jedes Depot ohne rotes Zins-Tor steht in der Rangfolge, nichts bleibt unbewertet", () => {
    const r = rangfolge(brokerVergleich, "depot");
    expect(r.nichtBewertet).toEqual([]);
    expect(r.gerankt.length + r.abgeraten.length).toBe(brokerVergleich.length);
  });

  it("Edelmetall: jedes Depot des Vergleichs ist gerankt und führt mindestens ein belegtes Papier", () => {
    const r = rangfolge(edelmetallVergleich, "edelmetall");
    expect(r.nichtBewertet).toEqual([]);
    expect(r.abgeraten).toEqual([]);
    expect(r.gerankt.length).toBe(edelmetallVergleich.length);
    for (const b of r.gerankt) expect(b.halal, b.anbieter.id).toBeGreaterThan(0);
  });

  it("Steuer: jeder Anbieter hat einen Einzelpreis als Zahl oder ausdrücklich null", () => {
    for (const a of steuersoftwareVergleich) expect(a.preisEinzel === null || typeof a.preisEinzel === "number", a.id).toBe(true);
  });

  it("Steuer: ELSTER und CHECK24 teilen sich Platz 1", () => {
    const r = rangfolge(steuersoftwareVergleich, "steuer");
    expect(r.gerankt.filter((x) => x.platz === 1).map((x) => x.anbieter.id).sort()).toEqual(["check24-steuer", "elster"]);
  });

  it("Screener: Musaffa steht allein auf Platz 1, Finispia ist seit 26.09. bewertet und steht hinten", () => {
    // Finispia rechnet laut eigener Hilfe noch keinen Reinigungsbetrag aus (Ampel rot, Beleg 26.09.2026).
    const r = rangfolge(screenerVergleich, "screener");
    expect(ids(nummerEins(r))).toEqual(["musaffa"]);
    expect(ids(r.nichtBewertet)).toEqual([]);
    expect(ids(r.gerankt).at(-1)).toBe("finispia");
  });

  it("Screener: Zoya nennt seine Shariah-Berater auf der About-Seite, Gremium grün", () => {
    // zoya.finance/about, „Our Shariah Advisors“: Joe Bradford und Umer Khan (Beleg 27.09.2026).
    const zoya = screenerVergleich.find((a) => a.id === "zoya")!;
    expect(zoya.werte.gremium).toBe("gut");
    expect(zoya.quellen?.gremium?.url).toBe("https://zoya.finance/about");
    const r = rangfolge(screenerVergleich, "screener");
    expect(ids(r.gerankt).slice(0, 2)).toEqual(["musaffa", "zoya"]);
  });
});

describe("automatischer Kredit im Depot (Elias, 12.10.2026; ohne Abzug seit 07.11.2026; Platz 1 frei seit 15.11.2026)", () => {
  const flatex = () => brokerVergleich.find((a) => a.id === "flatex-depot")!;

  it("zieht seit 24.11.2026 ein Zehntel vom Halal-Teil ab und sperrt Platz 1 im Depot weiter nicht (Regel 12, Elias VG5-01: „Flatex … mit dem Dispo 10 Prozent nur runternehmen, dass er ungefähr auf 3 bis 4 kommt“)", () => {
    const r = rangfolge(brokerVergleich, "depot");
    const mit = r.gerankt.find((b) => b.anbieter.id === "flatex-depot")!;
    expect(flatex().werte.kreditAbStart).toBe("teils");
    expect(FAKTOR_KREDIT).toBe(0.9);
    expect(mit.kredit).toBe(true);
    expect(mit.uneingeschraenkt).toBe(true);
    expect(mit.halal).toBeCloseTo(mit.halalVorKredit * 0.9, 1);
    expect(mit.platz).toBe(3);
    expect(ids(nummerEins(r))).toEqual(["s-broker-direkt-depot"]);
  });

  it("sperrt Platz 1 nur noch im Edelmetall-Vergleich", () => {
    expect([...KREDIT_NIE_PLATZ_EINS]).toEqual(["edelmetall"]);
    const a = depot("mit-kredit", { kreditAbStart: "teils" }, { link: "/out/x" });
    expect(rangfolge([a], "depot", { finanzMax: MAX_DEPOT }).gerankt[0].uneingeschraenkt).toBe(true);
    expect(rangfolge([a], "edelmetall", { finanzMax: MAX_DEPOT }).gerankt[0].uneingeschraenkt).toBe(false);
  });

  it("trägt ohne Kredit-Merkmal keinen Abzug", () => {
    const a = depot("ohne", { zinsfreiAbStart: "gut" });
    const b = rangfolge([a], "depot").gerankt[0];
    expect(b.kredit).toBe(false);
    expect(b.halal).toBe(b.halalVorKredit);
  });
});

describe("Feinwert: Kleinigkeiten entscheiden nur bei sonst gleichem Stand (Elias, 14.10.2026)", () => {
  const klein = (id: string, werte: RohAnbieter["werte"]) => giro(id, werte);

  it("mittelt App-Bewertung, Geldautomaten und Support-Wege, jede Kleinigkeit zählt gleich", () => {
    // App (4,7 + 4,5) / 2 / 5 = 0,92; Automaten 5.000 / 10.000 = 0,5; Support 2 von 3 Wegen = 0,67; Mittel 0,70
    const f = feinwert(klein("x", { appIos: "4,7 / 5", appAndroid: "4,5 / 5", geldautomaten: "5.000 bis 49.750", kundenservice: "Telefon, Chat" }));
    expect(f).toBeCloseTo(0.7, 2);
  });

  it("ist 0 ohne jede Angabe und rechnet nur mit dem, was belegt ist", () => {
    expect(feinwert(klein("leer", {}))).toBe(0);
    expect(feinwert(klein("nur-app", { appIos: "5 / 5", appAndroid: "5 / 5" }))).toBe(1);
  });

  it("entscheidet bei gleicher Note, gleichen Kosten und gleichem Halal-Teil, nie davor", () => {
    const gut = klein("a-gut", { appIos: "4,8 / 5", appAndroid: "4,8 / 5" });
    const schwach = klein("b-schwach", { appIos: "3,0 / 5", appAndroid: "3,0 / 5" });
    const r = rGiro([schwach, gut]);
    expect(ids(r.gerankt)).toEqual(["a-gut", "b-schwach"]);
    expect(r.gerankt.map((b) => b.platz)).toEqual([1, 2]);
    // Eine bessere Note schlägt jeden Feinwert.
    const besser = giro("c-besser", {}, { finanzPunkte: { kontofuehrung: 10 }, werte: { zinsfreiAbStart: "gut", keinDispoAbStart: "gut", karteOhneKredit: "gut", appIos: "1 / 5" } });
    const schlechter = klein("d-schlechter", { appIos: "5 / 5", appAndroid: "5 / 5" });
    schlechter.finanzPunkte = { kontofuehrung: 5 };
    expect(ids(rGiro([schlechter, besser]).gerankt)).toEqual(["c-besser", "d-schlechter"]);
  });
});

describe("Regel 7 und 8: angezeigte Note, Halal und Kosten je zur Hälfte, kein „Bei meinen Lesern beliebt“ mehr (Elias, 08.11.2026 A11; 25.11.2026 VG5-05)", () => {
  it("ordnet nach angezeigter Note absteigend, nur Platz 1 darf vorgezogen sein (Regel 6)", () => {
    for (const kategorie of ["depot", "girokonto", "krypto"] as const) {
      const liste = { depot: brokerVergleich, girokonto: girokontoVergleich, krypto: kryptoVergleich }[kategorie];
      const r = rangfolge(liste, kategorie);
      stufenAufsteigend(kategorie, r);
      // Die feste Spitze im Depot (Regel 13) steht nach Elias' Wahl, nicht nach Note.
      r.gerankt.slice(1).forEach((x, i) => i > 0 && spitzenRang(kategorie, x.anbieter.id) < 0 && spitzenRang(kategorie, r.gerankt[i].anbieter.id) < 0 && gleicheStufe(kategorie, x.anbieter, r.gerankt[i].anbieter) && expect(anzeigeNote(x.note), x.anbieter.id).toBeLessThanOrEqual(anzeigeNote(r.gerankt[i].note)));
    }
  });
  it("Sterne in Reihe: im Depot und Girokonto fällt die angezeigte Note von Platz zu Platz nie, auch Platz 1 nicht (Elias A10); im Depot erst hinter der festen Spitze (Regel 13, VG5-03)", () => {
    for (const [liste, kategorie] of [[depotAnzeige, "depot"], [girokontoVergleich, "girokonto"]] as const) {
      const r = rangfolge(liste, kategorie);
      stufenAufsteigend(kategorie, r);
      r.gerankt.slice(1).forEach((x, i) => spitzenRang(kategorie, x.anbieter.id) < 0 && spitzenRang(kategorie, r.gerankt[i].anbieter.id) < 0 && gleicheStufe(kategorie, x.anbieter, r.gerankt[i].anbieter) && expect(anzeigeNote(x.note), x.anbieter.id).toBeLessThanOrEqual(anzeigeNote(r.gerankt[i].note)));
    }
  });
  it("Depot ab 01.12.2026: S Broker 1, Smartbroker+ 2, flatex 3, Traders Place 4, Trading 212 5, Scalable 6, BBBank 7 (Regel 13, Elias VG5-03)", () => {
    // Elias VG5-03: „Warum ist Smart Broker VS Broker? Ich würde es sonst andersrum machen. Dann Flatex, Traders Place, Trading, Scalable, BB Bank.“
    // Die Noten rechnen nach Regel 8 und 12 (Halal und Kosten je zur Hälfte), die Reihenfolge an der Spitze ist fest.
    const r = rangfolge(depotAnzeige, "depot", { finanzMax: DEPOT_FINANZ_MAX });
    expect(ids(r.gerankt.slice(0, 7))).toEqual([...DEPOT_SPITZE]);
    expect(r.gerankt.slice(0, 7).map((b) => b.platz)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // Regel 14 (Elias VG5-06): feste Noten, BBBank gerechnet.
    expect(r.gerankt.slice(0, 7).map((b) => anzeigeNote(b.note))).toEqual([4.6, 4.5, 4.5, 4.5, 4.4, 4.4, 4.4]);
    expect(r.gerankt.slice(0, 6).every((b) => typeof b.noteGerechnet === "number")).toBe(true);
    expect(r.gerankt[0].anbieter.link).toBeTruthy();
    expect(r.gerankt.slice(7).every((b) => anzeigeNote(b.note) <= 4.3)).toBe(true);
  });
  it("Girokonto: norisbank fest auf 1 (Regel 15), dann BBBank 2, Consorsbank 3, Trade Republic 4 (mit Kriterium Ausland, PH2-01), Sterne in Reihe", () => {
    const r = rangfolge(girokontoVergleich, "girokonto");
    expect(ids(r.gerankt.slice(0, 4))).toEqual(["norisbank-top-girokonto", "bbbank-bettersmart", "consorsbank-girokonto", "trade-republic-girokonto"]);
    // meine Bank (1 % im Ausland) steht hinter DKB und Revolut, nicht mehr auf Platz 3.
    expect(ids(r.gerankt.slice(4, 7))).toEqual(["dkb-girokonto", "revolut-standard", "meine-bank-mein-girokonto"]);
    // Seit 25.11.2026 (kein „beliebt“): BBBank und norisbank 4,89 mit gleichen Kosten und gleichem Halal-Teil, der Feinwert hätte BBBank vorn
    // gehalten; Regel 15 (Elias VG5-07) setzt norisbank fest auf 1. Die Noten bleiben gerechnet.
    expect(r.gerankt.slice(0, 4).map((b) => anzeigeNote(b.note))).toEqual([4.8, 4.8, 4.8, 4.7]);
    expect(r.gerankt[0].anbieter.link).toBe("/out/norisbank");
    expect(r.gerankt[0].uneingeschraenkt).toBe(true);
    expect(r.gerankt.slice(0, 2).map((b) => b.platz)).toEqual([1, 2]);
    expect(r.gerankt.some((b) => typeof b.noteGerechnet === "number")).toBe(false);
  });
  it("Girokonto Regel 15: ohne die feste Spitze stünde BBBank vorn, nur norisbank wird bewegt, der Rest bleibt in seiner Reihenfolge", () => {
    const id = (b: { anbieter: { id: string } }) => b.anbieter.id;
    const mitSpitze = rangfolge(girokontoVergleich, "girokonto").gerankt.map(id);
    expect(GIRO_SPITZE).toEqual(["norisbank-top-girokonto"]);
    expect(spitzenRang("girokonto", "norisbank-top-girokonto")).toBe(0);
    expect(spitzenRang("girokonto", "bbbank-bettersmart")).toBe(-1);
    // Ohne norisbank ist die Reihenfolge der übrigen Konten dieselbe wie mit ihr: Regel 15 ändert nur Platz 1.
    const ohneNoris = rangfolge(girokontoVergleich.filter((a) => a.id !== "norisbank-top-girokonto"), "girokonto").gerankt.map(id);
    expect(mitSpitze.filter((x) => x !== "norisbank-top-girokonto")).toEqual(ohneNoris);
    expect(ohneNoris[0]).toBe("bbbank-bettersmart");
  });
  it("Girokonto Regel 15: der Satz über der Liste sagt offen, dass Platz 1 festgelegt ist, auf der Hauptliste", () => {
    expect(sortiertSatz("Girokonto")).toContain("Platz 1 lege ich selbst fest.");
    expect(sortiertSatz("Girokonto")).toContain("je zur Hälfte");
    expect(sortiertSatz("Girokonto")).not.toMatch(/Gedankenstrich|–|—/);
    expect(reihenfolgeAntwort("Konto")).toContain(SPITZE_SATZ_GIRO);
    expect(sortiertSatz()).not.toContain("selbst fest");
    for (const datei of ["VergleichGirokonto.tsx"]) {
      const t = readFileSync(join(__dirname, "..", "pages", datei), "utf8");
      expect(t, datei).toMatch(/sortiertSatz\("Girokonto"\)|was="Girokonto"/);
    }
  });
  it("rechnet Halal und Kosten je zur Hälfte, ein Partnerlink ändert die Note nicht (seit 25.11.2026 kein „beliebt“, Elias VG5-05)", () => {
    const mitLink = depot("mit-link", {}, { link: "/out/smartbroker" });
    const ohneLink = depot("ohne-link");
    for (const kategorie of ["depot", "edelmetall"] as const) {
      const a = rangfolge([mitLink], kategorie, { finanzMax: MAX_DEPOT }).gerankt[0];
      const b = rangfolge([ohneLink], kategorie, { finanzMax: MAX_DEPOT }).gerankt[0];
      expect(a.note, kategorie).toBe(b.note);
      expect(a.note, kategorie).toBe(5);
      expect("beliebt" in a, kategorie).toBe(false);
    }
    // Ein Anbieter mit Eintrag in den Leser-Eröffnungen und einer ohne gleichen sich aus: die Zahlen rechnen in keine Note.
    const norisbank = rangfolge([giro("norisbank-top-girokonto", {}, { link: "/out/norisbank" })], "girokonto", { finanzMax: MAX_GIRO }).gerankt[0];
    const fremd = rangfolge([giro("fremdbank", {}, { link: "/out/fremd" })], "girokonto", { finanzMax: MAX_GIRO }).gerankt[0];
    expect(norisbank.note).toBe(fremd.note);
  });
  it("kein Text für Leser nennt „beliebt“, „Lesern“ oder 47,5 % (Texte, Methodik, Edelmetall-Seite)", () => {
    const texte = [
      sortiertSatz("Depot"), sortiertSatz(), reihenfolgeAntwort("Depot"), reihenfolgeAntwort("Konto"),
      readFileSync(join(__dirname, "..", "pages", "VergleichMethodik.tsx"), "utf8").replace(/\/\*[\s\S]*?\*\//g, ""),
      readFileSync(join(__dirname, "..", "pages", "VergleichEdelmetalle.tsx"), "utf8"),
    ];
    for (const t of texte) expect(t).not.toMatch(/beliebt|Lesern|47,5/i);
    expect(sortiertSatz("Depot")).toContain("Die ersten sieben Plätze und ihre Noten lege ich selbst fest.");
    expect(sortiertSatz("Depot")).toContain("je zur Hälfte");
  });
  it("die Rangfolge liest die Leser-Eröffnungen nicht mehr", () => {
    expect(readFileSync(join(__dirname, "rangfolge.ts"), "utf8")).not.toMatch(/from "@\/data\/leserEroeffnungen"|beliebtPunkte|GEWICHT_BELIEBT/);
  });
  it("zählt Eröffnungen, nie Geld, und jede Zahl hat Klicks", () => {
    for (const tabelle of Object.values(LESER_EROEFFNUNGEN))
      for (const [id, e] of Object.entries(tabelle)) {
        expect(e.klicks, id).toBeGreaterThan(0);
        expect(e.abschluesse, id).toBeLessThanOrEqual(e.klicks);
      }
  });
  it("Geld zählt nie: Provision und Deals stehen nicht in der Rangfolge", () => {
    expect(readFileSync(join(__dirname, "rangfolge.ts"), "utf8")).not.toMatch(/from "@\/data\/(deals|provision)|dealFuer\(/);
    expect(readFileSync(join(__dirname, "..", "data", "leserEroeffnungen.ts"), "utf8")).not.toMatch(/from "@\/data\/(deals|provision)|€ je Klick/);
  });
  it("eine Nummer 1 im Depot: kein zweiter Kasten, weil flatex und BBBank mit 22 von 22 gleichauf die meisten Halal-Anlagen haben", () => {
    const sieger = siegerDerSeite(depotAnzeige, "depot", DEPOT_FINANZ_MAX);
    const r = rangfolge(depotAnzeige, "depot", { finanzMax: DEPOT_FINANZ_MAX });
    expect(sieger?.id).toBe("s-broker-direkt-depot");
    expect(meisteHalalVon(depotAnzeige, DEPOT_ZEILEN, new Set(r.gerankt.map((b) => b.anbieter.id)), sieger?.id)).toBeNull();
  });
});

describe("Regel 12: Halal-ETF doppelt, Royal Mint wie ein ETF, Kredit und Dispo ab Start minus 10 % (Elias, 24.11.2026, VG4-03 und VG5-01)", () => {
  it("zählt Halal-ETFs und Fonds 2, Sukuk und Edelmetall 1, Royal Mint 2: Deutschland 36 Höchstpunkte", () => {
    expect(HALAL_GEWICHT).toEqual({ halalEtfsFonds: 2, halalSukuk: 1, halalEdelmetalle: 1 });
    expect(GEWICHT_ROYAL_MINT).toBe(2);
    expect(halalPunkte(depot("voll"))).toEqual({ punkte: 36, max: 36 });
    // Ohne Royal-Mint-Beleg: 34 von 36, Halal 5 × 34 / 36 = 4,7222…, Note 4,86
    const ohneRm = depot("ohne-rm", {}, { haus: undefined });
    expect(halalPunkte(ohneRm)).toEqual({ punkte: 34, max: 36 });
    expect(einzig(rDepot([ohneRm]))).toMatchObject({ halal: 4.72, note: 4.86 });
    // Ein Halal-ETF mehr wiegt doppelt so viel wie ein Sukuk mehr.
    const etf = depot("etf", {}, { halalAnlagenPunkte: { halalEtfsFonds: 12, halalSukuk: 2, halalEdelmetalle: 7 } });
    const sukuk = depot("sukuk", {}, { halalAnlagenPunkte: { halalEtfsFonds: 11, halalSukuk: 3, halalEdelmetalle: 7 } });
    expect(halalPunkte(etf).punkte - halalPunkte(sukuk).punkte).toBe(1);
  });

  it("zählt Royal Mint nur in den deutschen Listen, Länderlisten zählen nur dort zugelassene Papiere", () => {
    const a = depot("at", { halalEtfsFonds: "1 von 1", halalSukuk: "1 von 1", halalEdelmetalle: "1 von 1" }, { halalAnlagenPunkte: { halalEtfsFonds: 1, halalSukuk: 1, halalEdelmetalle: 1 } });
    expect(halalPunkte(a, { halalEtfsFonds: 1, halalSukuk: 1, halalEdelmetalle: 1 })).toEqual({ punkte: 4, max: 4 });
  });

  it("die Häuser mit Royal-Mint-Beleg stimmen mit der Kaufbar-Liste überein", () => {
    const e = ANLAGEN_KAUFBAR[ROYAL_MINT];
    const ausListe = new Set(e.kaufbar.flatMap((k) => [k.haus, ...(k.haeuser ?? [])]));
    expect(new Set(ROYAL_MINT_HAEUSER)).toEqual(ausListe);
    expect(e.nichtImAngebot).toEqual([]);
    // Gleiches Ergebnis wie die Zeile „Royal Mint kaufbar“ im Edelmetall-Vergleich.
    const zuId = new Map(brokerVergleich.map((x) => [x.id, x]));
    for (const g of edelmetallVergleich) expect(String(g.werte.royalMint).startsWith("ja"), g.id).toBe(halalPunkte(zuId.get(g.id)!).punkte > halalPunkte({ ...zuId.get(g.id)!, haus: undefined, finanzfluss: undefined }).punkte);
  });

  it("Smartbroker+ hat 8 von 12 Halal-ETFs: die vier HSBC-ETFs gibt es dort nicht (API leer am 24.11.2026, nur Paris, London, SIX)", () => {
    const sb = brokerVergleich.find((x) => x.id === "smartbroker-plus-depot")!;
    expect(sb.werte.halalEtfsFonds).toBe("8 von 12");
    expect(sb.werte.kreditAbStart ?? null).toBeNull();
    // 2 × 8 + 3 + 7 + 2 = 28 von 36, Halal 3,89
    expect(halalPunkte(sb)).toEqual({ punkte: 28, max: 36 });
  });
});
