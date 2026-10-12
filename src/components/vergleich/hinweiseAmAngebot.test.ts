import { describe, expect, it } from "vitest";
import { brokerVergleich, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import { baueSpalten } from "@/data/vergleichHelfer";
import { GIRO_ZEILEN as GIROKONTO_ZEILEN } from "@/data/girokontoVergleich";
import { KRYPTO_ZEILEN } from "@/data/kryptoVergleich";
import { TARIF_ERNSTER, hinweiseAmAngebot } from "./vergleichTypen";

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

  it("kein Hinweistext hat einen Gedankenstrich", () => {
    for (const s of depot) {
      for (const h of hinweiseAmAngebot(s, DEPOT_ZEILEN)) expect(h.text).not.toMatch(/[–—]/);
    }
  });

  it("zählt die Zeichen: Depot 2, Girokonto 1, Krypto 3 (Sichtung, damit das Zeichen selten bleibt)", () => {
    const n = (l: typeof depot, z: typeof DEPOT_ZEILEN) => l.filter((s) => hinweiseAmAngebot(s, z).length > 0).length;
    expect([n(depot, DEPOT_ZEILEN), n(giro, GIROKONTO_ZEILEN), n(krypto, KRYPTO_ZEILEN)]).toEqual([2, 1, 3]);
  });
});
