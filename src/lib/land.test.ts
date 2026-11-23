import { describe, expect, it } from "vitest";
import {
  LAND_COOKIE,
  erkenneLand,
  istRobot,
  landAusCookie,
  landAusPfad,
  landCookieText,
  landPfad,
  ohneLandPraefix,
  zielLand,
} from "./land";

describe("Länderadressen (DACH1)", () => {
  it("erkennt das Land aus der Adresse", () => {
    expect(landAusPfad("/vergleich/depot")).toBe("de");
    expect(landAusPfad("/at/vergleich/depot")).toBe("at");
    expect(landAusPfad("/ch/vergleiche")).toBe("ch");
    expect(landAusPfad("/at")).toBe("at");
    // Eine Adresse, die nur so anfängt, ist keine Länderadresse.
    expect(landAusPfad("/atlas")).toBe("de");
    expect(landAusPfad("/chronik/x")).toBe("de");
  });

  it("wechselt das Land und behält die Seite", () => {
    expect(landPfad("/vergleich/depot", "at")).toBe("/at/vergleich/depot");
    expect(landPfad("/at/vergleich/depot", "ch")).toBe("/ch/vergleich/depot");
    expect(landPfad("/ch/vergleich/depot", "de")).toBe("/vergleich/depot");
    expect(landPfad("/", "at")).toBe("/at");
    expect(ohneLandPraefix("/at")).toBe("/");
    expect(ohneLandPraefix("/vergleiche")).toBe("/vergleiche");
  });
});

describe("Länderwahl merken (DACH1)", () => {
  it("liest und schreibt nur die Wahl", () => {
    expect(landAusCookie("a=1; fm_land=at; b=2")).toBe("at");
    expect(landAusCookie("fm_land=xx")).toBeNull();
    expect(landAusCookie("")).toBeNull();
    const text = landCookieText("ch");
    expect(text.startsWith(`${LAND_COOKIE}=ch;`)).toBe(true);
    expect(text).toContain("SameSite=Lax");
    expect(text).toContain("Max-Age=31536000");
  });
});

describe("Land erkennen (DACH1)", () => {
  it("nimmt zuerst die Region der Sprache", () => {
    expect(erkenneLand(["de-AT", "de"], "Europe/Berlin")).toBe("at");
    expect(erkenneLand(["de-CH"], "Europe/Berlin")).toBe("ch");
    expect(erkenneLand(["en-US", "de-AT"], null)).toBe("at");
  });
  it("nimmt sonst die Zeitzone", () => {
    expect(erkenneLand(["de-DE"], "Europe/Vienna")).toBe("at");
    expect(erkenneLand(["de"], "Europe/Zurich")).toBe("ch");
  });
  it("bleibt bei Deutschland, wenn nichts eindeutig ist (auch für Crawler aus den USA)", () => {
    expect(erkenneLand(["en-US"], "America/Los_Angeles")).toBe("de");
    expect(erkenneLand([], undefined)).toBe("de");
    expect(erkenneLand(["de-DE"], "Europe/Berlin")).toBe("de");
  });
});

describe("Roboter nie umleiten (DACH1)", () => {
  it("erkennt Crawler, Vorschauen und den Build", () => {
    expect(istRobot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)")).toBe(true);
    expect(istRobot("Mozilla/5.0 AppleWebKit HeadlessChrome/120.0")).toBe(true);
    expect(istRobot("WhatsApp/2.23")).toBe(true);
    expect(istRobot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Safari/604.1", true)).toBe(true);
    expect(istRobot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari/604.1")).toBe(false);
  });
});

describe("Umstellung entscheiden (DACH1)", () => {
  const offen = () => true;
  const basis = { aktuell: "de" as const, gemerkt: null, erkannt: "at" as const, robot: false, schonGeprueft: false, verfuegbar: offen };

  it("stellt Besucher aus Österreich um", () => {
    expect(zielLand(basis)).toBe("at");
  });
  it("lässt eine gemerkte Wahl vor der Erkennung gelten, auch Deutschland", () => {
    expect(zielLand({ ...basis, gemerkt: "de" })).toBeNull();
    expect(zielLand({ ...basis, gemerkt: "ch", erkannt: "at" })).toBe("ch");
  });
  it("eine gemerkte Wahl gilt auch in einer schon geprüften Sitzung (Prüfung M-4), nie für Roboter", () => {
    expect(zielLand({ ...basis, gemerkt: "at", erkannt: "de", schonGeprueft: true })).toBe("at");
    expect(zielLand({ ...basis, gemerkt: "de", schonGeprueft: true })).toBeNull();
    expect(zielLand({ ...basis, gemerkt: "at", robot: true })).toBeNull();
    expect(zielLand({ ...basis, gemerkt: "at", verfuegbar: () => false })).toBeNull();
  });
  it("stellt nie um: Roboter, schon geprüfte Sitzung, Länderseite, Version ohne Liste", () => {
    expect(zielLand({ ...basis, robot: true })).toBeNull();
    expect(zielLand({ ...basis, schonGeprueft: true })).toBeNull();
    expect(zielLand({ ...basis, aktuell: "at" as never })).toBeNull();
    expect(zielLand({ ...basis, verfuegbar: () => false })).toBeNull();
  });
});
