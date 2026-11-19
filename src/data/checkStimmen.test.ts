import { describe, expect, it } from "vitest";
import { ALLE_STIMMEN, STIMMEN, STIMMEN_JE_STELLE, stimmenAn, type StimmenStelle } from "@/data/checkStimmen";

describe("Stimmen (Elias RN16-27 bis RN16-32)", () => {
  it("echt und bestätigt: alle fünf (RN18-02, RN18-08 Pascal K.)", () => {
    expect(STIMMEN.map((s) => s.name)).toEqual(["Matin M.", "Reuf K.", "Artin E.", "Halil S.", "Bilal E."]);
  });

  it("fünf Stimmen: zwei zum Bankkonto, drei zum Investieren, keine mit Sternen", () => {
    const alle = Object.values(ALLE_STIMMEN);
    expect(alle.filter((s) => s.art === "konto")).toHaveLength(2);
    expect(alle.filter((s) => s.art === "depot")).toHaveLength(4);
    expect(alle.some((s) => s.sterne)).toBe(false);
  });

  it("Endfassungen und Anbieter je Stimme (RN16-37, RN17-02 bis -08)", () => {
    expect(ALLE_STIMMEN.skeptisch.zitat).toBe(
      "Ich war skeptisch, weil auf Insta jeder irgendwas als halal verkauft. Hier stand bei jeder Aktie dabei, woher die Einstufung kommt. Das hat mich überzeugt, weil ich es selbst nachprüfen konnte.",
    );
    expect(ALLE_STIMMEN.skeptisch.zeile).toBe("Depot bei flatex");
    expect(ALLE_STIMMEN["klein-anfangen"].zitat).toBe(
      "Ich wollte erstmal mit 50 € im Monat anfangen und habe Traders Place als Ergebnis bekommen. Da zahl ich 0 € Ordergebühr auf meinen Sparplan. Das Ergebnis hat wirklich sehr gut gepasst.",
    );
    expect(ALLE_STIMMEN["klein-anfangen"].zeile).toBe("Depot bei Traders Place");
    expect(ALLE_STIMMEN["bank-nebeneinander"].zitat).toMatch(/^Ich hab meine Commerzbank und die anderen .* 4,90 € im Monat Kontoführung/);
    expect(ALLE_STIMMEN["bank-nebeneinander"].zeile).toBe("Girokonto bei BBBank");
    expect(ALLE_STIMMEN["bank-nebeneinander"].zitat).toMatch(/Konto bei der BBBank eröffnet\.$/);
    expect(ALLE_STIMMEN.matin.name).toBe("Matin M.");
    expect(ALLE_STIMMEN["bank-nebeneinander"].name).toBe("Pascal K.");
    // RN18-07: kürzer, ohne „Zinsen zahlen wollte ich auf keinen Fall“.
    expect(ALLE_STIMMEN.matin.zitat).toMatch(/Sparkasse\. Ich hab gewechselt und mit dem Wechselservice alles rübergezogen\. Hat reibungslos geklappt\.$/);
    expect(ALLE_STIMMEN.matin.zitat).not.toMatch(/auf keinen Fall/);
  });

  it("Testseite drei (Matin, Reuf, Skeptisch), jedes Freebie zwei", () => {
    expect(stimmenAn("check", true).map((s) => s.id)).toEqual(["matin", "reuf", "skeptisch"]);
    for (const [stelle, ids] of Object.entries(STIMMEN_JE_STELLE)) if (stelle !== "check") expect(ids).toHaveLength(2);
  });

  it("Konto-Freebies nur Konto-Stimmen, Anlagen-Freebies nur Depot-Stimmen", () => {
    const art = (st: StimmenStelle) => new Set(stimmenAn(st, true).map((s) => s.art));
    // RN20-14: Konto-Stellen zeigen Matin M. und Bilal E. (Pascal K. raus).
    for (const st of ["vertrags-ampel", "auto-abo", "baraka-blocker", "rizq", "ergebnis-konto"] as const)
      expect(stimmenAn(st, false).map((s) => s.id)).toEqual(["matin", "bilal"]);
    for (const st of ["aktienliste", "halal-anlagen", "gold-plan", "sukuk-plan", "portfolio-plan", "broker-vergleich", "ergebnis-depot"] as const)
      expect([...art(st)]).toEqual(["depot"]);
    // RN20-13: Boykott-Liste oben Matin M. (Konto) und Artin E. (Depot).
    expect(stimmenAn("boykottliste", true).map((s) => s.id)).toEqual(["matin", "skeptisch"]);
    expect(stimmenAn("aktienliste", true)[0].id).toBe("skeptisch");
    expect(stimmenAn("halal-anlagen", true)[0].id).toBe("reuf");
  });

  it("live nur bestätigte, im Entwicklungsmodus unbestätigte als Beispiel markiert", () => {
    expect(stimmenAn("boykottliste", false).map((s) => s.id)).toEqual(["matin", "skeptisch"]);
    expect(stimmenAn("check", false).map((s) => s.id)).toEqual(["matin", "reuf", "skeptisch"]);
    expect(stimmenAn("check", true).map((s) => s.beispiel)).toEqual([false, false, false]);
    expect(stimmenAn("check", true, { ...ALLE_STIMMEN, reuf: { ...ALLE_STIMMEN.reuf, bestaetigt: false } }).map((s) => s.beispiel)).toEqual([false, true, false]);
    expect(stimmenAn("check", false, { ...ALLE_STIMMEN, reuf: { ...ALLE_STIMMEN.reuf, bestaetigt: false } }).map((s) => s.id)).toEqual(["matin", "skeptisch"]);
    expect(stimmenAn("homepage", true).map((s) => s.id)).toEqual(["matin", "reuf", "skeptisch"]);
  });
});

describe("Stimmen unten im Freebie (Elias RN16-41)", () => {
  it("zwei weitere, nie dieselben wie im Kasten oben", async () => {
    const { stimmenUnten, STIMMEN_UNTEN_JE_QUELLE } = await import("@/data/checkStimmen");
    for (const [q, ids] of Object.entries(STIMMEN_UNTEN_JE_QUELLE)) {
      expect(ids).toHaveLength(2);
      const oben = stimmenAn(q as StimmenStelle, true).map((s) => s.id);
      for (const id of ids!) expect(oben).not.toContain(id);
    }
    expect(stimmenUnten("boykottliste", true).map((s) => s.id)).toEqual(["bilal", "reuf"]);
    expect(stimmenUnten("boykottliste", false).map((s) => s.id)).toEqual(["bilal", "reuf"]);
    expect(stimmenUnten(undefined, true).map((s) => s.id)).toEqual(["matin", "reuf"]);
  });
});
