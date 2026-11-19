import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  DOKUMENTE,
  DOKUMENTE_BESCHREIBUNG,
  DOKUMENTE_EINLEITUNG,
  DOKUMENTE_SRC,
  DOKUMENTE_TITEL,
  FREEBIE_REIHENFOLGE,
  alleKarten,
  kartenAdresse,
} from "@/data/dokumente";
import { alleRouten, bewusstDraussen } from "@/data/routen";
import { findPartnerLink } from "@/data/partnerLinks";
import { vorlagen } from "@/data/vorlagen";
import { istGueltigeQuelle } from "@/lib/attribution";

const appQuelle = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");
const routerPfade = new Set([...appQuelle.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]));
const sitemapPfade = new Set(alleRouten().map((r) => r.pfad));
const draussen = new Set(bewusstDraussen.map((r) => r.pfad));

const ohneAbfrage = (adresse: string) => adresse.split(/[?#]/)[0];

/** Anbieter-Domain ohne Unterdomäne: konto.flatex.de und www.flatex.de sind beide flatex.de. */
const hauptDomain = (url: string) => new URL(url).hostname.split(".").slice(-2).join(".");

const karten = alleKarten();
const intern = karten.flatMap((k) => (k.ziel.art === "intern" ? [{ k, pfad: k.ziel.pfad }] : []));
const extern = karten.flatMap((k) => (k.ziel.art === "extern" ? [{ k, ziel: k.ziel }] : []));
const partner = karten.flatMap((k) => (k.ziel.art === "partner" ? [{ k, ziel: k.ziel }] : []));

describe("Dokumente: Aufbau", () => {
  it("jede Karte hat eine eigene Kennung, einen Titel, einen Satz und einen Knopf", () => {
    const ids = karten.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const k of karten) {
      expect(k.titel.trim().length, k.id).toBeGreaterThan(3);
      expect(k.satz.trim().length, k.id).toBeGreaterThan(10);
      expect(k.knopf.trim().length, k.id).toBeGreaterThan(2);
    }
  });

  it("die Gruppen stehen in der Reihenfolge Match, Depot, Konto, Listen, Rechner", () => {
    expect(DOKUMENTE.map((g) => g.id)).toEqual(["match", "depot", "konto", "listen", "rechner"]);
  });

  it("Rangfolge: Depot flatex vor Smartbroker+, Girokonto norisbank vor BBBank", () => {
    const depot = DOKUMENTE.find((g) => g.id === "depot")!.bloecke.map((b) => b.id);
    const konto = DOKUMENTE.find((g) => g.id === "konto")!.bloecke.map((b) => b.id);
    expect(depot).toEqual(["flatex", "smartbroker"]);
    expect(konto).toEqual(["norisbank", "bbbank"]);
  });

  it("kein Gedankenstrich im sichtbaren Text und kein Video als Weg", () => {
    const text = [
      DOKUMENTE_TITEL,
      DOKUMENTE_BESCHREIBUNG,
      DOKUMENTE_EINLEITUNG,
      ...DOKUMENTE.flatMap((g) => [g.titel, g.satz ?? ""]),
      ...karten.flatMap((k) => [k.titel, k.satz, k.knopf]),
    ].join("\n");
    expect(text).not.toMatch(/[–—]/);
    expect(text.toLowerCase()).not.toMatch(/video/);
  });

  it("Titel und Beschreibung tragen das Hauptwort und passen in die Suchanzeige", () => {
    expect(DOKUMENTE_TITEL.toLowerCase()).toContain("depotübertrag formular");
    expect(DOKUMENTE_TITEL.length).toBeLessThanOrEqual(62);
    expect(DOKUMENTE_BESCHREIBUNG.length).toBeGreaterThanOrEqual(110);
    expect(DOKUMENTE_BESCHREIBUNG.length).toBeLessThanOrEqual(160);
  });
});

describe("Dokumente: interne Adressen", () => {
  it("jede interne Adresse gibt es im Router", () => {
    for (const { k, pfad } of intern) {
      expect(routerPfade.has(ohneAbfrage(pfad)), `${k.id}: ${pfad}`).toBe(true);
    }
  });

  it("jede interne Adresse steht in den Routen (Sitemap) oder bewusst draußen (Check)", () => {
    for (const { k, pfad } of intern) {
      const p = ohneAbfrage(pfad);
      expect(sitemapPfade.has(p) || draussen.has(p), `${k.id}: ${p}`).toBe(true);
    }
  });

  it("die Seite selbst ist indexierbar und steht in der Sitemap", () => {
    expect(sitemapPfade.has("/dokumente")).toBe(true);
    expect(routerPfade.has("/dokumente")).toBe(true);
  });

  it("der Check steht als ein einziger Knopf, er fragt selbst nach Konto oder Depot", () => {
    const adressen = intern.map((i) => i.pfad).filter((a) => a.startsWith("/check"));
    expect(adressen).toEqual(["/check?quelle=quiz"]);
  });

  it("jedes Freebie aus vorlagen.ts steht auf der Seite", () => {
    const aufSeite = new Set(intern.map((i) => i.pfad));
    for (const v of vorlagen) {
      expect(aufSeite.has(`/vorlagen/${v.slug}`), v.slug).toBe(true);
    }
    expect(FREEBIE_REIHENFOLGE.length).toBe(vorlagen.length);
  });

  it("jeder Rechner aus den Routen steht auf der Seite", () => {
    const aufSeite = new Set(intern.map((i) => i.pfad));
    const rechner = alleRouten()
      .map((r) => r.pfad)
      .filter((p) => /rechner$/.test(p) && p !== "/rechner");
    expect(rechner.length).toBeGreaterThanOrEqual(8);
    for (const p of rechner) expect(aufSeite.has(p), p).toBe(true);
  });
});

describe("Dokumente: Adressen der Anbieter", () => {
  it("jede externe Adresse ist https und hat eine Quelle auf derselben Anbieter-Domain samt Lesedatum", () => {
    expect(extern.length).toBeGreaterThan(0);
    for (const { k, ziel } of extern) {
      expect(ziel.url, k.id).toMatch(/^https:\/\//);
      expect(ziel.quelle, `${k.id}: Quelle fehlt`).toMatch(/^https:\/\//);
      expect(hauptDomain(ziel.url), `${k.id}: Adresse und Quelle gehören nicht zum selben Anbieter`).toBe(
        hauptDomain(ziel.quelle),
      );
      expect(ziel.gelesen, k.id).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
    }
  });

  it("jeder Anbieter-Block hat mindestens ein offizielles Formular oder eine offizielle Seite", () => {
    for (const g of DOKUMENTE) {
      for (const b of g.bloecke.filter((x) => x.anbieter)) {
        expect(
          b.karten.some((k) => k.ziel.art === "extern"),
          b.id,
        ).toBe(true);
      }
    }
  });

  it("jeder Partner-Knopf zeigt auf einen aktiven Partnerlink mit gültiger Stelle", () => {
    expect(partner.length).toBe(4);
    for (const { k, ziel } of partner) {
      expect(findPartnerLink(ziel.kurzname)?.aktiv, k.id).toBe(true);
      expect(istGueltigeQuelle(ziel.src), `${k.id}: ${ziel.src}`).toBe(true);
      expect(Object.values(DOKUMENTE_SRC)).toContain(ziel.src);
      expect(kartenAdresse(k)).toBe(`/out/${ziel.kurzname}?src=${ziel.src}`);
    }
    expect(new Set(partner.map((p) => p.ziel.src)).size).toBe(partner.length);
  });

  it("eigene Stellen sind kurz genug für die SubID (Kleinbuchstaben, höchstens zwölf Zeichen)", () => {
    for (const s of Object.values(DOKUMENTE_SRC)) expect(s).toMatch(/^[a-z0-9]{1,12}$/);
  });
});
