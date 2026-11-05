import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check } from "lucide-react";
import Seo from "@/components/Seo";
import NewsletterBox from "@/components/NewsletterBox";
import AnbieterLogo from "@/components/AnbieterLogo";
import { BBBANK_PRAEMIE, BONUS_KONTEN, GIRO_BONUS_SRC, GIRO_BONUS_STAND, euro } from "@/data/girokontoBonus";

/**
 * /vorlagen/girokonto-bonus: das Girokonto-Freebie als offene Unterseite (Elias, 05.11.2026, H15 5c). Leser kommen über
 * die Halal-News und über das Video mit den 50 Euro. Aufbau nach Elias: die drei Konten im Vergleich, die BBBank als
 * Bonus und warum sie so gut ist, je Konto ein Knopf zum Eröffnen. Alle Zahlen und Belege: `src/data/girokontoBonus.ts`.
 * Nach dem Muster der Freebie-Seiten (Vault memory freebie-top3-statt-rot-guide-unten, freebie-seiten-simpel-beispiel-im-kontext):
 * weiß, große Zahl, Top-3-Karten mit Logo, Kennzeichnung Werbung, kein roter Kasten, kein Verweis auf andere Freebies.
 */
const [bbbank, norisbank, consorsbank] = BONUS_KONTEN;

const link = (out: string, stelle: string) => `/out/${out}?src=${stelle}`;

const Werbung = () => <span className="text-[12px] text-muted-foreground">Werbung</span>;

const Haken = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3 text-[17px] leading-snug text-foreground">
    <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gain text-white">
      <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
    </span>
    <span>{children}</span>
  </li>
);

const Pille = ({ children }: { children: ReactNode }) => (
  <li className="flex min-h-[40px] items-center gap-1.5 rounded-full border border-border bg-background px-3 text-[14px] font-semibold text-foreground">
    <Check className="h-4 w-4 text-gain" strokeWidth={3} aria-hidden />
    {children}
  </li>
);

const Knopf = ({ to, children }: { to: string; children: ReactNode }) => (
  <Link to={to} className="btn-spark w-full sm:w-auto">
    {children}
  </Link>
);

const Zelle = ({ children, fett }: { children: ReactNode; fett?: boolean }) => (
  <td className={`px-2 py-3 text-center align-middle text-[16px] leading-tight ${fett ? "font-extrabold text-foreground" : "text-foreground"}`}>
    {children}
  </td>
);

