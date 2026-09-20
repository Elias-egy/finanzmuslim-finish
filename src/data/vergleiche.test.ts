import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "./brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "./girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "./kryptoVergleich";
import { screenerVergleich, SCREENER_ZEILEN } from "./screenerVergleich";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { edelmetallVergleich, EDELMETALL_ZEILEN } from "./edelmetallVergleich";
import { bewerte, FINANZ_MAX_SUMME, HALAL_REGELN, teilKeys, type Kategorie } from "@/lib/bewertung";
import type { RohAnbieter } from "./vergleichHelfer";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";

const faelle: Array<[Kategorie, RohAnbieter[], VergleichsZeile[], Record<string, number>, number]> = [
  ["depot", brokerVergleich, DEPOT_ZEILEN, DEPOT_FINANZ_MAX, 56],
  ["girokonto", girokontoVergleich, GIRO_ZEILEN, GIRO_FINANZ_MAX, 56],
  ["krypto", kryptoVergleich, KRYPTO_ZEILEN, KRYPTO_FINANZ_MAX, 27],
];

describe.each(faelle)("Vergleichsdaten %s", (kategorie, anbieter, zeilen, max, anzahl) => {
  it("enthält alle Produkte aus dem Finanzfluss-Vergleich, jede ID einmal", () => {
    expect(anbieter).toHaveLength(anzahl);
    expect(new Set(anbieter.map((a) => a.id)).size).toBe(anzahl);
  });

  it("steht alphabetisch, Abgeratene am Ende", () => {
    const schluessel = (a: RohAnbieter) =>
      `${a.abgeraten ? 1 : 0}${`${a.name} ${a.produkt}`.toLowerCase()}`;
    const ist = anbieter.map(schluessel);
    const soll = [...ist].sort((a, b) => a.localeCompare(b, "de"));
    expect(ist).toEqual(soll);
  });

  it("gibt keinem Anbieter einen Partnerlink, von dem wir abraten", () => {
    for (const a of anbieter) {
      if (a.abgeraten) expect(a.link, a.id).toBeUndefined();
    }
  });

  it("markiert genau die Anbieter als abgeraten, bei denen ein Zins-Merkmal rot ist", () => {
    const zins = ["zinsfreiAbStart", "zinsfreiesModell"];
    for (const a of anbieter) {
      const rot = zins.some((k) => a.werte[k] === "schlecht");
      expect(Boolean(a.abgeraten), a.id).toBe(rot);
    }
  });

  it("hat für jedes Halal-Merkmal der Bewertung eine Zeile", () => {
    const regel = HALAL_REGELN[kategorie];
    const keys = zeilen.map((z) => z.key);
    for (const key of [regel.tuersteher, ...regel.teile.flatMap(teilKeys)]) {
      expect(keys).toContain(key);
    }
  });

  it("bleibt mit den Finanzpunkten unter der Höchstpunktzahl", () => {
    const summeMax = Object.values(max).reduce((a, b) => a + b, 0);
    expect(summeMax).toBe(FINANZ_MAX_SUMME[kategorie]);
    for (const a of anbieter) {
      for (const [k, v] of Object.entries(a.finanzPunkte ?? {})) {
        if (k === "abzug") continue;
        expect(v, `${a.id} ${k}`).toBeLessThanOrEqual(max[k] + 1e-9);
      }
      const summe = Object.values(a.finanzPunkte ?? {}).reduce((x, y) => x + y, 0);
      expect(summe, a.id).toBeLessThanOrEqual(summeMax);
    }
  });

  it("belegt jeden Halal-Wert mit einer Quelle", () => {
    const halal = zeilen.filter((z) => z.gruppe === "halal").map((z) => z.key);
    for (const a of anbieter) {
      for (const key of halal) {
        if (a.werte[key] !== null && a.werte[key] !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("schreibt Halal-Anlagen als 'x von N' oder 'mind. x von N'", () => {
    const gesamt: Record<string, number> = { halalEtfsFonds: 12, halalSukuk: 3, halalEdelmetalle: 8 };
    for (const a of anbieter) {
      for (const [key, n] of Object.entries(gesamt)) {
        const w = a.werte[key];
        if (w === null || w === undefined) continue;
        const m = String(w).match(/^(mind\. )?(\d+) von (\d+)$/);
        expect(m, `${a.id} ${key}: ${w}`).not.toBeNull();
        expect(Number(m![3]), `${a.id} ${key}`).toBe(n);
        expect(Number(m![2]), `${a.id} ${key}`).toBeLessThanOrEqual(n);
      }
    }
  });

  it("vergibt keine Note, wenn Zinsen nicht abschaltbar oder nicht geprüft sind", () => {
    for (const a of anbieter) {
      const b = bewerte(a, kategorie, max);
      const tuer = a.werte[HALAL_REGELN[kategorie].tuersteher];
      if (tuer !== "gut" && tuer !== "teils") {
        expect(b.status, a.id).not.toBe("bewertet");
      }
    }
  });
});

/* Der Screener-Vergleich hat keine Finanzfluss-Quelle und keine Note. Geprueft
   wird deshalb nur, was auch dort gelten muss: eindeutige IDs, alphabetische
   Reihenfolge und ein Beleg hinter jedem Halal-Wert. */
describe("Vergleichsdaten screening-apps", () => {
  it("hat eindeutige IDs und steht alphabetisch", () => {
    const namen = screenerVergleich.map((a) => a.name.toLowerCase());
    expect(new Set(screenerVergleich.map((a) => a.id)).size).toBe(screenerVergleich.length);
    expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, "de")));
  });

  it("belegt jeden eingetragenen Wert mit einer Quelle", () => {
    const keys = SCREENER_ZEILEN.filter((z) => !z.key.startsWith("__")).map((z) => z.key);
    for (const a of screenerVergleich) {
      for (const key of keys) {
        const wert = a.werte[key];
        if (wert !== null && wert !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("nennt keinen Partnerlink, weil es keine Partnerschaft gibt", () => {
    for (const a of screenerVergleich) expect(a.link, a.id).toBeUndefined();
  });
});

/* Der Edelmetall-Vergleich vergleicht Wege, keine Anbieter. Deshalb keine
   alphabetische Pruefung, aber dieselbe Belegpflicht. */
describe("Vergleichsdaten edelmetalle", () => {
  it("hat eindeutige IDs und keinen Partnerlink", () => {
    expect(new Set(edelmetallVergleich.map((a) => a.id)).size).toBe(edelmetallVergleich.length);
    for (const a of edelmetallVergleich) expect(a.link, a.id).toBeUndefined();
  });

  it("belegt jeden eingetragenen Halal-Wert mit einer Quelle", () => {
    const halal = EDELMETALL_ZEILEN.filter((z) => z.gruppe === "halal").map((z) => z.key);
    for (const a of edelmetallVergleich) {
      for (const key of halal) {
        if (a.werte[key] !== null && a.werte[key] !== undefined) {
          expect(a.quellen?.[key], `${a.id} ${key}`).toBeDefined();
        }
      }
    }
  });

  it("nennt zu jedem Weg alle vier Halal-Merkmale", () => {
    const halal = EDELMETALL_ZEILEN.filter((z) => z.gruppe === "halal").map((z) => z.key);
    for (const a of edelmetallVergleich) {
      for (const key of halal) expect(a.werte[key], `${a.id} ${key}`).not.toBeNull();
    }
  });
});

/*
 * Elias, 20.09.2026: "Wenn etwas Zinsen hat und du sagst, hat keine Zinsen, dann ist es das
 * Schlimmste, was man mir antun kann." Ein Ja bei den Zinsfragen braucht deshalb einen Beleg
 * von der Seite des Anbieters selbst. Finanzfluss, Presse oder Blogs reichen nicht.
 */
describe("Zinsfragen nur mit Beleg vom Anbieter", () => {
  const faelle = [
    ["depot", brokerVergleich, ["zinsfreiAbStart"]],
    ["girokonto", girokontoVergleich, ["zinsfreiAbStart"]],
    ["krypto", kryptoVergleich, ["zinsfreiAbStart", "zinsfreiesModell"]],
  ] as const;
  for (const [kat, liste, keys] of faelle) {
    it(kat, () => {
      for (const a of liste) {
        for (const k of keys) {
          const w = a.werte[k];
          if (w !== "gut" && w !== "teils") continue;
          const url = a.quellen?.[k]?.url ?? "";
          const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";
          const eigen = !!a.domain && (host === a.domain || host.endsWith(`.${a.domain}`) || a.domain.endsWith(`.${host}`));
          expect(eigen, `${a.name} ${a.produkt}: ${k}=${w} belegt mit ${host || "nichts"}`).toBe(true);
        }
      }
    });
  }
});

describe("Gegenprüfung 20.09.2026", () => {
  it("trennt optionale Erträge von echten Startzinsen", () => {
    const depot = (id: string) => brokerVergleich.find((a) => a.id === id)!;
    const giro = (id: string) => girokontoVergleich.find((a) => a.id === id)!;
    const krypto = (id: string) => kryptoVergleich.find((a) => a.id === id)!;
    expect(depot("trade-republic-depot").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("scalable-capital-prime-plus-broker").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("consorsbank-depot").werte.zinsfreiAbStart).toBe("gut");
    expect(depot("xtb-depot").werte.zinsfreiAbStart).toBe("schlecht");
    expect(giro("ing-girokonto").werte.zinsfreiAbStart).toBe("gut");
    expect(giro("1822direkt-girodirekt").werte.zinsfreiAbStart).toBe("gut");
    expect(giro("norisbank-top-girokonto").werte.zinsfreiAbStart).toBe("gut");
    expect(krypto("coinbase-advanced").werte.zinsfreiAbStart).toBe("gut");
    expect(krypto("bitvavo-standard").werte.zinsfreiesModell).toBe("gut");
  });

  it("stellt die zwei Trade-Republic-Goldtreffer bis zur App-Gegenprobe auf unklar", () => {
    for (const isin of ["IE00B579F325", "XS3384723154"]) {
      expect(ANLAGEN_KAUFBAR[isin].kaufbar.some((x) => x.anbieter === "Trade Republic")).toBe(false);
    }
    expect(brokerVergleich.find((a) => a.id === "trade-republic-depot")?.werte.halalEdelmetalle).toBe("mind. 6 von 8");
  });
});

/*
 * Elias, 20.09.2026: Wir haben behauptet, Invesco Physical Gold sei bei Trade Republic kaufbar,
 * ohne Einzelbeleg. Seitdem gilt fuer die Kaufbarkeit dieselbe Regel wie fuer die Zinsen:
 * Beleg aus der Wertpapiersuche oder Produktliste des Anbieters selbst. Ohne Beleg wird die
 * Zeile gar nicht gezeigt, statt sie als kaufbar auszugeben.
 */
describe("Kaufbarkeit nur mit Beleg vom Anbieter", () => {
  it("belegt jede kaufbare Anlage mit einer Seite des Anbieters", () => {
    for (const [isin, eintrag] of Object.entries(ANLAGEN_KAUFBAR)) {
      for (const k of eintrag.kaufbar) {
        const ort = `${isin} / ${k.anbieter}`;
        expect(k.beleg, ort).toBeDefined();
        expect(["anbieter", "elias"], `${ort}: quelle ${k.beleg.quelle}`).toContain(k.beleg.quelle);
        expect(k.beleg.stand, ort).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
        const host = new URL(k.beleg.url).hostname.replace(/^www\./, "");
        const eigen = k.beleg.domains.some(
          (d) => host === d || host.endsWith(`.${d}`) || d.endsWith(`.${host}`),
        );
        expect(eigen, `${ort}: belegt mit ${host}`).toBe(true);
      }
    }
  });

  it("nennt keinen Anbieter zugleich als kaufbar und als nicht im Angebot", () => {
    for (const [isin, eintrag] of Object.entries(ANLAGEN_KAUFBAR)) {
      const kaufbar = new Set(eintrag.kaufbar.map((k) => k.anbieter));
      for (const n of eintrag.nichtImAngebot) expect(kaufbar.has(n), `${isin} / ${n}`).toBe(false);
    }
  });
});
