import { describe, expect, it } from "vitest";
import { ALLE_GIRO_KNOPF_HINWEISE, giroKnopfHinweis } from "./giroKnopfHinweis";

describe("RN21: grüne Meldung am Girokonto-Knopf", () => {
  it("norisbank und BBBank tragen sie unter allen Schlüsseln, ein Depot nie", () => {
    for (const k of ["no", "norisbank", "norisbank-top-girokonto"]) expect(giroKnopfHinweis(k)?.bank).toBe("norisbank");
    for (const k of ["bb", "bbbank-bettersmart"]) expect(giroKnopfHinweis(k)?.bank).toBe("bbbank");
    for (const k of ["fl", "sb", "tp", "bbbank-depot", "consorsbank-girokonto", undefined]) expect(giroKnopfHinweis(k)).toBeUndefined();
  });

  it("nennt den Knopf der Bank wörtlich (Abruf 19.11.2026)", () => {
    expect(giroKnopfHinweis("no")?.satz).toContain("„Girokonto eröffnen“");
    expect(giroKnopfHinweis("bb")?.satz).toContain("„Jetzt Konto eröffnen“");
  });

  it("positiv: keine Angst-Wörter, keine Prämie, kein Gedankenstrich, kein Ausrufezeichen", () => {
    for (const h of ALLE_GIRO_KNOPF_HINWEISE) {
      expect(`${h.titel} ${h.satz}`).not.toMatch(/Achtung|Vorsicht|Warnung|Gefahr|haram|Prämie|€|[–—!]/);
      expect(h.titel).toBe("Girokonto komplett zinsfrei");
      expect(h.satz).toMatch(/ignorieren/);
    }
  });
});
