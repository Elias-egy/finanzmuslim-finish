import { describe, expect, it, vi } from "vitest";
import { OPTIN_WEBHOOK, ergebnisAus, optinAnmelden, optinDaten, quelleFuer } from "./optin";

const antwort = (ok: boolean, text: string, status = ok ? 200 : 500) => ({ ok, status, text: async () => text });

describe("quelleFuer", () => {
  it("macht aus einer DM-Kennung die Quelle dm:<stichwort>", () => {
    expect(quelleFuer("/gratis/top-100-halal-aktien", "dmaktie")).toBe("dm:aktie");
    expect(quelleFuer("/gratis/guide", "dm")).toBe("dm:allgemein");
  });

  it("nimmt sonst die Seite", () => {
    expect(quelleFuer("/vorlagen/rizq", null)).toBe("web:/vorlagen/rizq");
    expect(quelleFuer("/vorlagen/rizq", "bio")).toBe("web:/vorlagen/rizq");
    expect(quelleFuer("/halal-guide", "dm-aktie")).toBe("web:/halal-guide");
  });
});

describe("optinDaten", () => {
  it("baut die Anfrage für eine Vorlage ohne Stufe", () => {
    expect(
      optinDaten({
        email: "  a@b.de ",
        vorname: " Amina ",
        freebie: "top-100-halal-aktien",
        pfad: "/gratis/top-100-halal-aktien",
        src: "dmaktie",
        lang: "de",
        firma: "",
      }),
    ).toEqual({
      email: "a@b.de",
      vorname: "Amina",
      freebie: "top-100-halal-aktien",
      quelle: "dm:aktie",
      sprache: "de",
      firma: "",
    });
  });

  it("gibt beim Guide die Stufe mit", () => {
    const d = optinDaten({
      email: "a@b.de",
      vorname: "",
      freebie: "guide",
      level: "profi",
      pfad: "/halal-guide",
      lang: "tr",
      firma: "",
    });
    expect(d.level).toBe("profi");
    expect(d.sprache).toBe("tr");
    expect(d.quelle).toBe("web:/halal-guide");
  });
});

describe("ergebnisAus", () => {
  it("zeigt den Link sofort, wenn keine Bestätigungsmail kommt", () => {
    expect(ergebnisAus("active")).toBe("sofort");
    expect(ergebnisAus("unsubscribed")).toBe("sofort");
  });

  it("bittet sonst um die Bestätigung", () => {
    expect(ergebnisAus("unconfirmed")).toBe("bestaetigen");
    expect(ergebnisAus(undefined)).toBe("bestaetigen");
    expect(ergebnisAus("junk")).toBe("bestaetigen");
  });
});

describe("optinAnmelden", () => {
  const daten = optinDaten({ email: "a@b.de", vorname: "", freebie: "rizq", pfad: "/vorlagen/rizq", lang: "de", firma: "" });

  it("schickt JSON an das Opt-in-Szenario und liest den Status", async () => {
    const fetchFn = vi.fn(async () => antwort(true, '{"status":"active"}'));
    await expect(optinAnmelden(daten, fetchFn)).resolves.toBe("sofort");
    expect(fetchFn).toHaveBeenCalledWith(OPTIN_WEBHOOK, expect.objectContaining({ method: "POST" }));
    const body = JSON.parse((fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.freebie).toBe("rizq");
  });

  it("nimmt „Accepted“ ohne JSON als unbestätigt", async () => {
    await expect(optinAnmelden(daten, async () => antwort(true, "Accepted"))).resolves.toBe("bestaetigen");
  });

  it("wirft bei einem Fehler, damit die Karte es sagen kann", async () => {
    await expect(optinAnmelden(daten, async () => antwort(false, "", 500))).rejects.toThrow("Webhook 500");
  });
});
