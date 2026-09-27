import { bewertung, UrteilPille, type Farbe } from "@/components/vorlagen/ampelTeile";
import type { AboAnbieter, Rechnung } from "@/data/autoAboCheck";

/**
 * Einleitung, Legende und Anbieter-Karte des Auto-Abo-Checks. Enthält kein Urteil über einen
 * Anbieter, deshalb darf die offene Seite es laden. Die Anbieter stehen in `autoAboCheck.ts` (voll)
 * und `autoAboCheckAusschnitt.ts` (offen, nur Namen).
 */
const warumNicht: { titel: string; text: string }[] = [
  {
    titel: "Autokredit",
    text: "Die Bank gibt Geld und bekommt mehr zurück. Das ist Riba, auch wenn die Bank zum Autohersteller gehört.",
  },
  {
    titel: "Null-Prozent-Finanzierung",
    text: "Der Händler schlägt auf den Preis, was die Bank sonst an Zinsen verdient. Auf dem Papier steht null, im Vertrag bleibt ein Kredit.",
  },
  {
    titel: "Klassisches Leasing",
    text: "Zins ist hier nicht das Problem, Leasing ist Miete. Aber du zahlst Versicherung, Steuer und Wartung selbst und haftest für ein Auto, das dir nicht gehört.",
  },
];

export const WarumNicht = () => (
  <section aria-labelledby="warum-nicht">
    <h2 id="warum-nicht" className="text-2xl font-bold text-foreground">
      Warum Kredit und Leasing scheitern
    </h2>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {warumNicht.map((w) => (
        <div key={w.titel} className="card-surface p-5">
          <h3 className="text-[17px] font-bold text-foreground">{w.titel}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.text}</p>
        </div>
      ))}
    </div>
  </section>
);

export const WasAboAndersMacht = () => (
  <section className="rounded-2xl bg-hero p-6 md:p-8" aria-labelledby="abo-anders">
    <span className="badge-new">Die Alternative</span>
    <h2 id="abo-anders" className="mt-3 text-2xl font-bold text-foreground">
      Was ein Abo anders macht
    </h2>
    <p className="mt-3 text-[17px] leading-relaxed text-foreground/90">
      Beim Abo bleibt der Anbieter Eigentümer und Halter. Er zahlt Versicherung, Kfz-Steuer und Wartung, du zahlst die
      Rate und tankst.
    </p>
    <p className="mt-3 text-[16px] leading-relaxed text-foreground/90">
      So beschreiben Gelehrte die zulässige Miete, aber nur, wenn der Vertrag hält, was die Werbung sagt. Die Rate liegt
      höher als beim Leasing, dafür fallen die Nebenkosten weg.
    </p>
  </section>
);

const legende: { farbe: Farbe; text: string }[] = [
  {
    farbe: "gruen",
    text: "Passt zur zulässigen Miete: Der Anbieter trägt Eigentum, Versicherung und Wartung, du haftest nur für eigenes Verschulden. Im Vertrag steht weder Zins noch Kauf.",
  },
  { farbe: "gelb", text: "Der Aufbau passt, aber eine Klausel hakt, oder der Vertrag ist nicht öffentlich. Vor der Unterschrift klären." },
  {
    farbe: "rot",
    text: "Die Gefahr für das Auto liegt bei dir, oder im Vertrag stecken Kauf oder Kredit. Daran scheitert auch Leasing.",
  },
];

export const AboLegende = () => (
  <section aria-label="Was die Farben bedeuten">
    <div className="grid gap-4 md:grid-cols-3">
      {legende.map((l) => (
        <div key={l.farbe} className="card-surface p-5">
          <div className="flex items-center gap-3">
            <span className={`h-5 w-5 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] ${bewertung[l.farbe].punkt}`} aria-hidden />
            <span className="text-[17px] font-bold text-foreground">{bewertung[l.farbe].wort}</span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{l.text}</p>
        </div>
      ))}
    </div>
  </section>
);

