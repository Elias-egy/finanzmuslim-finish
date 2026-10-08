import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import GesperrteZeile from "@/components/vorlagen/GesperrteZeile";
import Schnittkante from "@/components/optin/Schnittkante";
import { FallKarte, GOLD_CTAS, GOLD_EINLEITUNG, GOLD_QUELLEN, GOLD_RECHTSHINWEIS, GoldLegende, Grundregel } from "@/components/vorlagen/goldTeile";
import { vorlageBySlug } from "@/data/vorlagen";
import { optinFreebie } from "@/data/optin";
import { ANZAHL_FAELLE, kante, offen } from "@/data/goldCheckAusschnitt";

/**
 * Offene Seite des Gold-Checks: Grundregel, zwei Fälle mit Urteil, die übrigen nur mit Namen
 * (Plan Opt-in-Strecke P3). Diese Datei importiert bewusst nicht `goldCheck.ts`, sonst stünden alle
 * Urteile im JavaScript dieser Seite. Die volle Fassung ist `GoldCheckVoll.tsx`.
 */
const v = vorlageBySlug("gold-check")!;
const freebie = optinFreebie("gold-check")!;

/** So viele Namen stehen lesbar an der Schranke, darunter läuft die Liste verschwommen aus. */
const AN_DER_KANTE = 3;

const GoldCheck = () => (
  <>
    <Seo
      title="Gold kaufen halal? Der Gold-Check für zehn Wege | finanzmuslim"
      description="Prüfe, welcher Weg zu Gold halal ist: Barren, Sparplan und Altgold beim Juwelier. Zu jedem Weg das Urteil, der Grund und ein Beispiel."
      path="/vorlagen/gold-check"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Gold-Check", path: "/vorlagen/gold-check" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung={GOLD_EINLEITUNG}
      pdfPfad={v.pdfPfad}
      slug={v.slug}
      gesperrt={freebie}
      quellen={GOLD_QUELLEN}
      rechtshinweis={GOLD_RECHTSHINWEIS}
      ctas={GOLD_CTAS}
    >
      <Grundregel />
      <GoldLegende />

      <section>
        <h2 className="text-2xl font-bold text-foreground">Zwei Wege, zwei Urteile</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sieh zwei Wege mit Urteil und Beispiel. Die übrigen {ANZAHL_FAELLE - offen.length} gibt es gegen deine E-Mail.
        </p>
        <div className="mt-4 space-y-3">
          {offen.map((f) => (
            <FallKarte key={f.id} f={f} />
          ))}
        </div>
      </section>

      <Schnittkante freebie={freebie} weitere={`Alle ${ANZAHL_FAELLE} Wege mit Urteil, Grund und Beispiel`}>
        {kante.slice(0, AN_DER_KANTE).map((f) => (
          <GesperrteZeile key={f.id} name={f.fall} unterzeile={f.unter} verborgen="Urteil, Grund und Beispiel nach der Anmeldung" />
        ))}
      </Schnittkante>
    </VorlagenSeite>
  </>
);

export default GoldCheck;
