import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { baueSpalten } from "@/data/vergleichHelfer";
import { GIRO_ZEILEN as GIROKONTO_ZEILEN } from "@/data/girokontoVergleich";
import { KRYPTO_ZEILEN } from "@/data/kryptoVergleich";
import { PRODUKT_UNTERSCHIEDE } from "@/data/produktUnterschiede";
import { TARIF_ERNSTER, hinweiseAmAngebot, istVorteil } from "./vergleichTypen";

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

  it("zählt die Warnungen und Tarife: Depot 2, Girokonto 1, Krypto 3 (Sichtung, damit das Zeichen „!“ selten bleibt)", () => {
    const n = (l: typeof depot, z: typeof DEPOT_ZEILEN) =>
      l.filter((s) => hinweiseAmAngebot(s, z).some((h) => h.art !== "unterschied")).length;
    expect([n(depot, DEPOT_ZEILEN), n(giro, GIROKONTO_ZEILEN), n(krypto, KRYPTO_ZEILEN)]).toEqual([2, 1, 3]);
  });
});

describe("Unterschied zwischen den Produkten eines Hauses (Elias, 12.10.2026)", () => {
  const alle = [...brokerVergleich, ...girokontoVergleich, ...kryptoVergleich];

  it("jeder Satz gehört zu einem Angebot, dessen Haus mehrere Produkte führt", () => {
    for (const id of Object.keys(PRODUKT_UNTERSCHIEDE)) {
      const a = alle.find((x) => x.id === id);
      expect(a, id).toBeDefined();
      expect(alle.filter((x) => x.name === a!.name).length, id).toBeGreaterThan(1);
    }
  });

  it("jeder Satz hat einen Beleg, höchstens zwei Sätze und kein Wort zu Zinsen, Kredit oder halal", () => {
    for (const [id, u] of Object.entries(PRODUKT_UNTERSCHIEDE)) {
      expect(u.beleg.length, id).toBeGreaterThan(10);
      expect(u.satz.split(/(?<=[.!?])\s+/).length, id).toBeLessThanOrEqual(2);
      expect(`${u.titel} ${u.satz}`, id).not.toMatch(/Zins|Kredit|Dispo|Tagesgeld|halal|haram|[–—!]/i);
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
