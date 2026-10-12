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
  it("ohne Ausnahme und bei unbekannter Art bleibt es still", () => {
    expect(startHinweise("smartbroker", "depot")).toEqual([]);
    expect(startHinweise("flatex", "steuer")).toEqual([]);
  });
});
