import { useCallback, useEffect, useState } from "react";

/** Gleicher Schlüssel wie die Verkaufsseite des Halal-Investment-OS, damit die Wahl zwischen beiden mitgeht. */
export const THEMA_SCHLUESSEL = "fm-verkauf-thema";

type Wahl = "dark" | "light" | null;

const gespeichert = (): Wahl => {
  try {
    const w = localStorage.getItem(THEMA_SCHLUESSEL);
    return w === "dark" || w === "light" ? w : null;
  } catch {
    return null;
  }
};

const geraetDunkel = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;

/** Ohne gemerkte Wahl folgt die Seite der Geräteeinstellung. */
export const istDunkel = () => {
  const w = gespeichert();
  return w ? w === "dark" : geraetDunkel();
};

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
    // Stand beim Laden angleichen (das Skript in index.html hat ihn schon gesetzt) und der Geräteeinstellung folgen, solange nichts gemerkt ist.
    const d = istDunkel();
    anwenden(d);
    setDunkel(d);
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const bei = () => {
      if (gespeichert()) return;
      const n = istDunkel();
      anwenden(n);
      setDunkel(n);
    };
    mq?.addEventListener?.("change", bei);
    return () => mq?.removeEventListener?.("change", bei);
  }, []);

  const umschalten = useCallback(() => {
    const n = !document.documentElement.classList.contains("dark");
    anwenden(n);
    setDunkel(n);
    try {
      localStorage.setItem(THEMA_SCHLUESSEL, n ? "dark" : "light");
    } catch {
      /* Speicher gesperrt: Wahl gilt nur für diese Sitzung */
    }
  }, []);

  return { dunkel, umschalten };
};
