import { describe, expect, it } from "vitest";
import { BEISPIEL_STIMMEN, STIMMEN, stimmeAnzeige, stimmenFuer } from "@/data/checkStimmen";

describe("Stimmen auf der Verkaufsseite des Checks", () => {
  it("nur echte Testimonials von Elias stehen hier, keins aus den Beispielen (RN16-16: Rolf K. als erste echte)", () => {
    expect(STIMMEN.map((s) => s.name)).toEqual(["Rolf K."]);
    for (const s of STIMMEN) expect(BEISPIEL_STIMMEN.some((b) => b.zitat === s.zitat)).toBe(false);
  });

  it("Platzhalter nur im Entwicklungsmodus, im Produktionsbuild entfällt die Karte", () => {
    expect(stimmeAnzeige(0, true, [])).toBe("platzhalter");
    expect(stimmeAnzeige(1, true, [])).toBe("platzhalter");
    expect(stimmeAnzeige(0, false, [])).toBe("keine");
    expect(stimmeAnzeige(1, false, [])).toBe("keine");
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

  it("Beispiele stehen nie als echte Stimmen im Produktionsbuild: ohne echte Konto-Stimme und ohne Entwicklungsmodus keine Anzeige", () => {
    expect(stimmenFuer("konto")).toHaveLength(0);
    for (const i of [0, 1, 2]) expect(stimmeAnzeige(i, false, stimmenFuer("konto"))).toBe("keine");
  });
});