const GirokontoBonus = () => (
  <>
    <Seo
      title="Girokonto ohne Zinsen mit 50 € Bonus | finanzmuslim"
      description="Vergleiche drei Girokonten ohne Zinsen und hol dir mit der BBBank 50 € Startprämie. Mit Kosten, Bedingungen und dem Weg zur Eröffnung."
      path="/vorlagen/girokonto-bonus"
      brotkrumen={[{ name: "Girokonto mit Bonus", path: "/vorlagen/girokonto-bonus" }]}
    />
    <main className="bg-background" data-vorlage="girokonto-bonus">
      <div className="mx-auto w-full max-w-[640px] px-4 pb-16 pt-8 md:pt-12">
        {/* Kopf: Zustand, den der Leser haben will, dazu die große Zahl und gleich der Knopf */}
        <header>
          <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-tight text-foreground md:text-[40px]">
            Girokonto ohne Zinsen, 50 € Bonus obendrauf
          </h1>
          <p className="mt-3 text-[18px] leading-snug text-foreground/85">
            Vergleiche drei Girokonten ohne Zinsen und hol dir mit dem ersten 50 € Startprämie.
          </p>
        </header>

        <section className="mt-6 rounded-3xl bg-accent p-5 ring-1 ring-primary/20 md:p-6" data-bonus-kopf>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AnbieterLogo name={bbbank.name} domain={bbbank.domain} rand />
              <p className="text-[18px] font-extrabold leading-tight text-foreground">
                {bbbank.name} {bbbank.produkt}
              </p>
            </div>
            <Werbung />
          </div>
          <p className="mt-4 text-[72px] font-extrabold leading-none tracking-tight text-primary tabular-nums">
            {euro(BBBANK_PRAEMIE.betrag)}
          </p>
          <p className="mt-1 text-[20px] font-bold leading-tight text-foreground">Startprämie für Neukunden</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <Pille>Keine Zinsen</Pille>
            <Pille>Dispo nur auf Antrag</Pille>
            <Pille>Karte ohne Kredit</Pille>
          </ul>
          <div className="mt-5">
            <Knopf to={link(bbbank.out, GIRO_BONUS_SRC.kopf)}>
              50 € bei der BBBank sichern*
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Knopf>
          </div>
          <a
            href="#vergleich"
            className="mt-3 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
          >
            Erst die drei vergleichen
            <ArrowDown className="h-4 w-4" aria-hidden />
          </a>
        </section>

        {/* Die drei im Vergleich */}
        <section id="vergleich" className="mt-12 scroll-mt-20">
          <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Die drei im Vergleich</h2>
          <ul className="mt-4 space-y-2.5">
            <Haken>Keine Zinsen auf dein Guthaben</Haken>
            <Haken>Dispo nur auf Antrag</Haken>
            <Haken>Karte ohne Kredit</Haken>
          </ul>
          <p className="mt-3 text-[16px] leading-snug text-foreground/80">Das gilt bei allen dreien. Der Unterschied liegt hier:</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border" data-bonus-tabelle>
            <table className="w-full min-w-[340px] border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[26%] px-2 py-3 text-left text-[13px] font-semibold text-foreground/70">
                    <span className="sr-only">Merkmal</span>
                  </th>
                  {BONUS_KONTEN.map((k) => (
                    <th key={k.id} scope="col" className="px-1 py-3 text-center">
                      <span className="mx-auto flex w-fit flex-col items-center gap-1.5">
                        <AnbieterLogo name={k.name} domain={k.domain} rand />
                        <span className="text-[14px] font-extrabold leading-tight text-foreground">{k.name}</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b [&>tr]:border-border last:[&>tr]:border-0">
                <tr>
                  <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">
                    Gratis ab Geldeingang
                  </th>
                  {BONUS_KONTEN.map((k) => (
                    <Zelle key={k.id} fett>
                      {euro(k.gratisAb)}
                    </Zelle>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">
                    Sonst im Monat
                  </th>
                  {BONUS_KONTEN.map((k) => (
                    <Zelle key={k.id}>{euro(k.sonst)}</Zelle>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">
                    Immer gratis
                  </th>
                  {BONUS_KONTEN.map((k) => (
                    <Zelle key={k.id}>unter {k.gratisUnter}</Zelle>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="px-2 py-3 text-left text-[14px] font-semibold leading-tight text-foreground">
                    Bargeld einzahlen
                  </th>
                  {BONUS_KONTEN.map((k) => (
                    <Zelle key={k.id}>{k.bargeld}</Zelle>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[16px] leading-snug text-foreground/80">
            Geldeingang heißt: Dein Gehalt oder anderes Geld kommt jeden Monat aufs Konto.
          </p>
        </section>

        {/* Warum die BBBank, dazu der Weg */}
        <section className="mt-12" data-bonus-warum>
          <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Darum die BBBank</h2>
          <ul className="mt-4 space-y-3">
            <Haken>
              <strong>50 € Startprämie.</strong> Als Voraussetzung nennt die BBBank nur: Du bist Neukunde.
            </Haken>
            <Haken>
              <strong>Keine Zinsen.</strong> Im Preisverzeichnis der BBBank steht beim BetterSmart Konto kein Guthabenzins.
            </Haken>
            <Haken>
              <strong>Karte gratis.</strong> Visa Debitkarte und digitale girocard kosten nichts.
            </Haken>
            <Haken>
              <strong>Kontoführung gratis</strong> ab {euro(bbbank.gratisAb)} Geldeingang im Monat, unter {bbbank.gratisUnter} Jahren immer.
            </Haken>
          </ul>

          <h3 className="mt-8 text-[20px] font-extrabold leading-tight text-foreground">So holst du dir die 50 €</h3>
          <ol className="mt-3 space-y-3">
            {[
              ["1", "Konto online eröffnen", "Du darfst in den letzten 24 Monaten kein Girokonto bei der BBBank gehabt haben."],
              ["2", "Per E-Ident oder Video-Ident bestätigen", "Ausweis in die Kamera halten oder mit dem Online-Ausweis."],
              ["3", "50 € kommen aufs Konto", "Die BBBank zahlt innerhalb von 8 Wochen aus, sobald die Voraussetzungen erfüllt sind."],
            ].map(([nr, titel, text]) => (
              <li key={nr} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-extrabold text-primary-foreground">
                  {nr}
                </span>
                <span className="text-[17px] leading-snug text-foreground">
                  <strong>{titel}</strong>
                  <br />
                  <span className="text-foreground/80">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Knopf to={link(bbbank.out, GIRO_BONUS_SRC.warum)}>
              Konto bei der BBBank eröffnen*
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Knopf>
          </div>
          <p className="mt-4 text-[16px] leading-snug text-foreground/80">
            Laut BBBank gehört die Prämie in die Steuererklärung. Bis 256 € im Jahr (alle solchen Einkünfte zusammen) fällt keine
            Steuer an, darüber zählt der volle Betrag.
          </p>
        </section>

        {/* Die anderen zwei */}
        <section className="mt-12" data-bonus-andere>
          <h2 className="text-[26px] font-extrabold leading-tight text-foreground">Lieber ein anderes Konto?</h2>
          <p className="mt-2 text-[17px] leading-snug text-foreground/85">Diese zwei stehen in meinem Vergleich gleich dahinter.</p>
          <ul className="mt-4 grid gap-4">
            {[
              { k: norisbank, stelle: GIRO_BONUS_SRC.norisbank, zeilen: [norisbank.karte, "Eröffnung per Video-Ident oder Post-Ident", "Bargeld einzahlen am Automaten der Deutschen Bank"] },
              { k: consorsbank, stelle: GIRO_BONUS_SRC.consorsbank, zeilen: [consorsbank.karte, "Eröffnung per Video-, Post- oder E-Ident", "Bargeld einzahlen geht nicht"] },
            ].map(({ k, stelle, zeilen }) => (
              <li
                key={k.id}
                className="rounded-2xl border border-primary/20 bg-background p-4 shadow-[0_6px_24px_-12px_rgba(15,23,42,0.18)]"
                data-bonus-karte
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AnbieterLogo name={k.name} domain={k.domain} rand />
                    <p className="text-[22px] font-extrabold leading-tight text-foreground">{k.name}</p>
                  </div>
                  <Werbung />
                </div>
                <ul className="mt-3 space-y-2.5">
                  {zeilen.map((z) => (
                    <Haken key={z}>{z}</Haken>
                  ))}
                  <Haken>
                    Gratis ab {euro(k.gratisAb)} Geldeingang, sonst {euro(k.sonst)} im Monat
                  </Haken>
                </ul>
                <div className="mt-4">
                  <Knopf to={link(k.out, stelle)}>
                    Bei {k.name} eröffnen*
                    <ArrowRight className="h-5 w-5" aria-hidden />
                  </Knopf>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* So bleibt es ohne Zinsen */}
        <section className="mt-12 rounded-3xl bg-accent p-5 md:p-6" data-bonus-regeln>
          <h2 className="text-[22px] font-extrabold leading-tight text-foreground">Zwei Regeln halten dein Konto ohne Zinsen</h2>
          <ul className="mt-4 space-y-3">
            <Haken>
              <strong>Kein Geld aufs Tagesgeld legen.</strong> BBBank und norisbank legen eins mit an. Es ist ein eigenes Konto und
              bleibt leer, wenn du nichts einzahlst.
            </Haken>
            <Haken>
              <strong>Keinen Dispo beantragen.</strong> Ein Dispo kostet Zinsen, sobald du ihn nutzt. Das Konto läuft auch ohne.
            </Haken>
          </ul>
          <Link
            to={`/vergleich/girokonto?src=${GIRO_BONUS_SRC.vergleich}`}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-[16px] font-semibold text-primary hover:underline"
          >
            Alle Girokonten im Vergleich
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        <p className="mt-8 text-[14px] leading-snug text-muted-foreground" data-werbehinweis>
          * Werbung: Eröffnest du über meinen Link ein Konto, bekomme ich eine Provision, ohne Mehrkosten für dich. Die Angaben
          habe ich am {GIRO_BONUS_STAND} bei den Banken gelesen, die Aktionen können sich jederzeit ändern.
        </p>

        <section className="mt-14">
          <NewsletterBox />
        </section>
      </div>
    </main>
  </>
);

export default GirokontoBonus;
