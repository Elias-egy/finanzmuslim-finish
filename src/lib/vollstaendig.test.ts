import { describe, expect, it } from "vitest";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import { baueSpalten, OFFEN, type RohAnbieter } from "@/data/vergleichHelfer";
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
import { rangfolge, STUFEN_ALLE_REIN, unbelegteWerte, type RangKategorie } from "@/lib/rangfolge";
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

/**
 * Depot und Girokonto zeigen seit VG2-04 (Elias, 23.11.2026: „Ich will jeden einzelnen Anbieter ranken“) jeden Anbieter, die Regeln 10 in
 * `rangfolge.ts` und der Block darunter prüfen sie. Alle anderen Vergleiche stehen weiter unter dem Schalter.
 */
const MIT_SCHALTER = VERGLEICHE.filter(([, kategorie]) => !STUFEN_ALLE_REIN.has(kategorie));
const OHNE_SCHALTER = VERGLEICHE.filter(([, kategorie]) => STUFEN_ALLE_REIN.has(kategorie));

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

  it.each(MIT_SCHALTER)("%s: keine Zelle der Tabelle ist leer", (_, __, ___, gezeigt, zeilen) => {
    const leer = gezeigt.flatMap((a) =>
      zeilen.filter((z) => !z.key.startsWith("__") && !gefuellt(a, z)).map((z) => `${a.id}: ${z.key}`),
    );
    expect(leer).toEqual([]);
  });

  it.each(MIT_SCHALTER)("%s: jeder Wert der Note ist belegt und jeder hat einen Platz", (_, kategorie, __, gezeigt) => {
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

  it.each(OHNE_SCHALTER)("%s: jeder Anbieter der Daten steht im Vergleich, auch ohne Beleg (Regel 10)", (_, kategorie, alle, gezeigt) => {
    expect(gezeigt.map((a) => a.id)).toEqual(alle.map((a) => a.id));
    const r = rangfolge(gezeigt, kategorie);
    expect(r.nichtBewertet.map((x) => x.anbieter.id)).toEqual([]);
    expect(r.abgeraten.map((x) => x.anbieter.id)).toEqual([]);
    expect(r.gerankt).toHaveLength(alle.length);
  });

  it("Depot: was nicht belegt ist, steht als „Offen“ in der Zelle, nicht als Strich, und zählt 0 Punkte", () => {
    const tp: RohAnbieter = {
      ...brokerVergleich.find((a) => a.id === "traders-place-depot")!,
      werte: { ...brokerVergleich.find((a) => a.id === "traders-place-depot")!.werte, zinsfreiAbStart: null, halalEtfsFonds: null, halalSukuk: null, halalEdelmetalle: null },
      halalAnlagenPunkte: undefined,
    };
    // Die Lücken bleiben bekannt (`luecken`), der Anbieter steht trotzdem da.
    expect(luecken(tp, "depot", DEPOT_ZEILEN).sort()).toEqual(["halalEdelmetalle", "halalEtfsFonds", "halalSukuk", "zinsfreiAbStart"]);
    expect(zeigbar([tp], "depot", DEPOT_ZEILEN).map((a) => a.id)).toEqual(["traders-place-depot"]);
    const sp = baueSpalten([tp], DEPOT_ZEILEN, "depot")[0];
    for (const key of ["zinsfreiAbStart", "halalEtfsFonds", "halalSukuk", "halalEdelmetalle"]) expect(sp.werte[key].text, key).toBe(OFFEN);
    expect(sp.werte.zinsfreiAbStart.status).toBe("unbekannt");
    // Kein Urteil: Kosten stehen weiter da, der Halal-Teil der Anlagen zählt nichts.
    expect(rangfolge([tp], "depot").gerankt[0]).toMatchObject({ halal: 0, uneingeschraenkt: false });
  });

  it("Krypto: wer belegt wird, erscheint von selbst wieder", () => {
    const k = kryptoAnzeige[0];
    const ohne: RohAnbieter = { ...k, werte: { ...k.werte, zinsfreiAbStart: null } };
    expect(zeigbar([ohne], "krypto", KRYPTO_ZEILEN)).toEqual([]);
    expect(luecken(ohne, "krypto", KRYPTO_ZEILEN)).toContain("zinsfreiAbStart");
    expect(zeigbar([k], "krypto", KRYPTO_ZEILEN).map((a) => a.id)).toEqual([k.id]);
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
