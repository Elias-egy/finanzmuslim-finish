import { describe, expect, it, vi } from "vitest";
import {
  FREITAGSBRIEF_WEBHOOK,
  anmeldeDaten,
  emailGueltig,
  freitagsbriefAnmelden,
  quelleAusPfad,
  spracheAus,
} from "./anmeldung";

describe("quelleAusPfad", () => {
  it("nennt die Startseite beim Namen", () => {
    expect(quelleAusPfad("/")).toBe("web:/startseite");
    expect(quelleAusPfad("")).toBe("web:/startseite");
  });

  it("übernimmt den Pfad genau, ohne Schrägstrich am Ende", () => {
    expect(quelleAusPfad("/rechner/zakat")).toBe("web:/rechner/zakat");
    expect(quelleAusPfad("/newsletter/")).toBe("web:/newsletter");
  });
});

describe("spracheAus", () => {
  it("liest die Sprache aus dem lang-Attribut", () => {
    expect(spracheAus("de")).toBe("de");
    expect(spracheAus("de-DE")).toBe("de");
    expect(spracheAus("tr")).toBe("tr");
    expect(spracheAus("ar")).toBe("ar");
  });

  it("fällt bei allem anderen auf Deutsch zurück", () => {
    expect(spracheAus("en")).toBe("de");
    expect(spracheAus("")).toBe("de");
    expect(spracheAus(undefined)).toBe("de");
  });
});

describe("emailGueltig", () => {
  it("nimmt normale Adressen an", () => {
    expect(emailGueltig("elias@finanzmuslim.com")).toBe(true);
    expect(emailGueltig("  a.b+c@gmx.de ")).toBe(true);
  });

  it("weist Unfertiges ab", () => {
    expect(emailGueltig("")).toBe(false);
    expect(emailGueltig("elias@")).toBe(false);
    expect(emailGueltig("elias finanzmuslim.com")).toBe(false);
  });
});

describe("anmeldeDaten", () => {
  it("baut genau die Felder, die Make erwartet", () => {
    expect(anmeldeDaten({ email: "  Elias@Finanzmuslim.com ", pfad: "/rechner/zakat", lang: "de", firma: "" })).toEqual({
      email: "Elias@Finanzmuslim.com",
      quelle: "web:/rechner/zakat",
      sprache: "de",
      interesse: "freitagsbrief",
      firma: "",
    });
  });
});

describe("freitagsbriefAnmelden", () => {
  const daten = anmeldeDaten({ email: "test@example.com", pfad: "/", lang: "de", firma: "" });

  it("schickt die Daten als JSON an den Webhook", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await freitagsbriefAnmelden(daten, fetchFn);
    expect(fetchFn).toHaveBeenCalledWith(FREITAGSBRIEF_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(daten),
    });
  });

  it("meldet einen Fehler, statt still zu scheitern", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    await expect(freitagsbriefAnmelden(daten, fetchFn)).rejects.toThrow("500");
  });
});
