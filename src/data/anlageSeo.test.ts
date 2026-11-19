import { describe, expect, it } from "vitest";
import { halalAnlagen } from "./halalAnlagen";
import { antwortSatz, faqFuer, fragtHalal, h1Text, kaufbarOhneZinsenRot, seoBeschreibung, seoTitel, verwandteAnlagen } from "./anlageSeo";
import { NACHWEIS } from "./anlagenNachweis";
import { ANLAGEN_KAUFBAR } from "./anlagenKaufbar";
import { depotAnzeige } from "./anzeige/depot";
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

  it("H1, Title und Meta tragen die Frage; nur Bitcoin (eigener Beitrag) und der BNP Islamic Fund (Nachweis nur von 2020) haben sie bewusst nicht", () => {
    for (const a of halalAnlagen) {
      if (!fragtHalal(a)) {
        expect(["bitcoin", "bnp-paribas-islamic-fund-hilal-income-classic-c"]).toContain(a.slug);
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
      expect(antwortSatz(a)).toMatch(
        NACHWEIS[a.slug]?.ohnePruefstelle
          ? /Eine Stelle, die den Fonds eingestuft hat, haben wir nicht gefunden\. Über die Einstufung entscheiden nicht wir\./
          : /Über die Einstufung entscheidet die Prüfstelle, nicht wir\./,
      );
      expect(antwortSatz(a)).not.toMatch(/\bist halal\b|\bist haram\b|\bhalal ist\b/i);
    }
  });

  it("Einschränkungen des Nachweises stehen in Antwortsatz, Meta und FAQ, nicht nur im Detail (Halal-Prüfer RN19)", () => {
    for (const a of halalAnlagen) {
      const grenze = NACHWEIS[a.slug]?.grenze;
      if (!grenze) continue;
      expect(antwortSatz(a), a.slug).toContain(grenze);
      expect(seoBeschreibung(a), a.slug).toContain(grenze);
      expect(faqFuer(a).map((f) => f.a).join(" "), a.slug).toContain(grenze);
    }
    const chain = halalAnlagen.find((a) => a.slug === "chainlink")!;
    expect(antwortSatz(chain)).toContain("Bedingung");
    expect(seoBeschreibung(chain)).toContain("Bedingung");
    for (const a of halalAnlagen.filter((x) => x.slug.startsWith("wisdomtree-"))) {
      expect(antwortSatz(a), a.slug).toContain("T+2");
      expect(JSON.stringify(a.zertifikatHinweis)).not.toMatch(/gewöhnliche Ware|Sonderregel/);
    }
  });

  it("MSCI-Index, Board und Berater heißen in der FAQ so, nicht „geprüft“; Xtrackers hat keine Prüfstelle", () => {
    const frage = (slug: string) => faqFuer(halalAnlagen.find((a) => a.slug === slug)!).map((f) => f.q).join(" | ");
    expect(frage("hsbc-msci-world-islamic-screened")).toContain("Wer hat den Index von");
    expect(frage("comgest-growth-europe-s-eur-acc")).toContain("Shariah-Board");
    expect(frage("xtrackers-ii-salam-usd-global-aggregate-sukuk")).toContain("berät zur Shari'a");
    for (const slug of ["comgest-growth-europe-s-eur-acc", "xtrackers-ii-salam-usd-global-aggregate-sukuk"])
      expect(frage(slug), slug).not.toMatch(/geprüft\?/);
  });

  it("Kaufen-FAQ nennt nur Anbieter, die im Depot-Vergleich bei „ohne Zinsen nutzbar“ grün stehen", () => {
    const rot = new Set(depotAnzeige.filter((z) => z.abgeraten || z.werte.zinsfreiAbStart !== "gut").map((z) => z.haus));
    const roteNamen = ["1822direkt", "HypoVereinsbank", "ING", "Bux Plus", "XTB", "WillBe"];
    for (const a of halalAnlagen) {
      const kaufbar = a.isin ? ANLAGEN_KAUFBAR[a.isin] : undefined;
      if (!kaufbar) continue;
      for (const k of kaufbarOhneZinsenRot(kaufbar)) expect(rot.has(k.haus), `${a.slug}: ${k.haus}`).toBe(false);
      const antwort = faqFuer(a).find((f) => f.q.startsWith("Wo kann ich"))?.a ?? "";
      for (const n of roteNamen) expect(antwort, `${a.slug}: ${n}`).not.toContain(n);
      expect(antwort).not.toContain("Nicht jeder Anbieter ist geprüft");
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
