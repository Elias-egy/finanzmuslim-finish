import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { landFreigegeben, hatLandVersion } from "@/data/land";
import {
  SITZUNG_GEPRUEFT,
  erkenneLand,
  gemerktesLand,
  istRobot,
  landAusPfad,
  landPfad,
  zielLand,
} from "@/lib/land";

/**
 * Schickt Besucher aus Österreich und der Schweiz einmal in ihre Länderversion (DACH1, Elias 23.11.2026).
 *
 * Gilt nur auf einer deutschen Vergleichsseite, die es auch als Länderversion gibt, und nur, wenn diese Version fertig
 * ist (`landFreigegeben`). Eine gemerkte Wahl (Cookie) geht vor der Erkennung. Pro Sitzung höchstens einmal, damit die
 * Zurück-Taste nie in eine Schleife läuft. Crawler (Google kommt aus den USA), Vorschaukarten und das Prerendering beim
 * Build werden nie umgeleitet. Die Umstellung ersetzt den Eintrag im Verlauf (`replace`), sie ist keine Weiterleitung per
 * Server, und die deutsche Adresse bleibt für Google die deutsche Seite.
 */
export const LandErkennung = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (landAusPfad(pathname) !== "de" || !hatLandVersion(pathname)) return;
    let schonGeprueft = false;
    try {
      schonGeprueft = sessionStorage.getItem(SITZUNG_GEPRUEFT) === "1";
      sessionStorage.setItem(SITZUNG_GEPRUEFT, "1");
    } catch {
      /* Speicher gesperrt: dann bleibt es bei der deutschen Seite, nichts wird erzwungen. */
      return;
    }
    let zeitzone: string | null = null;
    try {
      zeitzone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      zeitzone = null;
    }
    const ziel = zielLand({
      aktuell: "de",
      gemerkt: gemerktesLand(),
      erkannt: erkenneLand(navigator.languages?.length ? navigator.languages : [navigator.language], zeitzone),
      robot: istRobot(navigator.userAgent, navigator.webdriver),
      schonGeprueft,
      verfuegbar: (land) => landFreigegeben(land, pathname),
    });
    if (ziel) navigate(`${landPfad(pathname, ziel)}${search}`, { replace: true });
  }, [pathname, search, navigate]);

  return null;
};
