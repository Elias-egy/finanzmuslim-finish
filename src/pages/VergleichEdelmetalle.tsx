import { Link } from "react-router-dom";
import { VergleichsSeite } from "@/components/vergleich/VergleichsSeite";
import {
  edelmetallVergleich,
  EDELMETALL_ZEILEN,
  EDELMETALL_FILTER,
} from "@/data/edelmetallVergleich";

/**
 * Edelmetalle im Vergleich, und zwar nach Weg statt nach Händler.
 *
 * Der Grund steht in der Datendatei: Bei Gold entscheidet die Bauart des
 * Geschäfts über die Zulässigkeit, nicht der Name auf der Rechnung. Ein
 * Händlervergleich wäre ein Preisvergleich und hätte mit unserer Frage nichts
 * zu tun.
 */

const RohstoffeBlock = () => (
  <section className="mt-14 max-w-3xl">
    <h2 className="text-2xl font-bold text-foreground">Silber, Platin und die anderen Rohstoffe</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Für <strong className="font-semibold">Silber</strong> gilt dieselbe Sonderregel wie für Gold:
      Zahlung und Übergabe müssen zusammenfallen. Die Tabelle oben gilt für Silber unverändert, nur
      der Nisab ist ein anderer.
    </p>
    <p className="mt-4 text-[17px] leading-[26px] text-foreground/90">
      Bei <strong className="font-semibold">Platin und Palladium</strong> ist es einfacher, und das
      überrascht die meisten. Sie gehören nicht zu den Waren, für die diese Sonderregel überhaupt
      gilt. Sie werden behandelt wie Kupfer, Weizen oder ein Auto: ein normaler Kauf, bei dem eine
      spätere Lieferung kein Problem ist. Das Gremium, das die WisdomTree-Produkte prüft, führt
      Platin und Palladium deshalb ohne den Vorbehalt auf, den es bei Gold und Silber ausdrücklich
      diskutiert.
    </p>
    <p className="mt-4 text-[17px] leading-[26px] text-foreground/90">
      Bei <strong className="font-semibold">allen anderen Rohstoffen</strong> liegt das Problem
      woanders, und es ist meistens ein Ausschlussgrund. Wer über einen Öl-, Weizen- oder
      Rohstoffkorb-Fonds anlegt, kauft fast nie die Ware. Diese Fonds halten Terminkontrakte, die sie
      vor Fälligkeit weiterrollen. Es wird nie geliefert, nie übernommen und immer nur auf den Preis
      gesetzt. Dazu kommt die Verzinsung der hinterlegten Sicherheiten. Ein breiter Rohstoff-ETF ist
      deshalb in aller Regel kein Weg, und wir führen keinen in der Datenbank.
    </p>
    <p className="mt-4 text-[17px] leading-[26px] text-foreground/90">
      Was bleibt, ist der Weg über Unternehmen: Ein geprüfter Aktien-ETF enthält Bergbau-, Energie-
      und Agrarfirmen, sofern sie das Screening bestehen. Damit bist du an Rohstoffen beteiligt, ohne
      auf ihren Preis zu wetten. Welche Produkte das sind, steht in der{" "}
      <Link to="/halal-anlagen" className="font-semibold text-primary hover:underline">
        Anlagen-Datenbank
      </Link>
      .
    </p>

    <h2 className="mt-10 text-2xl font-bold text-foreground">Die drei Fragen beim Händler</h2>
    <p className="mt-3 text-[17px] leading-[26px] text-foreground/90">
      Beim physischen Kauf hängt alles an einer Frage: Gehört der Barren dem Händler schon, bevor du
      zahlst? Drei Dinge verraten es dir, ohne dass du fragen musst.
    </p>
    <ul className="mt-5 space-y-3 text-[15px] leading-[24px] text-muted-foreground">
      <li>
        <span className="font-semibold text-foreground">Die Lieferzeit.</span> Zwei oder drei Tage
        sind Logistik. Zwei oder drei Wochen heißen meist, dass der Barren erst nach deiner Zahlung
        eingekauft wird.
      </li>
      <li>
        <span className="font-semibold text-foreground">Der Preis.</span> Ein Händler mit eigenem
        Bestand nennt dir beim Kauf einen festen Preis. Wer den Preis erst bei Lieferung festlegt,
        hat den Barren noch nicht.
      </li>
      <li>
        <span className="font-semibold text-foreground">Die Beschreibung.</span> Steht auf der
        Rechnung eine Prägung, ein Gewicht, möglichst eine Nummer? Dann ist das Stück bestimmbar.
        „Gold im Wert von 2.000 Euro“ ist es nicht.
      </li>
    </ul>
    <p className="mt-5 text-[15px] leading-[24px] text-muted-foreground">
      Ausführlich mit Begründung, dazu Altgold beim Juwelier und Zakat auf Gold:{" "}
      <Link to="/wissen/halal-gold-kaufen" className="font-semibold text-primary hover:underline">
        Halal Gold kaufen
      </Link>
      .
    </p>
  </section>
);

