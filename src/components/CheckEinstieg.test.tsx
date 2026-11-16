import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CheckEinstieg from "@/components/CheckEinstieg";
import type { CheckQuelle } from "@/data/halalFinanzCheck";
import { stimmeFuerEinstieg, stimmenFuer, type Stimme } from "@/data/checkStimmen";

const zeige = (quelle: CheckQuelle) =>
  render(
    <MemoryRouter>
      <CheckEinstieg quelle={quelle} />
    </MemoryRouter>,
  );

const ziele = (c: HTMLElement) => [...c.querySelectorAll("a")].map((a) => a.getAttribute("href"));
const zeilen = (c: HTMLElement) => [...c.querySelectorAll("li")].map((li) => li.textContent);

describe("Einstieg aus dem Freebie (RN10-07): überall dieselbe Frage, nur ein grünes Etikett wandert", () => {
  it("Boykott-Liste: Zeile „Du achtest beim Einkaufen drauf. Und bei deiner Bank?“, erste Frage „Was suchst du gerade?“, Bankkonto mit „am beliebtesten“", () => {
    const { container } = zeige("boykottliste");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("Du achtest beim Einkaufen drauf. Und bei deiner Bank?");
    expect(container.textContent).toContain("Was suchst du gerade?");
    expect(ziele(container)).toEqual([
      "/check?quelle=boykottliste&start=2&a1=konto",
      "/check?quelle=boykottliste&start=2&a1=invest",
      "/check?quelle=boykottliste&start=2&a1=unsicher",
    ]);
    expect(zeilen(container)).toEqual(["Neues Bankkontoam beliebtesten", "Depot zum Investieren", "Noch unsicher"]);
    expect(container.querySelectorAll("[data-etikett]")).toHaveLength(1);
  });

  it("Aktien-Liste und Halal-Anlagen-Liste: dieselben drei Antworten, das Etikett „passt zu deiner Liste“ sitzt an „Depot zum Investieren“, Bankkonto hat keins", () => {
    for (const quelle of ["aktienliste", "halal-anlagen"] as const) {
      const { container, unmount } = zeige(quelle);
      expect(container.textContent).toContain("Was suchst du gerade?");
      expect(ziele(container)).toEqual([
        `/check?quelle=${quelle}&start=2&a1=konto`,
        `/check?quelle=${quelle}&start=2&a1=invest`,
        `/check?quelle=${quelle}&start=2&a1=unsicher`,
      ]);
      expect(zeilen(container)).toEqual(["Neues Bankkonto", "Depot zum Investierenpasst zu deiner Liste", "Noch unsicher"]);
      expect(container.querySelectorAll("[data-etikett]")).toHaveLength(1);
      expect(container.textContent).not.toContain("am beliebtesten");
      unmount();
    }
  });

  it("jede Stelle trägt ihr eigenes ?quelle=, und jede öffnet denselben Check mit der gewählten Antwort", () => {
    for (const quelle of ["boykottliste", "aktienliste", "halal-anlagen", "homepage"] as const) {
      const { container, unmount } = zeige(quelle);
      for (const h of ziele(container)) expect(h).toMatch(new RegExp(`^/check\\?quelle=${quelle}&start=2&a1=(konto|invest|unsicher)$`));
      unmount();
    }
  });

  it("die acht weiteren Freebies tragen ihre eigene Quelle und das Etikett, das zu ihnen passt", () => {
    const erwartet: [CheckQuelle, string | null, string | null][] = [
      ["vertrags-ampel", "am beliebtesten", null],
      ["auto-abo", "am beliebtesten", null],
      ["baraka-blocker", "am beliebtesten", null],
      ["rizq", "am beliebtesten", null],
      ["gold-plan", null, "passt zu deinem Plan"],
      ["sukuk-plan", null, "passt zu deinem Plan"],
      ["portfolio-plan", null, "passt zu deinem Plan"],
      ["broker-vergleich", null, "passt zu deinem Vergleich"],
    ];
    for (const [quelle, konto, depot] of erwartet) {
      const { container, unmount } = zeige(quelle);
      expect(container.querySelector("aside")?.getAttribute("data-check-einstieg"), quelle).toBe(quelle);
      expect(ziele(container), quelle).toEqual([1, 2, 3].map((i) => `/check?quelle=${quelle}&start=2&a1=${["konto", "invest", "unsicher"][i - 1]}`));
      const li = [...container.querySelectorAll("li")];
      expect(li[0].querySelector("[data-etikett]")?.textContent ?? null, quelle).toBe(konto);
      expect(li[1].querySelector("[data-etikett]")?.textContent ?? null, quelle).toBe(depot);
      expect(li[2].querySelector("[data-etikett]"), quelle).toBeNull();
      unmount();
    }
  });

  it("ohne echte Stimme steht im Kasten keine Stimme, nie ein ausgedachtes Zitat", () => {
    const { container } = zeige("boykottliste");
    expect(container.querySelector("figure")).toBeNull();
  });

  it("keine Fragenzahl, die nicht stimmt: der Kasten verspricht „Wenige Fragen · unter 60 Sekunden“", () => {
    const { container } = zeige("aktienliste");
    expect(container.textContent).toContain("Wenige Fragen · unter 60 Sekunden");
    expect(container.textContent).not.toMatch(/2 Fragen|Bankkonto-Check|Depot-Check/);
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
