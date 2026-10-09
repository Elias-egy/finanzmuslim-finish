import { describe, expect, it } from "vitest";
import { juengsterStand } from "@/lib/juengsterStand";

describe("juengsterStand", () => {
  it("nimmt das jüngste Datum aus verschachtelten Belegen, über Monats- und Jahresgrenzen", () => {
    const anbieter = [
      { id: "a", quellen: { zins: { url: "https://a.de", stand: "30.09.2026" } } },
      { id: "b", quellen: { zins: { stand: "08.10.2026" }, karte: { stand: "14.09.2026" } }, liste: [{ stand: "02.01.2026" }] },
    ];
    expect(juengsterStand(anbieter, "14.09.2026")).toBe("08.10.2026");
    expect(juengsterStand([{ quellen: { x: { stand: "03.01.2027" } } }], "31.12.2026")).toBe("03.01.2027");
  });

  it("bleibt beim Tag des Imports, wenn kein Beleg jünger ist oder kein Datum lesbar ist", () => {
    expect(juengsterStand([], "14.09.2026")).toBe("14.09.2026");
    expect(juengsterStand([{ quellen: { x: { stand: "01.09.2026" } } }], "14.09.2026")).toBe("14.09.2026");
    expect(juengsterStand([{ stand: "heute" }, { stand: 5 }, null], "14.09.2026")).toBe("14.09.2026");
  });
});
