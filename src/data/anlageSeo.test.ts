import { describe, expect, it } from "vitest";
import { halalAnlagen } from "./halalAnlagen";
import { antwortSatz, faqFuer, fragtHalal, h1Text, seoBeschreibung, seoTitel, verwandteAnlagen } from "./anlageSeo";
import { fuehrenZurDatenbank, verwandteBeitraege, wissenBeitraege } from "./wissenBeitraege";

/* RN19: Jede Detailseite der Halal-Datenbank trägt „Ist <Name> halal?“ in Title, H1 und Meta, mit den Längen der
   Guide-Regeln (Title unter 60, Meta 120 bis 160), und alles kommt aus den vorhandenen Daten. */
describe("Anlage-Detailseiten, SEO", () => {
  it("Title unter 60 Zeichen, Meta 120 bis 160, jeder Title einmalig", () => {
    const titel = new Set<string>();
    for (const a of halalAnlagen) {
      const t = seoTitel(a);
      expect(t.length, `${a.slug}: ${t}`).toBeLessThan(60);
      const m = seoBeschreibung(a);
      expect(m.length, `${a.slug}: ${m}`).toBeGreaterThanOrEqual(120);
      expect(m.length, `${a.slug}: ${m}`).toBeLessThanOrEqual(160);
      titel.add(t);
    }
    expect(titel.size).toBe(halalAnlagen.length);
  });

  it("H1, Title und Meta tragen die Frage; nur Bitcoin hat sie bewusst nicht (eigener Beitrag)", () => {
    for (const a of halalAnlagen) {
      if (!fragtHalal(a)) {
        expect(a.slug).toBe("bitcoin");
        continue;
      }
      expect(h1Text(a)).toBe(`Ist ${a.name} halal?`);
      expect(seoTitel(a)).toContain("halal?");
      expect(seoBeschreibung(a).startsWith("Ist ")).toBe(true);
    }
  });

  it("keine Gedankenstriche und kein eigenes Urteil im Antwortsatz", () => {
    for (const a of halalAnlagen) {
      const alles = [antwortSatz(a), seoBeschreibung(a), seoTitel(a), ...faqFuer(a).map((f) => f.q + f.a)].join(" ");
      expect(alles).not.toMatch(/[–—]/);
      expect(antwortSatz(a)).toContain("Über die Einstufung entscheidet die Prüfstelle, nicht wir.");
      expect(antwortSatz(a)).not.toMatch(/\bist halal\b|\bist haram\b|\bhalal ist\b/i);
    }
  });

  it("FAQ je Anlage hat Frage und Antwort", () => {
    for (const a of halalAnlagen) {
      const faq = faqFuer(a);
      expect(faq.length).toBeGreaterThanOrEqual(2);
      for (const f of faq) {
        expect(f.q.length).toBeGreaterThan(5);
        expect(f.a.length).toBeGreaterThan(5);
      }
    }
  });

  it("vier verwandte Anlagen, nie die Anlage selbst, jede wird von mindestens drei Seiten verlinkt", () => {
    const eingehend = new Map<string, number>();
    for (const a of halalAnlagen) {
      const v = verwandteAnlagen(a);
      expect(v.length).toBe(4);
      expect(v.map((x) => x.slug)).not.toContain(a.slug);
      for (const x of v) eingehend.set(x.slug, (eingehend.get(x.slug) ?? 0) + 1);
    }
    for (const a of halalAnlagen) expect(eingehend.get(a.slug) ?? 0, a.slug).toBeGreaterThanOrEqual(2);
  });
});

describe("Blog-Ketten", () => {
  const schluessel = new Set(wissenBeitraege.map((b) => b.slug));

  it("jeder Schlüssel und jedes Ziel der verwandten Beiträge ist ein Beitrag, nie er selbst", () => {
    for (const [k, ziele] of Object.entries(verwandteBeitraege)) {
      expect(schluessel.has(k), k).toBe(true);
      expect(ziele.length).toBe(3);
      for (const z of ziele) {
        expect(schluessel.has(z), `${k} -> ${z}`).toBe(true);
        expect(z).not.toBe(k);
      }
    }
  });

  it("die Beiträge, die zur Datenbank führen, gibt es", () => {
    for (const s of fuehrenZurDatenbank) expect(schluessel.has(s), s).toBe(true);
  });
});
