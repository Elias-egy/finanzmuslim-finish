import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Mail, Star, Users } from "lucide-react";

/**
 * /wie-ich-geld-verdiene — Transparenzseite.
 *
 * Zeigt auf, wie finanzmuslim finanziert wird. Nur belegbare Aussagen,
 * keine Zahlen, keine Provisionshöhen, keine erfundenen Einnahmequellen.
 */

const WieIchGeldVerdiene = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="So verdiene ich Geld – Transparenz | finanzmuslim"
      description="Wie sich finanzmuslim finanziert: Affiliate-Links, der kostenlose Guide und die Regel, warum Vertrauen vor Provision kommt."
      path="/wie-ich-geld-verdiene"
      brotkrumen={[{ name: "Wie ich Geld verdiene", path: "/wie-ich-geld-verdiene" }]}
    />
    <main>
      <section className="container max-w-3xl pt-14 md:pt-20">
        <span className="badge-note">Transparenz</span>
        <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-5">
          So verdiene ich Geld
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed text-base md:text-[17px]">
          Diese Seite existiert, weil Vertrauen der wichtigste Teil dieser Arbeit ist.
          Wenn ich dir empfehle, ein Produkt zu nutzen, sollst du wissen, ob und wie
          ich daran verdiene. Hier steht es offen.
        </p>
      </section>

      <section className="container max-w-3xl pb-16 md:pb-24">
        <ol className="mt-10 space-y-6">
          <li className="card-surface p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Star className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="headline text-xl md:text-2xl">Affiliate-Links</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Einige Links auf dieser Seite sind mit einem Stern (*) gekennzeichnet.
                  Das sind Werbe- oder Affiliate-Links. Wenn du über einen solchen Link
                  ein Depot oder Konto eröffnest, erhalte ich eine Vergütung vom Anbieter.
                  Stand heute sind das Scalable Capital, Traders Place, DKB, finvesto,
                  N26 und BBBank, teils über das Partnernetzwerk FinanceQuality.
                </p>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Für dich ändert sich nichts: derselbe Broker, dieselben Konditionen,
                  keine Mehrkosten. Du kannst jedes Depot und Konto jederzeit auch direkt
                  beim Anbieter eröffnen, dann bekomme ich nichts.
                </p>
              </div>
            </div>
          </li>

          <li className="card-surface p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="headline text-xl md:text-2xl">Der kostenlose Guide</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Der Halal Investment Guide ist kostenlos. Wenn du ihn per E-Mail
                  anforderst, landest du auf meiner E-Mail-Liste. Dort erfährst du von
                  neuen Rechnern, Vergleichen und Artikeln.
                </p>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Der Guide selbst enthält keine bezahlten Empfehlungen. Er ist dazu da,
                  dir eine sachliche Grundlage fürs islamkonforme Investieren zu geben.
                </p>
                <Link
                  to="/halal-guide"
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Zum Halal Investment Guide
                </Link>
              </div>
            </div>
          </li>
        </ol>

        <div className="mt-10 card-surface p-6 md:p-8 border-l-4 border-l-primary">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="headline text-xl md:text-2xl">Die wichtigste Regel</h2>
              <p className="mt-3 text-foreground leading-relaxed font-medium">
                Zuerst wird geprüft, dann wird über eine Partnerschaft gesprochen.
                Nie umgekehrt.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Anbieter ohne Partnerschaft stehen trotzdem in meinen Vergleichen,
                weil ein Vergleich sonst wertlos wäre. Nur weil ein Anbieter nicht
                vergütet, wird er nicht ausgeblendet.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 card-surface p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Was ich nicht mache</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>Keine Anlageberatung und keine Anlageempfehlung.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>Keine erfundenen Bewertungen oder Erfahrungsberichte.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>Keine Renditeversprechen.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>Keine Fatwa. Ich bin kein Gelehrter.</span>
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

export default WieIchGeldVerdiene;
