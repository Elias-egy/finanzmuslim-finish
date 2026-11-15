import { describe, expect, it } from "vitest";
import { CHECK_SRC, ergebnisAus, fragenGesamt, naechsteFrage, outLink, quelleAus, UEBERSCHRIFT, type Antworten } from "@/data/halalFinanzCheck";
import { istGueltigeQuelle, istHerkunft } from "@/lib/attribution";

const durch = (a: Antworten) => ergebnisAus(a, "aktienliste");

describe("Halal-Finanz-Check (RN5)", () => {
  it("fragt auf jedem Weg höchstens drei Fragen, Konto zwei", () => {
    expect(naechsteFrage({})).toBe("ziel");
    expect(naechsteFrage({ ziel: "konto" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "konto", filiale: "nein" })).toBeNull();
    expect(fragenGesamt({ ziel: "konto" })).toBe(2);
    expect(naechsteFrage({ ziel: "invest" })).toBe("depot");
    expect(naechsteFrage({ ziel: "invest", depot: "nein" })).toBe("start");
    expect(naechsteFrage({ ziel: "invest", depot: "halal" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "beides" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "beides", filiale: "ja" })).toBe("start");
    expect(fragenGesamt({ ziel: "invest" })).toBe(3);
  });

  it("Konto: norisbank ohne Filiale, BBBank mit Filiale (Elias RN3-07)", () => {
    expect(durch({ ziel: "konto", filiale: "nein" })?.anbieter.out).toBe("norisbank");
    expect(durch({ ziel: "konto", filiale: "ja" })?.anbieter.out).toBe("bbbank-bettersmart");
  });

  it("Depot: flatex als Nummer 1, Smartbroker+ nur beim kleinen Sparplan", () => {
    for (const start of ["etf-gold", "aktien", "einmal"] as const) {
      expect(durch({ ziel: "invest", depot: "nein", start })?.anbieter.out).toBe("flatex");
    }
    expect(durch({ ziel: "invest", depot: "nein", start: "sparplan" })?.anbieter.out).toBe("smartbroker");
    expect(durch({ ziel: "invest", depot: "nicht-halal", start: "etf-gold" })?.art).toBe("zweitdepot");
    expect(durch({ ziel: "invest", depot: "halal", filiale: "nein" })?.art).toBe("depot-halal-konto");
  });

  it("flatex nennt den Kreditrahmen, jedes Konto das leere Tagesgeld", () => {
    expect(durch({ ziel: "invest", depot: "nein", start: "aktien" })?.pflicht).toMatch(/Kreditrahmen/);
    expect(durch({ ziel: "konto", filiale: "nein" })?.pflicht).toMatch(/Tagesgeld/);
  });

  it("eine Empfehlung mit ein bis zwei Vorteilen, keine erfundenen Sterne oder Prozente", () => {
    const alle: Antworten[] = [
      { ziel: "konto", filiale: "nein" },
      { ziel: "konto", filiale: "ja" },
      { ziel: "invest", depot: "nein", start: "sparplan" },
      { ziel: "invest", depot: "nein", start: "etf-gold" },
      { ziel: "invest", depot: "nicht-halal", start: "einmal" },
      { ziel: "invest", depot: "halal", filiale: "ja" },
      { ziel: "beides", filiale: "nein", start: "aktien" },
    ];
    for (const a of alle) {
      const e = durch(a)!;
      expect(e.vorteile.length).toBeGreaterThanOrEqual(1);
      expect(e.vorteile.length).toBeLessThanOrEqual(2);
      const text = [e.vorspann, e.warum, ...e.vorteile, e.pflicht ?? ""].join(" ");
      expect(text).not.toMatch(/Stern|%|Beliebteste|Finde, was zu dir passt|Traders Place/);
    }
  });

  it("Knöpfe gehen über /out mit gültiger Kennung, die die Herkunft nicht überschreibt", () => {
    const e = durch({ ziel: "beides", filiale: "nein", start: "etf-gold" })!;
    const haupt = outLink("aktienliste", e.anbieter);
    expect(haupt).toBe("/out/norisbank?src=fcakno");
    expect(e.danach?.link).toBe("/out/flatex?src=fcakflz");
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
    expect(haupt).not.toMatch(/email/);
  });

  it("Boykott-Einstieg ohne Boykott-Aussage über die Bank, unbekannte Quelle läuft als Startseite", () => {
    expect(UEBERSCHRIFT.boykottliste).not.toMatch(/Boykott/i);
    expect(quelleAus("irgendwas")).toBe("homepage");
    expect(quelleAus("halal-anlagen")).toBe("halal-anlagen");
  });
});
