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
