import { Link } from "react-router-dom";
import Seo, { faqJsonLd } from "@/components/Seo";

/**
 * /wie-ich-geld-verdiene — Transparenzseite.
 *
 * Finanzfluss betreibt dieselbe Seite ("So verdienen wir Geld") und verlinkt
 * sie prominent. Fuer eine Marke, die Menschen sagt, was halal ist, und an der
 * Empfehlung mitverdient, ist diese Offenlegung kein Kleingedrucktes, sondern
 * der Kern der Glaubwuerdigkeit. Der groesste unausgesprochene Einwand lautet
 * "der verdient doch daran" — diese Seite beantwortet ihn, bevor er gestellt wird.
 *
 * Inhaltlich gilt: nur belegbare Aussagen. Keine Zahlen, die nicht stimmen,
 * keine Partnerschaften, die nicht bestehen.
 */

const faq = [
  {
    q: "Kostet mich der Affiliate-Link etwas?",
    a: "Nein. Du bekommst denselben Broker zu denselben Konditionen wie bei direkter Anmeldung. Die Vergütung zahlt Scalable Capital, nicht du.",
  },
  {
    q: "Empfiehlst du Scalable nur, weil du daran verdienst?",
    a: "Die Reihenfolge war umgekehrt: Ich habe zuerst geprüft, wo die islamkonformen Anlagen überhaupt handelbar sind, und erst danach die Partnerschaft geschlossen. Die Kriterien, nach denen ich geprüft habe, stehen offen auf dieser Seite und in den Guides.",
  },
  {
    q: "Kann ich das Depot auch ohne deinen Link eröffnen?",
    a: "Ja, jederzeit. Geh einfach direkt auf die Seite von Scalable Capital. Für dich ändert sich nichts, ich bekomme dann keine Vergütung.",
  },
  {
    q: "Verkaufst du meine Daten?",
    a: "Nein. Was mit deinen Daten passiert, steht in der Datenschutzerklärung.",
  },
];

const WieIchGeldVerdiene = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Wie ich Geld verdiene – Transparenz | finanzmuslim"
      description="Offenlegung: Wie sich finanzmuslim finanziert, was Affiliate-Links bedeuten, was sie dich kosten und wie ich Interessenkonflikte handhabe."
      path="/wie-ich-geld-verdiene"
      jsonLd={faqJsonLd(faq)}
    />
    <main>
      <section className="container max-w-3xl pt-14 md:pt-20">
        <span className="inline-flex items-center gap-3 text-[12px] font-semibold tracking-wide text-primary">
          <span className="h-px w-6 bg-primary" aria-hidden /> Transparenz
        </span>
        <h1 className="headline text-4xl md:text-[52px] leading-[1.05] mt-4">
          Wie ich Geld verdiene.
        </h1>
        <p className="mt-5 text-muted-foreground leading-relaxed text-base md:text-[17px]">
          Ich sage Menschen, worauf sie beim islamkonformen Investieren achten sollten,
          und verdiene an einer der Empfehlungen mit. Diesen Widerspruch kann man
          verschweigen oder erklären. Hier steht, wie es funktioniert.
        </p>
      </section>

      <section className="container max-w-3xl pb-16 md:pb-24">
        <div className="mt-12">
          <h2 className="headline text-2xl md:text-3xl">Affiliate-Provision von Scalable Capital</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Ich bin Partner von Scalable Capital. Wenn du über einen meiner Links ein Depot
            eröffnest und es aktiv nutzt, erhalte ich dafür eine einmalige Vergütung von
            Scalable. Für dich ändert das nichts: derselbe Broker, dieselben Konditionen,
            keine Mehrkosten. Du kannst das Depot jederzeit auch direkt bei Scalable
            eröffnen, dann bekomme ich nichts.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Jeder solche Link ist als Werbung gekennzeichnet, bevor du ihn anklickst. Auf
            der Website, in den Guides und in den PDFs.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="headline text-2xl md:text-3xl">Warum Scalable und nicht ein anderer</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Der Ausgangspunkt war nicht die Provision, sondern eine praktische Frage: Wo
            kann man die islamkonformen Anlagen in Deutschland überhaupt kaufen? Viele
            Banken und Broker führen weder Shariah-geprüfte Aktien-ETFs noch Sukuk noch
            physisch hinterlegtes Gold. Die Kriterien, nach denen ich geprüft habe, sind
            dieselben, die du in den Guides und auf der Startseite findest, und du kannst
            sie auf jeden anderen Anbieter anwenden.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Sollte ein anderer Anbieter diese Kriterien besser erfüllen, gehört das hierher
            und nicht unter den Tisch.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="headline text-2xl md:text-3xl">Was ich nicht mache</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Keine Anlageberatung. Ich sage dir nicht, welches Wertpapier du kaufen
                sollst, und darf das auch nicht.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>Keine erfundenen Bewertungen oder Erfahrungsberichte.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Keine Renditeversprechen. Kapitalanlagen bergen Risiken, auch die
                islamkonformen.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold shrink-0">·</span>
              <span>
                Keine Fatwa. Ich bin kein Gelehrter. Wo Gelehrtenmeinungen auseinandergehen,
                schreibe ich das dazu, statt eine Meinung als die einzige darzustellen.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="headline text-2xl md:text-3xl">Häufige Fragen</h2>
          <div className="mt-6 divide-y divide-border/70 border-y border-border/70">
            {faq.map((item) => (
              <div key={item.q} className="py-5">
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed text-[15px]">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-surface border border-border/70 p-6 md:p-8">
          <h2 className="headline text-xl md:text-2xl">Etwas stimmt nicht?</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed text-[15px]">
            Wenn dir auf dieser Seite, in einem Guide oder in einem Rechner ein Fehler
            auffällt, schreib mir. Korrekturen sind mir lieber als eine saubere Fassade.
          </p>
          <a
            href="mailto:elias@finanzmuslim.com?subject=Korrekturhinweis"
            className="mt-4 inline-block text-primary font-semibold hover:underline"
          >
            elias@finanzmuslim.com
          </a>
        </div>

        <p className="mt-10 text-[13px] text-muted-foreground leading-relaxed">
          Die auf dieser Website enthaltenen Äußerungen, Kommentare und sonstigen Inhalte
          sind auch dann, wenn einzelne Emittenten oder Finanzinstrumente genannt werden,
          nicht als Anlageberatung zu verstehen und stellen weder direkt noch indirekt eine
          Empfehlung oder Aufforderung zum Kaufen, Halten oder Verkaufen eines
          Finanzinstruments oder eine diesbezügliche Beratung dar. Kapitalanlagen bergen
          Risiken. Ausführliche Risikohinweise:{" "}
          <a
            href="https://de.scalable.capital/risiko"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            de.scalable.capital/risiko
          </a>
          . Siehe auch <Link to="/impressum" className="underline underline-offset-2">Impressum</Link>{" "}
          und <Link to="/datenschutz" className="underline underline-offset-2">Datenschutz</Link>.
        </p>
      </section>
    </main>
  </div>
);

export default WieIchGeldVerdiene;
