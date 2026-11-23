import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, describe, expect, it } from "vitest";
import { Sterne } from "@/components/vergleich/VergleichsBausteine";
import { sterne } from "@/lib/anzeigeNote";
import VergleichDepot from "@/pages/VergleichDepot";

beforeAll(() => {
  const leer = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= leer;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver ??= leer;
});

const gefuellt = (note: number | null) => {
  const { container } = render(<Sterne note={note} />);
  return [...container.querySelectorAll("span.overflow-hidden")].map((s) => (s as HTMLElement).style.width);
};

describe("Sterne (VG3, Regel 7)", () => {
  it("zeichnet halbe Schritte aus der angezeigten Note, nie einen Teilstern je Zehntel", () => {
    // 4,35 und 4,33 zeigen beide 4,3: gleiche Sterne, nicht einer mit halbem Stern mehr.
    expect(gefuellt(4.35)).toEqual(gefuellt(4.33));
    expect(gefuellt(4.35)).toEqual(["100%", "100%", "100%", "100%", "50%"]);
    expect(gefuellt(4.2)).toEqual(["100%", "100%", "100%", "100%"]);
    expect(gefuellt(4.67)).toEqual(["100%", "100%", "100%", "100%", "50%"]);
    expect(gefuellt(5)).toEqual(["100%", "100%", "100%", "100%", "100%"]);
    expect(gefuellt(null)).toEqual([]);
  });

  it("gleiche angezeigte Note, gleiche Sterne; höhere Note nie weniger Sterne", () => {
    const noten = Array.from({ length: 501 }, (_, i) => i / 100);
    for (let i = 1; i < noten.length; i++) expect(sterne(noten[i])).toBeGreaterThanOrEqual(sterne(noten[i - 1]));
    expect(sterne(4.35)).toBe(sterne(4.33));
  });
});

describe("Sterne auf /vergleich/depot", () => {
  it("jede Zahl mit gleicher angezeigter Note trägt dieselben Sterne, und die Sterne sinken mit der Zahl", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/vergleich/depot"]}>
        <Routes>
          <Route path="*" element={<VergleichDepot />} />
        </Routes>
      </MemoryRouter>,
    );
    const paare = [...container.querySelectorAll("span[data-sterne]")].map((s) => {
      const text = s.parentElement?.parentElement?.textContent ?? "";
      const zahl = Number(text.match(/\((\d),(\d)\)/)?.slice(1).join(".") ?? NaN);
      return { zahl, sterne: Number((s as HTMLElement).dataset.sterne) };
    }).filter((p) => Number.isFinite(p.zahl));
    expect(paare.length).toBeGreaterThan(5);
    const nachZahl = new Map<number, Set<number>>();
    for (const p of paare) nachZahl.set(p.zahl, (nachZahl.get(p.zahl) ?? new Set()).add(p.sterne));
    for (const [zahl, menge] of nachZahl) expect(menge.size, `Note ${zahl}`).toBe(1);
    const sortiert = [...nachZahl.entries()].sort((a, b) => b[0] - a[0]);
    for (let i = 1; i < sortiert.length; i++) expect([...sortiert[i][1]][0]).toBeLessThanOrEqual([...sortiert[i - 1][1]][0]);
  });
});
