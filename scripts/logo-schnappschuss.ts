/**
 * Schreibt src/data/logoSchnappschuss.ts aus der Live-Rechnung (src/lib/anbieterLogosLive.ts).
 * Läuft in `npm run build` vor vite (vite-node, damit die @-Pfade gelten) und im Test `anbieterLogos.test.ts`.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LOGO_KATEGORIEN, logosLive } from "../src/lib/anbieterLogosLive";
import { schnappschussText } from "../src/lib/logoSchnappschussText";

const ziel = fileURLToPath(new URL("../src/data/logoSchnappschuss.ts", import.meta.url));
writeFileSync(ziel, schnappschussText(Object.fromEntries(LOGO_KATEGORIEN.map((k) => [k, logosLive(k)]))));
console.log("logoSchnappschuss.ts geschrieben");
