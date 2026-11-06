import { describe, expect, it } from "vitest";
import { istGueltigeQuelle } from "@/lib/attribution";
import { findStartPartner, istLeerQuelle, leerSchritte } from "./investmentStart";

describe("Fassung Depot da, noch leer", () => {
  it("greift nur bei den Kennungen der ManyChat-Treppe", () => {
    expect(istLeerQuelle("dmleerinvest")).toBe(true);
    expect(istLeerQuelle("fbleerguide")).toBe(true);
    expect(istLeerQuelle("dminvest")).toBe(false);
    expect(istLeerQuelle("dmtagguide")).toBe(false);
    expect(istLeerQuelle(null)).toBe(false);
  });

  it("die Kennungen bleiben gültige Quellen für die Sub-ID", () => {
    expect(istGueltigeQuelle("dmleerinvest")).toBe(true);
    expect(istGueltigeQuelle("fbleerliste")).toBe(true);
  });

  it("nennt die Freischaltung durch 1 € nur bei Scalable", () => {
    const scalable = findStartPartner("scalable")!;
    const traders = findStartPartner("traders-place")!;
    expect(leerSchritte(scalable)[0].text).toContain("Depot frei");
    expect(leerSchritte(traders)[0].text).not.toContain("Depot frei");
    expect(leerSchritte(traders)).toHaveLength(3);
    expect(leerSchritte(scalable)[0].text).toContain("bei Scalable angegeben");
  });

  it("nennt Sparplan ab 1 € nur, wo er belegt ist", () => {
    expect(leerSchritte(findStartPartner("traders-place")!)[2].titel).toContain("ab 1 €");
    expect(leerSchritte(findStartPartner("smartbroker")!)[2].titel).toContain("ab 1 €");
    const andere = findStartPartner("finvesto");
    if (andere) expect(leerSchritte(andere)[2].titel).toBe("Sparplan anlegen");
  });
});
