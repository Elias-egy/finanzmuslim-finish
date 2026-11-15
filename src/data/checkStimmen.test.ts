import { describe, expect, it } from "vitest";
import { STIMMEN, stimmeAnzeige } from "@/data/checkStimmen";

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
