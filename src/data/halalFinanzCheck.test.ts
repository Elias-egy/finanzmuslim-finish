import { describe, expect, it } from "vitest";
import {
  CHECK_SRC,
  EIGENE_UEBERSCHRIFT,
  ETIKETT,
  FRAGEN,
  antwortZeilen,
  ergebnisAus,
  fragenGesamt,
  naechsteFrage,
  outLink,
  quelleAus,
  unterFuer,
  UEBERSCHRIFT,
  type Antworten,
} from "@/data/halalFinanzCheck";
import { istGueltigeQuelle, istHerkunft } from "@/lib/attribution";

const durch = (a: Antworten) => ergebnisAus(a, "aktienliste");
const durchB = (a: Antworten) => ergebnisAus(a, "aktienliste", "b");

describe("Halal-Finanz-Check (RN5, RN7)", () => {
  it("Fassung a fragt auf jedem Weg höchstens drei Fragen, Konto zwei", () => {
    expect(naechsteFrage({})).toBe("ziel");
    expect(naechsteFrage({ ziel: "konto" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "konto", filiale: "nein" })).toBeNull();
    expect(fragenGesamt({ ziel: "konto" })).toBe(2);
    expect(naechsteFrage({ ziel: "invest" })).toBe("depot");
    expect(naechsteFrage({ ziel: "invest", depot: "nein" })).toBe("start");
    expect(naechsteFrage({ ziel: "invest", depot: "nein", start: "sparplan" })).toBeNull();
    expect(naechsteFrage({ ziel: "invest", depot: "halal" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "beides" })).toBe("filiale");
    expect(naechsteFrage({ ziel: "beides", filiale: "ja" })).toBe("start");
    expect(fragenGesamt({ ziel: "invest" })).toBe(3);
  });

  it("Fassung b fragt auf dem Depot-Weg eine Frage mehr, Konto-Weg und halales Depot bleiben gleich", () => {
    expect(naechsteFrage({ ziel: "invest", depot: "nein", start: "sparplan" }, "b")).toBe("praef");
    expect(naechsteFrage({ ziel: "invest", depot: "nicht-halal", start: "etf-gold" }, "b")).toBe("praef");
    expect(naechsteFrage({ ziel: "beides", filiale: "nein", start: "einmal" }, "b")).toBe("praef");
    expect(naechsteFrage({ ziel: "invest", depot: "nein", start: "sparplan", praef: "kosten" }, "b")).toBeNull();
    expect(naechsteFrage({ ziel: "konto", filiale: "nein" }, "b")).toBeNull();
    expect(naechsteFrage({ ziel: "invest", depot: "halal", filiale: "nein" }, "b")).toBeNull();
    expect(fragenGesamt({ ziel: "invest" }, "b")).toBe(4);
    expect(fragenGesamt({ ziel: "beides" }, "b")).toBe(4);
    expect(fragenGesamt({ ziel: "konto" }, "b")).toBe(2);
    expect(fragenGesamt({ ziel: "invest", depot: "halal" }, "b")).toBe(3);
    // Ohne die Frage steht in Fassung b noch kein Ergebnis, in Fassung a schon.
    expect(ergebnisAus({ ziel: "invest", depot: "nein", start: "sparplan" }, "aktienliste", "b")).toBeNull();
    expect(durch({ ziel: "invest", depot: "nein", start: "sparplan" })).not.toBeNull();
  });

  it("Fassung b: Halal-Auswahl führt zu flatex, Kosten zu Smartbroker+, die andere Bank steht als Alternative", () => {
    for (const start of ["sparplan", "etf-gold", "einmal"] as const) {
      const halal = durchB({ ziel: "invest", depot: "nein", start, praef: "halal" })!;
      expect(halal.anbieter.out).toBe("flatex");
      expect(halal.alternative?.anbieter.out).toBe("smartbroker");
      const kosten = durchB({ ziel: "invest", depot: "nein", start, praef: "kosten" })!;
      expect(kosten.anbieter.out).toBe("smartbroker");
      expect(kosten.alternative?.anbieter.out).toBe("flatex");
    }
    expect(durchB({ ziel: "invest", depot: "nicht-halal", start: "etf-gold", praef: "kosten" })?.art).toBe("zweitdepot");
  });

  it("Fragen-Unterzeilen der neuen Frage kommen nur aus den Vergleichsdaten", () => {
    const [halal, kosten] = FRAGEN.praef.optionen;
    expect(halal.unter).toMatch(/^12 von 12 Halal-ETFs und Fonds, 7 von 7 Edelmetalle$/);
    expect(kosten.unter).toMatch(/Depotgebühr, Sparplan ab/);
    expect(FRAGEN.praef.titel).toBe("Was ist dir wichtiger?");
  });

  it("Konto: norisbank ohne Filiale, BBBank mit Filiale (Elias RN3-07)", () => {
    expect(durch({ ziel: "konto", filiale: "nein" })?.anbieter.out).toBe("norisbank");
    expect(durch({ ziel: "konto", filiale: "ja" })?.anbieter.out).toBe("bbbank-bettersmart");
  });

  it("Depot Fassung a: flatex als Nummer 1, Smartbroker+ nur beim kleinen Sparplan", () => {
    for (const start of ["etf-gold", "einmal"] as const) {
      expect(durch({ ziel: "invest", depot: "nein", start })?.anbieter.out).toBe("flatex");
    }
    expect(durch({ ziel: "invest", depot: "nein", start: "sparplan" })?.anbieter.out).toBe("smartbroker");
    expect(durch({ ziel: "invest", depot: "nicht-halal", start: "etf-gold" })?.art).toBe("zweitdepot");
    expect(durch({ ziel: "invest", depot: "halal", filiale: "nein" })?.art).toBe("depot-halal-konto");
  });

  it("Startfrage: „Erst ein zinsfreies Konto, dann investieren“ steht oben, ist grün und führt zum Konto-Ergebnis mit Depot als zweitem Schritt", () => {
    const [erste] = FRAGEN.start.optionen;
    expect(erste.wert).toBe("konto");
    expect(erste.titel).toBe("Erst ein zinsfreies Konto, dann investieren");
    expect(erste.etikett).toBe("beliebt");
    expect(FRAGEN.start.optionen.map((o) => o.titel)).not.toContain("Aktien aus der Liste kaufen");
    const e = durch({ ziel: "invest", depot: "nein", start: "konto" })!;
    expect(e.art).toBe("beides");
    expect(e.anbieter.out).toBe("norisbank");
    expect(e.danach?.anbieter.out).toBe("flatex");
    expect(e.danach?.konto).toBe(false);
    // Fassung b fragt danach noch, welches Depot der zweite Schritt zeigt.
    expect(ergebnisAus({ ziel: "invest", depot: "nein", start: "konto" }, "aktienliste", "b")).toBeNull();
    const eb = durchB({ ziel: "invest", depot: "nein", start: "konto", praef: "kosten" })!;
    expect(eb.anbieter.out).toBe("norisbank");
    expect(eb.danach?.anbieter.out).toBe("smartbroker");
  });

  it("Etikett heißt überall „beliebt“, nie „Leichtester Start“ oder „Beliebtester Start“", () => {
    expect(ETIKETT).toBe("beliebt");
    const etiketten = Object.values(FRAGEN).flatMap((f) => f.optionen.map((o) => o.etikett).filter(Boolean));
    expect(etiketten).toEqual(["beliebt", "beliebt"]);
    expect(JSON.stringify(FRAGEN)).not.toMatch(/Leichtester|Beliebtester/);
  });

  it("Quell-Überschriften sind je eine kurze Zeile, bei der Aktien-Liste darf die Antwort auf die Liste Bezug nehmen", () => {
    for (const q of EIGENE_UEBERSCHRIFT) expect(UEBERSCHRIFT[q].length).toBeLessThanOrEqual(55);
    expect(UEBERSCHRIFT.aktienliste).toBe("Wo kaufst du die Aktien aus der Liste?");
    expect(UEBERSCHRIFT.aktienliste).not.toMatch(/Du hast die Aktien/);
    const einmal = FRAGEN.start.optionen.find((o) => o.wert === "einmal")!;
    expect(unterFuer("aktienliste", "start", einmal)).toMatch(/Liste/);
    expect(unterFuer("homepage", "start", einmal)).toBeUndefined();
  });

  it("flatex nennt den Kreditrahmen, jedes Konto das leere Tagesgeld", () => {
    expect(durch({ ziel: "invest", depot: "nein", start: "etf-gold" })?.pflicht).toMatch(/Kreditrahmen/);
    expect(durch({ ziel: "konto", filiale: "nein" })?.pflicht).toMatch(/Tagesgeld/);
  });

  it("eine Empfehlung mit ein bis zwei Vorteilen, keine erfundenen Sterne oder Prozente", () => {
    const alle: Antworten[] = [
      { ziel: "konto", filiale: "nein" },
      { ziel: "konto", filiale: "ja" },
      { ziel: "invest", depot: "nein", start: "sparplan" },
      { ziel: "invest", depot: "nein", start: "etf-gold" },
      { ziel: "invest", depot: "nicht-halal", start: "einmal" },
      { ziel: "invest", depot: "nein", start: "konto" },
      { ziel: "invest", depot: "halal", filiale: "ja" },
      { ziel: "beides", filiale: "nein", start: "einmal" },
    ];
    for (const a of alle) {
      for (const e of [durch(a)!, ergebnisAus({ ...a, ...(a.start ? { praef: "halal" as const } : {}) }, "aktienliste", "b")!]) {
        expect(e.vorteile.length).toBeGreaterThanOrEqual(1);
        expect(e.vorteile.length).toBeLessThanOrEqual(2);
        const text = [e.warum, ...e.vorteile, e.pflicht ?? "", e.danach?.satz ?? ""].join(" ");
        expect(text).not.toMatch(/Stern|%|Beliebteste|Finde, was zu dir passt|Traders Place/);
      }
    }
  });

  it("„Deine Antworten“ zeigt nur die gegebenen Antworten", () => {
    expect(antwortZeilen({ ziel: "konto", filiale: "ja" })).toEqual(["Konto zinsfrei machen", "Mit Filiale"]);
    expect(antwortZeilen({ ziel: "invest", depot: "nein", start: "sparplan", praef: "kosten" })).toEqual([
      "Halal investieren",
      "Noch kein Depot",
      "Sparplan",
      "Niedrige Kosten",
    ]);
  });

  it("Knöpfe gehen über /out mit gültiger Kennung, die Fassung steht am Ende", () => {
    const e = durch({ ziel: "beides", filiale: "nein", start: "etf-gold" })!;
    expect(outLink("aktienliste", e.anbieter)).toBe("/out/norisbank?src=fcaknoa");
    expect(outLink("aktienliste", e.anbieter, "b")).toBe("/out/norisbank?src=fcaknob");
    expect(e.danach?.link).toBe("/out/flatex?src=fcakflza");
    expect(durchB({ ziel: "beides", filiale: "nein", start: "etf-gold", praef: "halal" })?.danach?.link).toBe("/out/flatex?src=fcakflzb");
    expect(durchB({ ziel: "invest", depot: "nein", start: "einmal", praef: "kosten" })?.alternative?.link).toBe("/out/flatex?src=fcakflxb");
    for (const src of ["fcakno", "fcakflz", "fchpsb", "fcbobb", "fcakfla", "fcaknob", "fcakflzb", "fcqzsbxa"]) {
      expect(CHECK_SRC.test(src)).toBe(true);
      expect(istGueltigeQuelle(src)).toBe(true);
      expect(istHerkunft(src)).toBe(false);
    }
    expect(outLink("aktienliste", e.anbieter)).not.toMatch(/email/);
  });

  it("Die Kennung der Fassung ist je Fassung unterscheidbar, auch auf dem Depot-Ergebnis", () => {
    const a = durch({ ziel: "invest", depot: "nein", start: "etf-gold" })!;
    const b = durchB({ ziel: "invest", depot: "nein", start: "etf-gold", praef: "halal" })!;
    expect(outLink("homepage", a.anbieter, "a")).toMatch(/src=fchpfla$/);
    expect(outLink("homepage", b.anbieter, "b")).toMatch(/src=fchpflb$/);
  });

  it("Boykott-Einstieg ohne Boykott-Aussage über die Bank, unbekannte Quelle läuft als Startseite", () => {
    expect(UEBERSCHRIFT.boykottliste).not.toMatch(/Boykott/i);
    expect(quelleAus("irgendwas")).toBe("homepage");
    expect(quelleAus("halal-anlagen")).toBe("halal-anlagen");
  });
});
