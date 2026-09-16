import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Check, Mail } from "lucide-react";

/**
 * /kooperationen — fuer Anbieter und Partnernetzwerke.
 *
 * Beantwortet, was Bewerbungsformulare abfragen: Reichweite, Zielgruppe,
 * Themen, Werbeformen, Bedingungen. Zahlen nur mit Stand, nur aktuelle,
 * nie Vergleiche mit frueher. Quelle: data/ig-history.csv und
 * data/tiktok-history.csv im Vault.
 */

const STAND = "16.09.2026";

const reichweite = [
  { wert: "11.600+", was: "Follower auf Instagram", wo: "@finanz.muslim" },
  { wert: "5.000+", was: "Follower auf TikTok", wo: "@finanz.muslim" },
  { wert: "1,5 Mio.+", was: "Aufrufe auf TikTok", wo: "alle Videos zusammen" },
  { wert: "80+", was: "Seiten auf finanzmuslim.com", wo: "Beiträge, Vergleiche, Rechner" },
];

const themen = [
  "Depot und Broker",
  "Girokonto",
  "Krypto-Börsen",
  "Gold und Silber",
  "Halal-Screening-Apps",
  "Zakat und Vermögensaufbau",
];

const regeln = [
  "Ich nehme nur Produkte auf, die sich ohne Zinsen nutzen lassen, oder bei denen sich Zinsen abschalten lassen.",
  "Erst prüfe ich den Anbieter, dann sprechen wir über eine Partnerschaft. Eine Provision ändert keine Bewertung.",
  "Partnerlinks sind mit * gekennzeichnet und als gesponserte Links ausgezeichnet.",
  "Kein Keyword-Bidding auf Markennamen, keine Gutscheinseiten, kein Incentive-Traffic.",
];

const Kooperationen = () => (
  <main className="bg-background">
    <Seo
      title="Kooperationen und Partner | finanzmuslim"
      description="Finde Reichweite, Themen und Bedingungen für eine Partnerschaft mit finanzmuslim: islamkonforme Finanzprodukte für Muslime in Deutschland."
      path="/kooperationen"
      brotkrumen={[{ name: "Kooperationen", path: "/kooperationen" }]}
    />

    <section className="container max-w-4xl pt-14 md:pt-20">
      <span className="badge-note">Für Partner</span>
      <h1 className="headline mt-5 text-4xl leading-[1.05] md:text-[52px]">Kooperationen</h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
        finanzmuslim erreicht Muslime in Deutschland, die ihr Geld anlegen wollen und dabei auf Zinsen
        verzichten. Viele haben ihr erstes Depot oder Konto noch vor sich und suchen einen Anbieter, dem sie
        vertrauen können.
      </p>
    </section>

    <section className="container max-w-4xl py-10 md:py-14">
      <h2 className="headline text-2xl md:text-3xl">Reichweite</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reichweite.map((r) => (
          <li key={r.was} className="card-surface p-5">
            <p className="text-[32px] font-bold leading-none text-primary">{r.wert}</p>
            <p className="mt-2 font-semibold text-foreground">{r.was}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">{r.wo}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted-foreground">Stand {STAND}. Aktuelle Zahlen schicke ich gern auf Anfrage.</p>
    </section>

    <section className="container max-w-4xl pb-10 md:pb-14">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card-surface p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Themen</h2>
          <ul className="mt-4 space-y-2">
            {themen.map((t) => (
              <li key={t} className="flex items-center gap-3 text-foreground">
                <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-surface p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Wo Partner auftauchen</h2>
          <ul className="mt-4 space-y-2 leading-relaxed text-muted-foreground">
            <li>In den Vergleichen für Depot, Girokonto, Krypto und Edelmetalle</li>
            <li>In Beiträgen zum passenden Thema</li>
            <li>Auf den Seiten der Halal-Anlagen, wo sie kaufbar sind</li>
            <li>In Videos auf Instagram und TikTok, immer als Werbung gekennzeichnet</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="container max-w-4xl pb-10 md:pb-14">
      <div className="card-surface border-l-4 border-l-primary p-6 md:p-8">
        <h2 className="headline text-xl md:text-2xl">Meine Bedingungen</h2>
        <ul className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
          {regeln.map((r) => (
            <li key={r} className="flex gap-3">
              <span className="shrink-0 font-bold text-primary">·</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
          <Link to="/vergleiche/methodik" className="text-primary hover:underline">
            Methodik der Vergleiche
          </Link>
          <Link to="/wie-ich-geld-verdiene" className="text-primary hover:underline">
            So verdiene ich Geld
          </Link>
          <Link to="/ueber-mich" className="text-primary hover:underline">
            Über mich
          </Link>
        </div>
      </div>
    </section>

    <section className="container max-w-4xl pb-16 md:pb-24">
      <div className="card-surface flex items-start gap-4 p-6 md:p-8">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Mail className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="headline text-xl">Kontakt</h2>
          <p className="mt-1 text-muted-foreground">
            Schreib mir mit dem Betreff „Kooperation“ an{" "}
            <a href="mailto:elias@finanzmuslim.com" className="font-semibold text-primary hover:underline">
              elias@finanzmuslim.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default Kooperationen;
