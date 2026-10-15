import { describe, expect, it } from "vitest";
import { brokerVergleich } from "./brokerVergleich";
import { KOSTEN_KURZ } from "./kostenKurz";

/* Eine Kurzform darf keine Zahl tragen, die nicht im belegten Satz steht. */
describe("Kurzform der Kosten", () => {
  for (const [id, felder] of Object.entries(KOSTEN_KURZ)) {
    for (const [key, kurz] of Object.entries(felder)) {
      it(`${id} ${key}`, () => {
        const anbieter = brokerVergleich.find((a) => a.id === id);
        expect(anbieter, `Anbieter ${id} fehlt`).toBeDefined();
        const lang = String(anbieter!.werte[key]);
        for (const zahl of kurz.match(/\d+(,\d+)?/g) ?? []) expect(lang).toContain(zahl);
      });
    }
  }
});
