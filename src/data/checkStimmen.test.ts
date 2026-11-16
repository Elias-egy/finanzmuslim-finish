import { describe, expect, it } from "vitest";
import { BEISPIEL_STIMMEN, STIMMEN, stimmeAnzeige, stimmenFuer } from "@/data/checkStimmen";

describe("Stimmen auf der Verkaufsseite des Checks", () => {
  it("es sind keine erfundenen Stimmen hinterlegt, nur echte Testimonials von Elias dürfen hier stehen", () => {
    expect(STIMMEN).toHaveLength(0);
  });

  it("Platzhalter nur im Entwicklungsmodus, im Produktionsbuild entfällt die Karte", () => {
    expect(stimmeAnzeige(0, true)).toBe("platzhalter");
    expect(stimmeAnzeige(1, true)).toBe("platzhalter");
    expect(stimmeAnzeige(0, false)).toBe("keine");
    expect(stimmeAnzeige(1, false)).toBe("keine");
  });

  it("eine echte Stimme wird in beiden Modi gezeigt", () => {
    const echt = [{ zitat: "Z", name: "N" }];
    expect(stimmeAnzeige(0, false, echt)).toBe("echt");
    expect(stimmeAnzeige(0, true, echt)).toBe("echt");
    expect(stimmeAnzeige(1, false, echt)).toBe("keine");
  });
});

describe("Stimmen je Stelle (Elias RN15-01)", () => {
  it("die Beispiele sind je Stelle da: zwei für das Konto-Ergebnis (norisbank eröffnet), eine allgemeine für die Verkaufsseite", () => {
    expect(stimmenFuer("konto", BEISPIEL_STIMMEN).filter((s) => s.art === "konto").length).toBeGreaterThanOrEqual(2);
    expect(stimmenFuer("konto", BEISPIEL_STIMMEN)[0].zitat).toMatch(/Konto bei der norisbank eröffnet/);
    const allgemein = stimmenFuer("alle", BEISPIEL_STIMMEN);
    expect(allgemein.length).toBeGreaterThanOrEqual(1);
    expect(allgemein.every((s) => s.art === "alle" || !s.art)).toBe(true);
  });

  it("Beispiele stehen nie als echte Stimmen im Produktionsbuild: STIMMEN bleibt leer, ohne Entwicklungsmodus keine Anzeige", () => {
    expect(STIMMEN).toHaveLength(0);
    for (const i of [0, 1, 2]) expect(stimmeAnzeige(i, false, stimmenFuer("konto"))).toBe("keine");
  });
});
