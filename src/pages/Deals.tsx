import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { laufendeDeals, schildText, type Deal, type DealBereich } from "@/data/deals";
import { empfehlbar } from "@/data/vergleichAssistent";
import { brokerVergleich } from "@/data/brokerVergleich";
import { girokontoVergleich } from "@/data/girokontoVergleich";
import { kryptoVergleich } from "@/data/kryptoVergleich";
import AnbieterLogo from "@/components/AnbieterLogo";
import { Check, Copy, Gift, TicketPercent } from "lucide-react";

/** Beworben wird nur, wer ab Start zinsfrei ist. Boni von anderen stehen nur neben ihrem Eintrag im Vergleich. */
const deals = laufendeDeals().filter((d) => !d.anbieterIds || d.anbieterIds.every(empfehlbar));

/** Domain fürs Logo: aus dem Vergleichseintrag, an dem der Bonus hängt. */
const domainFuer = (deal: Deal) => {
  const id = deal.anbieterIds?.[0];
  if (!id) return undefined;
  return [...brokerVergleich, ...girokontoVergleich, ...kryptoVergleich].find((a) => a.id === id)?.domain;
};

const BEREICHE: { id: DealBereich; label: string; vergleich: string }[] = [
  { id: "depot", label: "Depot", vergleich: "/vergleich/depot" },
  { id: "girokonto", label: "Girokonto", vergleich: "/vergleich/girokonto" },
  { id: "krypto", label: "Krypto", vergleich: "/vergleich/krypto" },
];

const DealCard = ({ deal }: { deal: Deal }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!deal.gutscheincode) return;
    try {
      await navigator.clipboard.writeText(deal.gutscheincode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Falls Clipboard API nicht verfügbar ist, passiert nichts Sichtbares.
    }
  };

  const ctaUrl = deal.partnerKurzname
    ? `/out/${deal.partnerKurzname}`
    : undefined;

  return (
    <article className="card-surface p-6 md:p-8 flex flex-col gap-4">
      {/* Handy: Betragsschild unter dem Kopf, sonst sprengt es bei 360 px die Karte. */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AnbieterLogo name={deal.anbieter} domain={domainFuer(deal)} gross />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
              {deal.anbieter}
            </p>
            <h2 className="headline text-xl md:text-2xl mt-0.5">{deal.titel}</h2>
          </div>
        </div>
        {/* Der Betrag ist das Detail, das leuchten darf: Gold statt Hellblau. */}
        {deal.betrag && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-spark-soft px-3 py-1 text-[14px] font-bold text-spark-foreground ring-1 ring-spark/60">
            {schildText(deal)}
          </span>
        )}
      </div>

      <p className="text-muted-foreground leading-relaxed">{deal.vorteil}</p>

      {deal.gutscheincode && (
        <div className="rounded-lg border border-dashed border-border bg-muted/50 p-4">
          <p className="text-[13px] text-muted-foreground mb-2 flex items-center gap-2">
            <TicketPercent className="h-4 w-4" aria-hidden />
            Gutscheincode
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <code className="inline-flex items-center justify-center rounded-md bg-background border border-border px-4 py-2 text-sm font-mono tracking-wide">
              {deal.gutscheincode}
            </code>
            <button
              type="button"
              onClick={copyCode}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors min-h-[44px]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Kopiert
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" aria-hidden />
                  Kopieren
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <p className="text-[13px] text-muted-foreground">
        {deal.bedingungen}
        {deal.quelle && ` Geprüft beim Anbieter am ${deal.quelle.stand}.`}
      </p>

      {ctaUrl ? (
        <Link
          to={ctaUrl}
          rel="sponsored nofollow"
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary-hover transition-colors min-h-[48px]"
        >
          Zum Angebot*
        </Link>
      ) : (
        <Link
          to={BEREICHE.find((b) => b.id === deal.bereich)?.vergleich ?? "/vergleiche"}
          className="mt-auto inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-primary hover:border-primary transition-colors min-h-[48px]"
        >
          Im Vergleich ansehen
        </Link>
      )}
    </article>
  );
};

const EmptyState = () => (
  <div className="card-surface p-10 md:p-16 text-center">
    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground mb-5">
      <Gift className="h-7 w-7" aria-hidden />
    </div>
    <h2 className="headline text-xl md:text-2xl">Aktuell laufen keine Aktionen</h2>
    <p className="mt-3 text-muted-foreground max-w-md mx-auto leading-relaxed">
      Sobald es etwas gibt, findest du es hier zuerst. Alle Angebote werden geprüft,
      bevor sie veröffentlicht werden.
    </p>
  </div>
);

const Deals = () => {
  const [bereich, setBereich] = useState<DealBereich | "alle">("alle");
  const vorhanden = BEREICHE.filter((b) => deals.some((d) => d.bereich === b.id));
  const sichtbar = bereich === "alle" ? deals : deals.filter((d) => d.bereich === bereich);
  const chip = (aktiv: boolean) =>
    `min-h-[44px] rounded-full border px-4 text-[15px] font-semibold transition-colors ${
      aktiv ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"
    }`;

  return (
  <div className="min-h-screen bg-background">
    <Seo
      title="Halal Angebote und Boni: aktuelle Deals | finanzmuslim"
      description="Geprüfte Boni und Aktionen für die finanzmuslim Community. Nur Angebote, die sich wirklich lohnen."
      path="/deals"
      noindex={deals.length === 0}
      brotkrumen={[{ name: "Deals", path: "/deals" }]}
    />
    <main>
      <section className="container max-w-3xl pt-14 md:pt-20">
        <span className="badge-note">Community</span>
        <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-5">
          Aktuelle Angebote
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed text-base md:text-[17px]">
          Hier sammle ich Boni und Aktionen, die sich für meine Community lohnen.
          Jedes Angebot wird vorher geprüft.
        </p>
      </section>

      <section className="container max-w-4xl pb-16 md:pb-24">
        {vorhanden.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Bereich wählen">
            <button type="button" aria-pressed={bereich === "alle"} onClick={() => setBereich("alle")} className={chip(bereich === "alle")}>
              Alle
            </button>
            {vorhanden.map((b) => (
              <button key={b.id} type="button" aria-pressed={bereich === b.id} onClick={() => setBereich(b.id)} className={chip(bereich === b.id)}>
                {b.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {deals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sichtbar.map((deal) => (
                <DealCard key={`${deal.anbieter}-${deal.titel}`} deal={deal} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 card-surface p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Wie ich Deals auswähle</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Zuerst wird der Anbieter und das Angebot geprüft, dann wird über eine
                Partnerschaft gesprochen.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Mit * markierte Links sind Werbe- oder Affiliate-Links. Für dich entstehen
                dadurch keine Mehrkosten.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Angebote ohne * liste ich ohne Provision. Der Betrag steht auf der Seite des Anbieters.
              </span>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-[13px] text-muted-foreground leading-relaxed">
          Mit * markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt
          abschließt, erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>
      </section>
    </main>
  </div>
  );
};

export default Deals;
