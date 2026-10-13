import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { baueSpalten } from "@/data/vergleichHelfer";
import { GIRO_ZEILEN as GIROKONTO_ZEILEN } from "@/data/girokontoVergleich";
import { KRYPTO_ZEILEN } from "@/data/kryptoVergleich";
import { OHNE_UNTERSCHIED, PRODUKT_UNTERSCHIEDE } from "@/data/produktUnterschiede";
import { TARIF_ERNSTER, hinweiseAmAngebot, istVorteil, hatZeichen } from "./vergleichTypen";

const depot = baueSpalten(brokerVergleich, DEPOT_ZEILEN, "depot");
const giro = baueSpalten(girokontoVergleich, GIROKONTO_ZEILEN, "girokonto");
const krypto = baueSpalten(kryptoVergleich, KRYPTO_ZEILEN, "krypto");

describe("Hinweis am Angebot (Zeichen „!“)", () => {
  it("flatex trägt die Achtung beim Kredit", () => {
    const flatex = depot.find((s) => s.id.startsWith("flatex") && s.produkt.toLowerCase().includes("depot"));
    expect(flatex).toBeDefined();
    const h = hinweiseAmAngebot(flatex!, DEPOT_ZEILEN);
    expect(h.map((x) => x.art)).toContain("achtung");
  });

  it("Scalable Prime+ trägt den Tarif-Hinweis mit belegtem Satz und Elias' Ton", () => {
    const prime = depot.find((s) => s.id === "scalable-capital-prime-plus-broker");
    expect(prime).toBeDefined();
    const t = hinweiseAmAngebot(prime!, DEPOT_ZEILEN).find((x) => x.art === "tarif");
    expect(t?.text).toContain("4,99 €");
    expect(t?.text).toContain(TARIF_ERNSTER);
  });

  it("eine grüne Ampel mit „nichts einstellen“ bekommt kein Zeichen", () => {
    const alle = [...depot, ...giro, ...krypto];
    for (const s of alle) {
      const zeilen = depot.includes(s) ? DEPOT_ZEILEN : giro.includes(s) ? GIROKONTO_ZEILEN : KRYPTO_ZEILEN;
      for (const h of hinweiseAmAngebot(s, zeilen)) {
        if (h.art === "zins") {
          expect(Object.values(s.werte).some((w) => w.zusatz === h.text && w.status === "teils")).toBe(true);
        }
      }
    }
  });

  it("kein Hinweistext hat einen Gedankenstrich oder ein Ausrufezeichen", () => {
    for (const [liste, zeilen] of [[depot, DEPOT_ZEILEN], [giro, GIROKONTO_ZEILEN], [krypto, KRYPTO_ZEILEN]] as const) {
      for (const s of liste) for (const h of hinweiseAmAngebot(s, zeilen)) expect(`${h.titel} ${h.text}`, s.id).not.toMatch(/[–—!]/);
    }
  });

  it("ein Zeichen trägt nur die Ausnahme, der Unterschied der Produkte eines Hauses nie (Elias, 13.10.2026)", () => {
    let unterschiede = 0;
    for (const [liste, zeilen] of [[depot, DEPOT_ZEILEN], [giro, GIROKONTO_ZEILEN], [krypto, KRYPTO_ZEILEN]] as const) {
      for (const s of liste) for (const h of hinweiseAmAngebot(s, zeilen)) {
        expect(hatZeichen(h), `${s.id}:${h.art}`).toBe(h.art !== "unterschied");
        if (h.art === "unterschied") unterschiede += 1;
      }
    }
    expect(unterschiede).toBeGreaterThan(40);
    /* Mit Zeichen bleiben sechs Angebote von über hundert. */
    const mit = (l: typeof depot, z: typeof DEPOT_ZEILEN) => l.filter((s) => hinweiseAmAngebot(s, z).some(hatZeichen)).length;
    expect(mit(depot, DEPOT_ZEILEN) + mit(giro, GIROKONTO_ZEILEN) + mit(krypto, KRYPTO_ZEILEN)).toBe(6);
  });

  it("zählt die Warnungen und Tarife: Depot 2, Girokonto 1, Krypto 3 (Sichtung, damit das Zeichen „!“ selten bleibt)", () => {
    const n = (l: typeof depot, z: typeof DEPOT_ZEILEN) =>
      l.filter((s) => hinweiseAmAngebot(s, z).some((h) => h.art !== "unterschied")).length;
    expect([n(depot, DEPOT_ZEILEN), n(giro, GIROKONTO_ZEILEN), n(krypto, KRYPTO_ZEILEN)]).toEqual([2, 1, 3]);
  });
});

