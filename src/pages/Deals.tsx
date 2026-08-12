import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { deals, type Deal } from "@/data/deals";
import { Check, Copy, Gift, TicketPercent } from "lucide-react";

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">
            {deal.anbieter}
          </p>
          <h2 className="headline text-xl md:text-2xl mt-1">{deal.titel}</h2>
        </div>
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Gift className="h-5 w-5" aria-hidden />
        </span>
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

      <p className="text-[13px] text-muted-foreground">{deal.bedingungen}</p>

      {ctaUrl ? (
        <Link
          to={ctaUrl}
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary-hover transition-colors min-h-[48px]"
        >
          Zum Angebot*
        </Link>
      ) : (
        <span className="mt-auto inline-flex items-center justify-center rounded-lg border border-border bg-muted px-6 py-3 text-base font-semibold text-muted-foreground min-h-[48px]">
          Kein aktiver Link
        </span>
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

const Deals = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Aktuelle Angebote – Deals | finanzmuslim"
      description="Geprüfte Boni und Aktionen für die finanzmuslim Community. Nur Angebote, die sich wirklich lohnen."
      path="/deals"
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
        <div className="mt-10">
          {deals.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {deals.map((deal) => (
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
                Angebote ohne Partnerschaft werden hier nicht gelistet.
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

export default Deals;
