import { useState } from "react";

const logoToken = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;

/** Kürzel als Rückfall, wenn kein Logo lädt. Zwei Buchstaben reichen. */
const kuerzelAus = (name: string) => {
  const teile = name.split(/[\s-]+/).filter(Boolean);
  if (teile.length >= 2) return (teile[0][0] + teile[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

/**
 * Rundes Anbieterlogo für die Vergleiche. Holt das Bild über die Domain bei
 * Logo.dev. Der Rückfall auf das Kürzel bleibt dauerhaft nötig, weil nicht
 * jeder Anbieter ein Logo herausgibt und der Schlüssel im Build fehlen kann.
 */
export const AnbieterLogo = ({
  name,
  domain,
  gross = false,
}: {
  name: string;
  domain?: string;
  gross?: boolean;
}) => {
  const [fehler, setFehler] = useState(false);
  const mass = gross ? "h-12 w-12" : "h-10 w-10";
  const url =
    !fehler && logoToken && domain
      ? `https://img.logo.dev/${domain}?token=${logoToken}&size=96&format=png&retina=true`
      : undefined;

  return (
    <span
      className={`flex ${mass} shrink-0 items-center justify-center overflow-hidden rounded-full bg-hero`}
      title={name}
    >
      {url ? (
        <img
          src={url}
          alt={`${name} Logo`}
          loading="lazy"
          onError={() => setFehler(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className={`font-bold text-foreground ${gross ? "text-[15px]" : "text-[13px]"}`}>
          {kuerzelAus(name)}
        </span>
      )}
    </span>
  );
};

export default AnbieterLogo;
