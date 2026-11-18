import { describe, expect, it } from "vitest";
import { ALLE_STIMMEN, STIMMEN, STIMMEN_JE_STELLE, stimmenAn, type StimmenStelle } from "@/data/checkStimmen";

describe("Stimmen (Elias RN16-27 bis RN16-32)", () => {
  it("echt und bestätigt ist bisher nur Reuf K.", () => {
    expect(STIMMEN.map((s) => s.name)).toEqual(["Reuf K."]);
  });

  it("fünf Stimmen: zwei zum Bankkonto, drei zum Investieren, keine mit Sternen", () => {
    const alle = Object.values(ALLE_STIMMEN);
    expect(alle.filter((s) => s.art === "konto")).toHaveLength(2);
    expect(alle.filter((s) => s.art === "depot")).toHaveLength(3);
    expect(alle.some((s) => s.sterne)).toBe(false);
  });

  it("Elias' Wortlaut und Anbieter je Stimme (RN16-29 bis RN16-32)", () => {
    expect(ALLE_STIMMEN.skeptisch.zitat).toBe(
      "Ich war ehrlich gesagt skeptisch, weil auf Insta jeder irgendwas als halal verkauft. Hier stand bei den Sachen dabei, woher die Info kommt, und das hat mir gefallen.",
    );
    expect(ALLE_STIMMEN.skeptisch.zeile).toBe("Depot bei flatex");
    expect(ALLE_STIMMEN["klein-anfangen"].zitat).toBe(
      "Ich wollte erstmal klein anfangen. Es wurde ein Broker ausgewählt, der 0 Euro Gebühren hat. Ich bin sehr zufrieden, Alhamdulillah.",
    );
    expect(ALLE_STIMMEN["klein-anfangen"].zeile).toBe("Depot bei Traders Place");
    expect(ALLE_STIMMEN["bank-nebeneinander"].zitat).toMatch(/^Mir hat gefallen, dass meine momentane Bank/);
    expect(ALLE_STIMMEN["bank-nebeneinander"].zeile).toBe("Girokonto bei norisbank");
  });

  it("Testseite drei (Matin, Reuf, Skeptisch), jedes Freebie zwei", () => {
    expect(stimmenAn("check", true).map((s) => s.id)).toEqual(["matin", "reuf", "skeptisch"]);
    for (const [stelle, ids] of Object.entries(STIMMEN_JE_STELLE)) if (stelle !== "check") expect(ids).toHaveLength(2);
  });

  it("Konto-Freebies nur Konto-Stimmen, Anlagen-Freebies nur Depot-Stimmen", () => {
    const art = (st: StimmenStelle) => new Set(stimmenAn(st, true).map((s) => s.art));
    for (const st of ["boykottliste", "vertrags-ampel", "auto-abo", "baraka-blocker", "rizq", "ergebnis-konto"] as const)
      expect([...art(st)]).toEqual(["konto"]);
    for (const st of ["aktienliste", "halal-anlagen", "gold-plan", "sukuk-plan", "portfolio-plan", "broker-vergleich", "ergebnis-depot"] as const)
      expect([...art(st)]).toEqual(["depot"]);
    expect(stimmenAn("aktienliste", true)[0].id).toBe("skeptisch");
    expect(stimmenAn("halal-anlagen", true)[0].id).toBe("reuf");
  });

  it("live nur bestätigte, im Entwicklungsmodus unbestätigte als Beispiel markiert", () => {
    expect(stimmenAn("boykottliste", false)).toHaveLength(0);
    expect(stimmenAn("check", false).map((s) => s.id)).toEqual(["reuf"]);
    expect(stimmenAn("check", true).map((s) => s.beispiel)).toEqual([true, false, true]);
    expect(stimmenAn("homepage", true).map((s) => s.id)).toEqual(["matin", "reuf", "skeptisch"]);
  });
});
