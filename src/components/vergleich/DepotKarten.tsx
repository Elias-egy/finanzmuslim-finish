import { Check, Minus, TriangleAlert } from "lucide-react";
import { Kachel, Wert, euro } from "./GiroKarten";

/**
 * Kacheln der Depot-Karten am Handy, gleiche Bauart wie die Girokonto-Karten (Elias 15.11.2026: „Mach das auch beim
 * Depot-Vergleich“). Eine Hakenzeile aus der Zins-Ampel, darunter vier Kacheln: Halal-ETFs und Fonds, Sukuk,
 * Depotgebühr im Jahr, Kosten pro Order. Alle Werte sind dieselben Zellen wie in der Tabelle, nichts ist neu gerechnet.
 * Krypto und die übrigen Vergleiche behalten die Hakenliste.
 */
export type DepotWerte = {
  zinsfrei: string | undefined;
  halalEtfsFonds: string | null | undefined;
  halalSukuk: string | null | undefined;
  depotgebuehr: string | null | undefined;
  /** Kurzform, falls vorhanden („ab 9,90€“). */
  orderkosten: string | null | undefined;
};

/** Die Zeile mit dem Haken: nur, was die Zins-Ampel des Depots belegt, wie die Zeile „Ohne Zinsen nutzbar“ der Tabelle. */
export const depotZinsZeile = (zinsfrei: string | undefined): { text: string; zeichen: "ja" | "teils" | "offen" } => {
  if (zinsfrei === "gut") return { text: "Ohne Zinsen nutzbar", zeichen: "ja" };
  if (zinsfrei === "teils") return { text: "Zinsen abschaltbar", zeichen: "teils" };
  return { text: "Zinsen: nicht geprüft", zeichen: "offen" };
};

/** Lange Werte („0,99€, ETF-Kauf ab 250€: 0€“) bekommen kleinere Schrift, damit die Kachel nicht in die Höhe wächst. */
const WertText = ({ text }: { text: string | null | undefined }) =>
  text ? (
    <span className={`font-bold leading-tight text-foreground ${text.length > 14 ? "text-[14px]" : "text-[16px]"}`}>{euro(text)}</span>
  ) : (
    <Wert leise>–</Wert>
  );

export const DepotInhalt = ({ w }: { w: DepotWerte }) => {
  const z = depotZinsZeile(w.zinsfrei);
  const Icon = z.zeichen === "ja" ? Check : z.zeichen === "teils" ? TriangleAlert : Minus;
  const farbe = z.zeichen === "ja" ? "text-success" : z.zeichen === "teils" ? "text-warning" : "text-muted-foreground/60";
  return (
    <>
      <p className="mt-3 flex items-start gap-2 text-[14px] font-semibold leading-snug text-foreground">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${farbe}`} aria-hidden />
        <span>{z.text}</span>
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <Kachel label="Halal-ETFs und Fonds">
          <WertText text={w.halalEtfsFonds} />
        </Kachel>
        <Kachel label="Sukuk">
          <WertText text={w.halalSukuk} />
        </Kachel>
        <Kachel label="Depotgebühr (Jahr)">
          <WertText text={w.depotgebuehr} />
        </Kachel>
        <Kachel label="Kosten pro Order">
          <WertText text={w.orderkosten} />
        </Kachel>
      </div>
    </>
  );
};
