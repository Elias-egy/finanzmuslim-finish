import { describe, expect, it } from "vitest";
import { ampelGut, ANTEIL_N, BASIS, euro, finanzNote, mindestensEins, werteAus, type Auswahl } from "@/lib/vergleichAssistent";
import { nummerEins, rangfolge } from "@/lib/rangfolge";
import { DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { aktiveFragen, auswahlAus, bausteine, empfehlbar, fragen, kostenlosReicht, type Antworten, type BausteinId, type Wirkung } from "@/data/vergleichAssistent";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { motive } from "@/components/motive";
import { dealFuer, deals, hoechsterBonus, laufendeDeals, schildText } from "@/data/deals";

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
const ids = (xs: Array<{ anbieter: RohAnbieter }>) => xs.map((x) => x.anbieter.id);
const istZinsKategorie = (k: string): k is keyof typeof BASIS => k in BASIS;

describe("geführter Vergleich", () => {
  it("empfiehlt nie einen Anbieter, dessen Zinsen sich nicht abschalten lassen", () => {
    const liste = [krypto("rot", { zinsfreiAbStart: "schlecht" }, { gebuehren: 100, sicherheit: 50 }), krypto("gruen", {})];
    const e = werteAus(liste, "krypto", MAX, leer);
    expect([...e.passt, ...e.ungeprueft].map((t) => t.anbieter.id)).toEqual(["gruen"]);
    expect(e.raus).toBe(1);
  });

  it("lässt einen unbekannten Wert nie als erfüllt gelten", () => {
    const liste = [krypto("unbekannt", { eigeneWallet: null }), krypto("status-unbekannt", { eigeneWallet: "unbekannt" }), krypto("ja", {}), krypto("nein", { eigeneWallet: "schlecht" })];
    const e = werteAus(liste, "krypto", MAX, wallet);
    expect(e.passt.map((t) => t.anbieter.id)).toEqual(["ja"]);
    expect(e.ungeprueft.map((t) => t.anbieter.id).sort()).toEqual(["status-unbekannt", "unbekannt"]);
    expect(e.raus).toBe(1);
  });

  it("stellt einen ungeprüften Türsteher nicht unter die passenden", () => {
    const e = werteAus([krypto("offen", { zinsfreiAbStart: null })], "krypto", MAX, leer);
    expect(e.passt).toHaveLength(0);
    expect(e.ungeprueft).toHaveLength(1);
  });

  it("ändert nichts, wenn nur der Partnerlink dazukommt", () => {
    const ohne = [krypto("a", {}, { gebuehren: 80, sicherheit: 10 }), krypto("b", {}, { gebuehren: 60, sicherheit: 50 })];
    const mit = [krypto("a", {}, { gebuehren: 80, sicherheit: 10 }), krypto("b", {}, { gebuehren: 60, sicherheit: 50 }, "/out/b")];
    const x = werteAus(ohne, "krypto", MAX, leer);
    const y = werteAus(mit, "krypto", MAX, leer);
    expect(y.passt.map((t) => [t.anbieter.id, t.sortWert, t.note])).toEqual(x.passt.map((t) => [t.anbieter.id, t.sortWert, t.note]));
  });

  it("liefert bei gleichen Antworten dieselbe Reihenfolge, egal wie die Liste sortiert ist", () => {
    const liste = [krypto("c", {}), krypto("a", {}), krypto("b", {})];
    const vor = werteAus(liste, "krypto", MAX, leer).passt.map((t) => t.anbieter.id);
    const zurueck = werteAus([...liste].reverse(), "krypto", MAX, leer).passt.map((t) => t.anbieter.id);
    expect(vor).toEqual(["a", "b", "c"]);
    expect(zurueck).toEqual(vor);
  });

  it("ordnet ohne Antworten wie die Rangfolge, der Finanzfluss-Rang zählt nicht", () => {
    const depot = (id: string, werte: RohAnbieter["werte"], punkte: Record<string, number>, rang: number): RohAnbieter => ({
      id,
      name: id,
      produkt: "Depot",
      werte: { zinsfreiAbStart: "gut", ...werte },
      halalAnlagenPunkte: punkte,
      finanzfluss: { produkt: id, partnerlink: null, rang },
      finanzPunkte: { gebuehren: 50, sicherheit: 25 },
    });
    const zeilen = (x: number, y: number, z: number) => ({ halalEtfsFonds: `${x} von 12`, halalSukuk: `${y} von 3`, halalEdelmetalle: `${z} von 7` });
    const punkte = (x: number, y: number, z: number) => ({ halalEtfsFonds: x, halalSukuk: y, halalEdelmetalle: z });
    const voll = depot("voll", zeilen(12, 3, 7), punkte(12, 3, 7), 55);
    const paketA = depot("paket-a", zeilen(6, 1, 4), punkte(6, 1, 4), 20);
    const paketB = depot("paket-b", zeilen(6, 1, 4), punkte(6, 1, 4), 2);
    const wenig = depot("wenig", zeilen(2, 0, 1), punkte(2, 0, 1), 1);
    const liste = [wenig, paketA, voll, paketB];
    const e = werteAus(liste, "depot", { gebuehren: 100, sicherheit: 50 }, leer);
    expect(ids(e.passt)).toEqual(["voll", "paket-a", "paket-b", "wenig"]);
    expect(ids(e.passt)).toEqual(ids(rangfolge(liste, "depot", { finanzMax: { gebuehren: 100, sicherheit: 50 } }).gerankt));
  });

  it("zeigt die Note der Rangfolge und ordnet nach ihr", () => {
    const liste = [krypto("a", {}, { gebuehren: 0, sicherheit: 0 }), krypto("z", {}, { gebuehren: 100, sicherheit: 50 })];
    const e = werteAus(liste, "krypto", MAX, leer);
    expect(e.passt.map((t) => [t.anbieter.id, t.note?.gesamt])).toEqual([
      ["z", 5],
      ["a", 2.5],
    ]);
  });

  it("lässt Ungeprüftes nie nach vorn rücken", () => {
    const geprueft = krypto("geprueft", {});
    const luecke = krypto("luecke", { echteCoins: null, eigeneWallet: null }, { gebuehren: 100, sicherheit: 50 });
    const e = werteAus([luecke, geprueft], "krypto", MAX, leer);
    expect(ids(e.passt)).toEqual(["geprueft"]);
    expect(ids(e.ungeprueft)).toEqual(["luecke"]);
    expect(e.ungeprueft[0].note).toBeNull();
  });

  it("schlägt nie vor, wer Zinsen erst abschalten muss oder Kredit, Dispo, Zinsbindung voreinstellt", () => {
    const liste = [krypto("abschaltbar", { zinsfreiAbStart: "teils" }), krypto("zinsmodell", { zinsfreiesModell: "schlecht" }), krypto("sauber", {})];
    const e = werteAus(liste, "krypto", MAX, leer);
    expect([...e.passt, ...e.ungeprueft].map((t) => t.anbieter.id)).toEqual(["sauber"]);
    expect(e.raus).toBe(2);
    for (const b of bausteine) {
      if (!istZinsKategorie(b.kategorie)) continue;
      const alle = werteAus(b.anbieter, b.kategorie, b.finanzMax, { wuensche: [], gewichte: [] });
      for (const t of [...alle.passt, ...alle.ungeprueft]) {
        expect(t.anbieter.werte.zinsfreiAbStart, t.anbieter.name).not.toBe("teils");
        for (const k of BASIS[b.kategorie]) expect(t.anbieter.werte[k], `${t.anbieter.name} ${k}`).not.toBe("schlecht");
      }
    }
  });

  it("fragt keine Halal-Grundlage ab", () => {
    const text = fragen.flatMap((f) => [f.titel, ...f.antworten.map((x) => x.titel)]).join(" ");
    expect(text).not.toMatch(/Zins|Kredit|Dispo/i);
  });

  it("zeigt einen Bonus nur mit Betrag, Quelle und laufender Frist", () => {
    const ids = new Set(["dkb-girokonto"]);
    const basis = { anbieter: "DKB", titel: "x", vorteil: "x", bedingungen: "x", anbieterIds: ["dkb-girokonto"] };
    const quelle = { url: "https://example.org", stand: "15.09.2026" };
    expect(hoechsterBonus(ids, "2026-09-19", [])).toBe(0);
    expect(hoechsterBonus(ids, "2026-09-19", [{ ...basis, betrag: 200 }])).toBe(0);
    expect(hoechsterBonus(ids, "2026-09-19", [{ ...basis, betrag: 200, quelle, gueltigBis: "2026-09-01" }])).toBe(0);
    expect(hoechsterBonus(ids, "2026-09-19", [{ ...basis, betrag: 200, quelle }, { ...basis, betrag: 75, quelle }])).toBe(200);
    expect(hoechsterBonus(new Set(["n26-standard"]), "2026-09-19", [{ ...basis, betrag: 200, quelle }])).toBe(0);
  });

  it("zeigt je Anbieter den höchsten laufenden, belegten Deal", () => {
    const quelle = { url: "https://example.org", stand: "15.09.2026" };
    const d = (betrag: number, extra = {}) => ({ anbieter: "X", titel: "x", vorteil: "x", bedingungen: "x", anbieterIds: ["x"], betrag, quelle, ...extra });
    expect(dealFuer("x", [], "2026-09-19")).toBeNull();
    expect(dealFuer("x", [d(50), d(200), d(999, { gueltigBis: "2026-01-01" })], "2026-09-19")?.betrag).toBe(200);
    expect(dealFuer("y", [d(200)], "2026-09-19")).toBeNull();
    expect(dealFuer("x", [{ ...d(200), quelle: undefined }], "2026-09-19")).toBeNull();
    // Ein Abruf, der älter als drei Wochen ist, zählt nicht mehr.
    expect(dealFuer("x", [d(200)], "2026-10-06")?.betrag).toBe(200);
    expect(dealFuer("x", [d(200)], "2026-10-07")).toBeNull();
  });

  it("zeigt nie Zinsen als Bonus und schreibt Schilder richtig", () => {
    for (const x of deals) {
      expect(`${x.titel} ${x.vorteil} ${x.schild ?? ""}`, x.anbieter).not.toMatch(/zins|p\.a\./i);
      expect(schildText(x), x.anbieter).not.toMatch(/zins|p\.a\./i);
    }
    expect(schildText({ anbieter: "a", titel: "", vorteil: "", bedingungen: "", betrag: 200, bisZu: true })).toBe("bis zu 200 € Bonus");
    expect(schildText({ anbieter: "a", titel: "", vorteil: "", bedingungen: "", betrag: 20, schild: "20 € in BTC" })).toBe("20 € in BTC");
  });

  it("belegt jeden Bonus beim Anbieter selbst und ordnet ihn einem Bereich zu", () => {
    for (const x of deals) {
      expect(x.quelle?.url, x.anbieter).toBeTruthy();
      expect(x.quelle!.url, x.anbieter).not.toMatch(/finanzfluss/i);
      expect(x.bereich, x.anbieter).toBeTruthy();
    }
  });

  it("zeigt auf /deals nur laufende Boni, den höchsten zuerst", () => {
    const d = (betrag: number, extra = {}) => ({
      anbieter: "a", titel: "", vorteil: "", bedingungen: "", betrag,
      quelle: { url: "https://anbieter.de", stand: "15.09.2026" }, ...extra,
    });
    const liste = [d(50), d(200), d(999, { gueltigBis: "2026-01-01" })];
    expect(laufendeDeals("2026-09-19", liste).map((x) => x.betrag)).toEqual([200, 50]);
    expect(laufendeDeals("2026-10-07", liste)).toEqual([]);
  });

  it("hängt keinen Bonus an eine ID, die in mehreren Vergleichen vorkommt", () => {
    // revolut-standard und vivid-standard gibt es als Depot und als Girokonto. Ein Bonus
    // daran würde im falschen Vergleich auftauchen. Erst die ID eindeutig machen.
    const zaehler = new Map<string, number>();
    for (const b of bausteine) for (const a of b.anbieter) zaehler.set(a.id, (zaehler.get(a.id) ?? 0) + 1);
    for (const x of deals) for (const id of x.anbieterIds ?? []) expect(zaehler.get(id), `${x.anbieter}: ${id}`).toBe(1);
  });

  it("ordnet jeden Bonus einem Anbieter zu, den es gibt", () => {
    const alle = new Set(bausteine.flatMap((b) => b.anbieter.map((a) => a.id)));
    for (const x of deals) for (const id of x.anbieterIds ?? []) expect(alle.has(id), `${x.anbieter}: ${id}`).toBe(true);
  });

  it("sortiert nach der gewählten Priorität", () => {
    const liste = [krypto("teuer-sicher", {}, { gebuehren: 10, sicherheit: 50 }), krypto("guenstig", {}, { gebuehren: 90, sicherheit: 0 })];
    const kosten: Auswahl = { ...leer, prioritaet: { id: "k", label: "Kosten", gewichte: { gebuehren: 2 }, fakten: [] } };
    expect(werteAus(liste, "krypto", MAX, kosten).passt[0].anbieter.id).toBe("guenstig");
  });

  it("rechnet ohne Gewichte dieselbe Finanznote wie der Kosten-Teil der Rangfolge", () => {
    const a = krypto("a", {}, { gebuehren: 70, sicherheit: 20 });
    expect(finanzNote(a, MAX, [])).toBeCloseTo(rangfolge([a], "krypto", { finanzMax: MAX }).gerankt[0].kosten!, 2);
  });

  it("verschiebt mit Gewichten die Rangfolge, aber weder Halal-Teil noch angezeigte Note", () => {
    const liste = [krypto("guenstig", {}, { gebuehren: 100, sicherheit: 0 }), krypto("sicher", {}, { gebuehren: 40, sicherheit: 50 })];
    const sicherheit: Auswahl = { ...leer, prioritaet: { id: "s", label: "Sicherheit", gewichte: { sicherheit: 5 }, fakten: [] } };
    const ohne = werteAus(liste, "krypto", MAX, leer);
    const mit = werteAus(liste, "krypto", MAX, sicherheit);
    expect(ohne.passt[0].anbieter.id).toBe("guenstig");
    expect(mit.passt[0].anbieter.id).toBe("sicher");
    expect(mit.passt.map((t) => t.note!.halal)).toEqual([5, 5]);
    const noten = (e: typeof ohne) => Object.fromEntries(e.passt.map((t) => [t.anbieter.id, t.note!.gesamt]));
    expect(noten(mit)).toEqual(noten(ohne));
  });

  it("nimmt nur fertig bewertete Anbieter in die Rangfolge", () => {
    const liste = [krypto("fertig", {}), krypto("luecke", { zinsfreiesModell: null }, { gebuehren: 100, sicherheit: 50 })];
    const e = werteAus(liste, "krypto", MAX, leer);
    expect(e.passt.map((t) => t.anbieter.id)).toEqual(["fertig"]);
    expect(e.ungeprueft.map((t) => t.anbieter.id)).toEqual(["luecke"]);
  });

  it("kennt dieselben Anlagenzahlen wie die Zeilentexte des Depot-Vergleichs", () => {
    for (const [key, n] of Object.entries(ANTEIL_N)) {
      expect(DEPOT_ZEILEN.find((z) => z.key === key)?.hinweis, key).toContain(`der ${n} `);
    }
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

describe("geführter Vergleich und Rangfolge sind eins (Spec 6 und 10.7)", () => {
  it.each(bausteine.map((b) => [b.id, b] as const))("%s: ohne Antworten dieselbe Reihenfolge wie die Rangfolge, nur ohne Einschränkung", (_id, b) => {
    const r = rangfolge(b.anbieter, b.kategorie, { finanzMax: b.finanzMax });
    expect(ids(werteAus(b.anbieter, b.kategorie, b.finanzMax, leer).passt)).toEqual(ids(r.gerankt.filter((x) => x.uneingeschraenkt)));
  });

  it.each(bausteine.map((b) => [b.id, b] as const))("%s: dieselbe Nummer 1 wie der Kasten der Vergleichsseite", (_id, b) => {
    const eins = ids(nummerEins(rangfolge(b.anbieter, b.kategorie, { finanzMax: b.finanzMax })));
    const erster = werteAus(b.anbieter, b.kategorie, b.finanzMax, leer).passt[0];
    if (eins.length === 0) expect(erster).toBeUndefined();
    else expect(eins).toContain(erster.anbieter.id);
  });

  it.each(bausteine.map((b) => [b.id, b] as const))("%s: nicht Bewertete ohne Einschränkung stehen unter ungeprüft", (_id, b) => {
    const r = rangfolge(b.anbieter, b.kategorie, { finanzMax: b.finanzMax });
    const e = werteAus(b.anbieter, b.kategorie, b.finanzMax, leer);
    const eingeschraenkt = (a: RohAnbieter) =>
      istZinsKategorie(b.kategorie) && (a.werte.zinsfreiAbStart === "teils" || BASIS[b.kategorie].some((k) => a.werte[k] === "schlecht"));
    const erwartet = r.nichtBewertet.filter((x) => !eingeschraenkt(x.anbieter)).map((x) => x.anbieter.id).sort();
    expect(ids(e.ungeprueft).sort()).toEqual(erwartet);
  });

  it("eine Priorität ändert nie Halal-Teil, Note oder Gruppe", () => {
    const d = bausteine.find((b) => b.id === "depot")!;
    const kosten = auswahlAus("depot", { vorhaben: ["anlegen"], wichtig: ["kosten"] });
    const ohne = werteAus(d.anbieter, d.kategorie, d.finanzMax, leer);
    const mit = werteAus(d.anbieter, d.kategorie, d.finanzMax, { ...kosten, wuensche: [] });
    expect(ids(mit.passt).sort()).toEqual(ids(ohne.passt).sort());
    expect(ids(mit.ungeprueft).sort()).toEqual(ids(ohne.ungeprueft).sort());
    expect(mit.raus).toBe(ohne.raus);
    const noten = (e: typeof ohne) => Object.fromEntries(e.passt.map((t) => [t.anbieter.id, [t.note?.gesamt, t.note?.halal]]));
    expect(noten(mit)).toEqual(noten(ohne));
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
  const ids = (a: Antworten) => aktiveFragen(a).map((f) => f.id);
  const aktiv = (a: Antworten) => bausteine.filter((b) => b.aktiv(a)).map((b) => b.id);

  it("fragt nur, was zum Vorhaben gehört", () => {
    expect(ids({})).toEqual(["vorhaben"]);
    expect(ids({ vorhaben: ["konto"] })).toEqual(["vorhaben", "kontoPreis", "alltag", "kontoWichtig"]);
    expect(ids({ vorhaben: ["steuer"] })).toEqual(["vorhaben", "steuerLage"]);
    expect(ids({ vorhaben: ["anlegen"] })).toEqual(["vorhaben", "betrag", "dauer", "bestimmtes", "region", "wichtig"]);
  });

  it("gibt jeder Antwort ein Bild, das es gibt", () => {
    for (const f of fragen) for (const x of f.antworten) expect(motive, `${f.id}/${x.id}`).toHaveProperty(x.bild);
  });

  it("nennt als Erstes nie einen Anbieter mit ungeprüftem Halal-Merkmal, wenn es einen fertig geprüften gibt", () => {
    const k = baustein("krypto");
    const e = werteAus(k.anbieter, k.kategorie, k.finanzMax, auswahlAus("krypto", { vorhaben: ["anlegen"], bestimmtes: ["krypto"] }));
    // Seit der Primärquellen-Sperre (20.09.2026) kann die Liste leer sein, bis geprüft ist.
    for (const t of e.passt) expect(t.anbieter.werte.zinsfreiAbStart, t.anbieter.name).toBe("gut");
  });

  it("stellt Folgefragen erst nach der passenden Antwort", () => {
    const nurGold: Antworten = { vorhaben: ["anlegen"], bestimmtes: ["metalle"] };
    expect(ids(nurGold)).not.toContain("region");
    const nurKrypto: Antworten = { vorhaben: ["anlegen"], bestimmtes: ["krypto"] };
    expect(ids(nurKrypto)).toContain("wallet");
    expect(ids(nurKrypto)).not.toContain("dauer");
  });

  it("baut das Paket aus den Antworten", () => {
    // Zum Depot gehört immer eine App zum Prüfen (Elias, 19.09.2026).
    expect(aktiv({ vorhaben: ["anlegen"] })).toEqual(["depot", "screener"]);
    expect(aktiv({ vorhaben: ["anlegen"], bestimmtes: ["sukuk", "metalle"] })).toEqual(["depot", "screener"]);
    expect(aktiv({ vorhaben: ["anlegen"], bestimmtes: ["krypto"] })).toEqual(["krypto"]);
    expect(aktiv({ vorhaben: ["anlegen", "konto", "steuer"], bestimmtes: ["etfs", "krypto"] })).toEqual(["depot", "screener", "krypto", "girokonto", "steuer"]);
    expect(aktiv({ vorhaben: ["konto"] })).toEqual(["girokonto"]);
  });

  it("schlägt zum Depot ein Steuerprogramm vor, das Kapitalerträge kann, aber nur als Zusatz", () => {
    const zusatz = (a: Antworten) => bausteine.filter((b) => !b.aktiv(a) && b.zusatzWenn?.(a)).map((b) => b.id);
    expect(zusatz({ vorhaben: ["anlegen"] })).toEqual(["steuer"]);
    expect(zusatz({ vorhaben: ["anlegen", "steuer"] })).toEqual([]);
    expect(zusatz({ vorhaben: ["konto"] })).toEqual([]);
    const s = baustein("steuer");
    const e = werteAus(s.anbieter, s.kategorie, s.finanzMax, auswahlAus("steuer", { ...s.zusatzAntworten, vorhaben: ["anlegen", "steuer"] }));
    expect(e.passt.every((t) => /^ja/i.test(String(t.anbieter.werte.kapital)))).toBe(true);
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
      { vorhaben: ["anlegen"], betrag: ["einmal"], dauer: ["lang"], bestimmtes: ["aktien", "krypto", "metalle"], wichtig: ["auswahl"], wallet: ["ja"] },
      { vorhaben: ["anlegen", "konto", "steuer"], betrag: ["mittel"], dauer: ["mittel"], bestimmtes: ["etfs", "sukuk"], region: ["usa"], wichtig: ["app"], kontoPreis: ["kostenlos"], alltag: ["girocard", "handy"], steuerLage: ["kapital", "selbst"] },
      { vorhaben: ["steuer"], steuerLage: ["gratis"] },
      { vorhaben: ["konto"], kontoPreis: ["egal"], alltag: ["filiale", "bargeld"], kontoWichtig: ["service"] },
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

  it("stellt die beiden kostenlosen Vollprogramme gemeinsam an die Spitze", () => {
    const s = baustein("steuer");
    const e = werteAus(s.anbieter, s.kategorie, s.finanzMax, auswahlAus("steuer", { vorhaben: ["steuer"], steuerLage: ["kapital"] }));
    expect(e.passt.slice(0, 2).map((t) => [t.anbieter.name, t.note?.gesamt])).toEqual([
      ["CHECK24 Steuer", 5],
      ["Mein ELSTER", 5],
    ]);
    expect(e.passt.map((t) => t.anbieter.id)).not.toContain("steuerbot");
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

describe("Prüf-Apps", () => {
  it("liest aus dem belegten Feld, ob die kostenlose Fassung reicht", () => {
    const b = bausteine.find((x) => x.id === "screener")!;
    const lage = Object.fromEntries(b.anbieter.map((a) => [a.name, kostenlosReicht(a)]));
    expect(lage).toEqual({ Finispia: true, Islamicly: false, Musaffa: true, Zoya: true });
  });

  it("stellt die App nach vorn, die am meisten belegt, und sagt warum", () => {
    const b = bausteine.find((x) => x.id === "screener")!;
    const e = werteAus(b.anbieter, b.kategorie, b.finanzMax, auswahlAus("screener", { vorhaben: ["anlegen"], bestimmtes: ["aktien"] }));
    expect(e.passt[0].anbieter.name).toBe("Musaffa");
    expect(e.passt[0].gruende).toContain("Gelehrte stehen mit Namen dahinter");
    expect(e.passt[0].gruende.length).toBeGreaterThanOrEqual(3);
  });
});

describe("Werbung nur für Empfehlbares", () => {
  it("wirbt nie für Anbieter mit Zinsen ab Start", () => {
    for (const b of bausteine) {
      if (!istZinsKategorie(b.kategorie)) continue;
      for (const a of b.anbieter) {
        if (a.werte.zinsfreiAbStart !== "gut") expect(empfehlbar(a.id), a.name).toBe(false);
      }
    }
    expect(empfehlbar("gibt-es-nicht")).toBe(false);
  });

  it("lässt Steuerprogramme und Prüf-Apps empfehlbar wie bisher", () => {
    for (const b of bausteine) if (!istZinsKategorie(b.kategorie)) for (const a of b.anbieter) expect(empfehlbar(a.id), a.name).toBe(true);
  });
});
