import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import DuaKarte from "@/components/vorlagen/DuaKarte";
import GesperrteZeile from "@/components/vorlagen/GesperrteZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { kante, offen } from "@/data/duasAusschnitt";
import { RIZQ_CTAS, RIZQ_EINLEITUNG, RIZQ_QUELLEN, RIZQ_RECHTSHINWEIS, RizqHinweis, RizqWarum } from "@/components/vorlagen/rizqTeile";

/**
 * Offene Seite „Dua für was?“: drei Bittgebete ganz, die Anliegen der stärksten an der
 * Schnittkante, alle 14 gegen E-Mail (Elias, 27.09.2026, Vault raw 2026-09-26-doomscroll-web/09).
 * Diese Datei importiert bewusst nicht `duas.ts`, sonst stünden alle 14 im JavaScript dieser
 * Seite. Die volle Fassung ist `RizqVoll.tsx`.
 */
const v = vorlageBySlug("rizq")!;
const freebie = optinFreebie("rizq")!;

/** So viele Namen stehen lesbar an der Schranke, darunter läuft die Liste verschwommen aus. */
const AN_DER_KANTE = 3;

const Rizq = () => (
  <>
    <Seo
      title="Dua für Rizq: 14 Bittgebete mit Quelle und Übersetzung | finanzmuslim"
      description="Finde das Dua für dein Anliegen: Arbeit, Schulden oder eine Entscheidung. Drei Bittgebete offen, alle 14 mit Arabisch und Fundstelle gegen deine E-Mail."
      path="/vorlagen/rizq"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Dua für was?", path: "/vorlagen/rizq" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel="Dua für was?"
      einleitung={RIZQ_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen={RIZQ_QUELLEN}
      rechtshinweis={RIZQ_RECHTSHINWEIS}
      ctas={RIZQ_CTAS}
    >
      <RizqWarum />

      <section>
        <h2 className="text-2xl font-bold text-foreground">Drei Duas aus dem Quran</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">Lies sie ganz, mit Wortlaut, Umschrift und Fundstelle.</p>
        <div className="mt-4 space-y-4">
          {offen.map((d) => (
            <DuaKarte key={d.nr} d={d} />
          ))}
        </div>
      </section>

      <Schnittkante freebie={freebie} weitere="Alle 14 Duas nach Anliegen, mit Arabisch und Fundstelle">
        {kante.slice(0, AN_DER_KANTE).map((k) => (
          <GesperrteZeile key={k.nr} name={k.name} unterzeile={k.wann} verborgen="Wortlaut nach der Anmeldung" />
        ))}
      </Schnittkante>

      <RizqHinweis />
    </VorlagenSeite>
  </>
);

export default Rizq;
