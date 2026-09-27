import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowRight, Check, Mail, Scale, ShieldCheck, Sparkles } from "lucide-react";
import Seo from "@/components/Seo";
import eliasPortrait from "@/assets/elias-autor.webp";
import { optinFreebie, vollPfad } from "@/data/optin";
import type { DankeState } from "@/components/optin/OptinKarte";

/**
 * /danke/<freebie> (Baustein 30). Oben die Bestätigung, darunter „Teste dich“ als Bühne:
 * der Vergleichs-Assistent, also der Weg zu einem Partnerangebot.
 *
 * Wichtig bei Double Opt-in: Das Freebie ist noch nicht unterwegs, es kommt erst nach dem
 * Klick in der Bestätigungsmail. Deshalb steht hier „Bestätige kurz deine Mail“, nicht
 * „Dein Guide ist unterwegs“. Wer schon bestätigt war, bekommt keine Bestätigungsmail,
 * für ihn steht der Link direkt hier. Vorname und Ergebnis kommen über den Router-State,
 * nie über die Adresse. Ohne State (neu geladen, direkt aufgerufen) gilt der Normalfall.
 */
const karten = [
  { icon: Scale, titel: "Passende Anbieter", text: "Depot, Konto oder Steuer, je nachdem, was du vorhast." },
  { icon: ShieldCheck, titel: "Halal eingeordnet", text: "Jeder Anbieter mit seiner Halal-Einordnung." },
  { icon: Sparkles, titel: "Direkt loslegen", text: "Ein Klick zum Anbieter, wenn es passt." },
];

const Danke = () => {
  const { freebie: id } = useParams();
  const { state } = useLocation() as { state: DankeState | null };
  const freebie = optinFreebie(id);
  if (!freebie) return <Navigate to="/vorlagen" replace />;

  const anrede = state?.vorname ? `, ${state.vorname}` : "";
  const sofort = state?.ergebnis === "sofort";

  return (
    <div className="bg-background">
      <Seo title="Fast geschafft | finanzmuslim" description="Bestätige kurz deine E-Mail-Adresse." path={`/danke/${freebie.id}`} noindex />

      <div className="container pt-6 md:pt-10">
        <div
          role="status"
          className="mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-primary/20 bg-card p-5 shadow-[0_16px_40px_-28px_hsl(var(--primary)/0.6)] sm:flex-row sm:items-center sm:p-6"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {sofort ? <Check className="h-5 w-5" aria-hidden /> : <Mail className="h-5 w-5" aria-hidden />}
          </span>
          <div className="min-w-0 flex-1">
            {sofort ? (
              <>
                <p className="text-[17px] font-bold text-foreground">Du bist schon dabei{anrede}.</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                  Hier ist {freebie.deinObjekt}, ganz ohne Bestätigungsmail.
                </p>
              </>
            ) : (
              <>
                <p className="text-[17px] font-bold text-foreground">
                  Fast geschafft{anrede}: Bestätige kurz deine Mail, dann kommt {freebie.deinObjekt}.
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                  Die Mail kommt von elias@finanzmuslim.com. Keine Mail da? Schau im Spam-Ordner nach.
                </p>
              </>
            )}
          </div>
          {sofort && (
            <Link to={vollPfad(freebie, state?.stufe)} className="btn-spark shrink-0">
              Jetzt öffnen
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      <section className="container py-8 md:py-14">
        <div className="relative overflow-hidden rounded-[2rem] bg-hero px-6 py-10 md:px-12 md:py-14">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.18),transparent_65%)]"
          />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div className="max-w-xl">
              <p className="eyebrow">{sofort ? "Als Nächstes" : "Während die Mail kommt"}</p>
              <h1 className="mt-3 text-[30px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[44px]">
                Teste dich: <span className="text-primary">Was passt zu dir?</span>
              </h1>
              <p className="mt-4 text-[17px] leading-relaxed text-foreground/80">
                Beantworte ein paar Klicks und sieh die halal-tauglichen Anbieter für dein Geld.
              </p>
              <Link to="/vergleich/start" className="btn-spark mt-6 md:h-14 md:px-8 md:text-[18px]">
                Jetzt testen
                <ArrowRight className="h-5 w-5" aria-hidden />
              </Link>
            </div>
            <span className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-card bg-[#EFE7DC] shadow-lg md:h-56 md:w-56">
              <img src={eliasPortrait} alt="Elias El-Gendy, Gründer von finanzmuslim" className="h-full w-full object-cover" />
            </span>
          </div>
        </div>

        <h2 className="mt-10 text-[22px] font-bold text-foreground md:text-[28px]">Was du mitnimmst</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {karten.map((k, i) => (
            <div key={k.titel} className="card-surface p-6">
              <span className="text-[13px] font-bold text-primary">0{i + 1}</span>
              <k.icon className="mt-3 h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-3 text-[17px] font-bold text-foreground">{k.titel}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{k.text}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link to={freebie.seite} className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-primary hover:underline">
            Zurück zur Seite
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Danke;
