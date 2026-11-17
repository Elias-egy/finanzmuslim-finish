import { Link } from "react-router-dom";
import { ArrowRight, Check, MessageSquare, Star, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { ereignis } from "@/lib/messung";
import { BEISPIEL_STIMMEN, stimmeAnzeige, stimmenFuer, type Stimme } from "@/data/checkStimmen";
import { RUNDE_BANKEN, rundStil } from "@/components/rundeBanken";
import {
  ART_JE_QUELLE,
  DEPOTS_GETESTET,
  KONTEN_GETESTET,
  UEBERSCHRIFT,
  checkEinstiegLink,
  zielFrage,
  type CheckQuelle,
} from "@/data/halalFinanzCheck";

/**
 * Einstieg in den Check in jedem Freebie (RN5, RN8, RN10-07; neu gestaltet RN16-07 am 17.11.2026).
 *
 * Elias RN16-07: „Dass sie irgendwie selber ein Testimonial haben, im Freebie selber … und was sagt, ich habe so und so viele Sachen
 * selbst getestet und habe hier einen Vergleich entwickelt … Und dann der Klick … dass es nicht Quiz starten heißt“. Darum oben Elias mit
 * Foto und „35 Depots und 54 Girokonten selbst getestet“ samt runden Bank-Logos (wie die Verkaufsseite, RN14-02), ein Satz zum Vergleich,
 * eine Stimme, dann gleich die erste Frage als große Antwort-Karten: der Klick auf eine Antwort startet den Check bei Frage 2, es gibt
 * keinen Knopf „Quiz starten“ (Perspective-Tipp 13: der erste Tipp ist der schwerste).
 *
 * Stimme: nur echte aus checkStimmen.ts; solange keine da ist, zeigt nur der Entwicklungsmodus eine gelb gestrichelte Beispiel-Stimme,
 * die Produktion nichts (Vault raw/2026-11-15-elias-rn6-02: „Keine erfundenen Stimmen, nur echte“).
 *
 * Etiketten (Elias RN16-08): „Neues Bankkonto“ immer grün „am beliebtesten“, aus einem Anlagen-Freebie dazu orange an „Depot zum
 * Investieren“ („passt zu deiner Liste“, „… Plan“, „… Vergleich“). Ein Tipp öffnet /check?quelle=…&start=2&a1=…; jede Stelle hat ihr
 * eigenes ?quelle= (Tipp 43). Nie „Finde, was zu dir passt“ (Regelbuch woerter-und-ton, Nie).
 *
 * Eigenschaften (rückwärts verträglich): `quelle` (Pflicht), `className` (optional). Mehr nicht.
 */
const ICON: Record<string, LucideIcon> = { konto: Wallet, invest: TrendingUp, unsicher: MessageSquare };

const StimmeKarte = ({ art }: { art: "konto" | "depot" }) => {
  const liste = stimmenFuer(art);
  const modus = stimmeAnzeige(0, import.meta.env.DEV, liste);
  if (modus === "keine") return null;
  const s: Stimme | undefined = modus === "echt" ? liste[0] : stimmenFuer(art, BEISPIEL_STIMMEN)[0];
  if (!s) return null;
  const platz = modus === "platzhalter";
  return (
    <figure
      data-stimme-platzhalter={platz ? "" : undefined}
      className={`mt-5 rounded-xl p-4 ${platz ? "border-2 border-dashed border-warning bg-warning/10" : "bg-primary/5"}`}
    >
      {s.sterne && (
        <div className="flex gap-0.5" role="img" aria-label={`${s.sterne} von 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} className={`h-4 w-4 ${n <= s.sterne! ? "fill-warning text-warning" : "text-border"}`} aria-hidden />
          ))}
        </div>
      )}
      <blockquote className="mt-2 text-[16px] font-medium leading-snug text-foreground">„{s.zitat}“</blockquote>
      <figcaption className="mt-2 flex items-center gap-2 text-[14px] text-foreground">
        {s.foto && <img src={s.foto} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 rounded-full object-cover" />}
        <span className="font-bold">{s.name}</span>
        {s.zeile && <span>· {s.zeile}</span>}
      </figcaption>
    </figure>
  );
};

const CheckEinstieg = ({ quelle, className = "" }: { quelle: CheckQuelle; className?: string }) => {
  const art = ART_JE_QUELLE[quelle] ?? "konto";
  const frage = zielFrage(quelle);
  return (
    <aside
      data-check-einstieg={quelle}
      data-art={art}
      aria-labelledby={`check-${quelle}`}
      className={`rounded-2xl border-2 border-primary bg-card p-4 shadow-[0_12px_32px_-16px_hsl(var(--primary)/0.45)] md:p-7 ${className}`}
    >
      <div className="flex items-center gap-3">
        <img src="/elias-el-gendy.webp" alt="Elias El-Gendy" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-primary/25" />
        <div className="min-w-0">
          <p className="text-[16px] font-extrabold leading-tight text-foreground">Elias El-Gendy</p>
          <p data-getestet className="mt-1.5 text-[14px] font-bold leading-snug text-primary">
            <span className="mb-1.5 flex">
              {RUNDE_BANKEN.map((b, i) => (
                <span
                  key={b.src}
                  role="img"
                  aria-label={b.alt}
                  className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-border bg-white ${i ? "-ml-2" : ""}`}
                >
                  <span style={rundStil(b, 18)} />
                </span>
              ))}
            </span>
            <span className="block">
              {DEPOTS_GETESTET} Depots und {KONTEN_GETESTET} Girokonten selbst getestet
            </span>
          </p>
        </div>
      </div>

      <h2 id={`check-${quelle}`} className="mt-5 text-[24px] font-extrabold leading-[1.15] text-foreground [text-wrap:balance] md:text-[30px]">
        {UEBERSCHRIFT[quelle]}
      </h2>
      <p className="mt-2 text-[16px] leading-snug text-foreground">
        Aus meinen Tests habe ich einen Vergleich gebaut. Ein paar kurze Fragen, dann siehst du dein Match.
      </p>

      <StimmeKarte art={art} />

      <p className="mt-6 text-[19px] font-extrabold leading-tight text-foreground">{frage.titel}</p>
      <ul className="mt-3 space-y-2.5">
        {frage.optionen.map((o) => {
          const Icon = ICON[o.wert];
          return (
            <li key={o.wert}>
              <Link
                to={checkEinstiegLink(quelle, o.wert)}
                onClick={() => ereignis("quiz_frage", { check: true, quelle, art, frage: "ziel", antwort: o.wert, nummer: 1, im: "freebie" })}
                className="group flex min-h-[64px] w-full items-center gap-3 rounded-xl border-2 border-border bg-background px-3.5 py-3 text-left transition-[border-color,transform] duration-150 hover:border-primary active:scale-[0.98]"
              >
                {Icon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-bold leading-tight text-foreground">{o.titel}</span>
                  {(o.etikett || o.hinweis) && (
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {o.etikett && (
                        <span data-etikett className="rounded-full bg-gain-soft px-2 py-0.5 text-[12px] font-bold leading-snug text-gain">
                          {o.etikett}
                        </span>
                      )}
                      {o.hinweis && (
                        <span data-hinweis className="rounded-full bg-warning/15 px-2 py-0.5 text-[12px] font-bold leading-snug text-[hsl(28_90%_38%)]">
                          {o.hinweis}
                        </span>
                      )}
                    </span>
                  )}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 group-hover:translate-x-0.5">
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[14px] font-semibold text-foreground">
        {["Kostenlos", "Ohne Anmeldung", "Unter 60 Sekunden"].map((t) => (
          <span key={t} className="flex items-center gap-1">
            <Check className="h-4 w-4 text-gain" aria-hidden />
            {t}
          </span>
        ))}
      </p>
    </aside>
  );
};

export default CheckEinstieg;
