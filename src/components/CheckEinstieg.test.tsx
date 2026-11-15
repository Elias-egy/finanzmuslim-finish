import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CheckEinstieg from "@/components/CheckEinstieg";
import { stimmeFuerEinstieg, stimmenFuer, type Stimme } from "@/data/checkStimmen";

const zeige = (quelle: "boykottliste" | "aktienliste" | "halal-anlagen") =>
  render(
    <MemoryRouter>
      <CheckEinstieg quelle={quelle} />
    </MemoryRouter>,
  );

describe("Einstieg aus dem Freebie (RN8)", () => {
  it("Boykott-Liste: Bankkonto-Check, Zeile „Du achtest beim Einkaufen drauf. Und bei deiner Bank?“, erste Frage „Wie bezahlst du meistens?“", () => {
    const { container } = zeige("boykottliste");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Du achtest beim Einkaufen drauf. Und bei deiner Bank?");
    expect(container.textContent).toContain("Wie bezahlst du meistens?");
    const ziele = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(ziele).toEqual([
      "/check?art=konto&quelle=boykottliste&start=2&a1=karte",
      "/check?art=konto&quelle=boykottliste&start=2&a1=karte-bar",
      "/check?art=konto&quelle=boykottliste&start=2&a1=bar",
    ]);
  });

  it("Aktien-Liste und Halal-Anlagen-Liste: Depot-Check, erste Frage ist die Erfahrung", () => {
    for (const quelle of ["aktienliste", "halal-anlagen"] as const) {
      const { container, unmount } = zeige(quelle);
      expect(container.querySelector("aside")?.getAttribute("data-art")).toBe("depot");
      const ziele = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href"));
      expect(ziele).toEqual([
        `/check?art=depot&quelle=${quelle}&start=2&a1=keine`,
        `/check?art=depot&quelle=${quelle}&start=2&a1=erste`,
        `/check?art=depot&quelle=${quelle}&start=2&a1=depot`,
      ]);
      unmount();
    }
  });

  it("ohne echte Stimme steht im Kasten keine Stimme, nie ein ausgedachtes Zitat", () => {
    const { container } = zeige("boykottliste");
    expect(container.querySelector("figure")).toBeNull();
  });
});

describe("Stimmen je Art", () => {
  const stimmen: Stimme[] = [
    { art: "konto", zitat: "K", name: "A" },
    { art: "depot", zitat: "D", name: "B" },
    { art: "alle", zitat: "X", name: "C" },
    { zitat: "O", name: "D" },
  ];
  it("eine Art sieht nur ihre eigenen und die für alle, nie die der anderen Art", () => {
    expect(stimmenFuer("konto", stimmen).map((s) => s.zitat)).toEqual(["K", "X", "O"]);
    expect(stimmenFuer("depot", stimmen).map((s) => s.zitat)).toEqual(["D", "X", "O"]);
    expect(stimmenFuer(undefined, stimmen)).toHaveLength(4);
    expect(stimmeFuerEinstieg("konto", stimmen)?.zitat).toBe("K");
    expect(stimmeFuerEinstieg("depot", [stimmen[0]])).toBeUndefined();
  });
});
