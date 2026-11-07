import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { inflateSync } from "node:zlib";
import { VALID_SRC, istGueltigeQuelle } from "./attribution";

/** Alle ?src=-Kennungen, die in den PDFs unter public/ stehen, auch in komprimierten Streams. */
const quellenAusPdf = (datei: string): string[] => {
  const roh = readFileSync(datei);
  const texte = [roh.toString("latin1")];
  const text = texte[0];
  const re = /stream\r?\n/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const start = m.index + m[0].length;
    const ende = text.indexOf("endstream", start);
    if (ende < 0) break;
    try {
      texte.push(inflateSync(roh.subarray(start, ende)).toString("latin1"));
    } catch {
      /* nicht komprimiert oder kein Flate-Stream */
    }
  }
  return texte.flatMap((t) => [...t.matchAll(/src=([a-z0-9]+)/g)].map((x) => x[1]));
};

describe("Herkunftskennungen", () => {
  it("sind klein und alphanumerisch, wie Scalable es für die SubID verlangt", () => {
    for (const s of VALID_SRC) expect(s).toMatch(/^[a-z0-9]{2,12}$/);
  });

  it("unbekannte Werte fallen durch", () => {
    expect(istGueltigeQuelle("lstc")).toBe(true);
    expect(istGueltigeQuelle("foo")).toBe(false);
    expect(istGueltigeQuelle(null)).toBe(false);
  });

  it("jede Kennung aus einem veröffentlichten PDF ist bekannt", () => {
    const pdfs = [
      ...readdirSync("public/downloads").map((d) => join("public/downloads", d)),
      ...readdirSync("public").map((d) => join("public", d)),
    ].filter((d) => d.endsWith(".pdf"));
    const gefunden = new Set(pdfs.flatMap(quellenAusPdf));
    expect(gefunden.size).toBeGreaterThan(0);
    const unbekannt = [...gefunden].filter((s) => !istGueltigeQuelle(s));
    expect(unbekannt).toEqual([]);
  });
});

describe("Kennungs-Familien (CV4)", () => {
  it("nehmen ManyChat-, Facebook- und Mail-Kennungen ohne eigenen Eintrag an", () => {
    for (const s of ["dmgoldnach", "fbaktie", "mlbrief7", "v2", "g0", "fb0", "m2", "g3fertig", "mail"]) {
      expect(istGueltigeQuelle(s)).toBe(true);
    }
  });
  it("lehnen Fremdes, Großbuchstaben und zu Langes ab", () => {
    for (const s of ["", "x", "DMgold", "dm-gold", "facebook", "dm" + "a".repeat(19), "xyz123"]) {
      expect(istGueltigeQuelle(s)).toBe(false);
    }
  });
});

// CV16F (07.11.2026): Herkunft bleibt, Stelle wird angehängt (Hermes BERICHT R10, PRUEFUNG-2 Befund B).
import { herkunftAufnehmen, aktuelleSubId, istHerkunft, subIdAus } from "./attribution";

describe("Herkunft plus Stelle", () => {
  it("trennt Herkunft und Stelle", () => {
    for (const h of ["dmliste", "nl20261106", "g0boykottmitte", "d1", "mail", "bio", "fbliste"]) expect(istHerkunft(h), h).toBe(true);
    for (const s of ["gbkopf", "gbconsors", "eftop3", "sktop3", "amdepot", "start"]) expect(istHerkunft(s), s).toBe(false);
  });
  it("hängt die Stelle an die Herkunft, höchstens 19 Zeichen", () => {
    expect(subIdAus("dmliste", "gbkopf")).toBe("dmlistegbkopf");
    expect(subIdAus(null, "gbkopf")).toBe("gbkopf");
    expect(subIdAus("dmliste", null)).toBe("dmliste");
    expect(subIdAus("start", null)).toBe("start");
    expect(subIdAus(null, null)).toBe("start");
    expect(subIdAus("dmleerinvest", "gbconsors")).toHaveLength(19);
    expect(subIdAus("dmliste", "gbkopf")).toMatch(/^[a-z0-9]{1,19}$/);
  });
  it("eine Stelle überschreibt die Herkunft nicht mehr", () => {
    sessionStorage.clear();
    herkunftAufnehmen("dmliste");
    herkunftAufnehmen("gbkopf");
    herkunftAufnehmen("gbconsors");
    expect(aktuelleSubId()).toBe("dmlistegbconsors");
    herkunftAufnehmen("nl20261106");
    expect(aktuelleSubId()).toBe("nl20261106");
  });
});
