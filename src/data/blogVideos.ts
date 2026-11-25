import type { VideoKapitel } from "@/components/blog/bausteine";

/**
 * Elias' Videos, die in mehr als einem Beitrag stehen (SEO91). Kapitelmarken: Startsekunden aus den Untertiteln des Videos
 * (yt-dlp, 26.11.2026, Sekunde auf die erste Zeile des Themas); Kapitel in YouTube selbst hat keines der Videos.
 * Titel in Alltagswörtern, ohne neue Aussage.
 */
export const VIDEO_LEASING = {
  id: "ukcCjjf7FIY",
  titel: "So geht Leasing als Muslim (in unter 10 Minuten)",
  hochgeladen: "2026-04-19",
  dauer: 551,
  bild: "/bilder/blog/ist-leasing-haram/video-leasing.webp",
};

export const KAPITEL_LEASING: VideoKapitel[] = [
  { s: 0, titel: "Worum es geht" },
  { s: 30, titel: "Leasing ist Miete: was sie gültig macht" },
  { s: 141, titel: "Warum das übliche Leasing nicht passt" },
  { s: 235, titel: "Wie Leasing in islamischen Ländern läuft" },
  { s: 315, titel: "Gibt es eine Alternative in Deutschland?" },
  { s: 380, titel: "Das Auto-Abo" },
  { s: 453, titel: "Was das Abo mehr kostet" },
];
