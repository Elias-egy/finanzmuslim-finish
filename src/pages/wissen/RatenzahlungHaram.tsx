import Seo, { beitragJsonLd } from "@/components/Seo";
import BeitragSeite, { type BeitragAbschnitt, type BeitragFrage } from "@/components/BeitragSeite";
import { IlluHandel, IlluRaten } from "@/components/illu";
import {
  B,
  Beispiel,
  Bild,
  Checkliste,
  Faelle,
  Frage,
  Gegenueber,
  Hinweis,
  L,
  Merksatz,
  PasstDazu,
  Schritte,
} from "@/components/beitrag";

const abschnitte: BeitragAbschnitt[] = [
  {
    id: "die-eine-frage",
    titel: "Die erste Frage ist nicht der Preis, sondern wer dir das Geld gibt",
    inhalt: (
      <>
        <p>
          Ratenzahlung ist nicht automatisch verboten. Die meisten fangen aber an der falschen Stelle an zu
          prüfen. Sie rechnen die Raten zusammen und vergleichen mit dem Barpreis. Wichtiger ist eine andere
          Frage, und die kannst du an jeder Kasse beantworten:
        </p>
        <Merksatz>Verkauft mir der Händler eine Ware, oder leiht mir eine Bank Geld?</Merksatz>
        <p>
          Das sind zwei völlig verschiedene Geschäfte, auch wenn sie im Laden gleich aussehen und beide „in
          Raten" heißen.
        </p>
        <Gegenueber
          links={{
            titel: "Der Händler verkauft dir die Ware",
            ton: "gruen",
            punkte: [
              "Du hast einen Kaufvertrag, sonst nichts.",
              "Der Händler wartet auf sein Geld und darf dafür einen höheren Preis nehmen.",
              "Es ist Handel, und Handel ist ausdrücklich erlaubt.",
            ],
          }}
          rechts={{
            titel: "Eine Bank leiht dir das Geld",
            ton: "rot",
            punkte: [
              "Du unterschreibst zusätzlich einen Kreditvertrag.",
              "Die Bank zahlt dem Händler, du zahlst der Bank zurück.",
              "Geld gegen mehr Geld über Zeit. Das ist genau der Fall, den das Zinsverbot meint.",
            ],
          }}
        />
        <Bild text="Zahlst du dem Händler, oder zahlst du einer Bank? An dieser Weiche entscheidet sich alles Weitere.">
          <IlluRaten />
        </Bild>
      </>
    ),
  },
  {
    id: "haendler",
    titel: "Beim Händler: höherer Preis ist erlaubt",
    inhalt: (
      <>
        <Frage>Das Sofa kostet bar 1.000 Euro und in Raten 1.200. Ist das nicht verkappter Zins?</Frage>
        <p>
          Nein, solange die Wahl <B>vor</B> dem Vertrag bestand. Ein Verkäufer darf für dieselbe Ware zwei
          Preise nennen, einen für sofort und einen für später. Du entscheidest dich für einen davon, und
          damit ist der Preis fest. Was du kaufst, ist eine Ware, kein Geld.
        </p>
        <p>Damit das trägt, müssen drei Dinge stimmen:</p>
        <Schritte
          schritte={[
            {
              titel: "Der Preis steht vor der Unterschrift fest",
              text: "Beide Zahlen liegen auf dem Tisch, bevor du dich entscheidest. Was nicht geht: erst unterschreiben und danach schauen, was die Ratenzahlung kostet.",
            },
            {
              titel: "Danach ändert sich nichts mehr",
              text: "Der vereinbarte Gesamtpreis ist fix. Es gibt keinen Rabatt, wenn du früher fertig bist, und keinen Aufschlag, wenn du später bist.",
            },
            {
              titel: "Bei Verzug kommt nichts dazu",
              text: "Steht in den Bedingungen, dass die Schuld bei verspäteter Zahlung wächst, ist es kein reiner Kaufvertrag mehr. Genau diese Erhöhung bei Verzug ist die älteste Form des verbotenen Zinses.",
            },
          ]}
        />
        <Beispiel
          titel="Zwei Preise, ein Vertrag"
          rechnung={["Angebot: 1.000 € sofort oder 1.200 € in 12 Raten zu 100 €", "Du wählst die Raten → Gesamtpreis 1.200 €, endgültig"]}
          ergebnis="Erlaubt. Du hast eine Ware gekauft, keinen Kredit aufgenommen."
        >
          <p>
            Zahlst du im achten Monat alles auf einmal, bleibt es bei 1.200 Euro. Zahlst du einen Monat zu
            spät, bleibt es ebenfalls bei 1.200 Euro. Der Preis ist der Preis.
          </p>
        </Beispiel>
      </>
    ),
  },
  {
    id: "bank",
    titel: "Sobald eine Bank dazwischen ist, kippt es",
    inhalt: (
      <>
        <p>
          Hier wird es unbequem, weil es die verbreitetste Form der Ratenzahlung in Deutschland betrifft. In
          vielen Läden zahlt nicht der Händler auf dein Geld, sondern eine Partnerbank zahlt ihm sofort den
          vollen Betrag, und du hast danach einen Vertrag mit dieser Bank.
        </p>
        <p>
          Damit hast du kein Zahlungsziel bekommen, sondern ein Darlehen. Die Bank hat Geld gegeben und
          bekommt Geld zurück. Ob das mehr ist oder gleich viel, ändert an der Art des Vertrags nichts.
        </p>
        <Frage>Auch bei null Prozent?</Frage>
        <p>
          Auch dann. Und das ist der Punkt, an dem die meisten Erklärungen im Internet aufhören. Bei einer
          Null-Prozent-Finanzierung ist der Zinsbetrag nicht verschwunden, er ist im Preis eingerechnet: Der
          Händler zahlt ihn der Bank aus seiner Marge, damit die Aktion beworben werden kann. Du unterschreibst
          trotzdem einen Kreditvertrag mit einer Zinsbank, und genau darauf kommt es an, nicht auf die Zahl,
          die auf dem Werbeschild steht.
        </p>
        <Merksatz>
          Null Prozent macht einen Kreditvertrag nicht zu einem Kaufvertrag. Es macht ihn nur billiger.
        </Merksatz>
        <Hinweis titel="Woran du erkennst, ob eine Bank dabei ist">
          <p>
            Du musst Angaben zu deinem Einkommen machen. Es wird eine Bonitätsprüfung erwähnt. Im Kleingedruckten
            steht ein Name, den du nicht erwartet hast, etwa Santander, BNP Paribas oder Consors Finanz. Es gibt
            ein Widerrufsrecht für Verbraucherdarlehen. Jedes dieser Zeichen heißt: Das ist ein Kreditvertrag.
          </p>
        </Hinweis>
      </>
    ),
  },
  {
    id: "praxis",
    titel: "Klarna, PayPal und die Bezahlseite im Onlineshop",
    inhalt: (
      <>
        <p>
          Diese Anbieter haben mehrere Varianten und ändern sie regelmäßig. Deshalb kann dir niemand pauschal
          sagen, ob ein Dienst erlaubt ist. Man kann aber die Varianten sortieren, und das hilft im
          Bezahlvorgang mehr als jede Liste von Firmennamen.
        </p>
        <Faelle
          faelle={[
            {
              titel: "Später zahlen, in einer Summe",
              ton: "gruen",
              wort: "meist unproblematisch",
              text: "Du zahlst in 14 oder 30 Tagen denselben Betrag. Ein reiner Zahlungsaufschub des Händlers, kein Kredit. Achte nur darauf, was bei Verzug passiert.",
            },
            {
              titel: "Raten beim Händler, Preis unverändert",
              ton: "gruen",
              wort: "in Ordnung",
              text: "Die Summe aller Raten entspricht dem Preis, und es steht kein Kreditvertrag dahinter.",
            },
            {
              titel: "Raten mit Aufschlag beim Händler",
              ton: "gruen",
              wort: "erlaubt, wenn der Preis vorher feststand",
              text: "Der höhere Ratenpreis ist zulässig, solange du vor der Unterschrift beide Preise kanntest und sich danach nichts mehr ändert.",
            },
            {
              titel: "Ratenkauf über die Partnerbank",
              ton: "rot",
              wort: "Kreditvertrag",
              text: "Erkennbar an Bonitätsprüfung, Einkommensangaben und einem Bankennamen im Kleingedruckten. Auch bei null Prozent.",
            },
            {
              titel: "Verzugszinsen in den Bedingungen",
              ton: "rot",
              wort: "fällt weg",
              text: "Wächst die Schuld, wenn du zu spät zahlst, ist die Zinsklausel schon vereinbart. Für viele Gelehrte ist die Vereinbarung das Problem, nicht erst der Fall, dass sie greift.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "checkliste",
    titel: "Die Prüfung an der Kasse, in dreißig Sekunden",
    inhalt: (
      <>
        <Checkliste
          punkte={[
            { art: "neutral", text: <><B>Wer bekommt mein Geld?</B> Der Händler oder eine Bank. Das ist die wichtigste Frage.</> },
            { art: "neutral", text: <><B>Muss ich Einkommen angeben oder wird die Schufa geprüft?</B> Dann ist es ein Kredit.</> },
            { art: "neutral", text: <><B>Kannte ich beide Preise vor der Unterschrift?</B> Bar und in Raten, beide auf dem Tisch.</> },
            { art: "neutral", text: <><B>Steht irgendwo ein Zinssatz oder eine Gebühr?</B> Dann ist es ein Zinsgeschäft.</> },
            { art: "neutral", text: <><B>Was passiert, wenn ich zu spät zahle?</B> Wächst die Summe, ist es ein Zinsvertrag.</> },
          ]}
        />
        <p>
          Und die ehrlichste Frage zum Schluss: Brauchst du es jetzt, oder könntest du zwei Monate sparen und
          es bar kaufen? In den allermeisten Fällen lautet die Antwort: Du könntest. Schulden sind auch ohne
          Zins nichts, was man ohne Grund aufnimmt.
        </p>
        <Bild text="Beim Kauf tauschst du Geld gegen Ware, beide Seiten geben etwas her. Genau das unterscheidet ihn vom Darlehen.">
          <IlluHandel />
        </Bild>
      </>
    ),
  },
];

const faq: BeitragFrage[] = [
  {
    frage: "Ist Ratenzahlung im Islam erlaubt?",
    antwort:
      "Beim Händler ja. Ein Verkäufer darf für dieselbe Ware einen Barpreis und einen höheren Ratenpreis nennen, solange du beide vor der Unterschrift kennst und sich danach nichts mehr ändert. Sobald eine Bank dazwischentritt und dir Geld leiht, ist es ein Darlehen und damit ein anderer Fall.",
  },
  {
    frage: "Ist eine Null-Prozent-Finanzierung halal?",
    antwort:
      "Läuft sie über eine Bank, nach verbreiteter Auffassung nicht. Du unterschreibst einen Kreditvertrag, auch wenn der Zins bei null steht. Der Zinsbetrag ist dabei nicht verschwunden, sondern in der Marge des Händlers eingerechnet. Ein Ratenkauf direkt beim Händler ohne Bank ist der saubere Weg.",
  },
  {
    frage: "Darf der Ratenpreis höher sein als der Barpreis?",
    antwort:
      "Ja, wenn beide Preise vor Vertragsschluss feststehen und du wählen konntest. Danach ist der Preis endgültig: kein Rabatt bei früherer Zahlung, kein Aufschlag bei Verzug.",
  },
  {
    frage: "Ist Ratenzahlung bei Otto, Amazon oder Klarna haram?",
    antwort:
      "Das hängt von der gewählten Variante ab, nicht vom Namen des Anbieters. Reiner Zahlungsaufschub und Ratenkauf beim Händler sind unproblematisch. Sobald im Bezahlvorgang eine Bonitätsprüfung, Einkommensangaben oder ein Bankenname auftauchen, unterschreibst du einen Kreditvertrag.",
  },
  {
    frage: "Was ist mit dem Handyvertrag, bei dem das Gerät dabei ist?",
    antwort:
      "Vergleiche den Tarif mit Gerät und denselben Tarif ohne Gerät. Die Differenz mal Laufzeit ist das, was du für das Gerät zahlst. Solange das ein Vertrag mit dem Anbieter ist und der Preis feststeht, ist es ein Ratenkauf. Wird das Gerät über eine Bank finanziert, gilt das Gleiche wie im Laden.",
  },
  {
    frage: "Darf ich eine Kreditkarte für Ratenzahlung nutzen?",
    antwort:
      "Die Teilzahlungsfunktion, oft Revolving genannt, arbeitet mit Zinsen und gehört zu den klarsten Fällen. Bei der Karte selbst gibt es zwei Auffassungen: Manche halten sie für unproblematisch, solange der volle Betrag jeden Monat ausgeglichen wird, andere sehen schon in der Unterschrift unter einen Vertrag mit Zinsklausel das Problem.",
  },
  {
    frage: "Ich habe schon etwas auf Raten gekauft. Was mache ich jetzt?",
    antwort:
      "Die verbreitete Empfehlung ist, den Restbetrag so schnell wie möglich abzulösen, wenn Zinsen oder Aufschläge anfallen. Wo das nicht geht, zahlt man wie vereinbart weiter und vermeidet solche Verträge künftig. Rückabwickeln muss man nichts.",
  },
];

const beschreibung =
  "Ratenzahlung ist nicht automatisch verboten. Entscheidend ist, ob der Händler dir eine Ware verkauft oder eine Bank dir Geld leiht. Mit Prüfung für Klarna, PayPal, Null-Prozent-Finanzierung und Handyverträge.";

const RatenzahlungHaram = () => (
  <>
    <Seo
      title="Ist Ratenzahlung haram? Die eine Frage, die entscheidet | finanzmuslim"
      description={beschreibung}
      path="/wissen/ratenzahlung-haram"
      jsonLd={beitragJsonLd({
        titel: "Ist Ratenzahlung haram?",
        beschreibung,
        path: "/wissen/ratenzahlung-haram",
        datePublished: "15. August 2026",
        dateModified: "5. September 2026",
        faq,
      })}
    />
    <BeitragSeite
      slug="ratenzahlung-haram"
      titel="Ist Ratenzahlung haram?"
      untertitel="Die Antwort hängt an einer Frage, die im Laden niemand stellt: Wer gibt dir eigentlich das Geld?"
      kurzGesagt={[
        "Ratenzahlung ist nicht automatisch verboten.",
        "Entscheidend ist, wer dir das Geld gibt: der Händler oder eine Bank.",
        "Beim Händler darf der Ratenpreis höher sein, solange du beide Preise vor der Unterschrift kanntest.",
        "Danach ist der Preis fix: kein Rabatt bei früherer Zahlung, kein Aufschlag bei Verzug.",
        "Läuft es über eine Bank, ist es ein Darlehen. Auch bei null Prozent.",
        "Bonitätsprüfung und Einkommensangaben sind das sicherste Zeichen für einen Kreditvertrag.",
      ]}
      abschnitte={abschnitte}
      faq={faq}
      datePublished="15. August 2026"
      dateModified="5. September 2026"
      boxMitteNach={2}
      rechtshinweis="Dieser Beitrag gibt bekannte Positionen wieder und dient ausschließlich zu Bildungszwecken. Er ist keine Fatwa und ersetzt weder die Auskunft eines Gelehrten noch eine Rechtsberatung. Genannte Zahlungsdienste und Banken sind Beispiele, ihre Bedingungen ändern sich und müssen im Einzelfall selbst geprüft werden. Innerhalb der Rechtsschulen gibt es zu einzelnen Punkten abweichende Auffassungen. Die Zahlen in den Beispielen sind erfunden."
      boxOben={{
        kategorie: "Girokonto",
        ueberschrift: "Ein Konto, das dich nicht in den Dispo zieht",
        linkZiel: "/vergleiche",
      }}
      boxMitte={{
        kategorie: "Depot",
        ueberschrift: "Ansparen statt abstottern",
        linkZiel: "/vergleich/depot",
      }}
    >
      <PasstDazu
        punkte={[
          { to: "/wissen/zinsen-im-islam", name: "Zinsen im Islam", text: "erklärt, warum ein Aufschlag auf eine Ware etwas anderes ist als einer auf geliehenes Geld." },
          { to: "/vorlagen/vertrags-ampel", name: "Die Vertrags-Ampel", text: "ordnet Ratenzahlung, Leasing, Kreditkarte und neun weitere Verträge ein." },
          { to: "/wissen/girokonto-ohne-zinsen", name: "Girokonto ohne Zinsen", text: "der Dispo ist die teuerste Form, später zu zahlen." },
          { to: "/wissen/haus-kaufen-ohne-zinsen", name: "Haus kaufen ohne Zinsen", text: "dieselbe Frage bei der größten Anschaffung des Lebens." },
        ]}
      />
    </BeitragSeite>
  </>
);

export default RatenzahlungHaram;