/** Ein Anbieter mit Urteil, Grund, Preis und den Klauseln aus seinen eigenen Bedingungen. */
export const AnbieterKarte = ({ a }: { a: AboAnbieter }) => (
  <article className="card-surface p-5 md:p-6" aria-labelledby={`abo-${a.id}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 id={`abo-${a.id}`} className="text-[19px] font-bold text-foreground">
          {a.name}
        </h3>
        <span className="mt-1 block text-[13px] text-muted-foreground">{a.unter}</span>
      </div>
      <UrteilPille farbe={a.farbe} urteil={a.urteil} />
    </div>
    <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">{a.grund}</p>
    <p className="mt-3 text-[14px] text-foreground">
      <span className="font-bold">Preis:</span> {a.preisAb}
    </p>

    <h4 className="mt-5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
      Wortlaut des Anbieters
    </h4>
    <dl className="mt-2 divide-y divide-border rounded-xl border border-border">
      {a.klauseln.map((k, i) => (
        <div key={`${k.thema}-${i}`} className="grid gap-1 p-3 md:grid-cols-[9rem_1fr] md:gap-4">
          <dt className="text-[13px] font-bold text-foreground">{k.thema}</dt>
          <dd className="min-w-0 text-[14px] leading-relaxed text-foreground/90">
            {k.zitat ? <q className="italic">{k.zitat}</q> : <span className="text-muted-foreground">Dazu schreibt der Anbieter nichts.</span>}
            <span className="mt-1 block text-[12px] text-muted-foreground">{k.fundstelle}</span>
            {k.hinweis && <span className="mt-1 block text-[13px] text-foreground/80">{k.hinweis}</span>}
          </dd>
        </div>
      ))}
    </dl>
    <p className="mt-3 text-[12px] text-muted-foreground">Grundlage: {a.grundlage}</p>
  </article>
);

const euro = (n: number) => `${Math.round(n).toLocaleString("de-DE")} Euro`;

/** Abo, Leasing und Barkauf für dasselbe Auto, nur Beträge, keine Zinsrechnung (Elias, 26.09.2026). */
export const Rechenbeispiel = ({ r }: { r: Rechnung }) => (
  <section aria-labelledby="rechnung">
    <h2 id="rechnung" className="text-2xl font-bold text-foreground">
      Abo, Leasing oder bar kaufen
    </h2>
    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{r.einleitung}</p>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      {r.wege.map((w) => (
        <div key={w.name} className="card-surface flex flex-col p-5">
          <h3 className="text-[17px] font-bold text-foreground">{w.name}</h3>
          <dl className="mt-3 flex-1 space-y-2">
            {w.posten.map((p) => (
              <div key={p.was} className="flex items-baseline justify-between gap-3 text-[14px]">
                <dt className="min-w-0 text-foreground/90">{p.was}</dt>
                <dd className="shrink-0 font-semibold tabular-nums text-foreground">{euro(p.betrag)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-xl bg-accent p-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] font-bold text-foreground">{r.summeWort}</span>
              <span className="text-[19px] font-bold tabular-nums text-primary">{euro(w.posten.reduce((s, p) => s + p.betrag, 0))}</span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{w.hinweis}</p>
          </div>
        </div>
      ))}
    </div>
    <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">{r.fazit}</p>
    <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{r.quellen}</p>
  </section>
);

export const AUTO_EINLEITUNG =
  "Prüfe Auto-Abos als Alternative zu Kredit und Leasing, Anbieter für Anbieter. Zu jedem das Urteil, der Wortlaut aus den eigenen Bedingungen und ein Rechenbeispiel.";

export const AUTO_QUELLEN =
  "Anbieter: eigene AGB, FAQ, Gebührenkataloge und Preisseiten, abgerufen am 27.09.2026, jeweils mit Stand und Ziffer bei der Klausel. Miete, Leasing und Autofinanzierung: Positionen zeitgenössischer Gelehrter zu Miete (Ijara) und Riba. Gesetzliche Verzugszinsen: § 288 BGB. Partnerlinks enthält diese Seite nicht.";

export const AUTO_RECHTSHINWEIS =
  "Diese Seite gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. AGB ändern sich: Lies vor der Unterschrift deinen eigenen Vertrag und lege ihn im Zweifel einem Gelehrten vor, dem du vertraust.";

export const AUTO_CTAS = [
  {
    titel: "Auto ohne Kredit ansparen",
    text: "Rechne aus, wie viel du im Monat zurücklegst und wann du das Auto bar bezahlst.",
    buttonLabel: "Zum Sparzielrechner",
    to: "/sparzielrechner",
  },
  {
    titel: "Welche Verträge gehen?",
    text: "Sieh zwölf Verträge aus dem Alltag mit Farbe und Bedingung, von der Kreditkarte bis zur Versicherung.",
    buttonLabel: "Zur Vertrags-Ampel",
    to: "/vorlagen/vertrags-ampel",
  },
];
