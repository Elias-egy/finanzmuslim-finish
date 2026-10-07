import { describe, expect, it } from "vitest";
import { brokerVergleich } from "./brokerVergleich";
import { girokontoVergleich } from "./girokontoVergleich";
import { kryptoVergleich } from "./kryptoVergleich";
import { rangfolge } from "@/lib/rangfolge";
import { ALLE_ZINS_SAETZE, zinsHinweis } from "./zinsHinweise";
import type { RohAnbieter } from "./vergleichHelfer";

const faelle: Array<["depot" | "girokonto" | "krypto", RohAnbieter[]]> = [
  ["depot", brokerVergleich],
  ["girokonto", girokontoVergleich],
  ["krypto", kryptoVergleich],
];

describe("Zins-Hinweise", () => {
  it.each(faelle)("gibt in %s jedem gerankten Angebot mit Beleg einen Satz", (kategorie, anbieter) => {
    const ohne = rangfolge(anbieter, kategorie)
      .gerankt.map((b) => b.anbieter)
      .filter((a) => a.quellen?.zinsfreiAbStart?.hinweis && !zinsHinweis(kategorie, a))
      .map((a) => a.id);
    expect(ohne).toEqual([]);
  });

  it.each(faelle)("zeigt in %s nie einen Satz ohne Beleg oder bei roter Ampel", (kategorie, anbieter) => {
    for (const a of anbieter) {
      const status = a.werte.zinsfreiAbStart;
      const belegt = Boolean(a.quellen?.zinsfreiAbStart?.hinweis);
      if (!belegt || (status !== "gut" && status !== "teils")) {
        expect(zinsHinweis(kategorie, a), a.id).toBeUndefined();
      }
    }
  });

  it.each(faelle)("sagt in %s bei gelber Ampel, dass etwas abzuschalten ist", (kategorie, anbieter) => {
    for (const a of anbieter.filter((x) => x.werte.zinsfreiAbStart === "teils")) {
      expect(zinsHinweis(kategorie, a), a.id).toMatch(/Schalte|Melde dich davon ab/);
    }
  });

  it("bleibt außerhalb von Depot, Girokonto und Krypto still", () => {
    expect(zinsHinweis("edelmetall", brokerVergleich[0])).toBeUndefined();
    expect(zinsHinweis(undefined, brokerVergleich[0])).toBeUndefined();
  });

  it("enthält keine Wörter aus der Recherche und höchstens zwei Sätze", () => {
    const verboten =
      /Ticket|Gegenprobe|Bestätig|schriftlich|geprüft|Chrome|Anfrage|Beleg|Stand |noch nicht|fehlt|steht aus|\bderzeit\b|aktuell|[–—!]/i;
    for (const satz of ALLE_ZINS_SAETZE) {
      expect(satz, satz).not.toMatch(verboten);
      expect(satz.length, satz).toBeLessThanOrEqual(150);
      expect(satz.replace("finanzen.net", "finanzen").match(/\.(\s|$)/g)?.length, satz).toBeLessThanOrEqual(2);
    }
  });
});
