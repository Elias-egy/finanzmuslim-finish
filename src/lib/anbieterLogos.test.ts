import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LOGO_KATEGORIEN, logosLive } from "@/lib/anbieterLogosLive";
import { schnappschussText } from "@/lib/logoSchnappschussText";
import { hatLogos, logosFuer } from "@/lib/anbieterLogos";

describe("Logo-Schnappschuss (Nacht-Tempo)", () => {
  it("entspricht der Live-Rechnung; sonst `npx vite-node scripts/logo-schnappschuss.ts` ausführen", () => {
    for (const k of LOGO_KATEGORIEN) expect(logosFuer(k)).toEqual(logosLive(k));
    const datei = readFileSync(join(process.cwd(), "src/data/logoSchnappschuss.ts"), "utf8");
    expect(datei).toBe(schnappschussText(Object.fromEntries(LOGO_KATEGORIEN.map((k) => [k, logosLive(k)]))));
  });

  it("kennt nur Depot, Girokonto und Krypto", () => {
    expect(hatLogos("Depot") && hatLogos("Girokonto") && hatLogos("Krypto")).toBe(true);
    expect(hatLogos("Edelmetalle")).toBe(false);
  });
});
