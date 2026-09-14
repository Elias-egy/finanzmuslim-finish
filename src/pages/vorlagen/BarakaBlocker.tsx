import Seo from "@/components/Seo";
import VorlagenSeite from "@/components/VorlagenSeite";
import { vorlageBySlug } from "@/data/vorlagen";
import { blocker } from "@/data/barakaBlocker";

const v = vorlageBySlug("baraka-blocker")!;

const BarakaBlocker = () => (
  <>
    <Seo
      title="Zehn Dinge, die deiner Baraka im Weg stehen | finanzmuslim"
      description="Zehn belegte Rizq-Blocker aus Quran und Sunnah, mit Fundstelle und dem, was stattdessen geht. Nicht mehr bekommen, sondern weniger verlieren."
      path="/vorlagen/baraka-blocker"
      brotkrumen={[{ name: "Vorlagen", path: "/vorlagen" }, { name: "Baraka-Blocker", path: "/vorlagen/baraka-blocker" }]}
    />
    <VorlagenSeite
      kicker={v.kicker}
      motiv={v.motiv}
      titel={v.titel}
      einleitung="Nicht zehn Meinungen, sondern zehn Punkte, zu denen es eine Stelle im Quran oder eine Überlieferung gibt. Jeweils mit Fundstelle und mit dem, was stattdessen geht."
      pdfPfad={v.pdfPfad}
      quellen="Quran: 2:276, 2:278 bis 279, 9:34 bis 35, 14:7, 17:26 bis 27, 25:67. Deutsche Wiedergabe sinngemäß nach Bubenheim/Elyas. Hadith: Ṣaḥīḥ al-Buchari 1454, 2079, 2087, 2227, 5986; Ṣaḥīḥ Muslim 1513, 1532, 1598, 1606, 2963; Sunan Abū Dāwūd 2606; Sunan at-Tirmidhi 1212; Sunan Ibn Māja 2443. Die Nummerierung folgt der jeweils verbreiteten Zählung und kann je nach Ausgabe um wenige Stellen abweichen. Zum Überlieferungsgrad der einzelnen Hadithe äußert sich diese Seite nicht. Punkt 8 und 9 sind in Teilfragen umstritten, das ist dort vermerkt."
      rechtshinweis="Diese Seite gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Sie ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechts-, Steuer- oder Anlageberatung. Sie urteilt nicht über einzelne Personen. Innerhalb der Rechtsschulen gibt es zu mehreren dieser Punkte abweichende Auffassungen. In Zweifelsfällen wende dich an einen Gelehrten, dem du vertraust, und lege ihm deinen konkreten Fall vor."
      ctas={[
        {
          titel: "Punkt 1 in der Praxis",
          text: "Welcher Anbieter Guthabenzins zahlt, wo man ihn abschalten kann und wer einen Dispo ungefragt einräumt.",
          buttonLabel: "Depot-Vergleich",
          to: "/vergleich/depot",
        },
        {
          titel: "Punkt 4 ohne Kopfrechnen",
          text: "Zakat auf Bargeld, Depot, Gold und Krypto, mit dem Nisab nach Gold oder Silber und einem festen Stichtag.",
          buttonLabel: "Zakat-Rechner",
          to: "/zakat-rechner",
        },
      ]}
    >
      <section className="rounded-2xl bg-hero p-6 md:p-8">
        <h2 className="text-xl font-bold text-foreground">Baraka ist nicht dasselbe wie Menge</h2>
        <p className="mt-2 text-[16px] leading-relaxed text-foreground/90">
          Baraka heißt Segen im Sinne von: es reicht weiter, als es sollte. Zwei Menschen mit
          demselben Gehalt kommen unterschiedlich weit. Deshalb geht es hier nicht darum, mehr zu
          bekommen, sondern darum, was vorhandene Versorgung aufzehrt.
        </p>
      </section>

      <section>
        <div className="space-y-3">
          {blocker.map((b) => (
            <article key={b.nr} className="card-surface p-5 md:p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-[20px] font-extrabold leading-none text-[hsl(var(--destructive))]">
                  {b.nr}
                </span>
                <h3 className="text-[17px] font-bold text-foreground">{b.titel}</h3>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">{b.text}</p>
              <p className="mt-2 rounded-md bg-[hsl(var(--primary)/0.06)] p-3 text-[14px] leading-relaxed text-foreground/90">
                <span className="font-bold text-foreground">Stattdessen: </span>
                {b.stattdessen}
              </p>
              <p className="mt-2 border-t border-border pt-2 text-[12px] leading-relaxed text-muted-foreground">
                {b.quelle}
                {b.umstritten && (
                  <span className="ml-1 font-semibold text-[hsl(38_92%_32%)]">Umstritten.</span>
                )}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] p-6">
        <h2 className="text-xl font-bold text-foreground">Was dieses Blatt nicht tut</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/90">
          Es urteilt nicht über Personen und erklärt niemanden für schuldig. Mehrere der Punkte
          sind unter Gelehrten in Teilfragen umstritten, besonders Nummer 8 und 9. Wo das so ist,
          steht es dabei.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground">Womit du anfängst</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Zehn Punkte auf einmal ändert niemand. Drei davon lassen sich an einem Nachmittag
          erledigen.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Heute, 20 Minuten</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Beim Broker und bei der Bank nachsehen, ob Guthabenzins gutgeschrieben wird, und ihn
              abschalten. Punkt 1.
            </p>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Diese Woche</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Einen Hawl-Stichtag für die Zakat festlegen und in den Kalender eintragen. Punkt 4.
            </p>
          </div>
          <div className="card-surface p-5">
            <h3 className="text-[16px] font-bold text-foreground">Diesen Monat</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
              Ein Anruf bei jemandem aus der Verwandtschaft, mit dem der Kontakt abgerissen ist.
              Punkt 2.
            </p>
          </div>
        </div>
      </section>
    </VorlagenSeite>
  </>
);

export default BarakaBlocker;
