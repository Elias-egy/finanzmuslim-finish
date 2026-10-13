import { describe, expect, it } from "vitest";
import { startHinweise } from "./startHinweise";

describe("Hinweise auf der Startseite (Seite mit dem Video)", () => {
  it("flatex trägt die Achtung zum Kredit", () => {
    expect(startHinweise("flatex", "depot").map((h) => h.art)).toContain("achtung");
  });
  it("Scalable trägt den Tarif-Hinweis zu Prime+ mit dem Produkt im Titel", () => {
    const t = startHinweise("scalable", "depot").find((h) => h.art === "tarif");
    expect(t?.titel).toContain("Prime+");
    expect(t?.text).toContain("4,99 €");
  });
  it("Scalable und finvesto nennen je Produkt den Unterschied, mit dem Produkt als Titel", () => {
    const frei = startHinweise("scalable", "depot").find((h) => h.art === "unterschied");
    expect(frei?.titel).toBe("Free Broker");
    expect(startHinweise("finvesto", "depot").filter((h) => h.art === "unterschied").map((h) => h.titel)).toEqual(["Depot", "Depot Basis"]);
    expect(startHinweise("comdirect-pure-depot", "depot").map((h) => h.titel)).toEqual(["Depot oder Pure Depot"]);
  });
  it("ohne Ausnahme und bei unbekannter Art bleibt es still", () => {
    expect(startHinweise("smartbroker", "depot")).toEqual([]);
    expect(startHinweise("flatex", "steuer")).toEqual([]);
  });

  it("mehrere Konten eines Hauses: N26 zeigt Standard zuerst und Flex zuletzt, bunq beginnt mit Free", () => {
    const n26 = startHinweise("n26", "girokonto").filter((h) => h.art === "unterschied").map((h) => h.titel);
    expect(n26).toEqual(["Standard", "Smart", "Go", "Metal", "Flex"]);
    expect(startHinweise("bunq", "girokonto").filter((h) => h.art === "unterschied").map((h) => h.titel)).toEqual(["Free", "Core", "Pro", "Elite"]);
  });
});
