import { useCallback, useEffect, useState } from "react";

/** Gleicher Schlüssel wie die Verkaufsseite des Halal-Investment-OS, damit die Wahl zwischen beiden mitgeht. */
export const THEMA_SCHLUESSEL = "fm-verkauf-thema";

/** Elias 20.11. (RN26-04): Die Seite ist bei jedem Aufruf hell, egal was früher gewählt wurde. Umschalten gilt nur für die offene Seite. */
export const istDunkel = () => false;

const anwenden = (dunkel: boolean) => {
  const root = document.documentElement;
  root.classList.toggle("dark", dunkel);
  if (dunkel) root.dataset.theme = "dark";
  else delete root.dataset.theme;
};

/** Hell/dunkel für die ganze Seite: Klasse `dark` an <html> (Tailwind), Wahl in localStorage. */
export const useThema = () => {
  const [dunkel, setDunkel] = useState<boolean>(() =>
    typeof document === "undefined" ? false : document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    // Stand beim Laden angleichen (das Skript in index.html hat ihn schon gesetzt); die Geräteeinstellung zählt nicht.
    const d = istDunkel();
    anwenden(d);
    setDunkel(d);
  }, []);

  const umschalten = useCallback(() => {
    const n = !document.documentElement.classList.contains("dark");
    anwenden(n);
    setDunkel(n);
  }, []);

  return { dunkel, umschalten };
};
