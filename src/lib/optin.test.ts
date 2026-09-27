import { describe, expect, it, vi } from "vitest";
import {
  EINWILLIGUNG,
  NACHTRAG_WEBHOOK,
  OPTIN_WEBHOOK,
  anmeldungAus,
  ergebnisAus,
  nachtragDaten,
  optinAnmelden,
  optinDaten,
  optinNachtragen,
  quelleFuer,
  vorhabenListe,
} from "./optin";

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
  it("baut die Anfrage mit Quelle, Sprache und Fassung der Einwilligung", () => {
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
      einwilligung: EINWILLIGUNG,
    });
  });

  it("schickt beim Guide keine Stufe mehr mit, die kommt als Nachtrag", () => {
    const d = optinDaten({ email: "a@b.de", vorname: "", freebie: "guide", pfad: "/halal-guide", lang: "tr", firma: "" });
    expect(d).not.toHaveProperty("level");
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

describe("anmeldungAus", () => {
  it("liest Status, ID und Schlüssel", () => {
    expect(
      anmeldungAus('{"status":"unconfirmed","id":"199765185340114885","token":"78958670-421f-4310-82a4-3db6470c3364"}'),
    ).toEqual({ ergebnis: "bestaetigen", id: "199765185340114885", token: "78958670-421f-4310-82a4-3db6470c3364" });
  });

  it("lässt eine ID oder einen Schlüssel weg, die nicht passen", () => {
    expect(anmeldungAus('{"status":"active","id":"abc","token":"x"}')).toEqual({ ergebnis: "sofort" });
    expect(anmeldungAus('{"status":"active","id":"","token":""}')).toEqual({ ergebnis: "sofort" });
  });

  it("nimmt „Accepted“ ohne JSON als unbestätigt ohne ID", () => {
    expect(anmeldungAus("Accepted")).toEqual({ ergebnis: "bestaetigen" });
  });
});

describe("optinAnmelden", () => {
  const daten = optinDaten({ email: "a@b.de", vorname: "", freebie: "rizq", pfad: "/vorlagen/rizq", lang: "de", firma: "" });

  it("schickt JSON an das Opt-in-Szenario und liest die Antwort", async () => {
    const fetchFn = vi.fn(async () => antwort(true, '{"status":"active","id":"199765185340114885","token":""}'));
    await expect(optinAnmelden(daten, fetchFn)).resolves.toEqual({ ergebnis: "sofort", id: "199765185340114885" });
    expect(fetchFn).toHaveBeenCalledWith(OPTIN_WEBHOOK, expect.objectContaining({ method: "POST" }));
    const body = JSON.parse((fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    expect(body.freebie).toBe("rizq");
    expect(body.einwilligung).toBe(EINWILLIGUNG);
  });

  it("wirft bei einem Fehler, damit die Karte es sagen kann", async () => {
    await expect(optinAnmelden(daten, async () => antwort(false, "", 500))).rejects.toThrow("Webhook 500");
  });
});

describe("Nachtrag", () => {
  const basis = { abonnent: "199765185340114885", token: "78958670-421f-4310-82a4-3db6470c3364", freebie: "guide" };

  it("schreibt das Vorhaben in fester Reihenfolge, ohne Doppelte und Fremdes", () => {
    expect(vorhabenListe(["steuer", "anlegen", "steuer", "boese"])).toBe("anlegen,steuer");
    expect(vorhabenListe([])).toBe("");
  });

  it("schickt nichts, wenn beide Fragen übersprungen sind", async () => {
    expect(nachtragDaten(basis)).toBeNull();
    const fetchFn = vi.fn(async () => antwort(true, "{}"));
    await expect(optinNachtragen(basis, fetchFn)).resolves.toBe(false);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("schickt Stufe und Vorhaben an das Nachtrag-Szenario", async () => {
    const fetchFn = vi.fn(async () => antwort(true, '{"ok":true}'));
    await expect(optinNachtragen({ ...basis, stufe: "profi", vorhaben: ["konto"] }, fetchFn)).resolves.toBe(true);
    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(NACHTRAG_WEBHOOK);
    expect(JSON.parse(init.body as string)).toEqual({ ...basis, stufe: "profi", vorhaben: "konto" });
  });

  it("hält niemanden auf, wenn der Nachtrag scheitert", async () => {
    await expect(
      optinNachtragen({ ...basis, stufe: "profi" }, async () => {
        throw new Error("offline");
      }),
    ).resolves.toBe(false);
  });
});
