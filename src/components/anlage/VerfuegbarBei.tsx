import AnbieterLogo from "@/components/AnbieterLogo";
import { DEPOT_PARTNER } from "@/components/anlage/KaufbarListe";
import type { AnlageKaufbar } from "@/data/anlagenKaufbar";

/**
 * "Verfügbar bei" im Kopf der Anlageseite (Elias, 21.09.2026): statt dreimal "Broker anzeigen"
 * eine Logo-Reihe der Anbieter, bei denen die Anlage belegt kaufbar ist. Partner stehen vorn.
 * Der Klick springt zum Abschnitt "Wo du sie kaufen kannst", dort stehen Belege und Links.
 */
const VerfuegbarBei = ({ kaufbar }: { kaufbar: AnlageKaufbar }) => {
  const alle = [
    ...kaufbar.kaufbar.filter((k) => DEPOT_PARTNER[k.anbieter]),
    ...kaufbar.kaufbar.filter((k) => !DEPOT_PARTNER[k.anbieter]),
  ];
  if (alle.length === 0) return null;
  const sichtbar = alle.slice(0, 6);
  const rest = alle.length - sichtbar.length;
  return (
    <a
      href="#kaufen"
      className="group inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-border bg-card px-4 py-3 transition hover:border-primary"
    >
      <span className="text-[14px] font-bold text-foreground">Verfügbar bei</span>
      <span className="flex -space-x-2">
        {sichtbar.map((k) => (
          <span key={k.anbieter} className="rounded-full bg-white p-[3px] ring-1 ring-black/5">
            <AnbieterLogo name={k.anbieter} domain={k.beleg.domains[0]} />
          </span>
        ))}
      </span>
      {rest > 0 && <span className="text-[13px] font-bold text-foreground">+ {rest}</span>}
      <span className="text-[14px] font-semibold text-primary group-hover:underline">Alle ansehen</span>
    </a>
  );
};

export default VerfuegbarBei;
