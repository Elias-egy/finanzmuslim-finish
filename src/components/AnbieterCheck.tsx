import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ZellInhalt } from "@/components/vergleich/VergleichsBausteine";
import type { VergleichsZeile } from "@/components/vergleich/vergleichTypen";
import { ANLAGEN_KAUFBAR } from "@/data/anlagenKaufbar";
import { brokerVergleich, DEPOT_ZEILEN } from "@/data/brokerVergleich";
import { girokontoVergleich, GIRO_ZEILEN } from "@/data/girokontoVergleich";
import { halalAnlagen, type Kategorie } from "@/data/halalAnlagen";
import type { StartPartner } from "@/data/investmentStart";
import { baueSpalten } from "@/data/vergleichHelfer";

/**
 * „Dein Check“ auf der Startseite je Partner (Elias, 15.09.2026): Halal-Merkmale, Kosten und bei Depots die
 * Halal-Anlagen, die dort nachweislich kaufbar sind. Alles kommt aus den Vergleichsdaten, nichts wird hier
 * eingetragen. Was dort fehlt, steht als „noch nicht geprüft“ da.
 */

const KOSTEN_KEYS = {
  depot: ["depotgebuehr", "orderkosten", "etfSparplanKosten", "sparrate"],
  girokonto: ["kontofuehrung", "debitkarte", "girocard", "applePay"],
} as const;

const KATEGORIE_TITEL: { titel: string; kategorien: Kategorie[] }[] = [
  { titel: "Aktien-ETFs und Fonds", kategorien: ["aktien"] },
  { titel: "Sukuk", kategorien: ["sukuk"] },
  { titel: "Gold und Silber", kategorien: ["gold", "silber"] },
];

const Zeile = ({ zeile, wert }: { zeile: VergleichsZeile; wert: Parameters<typeof ZellInhalt>[0]["wert"] }) => (
  <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
    <span className="text-[15px] text-foreground/85">{zeile.label}</span>
    <span className="shrink-0 text-right text-[15px] font-semibold [&_svg]:mx-0">
      <ZellInhalt wert={wert} art={zeile.art} />
    </span>
  </div>
);

const AnbieterCheck = ({ partner }: { partner: StartPartner }) => {
  const istDepot = partner.art === "depot";
  const zeilen = istDepot ? DEPOT_ZEILEN : GIRO_ZEILEN;
  const roh = (istDepot ? brokerVergleich : girokontoVergleich).find((a) => a.link === `/out/${partner.kurzname}`);
  if (!roh) return null;
  const [spalte] = baueSpalten([roh], zeilen);

  const halal = zeilen.filter((z) => z.gruppe === "halal");
  const kosten = KOSTEN_KEYS[istDepot ? "depot" : "girokonto"]
    .map((k) => zeilen.find((z) => z.key === k))
    .filter((z): z is VergleichsZeile => Boolean(z));

  const mitIsin = halalAnlagen.filter((a) => a.isin && ANLAGEN_KAUFBAR[a.isin]);
  const kaufbar = mitIsin.filter((a) => ANLAGEN_KAUFBAR[a.isin!].kaufbar.some((k) => k.anbieter === roh.name));
  const offen = mitIsin.filter(
    (a) =>
      !ANLAGEN_KAUFBAR[a.isin!].kaufbar.some((k) => k.anbieter === roh.name) &&
      !ANLAGEN_KAUFBAR[a.isin!].nichtImAngebot.includes(roh.name),
  ).length;

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="container max-w-[960px]">
        <div className="reveal text-center">
          <span className="eyebrow">Dein Check</span>
          <h2 className="headline mt-3 text-3xl md:text-4xl">Das bekommst du bei {partner.kurz}</h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] text-muted-foreground md:text-[17px]">
            Prüfe die Halal-Merkmale und Kosten, bevor du startest: dieselben Daten wie im{" "}
            {istDepot ? "Depot" : "Girokonto"}-Vergleich.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="reveal card-surface p-5 md:p-6">
            <h3 className="text-[17px] font-bold text-foreground">Halal-Merkmale</h3>
            <div className="mt-2">
              {halal.map((z) => (
                <Zeile key={z.key} zeile={z} wert={spalte.werte[z.key]} />
              ))}
            </div>
          </div>
          <div className="reveal card-surface p-5 md:p-6">
            <h3 className="text-[17px] font-bold text-foreground">Kosten</h3>
            <div className="mt-2">
              {kosten.map((z) => (
                <Zeile key={z.key} zeile={z} wert={spalte.werte[z.key]} />
              ))}
            </div>
          </div>
        </div>

        {istDepot && (
          <div className="reveal card-surface mt-4 p-5 md:p-6">
            <h3 className="text-[17px] font-bold text-foreground">Diese Halal-Anlagen gibt es bei {partner.kurz}</h3>
            {kaufbar.length === 0 ? (
              <p className="mt-2 text-[15px] text-muted-foreground">Noch nicht geprüft.</p>
            ) : (
              <div className="mt-3 space-y-4">
                {KATEGORIE_TITEL.map(({ titel, kategorien }) => {
                  const liste = kaufbar.filter((a) => kategorien.includes(a.kategorie));
                  if (liste.length === 0) return null;
                  return (
                    <div key={titel}>
                      <p className="text-[13px] font-semibold text-muted-foreground">{titel}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {liste.map((a) => (
                          <Link
                            key={a.slug}
                            to={`/halal-anlagen/${a.slug}`}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-[14px] text-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            {a.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {offen > 0 && (
              <p className="mt-4 text-[14px] text-muted-foreground">
                Bei {offen} weiteren Anlagen ist noch nicht geprüft, ob es sie bei {partner.kurz} gibt.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to={istDepot ? "/vergleich/depot" : "/vergleich/girokonto"}
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline"
          >
            Alle Anbieter im Vergleich <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AnbieterCheck;
