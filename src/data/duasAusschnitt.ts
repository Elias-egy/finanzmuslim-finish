import type { Dua } from "@/data/duas";

/**
 * Der offene Ausschnitt von „Dua für was?“. Bewusst eine eigene Datei ohne Laufzeit-Import aus
 * `duas.ts`: Die offene Seite lädt nur diese drei Bittgebete, alle 14 lädt erst die volle
 * Fassung. Ein Test prüft, dass jeder Eintrag hier wortgleich dort steht.
 *
 * `kante` sind die Anliegen direkt an der Schranke, nur mit Namen, ohne Wortlaut (Elias,
 * 27.09.2026: „die interessantesten Duas, zum Beispiel für Reichtum … ganz knapp hinter
 * dieser Mail“). Die Plan-Tabelle nennt 04, 07, 08, 09 und 10 als die stärksten.
 */

/** Oben offen, ganz: drei Bittgebete aus dem Quran. */
export const offen: Dua[] = [
  {
    nr: "01 · Das Gute in beiden Häusern",
    when: "Das häufigste Bittgebet des Propheten ﷺ",
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār",
    de: "Unser Herr, gib uns im Diesseits Gutes und im Jenseits Gutes, und bewahre uns vor der Strafe des Feuers.",
    quelle: "Quran 2:201. Anas berichtet, dies sei das Bittgebet gewesen, das der Prophet ﷺ am häufigsten sprach (Buchari 6389, Muslim 2690).",
  },
  {
    nr: "02 · Das Bittgebet des Musa",
    when: "Gesprochen ohne Obdach und ohne Einkommen",
    ar: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    tr: "Rabbi innī limā anzalta ilayya min khayrin faqīr",
    de: "Mein Herr, ich bin dessen bedürftig, was Du an Gutem zu mir herabsendest.",
    quelle: "Quran 28:24. Musa spricht es, nachdem er aus Ägypten geflohen war und im Schatten saß, ohne Arbeit und ohne Bleibe. Kurz darauf bekommt er beides.",
  },
  {
    nr: "06 · Genügsamkeit statt Rechnerei",
    when: "Wenn eine Tür zugeht",
    ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    tr: "Ḥasbunallāhu wa niʿmal-wakīl",
    de: "Allah genügt uns, und wie trefflich ist Er als Sachwalter.",
    quelle: "Quran 3:173. Im unmittelbar folgenden Vers heißt es, sie seien mit Gunst und Huld zurückgekehrt, ohne dass sie Übel berührt hätte.",
    kurz: true,
  },
];

/** An der Schnittkante: Anliegen ja, Wortlaut nein. `nr` ist die Nummer in `duas.ts`. */
export const kante: { nr: string; name: string; wann: string }[] = [
  { nr: "07", name: "Das Dua für Unabhängigkeit", wann: "Das zentrale Rizq-Bittgebet" },
  { nr: "09", name: "Gegen Sorge und Schulden", wann: "Wenn Schulden drücken" },
  { nr: "08", name: "Nach dem Fajr-Gebet", wann: "Morgens, nach dem Salam" },
  { nr: "10", name: "Beim Betreten des Marktes", wann: "Vor einem Geschäft, einem Kauf, einem Verkauf" },
  { nr: "04", name: "Der Beste der Versorger", wann: "Beim Bitten um Auskommen für eine Familie" },
  { nr: "14", name: "Wenn du nicht weißt, ob es gut für dich ist", wann: "Vor einer Entscheidung, auch einer finanziellen" },
];
