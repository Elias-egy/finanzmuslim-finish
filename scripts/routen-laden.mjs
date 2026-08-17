/**
 * Lädt die Routenliste aus src/data/routen.ts in Node.
 *
 * Die Liste liegt in TypeScript, weil sie zu den Anlagedaten gehört und mit
 * ihnen zusammen gepflegt wird. Node kann das nicht direkt lesen, deshalb wird
 * die Datei hier mit esbuild in den Speicher gebündelt. esbuild liegt ohnehin
 * im Projekt, es kommt mit Vite.
 *
 * Der Umweg ist der Preis dafür, dass es nur EINE Liste gibt. Eine zweite
 * Liste in reinem JavaScript wäre bequemer und würde irgendwann von der ersten
 * abweichen, und genau das war der Fehler an der handgepflegten Sitemap.
 */
import { build } from "esbuild";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeFile, unlink, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

export const routenLaden = async () => {
  const ordner = await mkdtemp(join(tmpdir(), "finanzmuslim-routen-"));
  const ziel = join(ordner, "routen.mjs");

  await build({
    entryPoints: [join(WURZEL, "src/data/routen.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: ziel,
    logLevel: "silent",
    // "@/..." löst Vite über tsconfig auf, esbuild muss es hier erfahren.
    alias: { "@": join(WURZEL, "src") },
    loader: { ".json": "json" },
  });

  const modul = await import(pathToFileURL(ziel).href);
  await unlink(ziel).catch(() => {});
  return modul;
};
