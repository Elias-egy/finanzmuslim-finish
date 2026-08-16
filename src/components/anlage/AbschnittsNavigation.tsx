import { useEffect, useState } from "react";

export type Abschnitt = { id: string; label: string };

/**
 * Klebende Abschnittsleiste unter der Kopfleiste. Auf dem Handy waagerecht
 * scrollbar. Sie springt nur innerhalb der Seite, sie verlässt sie nie.
 *
 * Der Abstand 68px entspricht der Höhe der Kopfleiste, sonst klebt die Leiste
 * darunter und verdeckt die Überschrift des Ziels.
 */
const AbschnittsNavigation = ({ abschnitte }: { abschnitte: Abschnitt[] }) => {
  const [aktiv, setAktiv] = useState(abschnitte[0]?.id);

  useEffect(() => {
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        const sichtbar = eintraege
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (sichtbar) setAktiv(sichtbar.target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    abschnitte.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) beobachter.observe(el);
    });
    return () => beobachter.disconnect();
  }, [abschnitte]);

  return (
    <nav
      aria-label="Abschnitte dieser Seite"
      className="sticky top-[68px] z-30 border-b border-border bg-background/95 backdrop-blur"
    >
      <ul className="container flex max-w-[1200px] gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {abschnitte.map((a) => (
          <li key={a.id}>
            <a
              href={`#${a.id}`}
              aria-current={aktiv === a.id ? "true" : undefined}
              className={`inline-flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-lg px-4 text-[14px] font-semibold transition-colors ${
                aktiv === a.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {a.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AbschnittsNavigation;
