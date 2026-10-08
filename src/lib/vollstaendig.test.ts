import { describe, expect, it } from "vitest";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import type { RohAnbieter } from "@/data/vergleichHelfer";
import { brokerVergleich, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { edelmetallVergleich, EDELMETALL_ZEILEN } from "@/data/edelmetallVergleich";
import { girokontoVergleich, GIRO_ZEILEN } from "@/data/girokontoVergleich";
import { kryptoVergleich, KRYPTO_ZEILEN } from "@/data/kryptoVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "@/data/screenerVergleich";
import { steuersoftwareVergleich, STEUER_ZEILEN } from "@/data/steuersoftwareVergleich";
import {
  depotAnzeige,
  edelmetallAnzeige,
  girokontoAnzeige,
  kryptoAnzeige,
  screenerAnzeige,
  steuerAnzeige,
} from "@/data/vergleichAnzeige";
import { rangfolge, unbelegteWerte, type RangKategorie } from "@/lib/rangfolge";
import { luecken, NUR_VOLLSTAENDIG, zeigbar } from "@/lib/vollstaendig";

/**
 * Elias, 08.10.2026: „alles rausnehmen, was wir nicht perfekt bewerten können.“ Ein Vergleich
 * zeigt nur Angebote ohne leere Zelle und ohne unbelegten Wert in der Note. Nichts ist gelöscht,
 * wer belegt wird, steht von selbst wieder da.
 */
const VERGLEICHE: Array<[string, RangKategorie, RohAnbieter[], RohAnbieter[], VergleichsZeile[]]> = [
  ["Depot", "depot", brokerVergleich, depotAnzeige, DEPOT_ZEILEN],
  ["Edelmetalle", "edelmetall", edelmetallVergleich, edelmetallAnzeige, EDELMETALL_ZEILEN],
  ["Girokonto", "girokonto", girokontoVergleich, girokontoAnzeige, GIRO_ZEILEN],
  ["Krypto", "krypto", kryptoVergleich, kryptoAnzeige, KRYPTO_ZEILEN],
  ["Halal-Aktien-Apps", "screener", screenerVergleich, screenerAnzeige, SCREENER_ZEILEN],
  ["Steuersoftware", "steuer", steuersoftwareVergleich, steuerAnzeige, STEUER_ZEILEN],
];

const gefuellt = (a: RohAnbieter, z: VergleichsZeile) => {
  const w = a.werte[z.key];
  if (z.art === "ampel") return w === "gut" || w === "teils" || w === "schlecht";
  if (z.art === "janein") return typeof w === "boolean";
  return typeof w === "string" && w.replace(/[\s–—-]/g, "") !== "";
};

describe("Nur vollständig Belegtes steht im Vergleich", () => {
  it("der Schalter ist an", () => {
    expect(NUR_VOLLSTAENDIG).toBe(true);
  });

  it.each(VERGLEICHE)("%s: keine Zelle der Tabelle ist leer", (_, __, ___, gezeigt, zeilen) => {
    const leer = gezeigt.flatMap((a) =>
      zeilen.filter((z) => !z.key.startsWith("__") && !gefuellt(a, z)).map((z) => `${a.id}: ${z.key}`),
    );
    expect(leer).toEqual([]);
  });

  it.each(VERGLEICHE)("%s: jeder Wert der Note ist belegt und jeder hat einen Platz", (_, kategorie, __, gezeigt) => {
    const r = rangfolge(gezeigt, kategorie);
    expect(r.nichtBewertet.map((x) => x.anbieter.id)).toEqual([]);
    const unbelegt = r.gerankt.flatMap((b) => unbelegteWerte(b.anbieter, kategorie).map((k) => `${b.anbieter.id}: ${k}`));
    expect(unbelegt).toEqual([]);
  });

  it.each(VERGLEICHE)("%s: nichts ist gelöscht, die Anzeige ist eine Auswahl aus den Daten", (_, __, alle, gezeigt) => {
    const ids = new Set(alle.map((a) => a.id));
    expect(gezeigt.length).toBeGreaterThan(0);
    expect(gezeigt.filter((a) => !ids.has(a.id))).toEqual([]);
  });

  it("wer belegt wird, erscheint von selbst wieder", () => {
    const tp = brokerVergleich.find((a) => a.id === "traders-place-depot")!;
    expect(zeigbar([tp], "depot", DEPOT_ZEILEN)).toEqual([]);
    expect(luecken(tp, "depot", DEPOT_ZEILEN).sort()).toEqual(["halalEdelmetalle", "halalEtfsFonds", "halalSukuk"]);
    const belegt: RohAnbieter = {
      ...tp,
      werte: { ...tp.werte, halalEtfsFonds: "5 von 12", halalSukuk: "0 von 3", halalEdelmetalle: "mind. 2 von 7" },
      halalAnlagenPunkte: { halalEtfsFonds: 5, halalSukuk: 0, halalEdelmetalle: 2 },
    };
    expect(zeigbar([belegt], "depot", DEPOT_ZEILEN).map((a) => a.id)).toEqual(["traders-place-depot"]);
  });

  it("ein Partnerlink ändert nichts daran, wer gezeigt wird", () => {
    for (const [, kategorie, alle, , zeilen] of VERGLEICHE) {
      for (const a of alle) {
        const ohne: RohAnbieter = { ...a, link: undefined };
        const mit: RohAnbieter = { ...a, link: "/out/test" };
        expect(luecken(ohne, kategorie, zeilen)).toEqual(luecken(mit, kategorie, zeilen));
      }
    }
  });

  it("eine Zahl ohne Kaufbeleg zählt als Lücke", () => {
    const a = depotAnzeige.find((x) => x.halalAnlagenPunkte)!;
    const ohneBeleg: RohAnbieter = { ...a, halalAnlagenPunkte: { ...a.halalAnlagenPunkte, halalSukuk: null } };
    expect(luecken(ohneBeleg, "depot", DEPOT_ZEILEN)).toContain("halalSukuk");
  });
});

describe("Zellen, die aus einem belegten Wert folgen", () => {
  it("Krypto: Kosten der Auszahlung stehen nur dort als nicht möglich, wo die Auszahlung belegt nicht geht", () => {
    for (const a of kryptoAnzeige) {
      const roh = kryptoVergleich.find((x) => x.id === a.id)!;
      if (a.werte.auszahlungBitcoin === "nicht möglich") {
        expect(roh.werte.eigeneWallet, a.id).toBe("schlecht");
        expect(roh.werte.auszahlungBitcoin ?? null, a.id).toBeNull();
      } else {
        expect(a.werte.auszahlungBitcoin, a.id).toBe(roh.werte.auszahlungBitcoin);
      }
    }
  });

  it("Steuer: je Kauf entfällt nur bei einem Programm, das nichts kostet", () => {
    for (const a of steuerAnzeige) {
      const roh = steuersoftwareVergleich.find((x) => x.id === a.id)!;
      if (a.werte.abgaben !== roh.werte.abgaben) {
        expect(a.werte.abgaben, a.id).toBe("entfällt");
        expect(roh.preisEinzel, a.id).toBe(0);
        expect(roh.werte.zahlung, a.id).toBe("entfällt");
      }
    }
  });
});

describe("Texte der Seiten, die Angebote beim Namen nennen", () => {
  it("Steuersoftware: die zwei kostenlosen Programme stehen im Vergleich und vorn", () => {
    const frei = steuerAnzeige.filter((a) => a.preisEinzel === 0).map((a) => a.id).sort();
    expect(frei).toEqual(["check24-steuer", "elster"]);
    const r = rangfolge(steuerAnzeige, "steuer");
    expect(r.gerankt.filter((b) => b.platz === 1).map((b) => b.anbieter.id).sort()).toEqual(["check24-steuer", "elster"]);
  });

  it("Halal-Aktien-Apps: die vier Apps aus Titel und Antworten stehen im Vergleich", () => {
    expect(screenerAnzeige.map((a) => a.id).sort()).toEqual(["finispia", "islamicly", "musaffa", "zoya"]);
  });
});