const VergleichEdelmetalle = () => (
  <VergleichsSeite
    pfad="/vergleich/edelmetalle"
    brotkrumen="Edelmetalle"
    titel="Halal Gold kaufen: die Wege im Vergleich"
    untertitel="Fünf Wege zu Gold und Silber, und welcher die Regel der sofortigen Übergabe erfüllt"
    seoTitel="Halal Gold kaufen: Wege und Anbieter im Vergleich | finanzmuslim"
    seoText="Barren, Goldsparplan, Gold-ETC oder Schuldverschreibung? Fünf Wege zu Gold und Silber im Vergleich, mit Shariah-Nachweis, Auslieferung, Kosten und Steuer."
    einheit="Wege"
    einleitung={
      <>
        <p>
          Bei Gold entscheidet nicht der Händler über halal oder nicht, sondern die Bauart des
          Geschäfts. Ob du den Barren bei philoro oder bei Degussa kaufst, ändert an der Frage
          nichts. Ob du einen Barren kaufst oder ein Papier, das dir Gold verspricht, ändert alles.
        </p>
        <p>
          Der Grund ist eine Regel, die es sonst nirgends gibt: Bei Gold und Silber müssen Zahlung
          und Übergabe im selben Moment stattfinden. Diese Tabelle übersetzt die Regel in die fünf
          Wege, die es in Deutschland gibt, und nennt zu jedem die Anbieter.
        </p>
      </>
    }
    zeilen={EDELMETALL_ZEILEN}
    anbieter={edelmetallVergleich}
    filter={EDELMETALL_FILTER}
    stand="16.09.2026"
    standHinweis="Wege und Nachweise geprüft"
    quellenHinweis="Angaben von den Seiten der Anbieter und aus den Shariah-Zertifikaten, geprüft am 16.09.2026. Die Einordnung folgt der Regel zur sofortigen Übergabe, nachzulesen im Beitrag Halal Gold kaufen."
    kriterien={[
      {
        titel: "Übergabe fällt mit der Zahlung zusammen",
        text: "Die Kernregel bei Gold und Silber. Du zahlst, und im selben Moment gehört dir bestimmtes Metall. Alles, was das auseinanderzieht, ist das Problem.",
      },
      {
        titel: "Echtes Metall dahinter",
        text: "Liegt hinter dem, was du kaufst, wirklich Metall mit Nummer und Liste, oder bildet jemand nur einen Preis nach?",
      },
      {
        titel: "Shariah-Nachweis vorhanden",
        text: "Gibt es auf diesem Weg mindestens einen Anbieter mit einem Gutachten, das du selbst lesen kannst? Bei den Wertpapieren ist das der entscheidende Unterschied.",
      },
      {
        titel: "Ausliefern möglich",
        text: "Kommst du an das Metall heran, wenn du willst? Das ist die Probe darauf, ob hinter dem Papier Barren liegen, und sie entscheidet nebenbei über die Steuer.",
      },
    ]}
    zusatz={<RohstoffeBlock />}
    faq={[
      {
        frage: "Ist Gold kaufen halal?",
        antwort:
          "Ja, mit einer Bedingung: Zahlung und Übergabe müssen zusammenfallen. Du zahlst und bekommst das Gold. Gold auf Raten, Gold mit später Lieferung und Wetten auf den Goldpreis erfüllen das nicht.",
      },
      {
        frage: "Ist ein Gold-ETC halal?",
        antwort:
          "Darüber gehen die Meinungen auseinander. Produkte mit nummerierten Barren im Tresor und einem jährlichen Zertifikat eines Gelehrtengremiums werden verbreitet akzeptiert. Ein Teil der Gelehrten sagt, ohne Gold in der Hand sei die Übergabe nicht erfüllt. Unstrittig ausgeschlossen sind Produkte ohne echtes Metall.",
      },
      {
        frage: "Was ist mit Xetra-Gold und EUWAX Gold II?",
        antwort:
          "Beide sind Schuldverschreibungen. Du kaufst nicht Gold, sondern einen Anspruch auf Lieferung von Gold gegen den Herausgeber. Metall liegt zwar im Tresor, aber zwischen dir und dem Barren steht ein Versprechen. Ein Gutachten eines Gelehrtengremiums haben wir für keines der beiden gefunden. Wer diesen Weg trotzdem geht, sollte ihn mit einem Gelehrten besprechen.",
      },
      {
        frage: "Gibt es einen Goldsparplan mit Shariah-Zertifikat?",
        antwort:
          "Ja, wir haben einen gefunden. INAIA aus Deutschland lässt seinen Gold- und Silbersparplan von Minhaj Shari'ah Financial Advisory in Dubai nach den AAOIFI-Kriterien prüfen, das Metall lagert in Deutschland und der Schweiz und wird auf Wunsch ausgeliefert. Für Auvesta und SOLIT, die bekanntesten deutschen Anbieter, haben wir keinen Nachweis gefunden.",
      },
      {
        frage: "Welcher Gold-ETC lässt sich ausliefern?",
        antwort:
          "Von den zertifizierten kennen wir einen: den ETC der Royal Mint. Das Gold liegt im Tresor der Royal Mint in Cardiff statt bei einer Bank, und Privatanleger können sich Barren und Münzen ausliefern lassen. Das ist auch steuerlich der Unterschied, weil der Gewinn nach einem Jahr dann wie bei physischem Gold behandelt wird.",
      },
      {
        frage: "Ist Platin halal?",
        antwort:
          "Für Platin und Palladium gilt die Sonderregel von Gold und Silber nicht. Sie werden wie gewöhnliche Waren behandelt, eine spätere Lieferung ist also kein Problem. Physisch hinterlegte Platin- und Palladium-Produkte mit Prüfbericht stehen in unserer Anlagen-Datenbank.",
      },
      {
        frage: "Sind Rohstoff-ETFs halal?",
        antwort:
          "In aller Regel nicht. Breite Rohstofffonds halten Terminkontrakte und rollen sie weiter, statt die Ware zu kaufen. Es wird nie geliefert und nie übernommen, dazu kommen Zinsen auf die hinterlegten Sicherheiten. Wer an Rohstoffen beteiligt sein will, kommt über geprüfte Aktien-ETFs an die Unternehmen dahinter.",
      },
      {
        frage: "Wie viel Gold sollte man haben?",
        antwort:
          "Dazu geben wir keine Empfehlung ab, das wäre Anlageberatung. Was sich sagen lässt: Gold wirft nichts ab, es zahlt keine Miete und keinen Gewinn. Es ist ein Wertspeicher, kein Einkommen. Und auf den Bestand fällt jedes Jahr Zakat an.",
      },
    ]}
    schluss="Diese Seite ist keine Anlageberatung und keine Fatwa. Sie gibt bekannte Positionen wieder, bei Gold als Wertpapier und bei Sparplänen gibt es abweichende Auffassungen. Steuerliche Angaben sind keine Steuerberatung."
  />
);

export default VergleichEdelmetalle;
