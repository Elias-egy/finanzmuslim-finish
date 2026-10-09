import { describe, expect, it } from "vitest";
import { MERK_SCHLUESSEL, gemerktAus, gemerktLesen, hatGeholt, merken, stufeMerken, vergessen } from "./merken";

const speicher = () => {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
  };
};

const tag = new Date("2026-10-09T10:00:00Z");
const erste = { email: " Lea@Example.com ", vorname: " Lea ", einwilligung: "karte-2026-10-09", freebie: "gold-check" };

describe("was die Opt-in-Karte sich auf dem Gerät merkt", () => {
  it("ist leer, solange niemand abgeschickt hat", () => {
    expect(gemerktLesen(speicher())).toBeNull();
    expect(hatGeholt(null, "gold-check")).toBe(false);
  });

  it("merkt Adresse, Vorname, Einwilligung, Tag und das Geholte", () => {
    const s = speicher();
    merken(erste, tag, s);
    expect(gemerktLesen(s)).toEqual({
      email: "Lea@Example.com",
      vorname: "Lea",
      einwilligung: "karte-2026-10-09",
      seit: "2026-10-09",
      stufe: undefined,
      geholt: ["gold-check"],
    });
  });

  it("behält bei derselben Adresse das Geholte und die erste Einwilligung", () => {
    const s = speicher();
    merken(erste, tag, s);
    const g = merken(
      { email: "lea@example.com", vorname: "", einwilligung: "karte-2027-01-01", freebie: "rizq", stufe: "profi" },
      new Date("2027-01-01T00:00:00Z"),
      s,
    );
    expect(g.geholt).toEqual(["gold-check", "rizq"]);
    expect(g.einwilligung).toBe("karte-2026-10-09");
    expect(g.seit).toBe("2026-10-09");
    expect(g.vorname).toBe("Lea");
    expect(g.stufe).toBe("profi");
    expect(hatGeholt(g, "rizq")).toBe(true);
    expect(hatGeholt(g, "halal-anlagen")).toBe(false);
  });

  it("fängt bei einer anderen Adresse neu an", () => {
    const s = speicher();
    merken(erste, tag, s);
    const g = merken({ email: "omar@example.com", vorname: "Omar", einwilligung: "karte-2026-10-09", freebie: "rizq" }, tag, s);
    expect(g.geholt).toEqual(["rizq"]);
    expect(g.vorname).toBe("Omar");
  });

  it("trägt die Stufe nach und vergisst auf Wunsch alles", () => {
    const s = speicher();
    expect(stufeMerken("profi", s)).toBeNull();
    merken(erste, tag, s);
    expect(stufeMerken("fortgeschritten", s)?.stufe).toBe("fortgeschritten");
    vergessen(s);
    expect(gemerktLesen(s)).toBeNull();
  });

  it("verwirft, was kein gültiger Eintrag ist", () => {
    expect(gemerktAus("kein json")).toBeNull();
    expect(gemerktAus(JSON.stringify({ email: "keine-adresse", einwilligung: "x" }))).toBeNull();
    expect(gemerktAus(JSON.stringify({ email: "a@b.de" }))).toBeNull();
    expect(gemerktAus(JSON.stringify({ email: "a@b.de", einwilligung: "x", stufe: "meister", geholt: ["rizq", 7] }))).toEqual({
      email: "a@b.de",
      vorname: "",
      einwilligung: "x",
      seit: "",
      stufe: undefined,
      geholt: ["rizq"],
    });
  });

  it("übersteht einen gesperrten Speicher", () => {
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    expect(gemerktLesen(kaputt)).toBeNull();
    expect(merken(erste, tag, kaputt).geholt).toEqual(["gold-check"]);
    expect(() => vergessen(kaputt)).not.toThrow();
  });

  it("legt alles unter einem Schlüssel ab", () => {
    const s = speicher();
    merken(erste, tag, s);
    expect(s.getItem(MERK_SCHLUESSEL)).toContain("gold-check");
  });
});