describe("Unterschied zwischen den Produkten eines Hauses (Elias, 12.10.2026)", () => {
  const LISTEN = { depot: brokerVergleich, girokonto: girokontoVergleich, krypto: kryptoVergleich } as const;
  const KATEGORIEN = Object.keys(LISTEN) as Array<keyof typeof LISTEN>;
  const saetze = KATEGORIEN.flatMap((k) => Object.entries(PRODUKT_UNTERSCHIEDE[k]).map(([id, u]) => ({ k, id, u })));

  it("jeder Satz gehört zu einem Angebot seines Vergleichs, dessen Haus dort mehrere Produkte führt", () => {
    for (const { k, id } of saetze) {
      const a = LISTEN[k].find((x) => x.id === id);
      expect(a, `${k}:${id}`).toBeDefined();
      expect(LISTEN[k].filter((x) => x.name === a!.name).length, `${k}:${id}`).toBeGreaterThan(1);
    }
  });

  it("jeder Satz hat einen Beleg, höchstens zwei Sätze und kein Wort zu Zinsen, Kredit, Versicherung oder halal", () => {
    for (const { id, u } of saetze) {
      expect(u.beleg.length, id).toBeGreaterThan(10);
      expect(u.satz.split(/(?<=[.!?])\s+/).length, id).toBeLessThanOrEqual(2);
      expect(`${u.titel} ${u.satz}`, id).not.toMatch(/Zins|Kredit|Dispo|Tagesgeld|Versicher|Staking|Hebel|halal|haram|[–—!]/i);
    }
  });

  it("Girokonto: jedes Konto eines Hauses mit mehreren Konten trägt den Satz oder steht mit Grund auf der Liste", () => {
    const mehrfach = girokontoVergleich.filter((a) => girokontoVergleich.filter((x) => x.name === a.name).length > 1);
    expect(new Set(mehrfach.map((a) => a.name)).size).toBe(11);
    expect(mehrfach.length).toBe(33);
    for (const a of mehrfach) {
      const satz = Boolean(PRODUKT_UNTERSCHIEDE.girokonto[a.id]);
      const grund = OHNE_UNTERSCHIED.girokonto[a.id];
      expect(satz || (grund ?? "").length > 10, a.id).toBe(true);
      expect(satz && Boolean(grund), `${a.id} steht doppelt`).toBe(false);
    }
    const mit = giro.filter((s) => hinweiseAmAngebot(s, GIROKONTO_ZEILEN).some((h) => h.art === "unterschied"));
    expect(mit.length).toBe(mehrfach.filter((a) => PRODUKT_UNTERSCHIEDE.girokonto[a.id]).length);
  });

  it("Krypto: jedes Produkt eines Hauses mit mehreren Produkten trägt den Satz oder steht mit Grund auf der Liste", () => {
    const mehrfach = kryptoVergleich.filter((a) => kryptoVergleich.filter((x) => x.name === a.name).length > 1);
    expect(new Set(mehrfach.map((a) => a.name)).size).toBe(4);
    expect(mehrfach.length).toBe(8);
    for (const a of mehrfach) {
      const satz = Boolean(PRODUKT_UNTERSCHIEDE.krypto[a.id]);
      const grund = OHNE_UNTERSCHIED.krypto[a.id];
      expect(satz || (grund ?? "").length > 10, a.id).toBe(true);
      expect(satz && Boolean(grund), `${a.id} steht doppelt`).toBe(false);
    }
    const mit = krypto.filter((s) => hinweiseAmAngebot(s, KRYPTO_ZEILEN).some((h) => h.art === "unterschied"));
    expect(mit.length).toBe(mehrfach.filter((a) => PRODUKT_UNTERSCHIEDE.krypto[a.id]).length);
  });

  it("dieselbe Kennung in zwei Vergleichen: Revolut Standard als Depot trägt nicht den Satz des Girokontos", () => {
    const alsDepot = depot.find((s) => s.id === "revolut-standard");
    const alsKonto = giro.find((s) => s.id === "revolut-standard");
    expect(alsDepot && alsKonto).toBeTruthy();
    expect(hinweiseAmAngebot(alsDepot!, DEPOT_ZEILEN).some((h) => h.art === "unterschied")).toBe(false);
    expect(hinweiseAmAngebot(alsKonto!, GIROKONTO_ZEILEN).some((h) => h.art === "unterschied")).toBe(true);
  });

  it("die Sätze eines Hauses tragen in einem Vergleich denselben Titel", () => {
    for (const k of KATEGORIEN) {
      for (const name of new Set(LISTEN[k].map((a) => a.name))) {
        const titel = new Set(LISTEN[k].filter((a) => a.name === name && PRODUKT_UNTERSCHIEDE[k][a.id]).map((a) => PRODUKT_UNTERSCHIEDE[k][a.id].titel));
        expect(titel.size, `${k}:${name}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("steht als violetter Hinweis beim Angebot: fünf Depots, Scalable Prime+ behält seinen Tarif-Satz", () => {
    const mit = depot.filter((s) => hinweiseAmAngebot(s, DEPOT_ZEILEN).some((h) => h.art === "unterschied")).map((s) => s.id).sort();
    expect(mit).toEqual(["comdirect-depot", "comdirect-pure-depot", "finvesto-depot", "finvesto-depot-basis", "scalable-capital-free-broker"]);
    for (const s of depot) for (const h of hinweiseAmAngebot(s, DEPOT_ZEILEN)) if (h.art === "unterschied") expect(istVorteil(h)).toBe(true);
    const prime = depot.find((s) => s.id === "scalable-capital-prime-plus-broker")!;
    expect(hinweiseAmAngebot(prime, DEPOT_ZEILEN).map((h) => h.art)).toEqual(["tarif"]);
  });
});
