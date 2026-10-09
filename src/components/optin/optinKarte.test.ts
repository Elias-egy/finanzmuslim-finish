import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fragen } from "@/data/vergleichAssistent";
import { VORHABEN } from "@/lib/optin";
import { optinFreebies } from "@/data/optin";
import { EINWILLIGUNG_TEXT, vorhabenAntworten, vorhabenFrage } from "./OptinKarte";

describe("dritte Frage der Opt-in-Karte", () => {
  const erste = fragen[0];

  it("ist wortgleich die erste Frage des Vergleichs-Assistenten", () => {
    expect(vorhabenFrage).toBe(erste.titel);
    expect(vorhabenAntworten.map((a) => ({ id: a.key, bild: a.bild, titel: a.titel }))).toEqual(
      erste.antworten.map((a) => ({ id: a.id, bild: a.bild, titel: a.titel })),
    );
  });

  it("kennt dieselben Werte, die Make im Nachtrag prüft", () => {
    expect(vorhabenAntworten.map((a) => a.key)).toEqual(VORHABEN);
  });
});

describe("Wortlaut der Opt-in-Karte (Elias, 09.10.2026)", () => {
  const quelle = readFileSync("src/components/optin/OptinKarte.tsx", "utf8");

  it("hat am Häkchen einen Satz für alle Karten, mit Absender, Newsletter und Abmelden", () => {
    for (const wort of ["finanzmuslim", "Newsletter", "E-Mail", "Abmelden"]) expect(EINWILLIGUNG_TEXT).toContain(wort);
    for (const f of optinFreebies) expect(EINWILLIGUNG_TEXT).not.toContain(f.objekt);
    expect(quelle).not.toMatch(/Ich will \{freebie\.objekt\}/);
  });

  it("sagt vor dem Klick nichts von den Fragen und trägt kein Etikett „Gratis“", () => {
    expect(quelle).not.toContain("zwei kurze Fragen");
    expect(quelle).not.toMatch(/>\s*Gratis\s*</);
    expect(quelle).not.toContain("Schritt {schritt} von 3");
    expect(quelle).not.toContain("Wähl deine Stufe");
  });

  it("nennt den Newsletter in der Karte nicht beim alten Namen", () => {
    expect(quelle.replace(/\/\*[\s\S]*?\*\//g, "")).not.toContain("Freitagsbrief");
  });
});
