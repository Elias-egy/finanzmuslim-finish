import { vorlageBySlug } from "@/data/vorlagen";
import { ANZAHL_HALAL_ANLAGEN } from "@/data/anzahlen";
import { DEPOTS_GETESTET, KONTEN_GETESTET } from "@/data/halalFinanzCheckKern";

/**
 * Die Seite /dokumente (RN19, 19.11.2026). Elias RN18-20: „Dokumentseite. Und dann kann man auch immer sagen, alles
 * Mögliche findest du bei Dokumente … da kommen dann halt Flatex, Smartbroker, alle Übergangsformulare … Die Quizze
 * müssten da sein, alle Freebies aktualisiert natürlich.“ (Vault raw/2026-11-19-elias-rn18-16-…). Dazu RN18-19: die
 * Einrichtungsvideos erstmal weg, immer direkt zum Anbieter.
 *
 * Alle Inhalte der Seite stehen hier, die Seite (src/pages/Dokumente.tsx) zeichnet nur. Drei Arten von Zielen:
 *
 * - `intern`: eine Seite bei uns. Ein Test prüft, dass es die Adresse im Router und in den Routen gibt.
 * - `partner`: der Partnerweg /out/<kurzname> mit eigener Stelle in der SubID. Rangfolge und Partnerlinks stehen
 *   in partnerLinks.ts und startLinks.ts und werden hier nie angefasst.
 * - `extern`: ein offizielles Formular oder eine offizielle Seite des Anbieters. Nie eine fremde Kopie. `quelle` ist
 *   die Seite des Anbieters, auf der die Adresse steht, `gelesen` das Datum. Ein Test hält beides fest und prüft, dass
 *   Adresse und Quelle zum selben Anbieter gehören.
 */

export type DokAnbieter = { name: string; domain: string };

export type DokZiel =
  | { art: "intern"; pfad: string }
  | { art: "partner"; kurzname: string; src: string }
  | { art: "extern"; url: string; quelle: string; gelesen: string };

export type DokKarte = {
  id: string;
  titel: string;
  /** Ein Satz, kein grauer Kleintext. */
  satz: string;
  knopf: string;
  ziel: DokZiel;
  /** Die Freebie-Seite holt erst die E-Mail-Adresse (nur zur Anzeige „gegen E-Mail“). */
  gegenEmail?: true;
};

export type DokBlock = {
  id: string;
  titel?: string;
  anbieter?: DokAnbieter;
  karten: DokKarte[];
};

export type DokGruppe = {
  id: string;
  titel: string;
  satz?: string;
  /** Der Check steht groß oben, wie auf den Freebie-Seiten (RN19-05). */
  gross?: true;
  bloecke: DokBlock[];
};

/** Titel und Beschreibung für Google. Hauptwort „depotübertrag formular“ (Google-Vorschläge, 19.11.2026). */
export const DOKUMENTE_TITEL = "Depotübertrag Formular und Halal-Listen | finanzmuslim";
export const DOKUMENTE_BESCHREIBUNG =
  "Formulare für Depotübertrag und Kontowechsel direkt vom Anbieter, dazu der Halal-Check, alle Listen und Rechner. Alles an einem Ort.";

export const DOKUMENTE_EINLEITUNG =
  "Hier liegen die Formulare für den Depotübertrag und den Kontowechsel, dazu der Check, alle Listen und alle Rechner.";

const HEUTE = "19.11.2026";

const FLATEX = { name: "flatex", domain: "flatex.de" } as const;
const SMARTBROKER = { name: "Smartbroker+", domain: "smartbrokerplus.de" } as const;
const NORISBANK = { name: "norisbank", domain: "norisbank.de" } as const;
const BBBANK = { name: "BBBank", domain: "bbbank.de" } as const;

/** Stellen der Partner-Knöpfe in der SubID (src/lib/attribution.ts VALID_SRC), Kleinbuchstaben, höchstens zwölf Zeichen. */
export const DOKUMENTE_SRC = {
  flatex: "dokfl",
  smartbroker: "doksb",
  norisbank: "doknb",
  bbbank: "dokbb",
} as const;

/**
 * Der Check, ein Knopf (RN19, Prüfer: zwei gleiche blaue „Match finden“ untereinander; Elias RN16-42: „nur noch diesen einen Call to Action …
 * immer gleich“). Der Check fragt selbst nach Konto oder Depot; „quiz“ ist die Stelle für alle, die früher ins alte Quiz kamen (RN6).
 */
const CHECK = "/check?quelle=quiz";

const match: DokGruppe = {
  id: "match",
  titel: "Dein Match finden",
  satz: `${KONTEN_GETESTET} Bankkonten, ${DEPOTS_GETESTET} Depots. Ich habe sie alle getestet.`,
  gross: true,
  bloecke: [
    {
      id: "match-check",
      karten: [
        {
          id: "check",
          titel: "Bankkonto oder Depot",
          satz: "Ein paar Fragen, dann siehst du, was zu dir passt.",
          knopf: "Match finden",
          ziel: { art: "intern", pfad: CHECK },
        },
      ],
    },
  ],
};

const depot: DokGruppe = {
  id: "depot",
  titel: "Depot wechseln und eröffnen",
  satz: "Die Formulare kommen von flatex und Smartbroker+ selbst. Die Knöpfe zum Eröffnen führen direkt zum Anbieter.",
  bloecke: [
    {
      id: "flatex",
      titel: "flatex",
      anbieter: FLATEX,
      karten: [
        {
          id: "flatex-eroeffnen",
          titel: "Depot bei flatex eröffnen",
          satz: "Hier eröffnest du dein Depot direkt bei flatex.",
          knopf: "Depot eröffnen*",
          ziel: { art: "partner", kurzname: "flatex", src: DOKUMENTE_SRC.flatex },
        },
        {
          // flatex.de/service/formulare/, „Formulare allgemein“, Nr. 1 (PDF Konto-/Depotübertrag an die flatexDEGIRO Bank SE).
          id: "flatex-uebertrag",
          titel: "Depotübertrag zu flatex",
          satz: "Der Antrag für den Übertrag deines Depots von einer anderen Bank. Ausfüllen, unterschreiben, an die alte Bank schicken.",
          knopf: "Antrag öffnen",
          ziel: {
            art: "extern",
            url: "https://konto.flatex.de/formularcenter/public/1300002.pdf",
            quelle: "https://www.flatex.de/service/formulare/",
            gelesen: HEUTE,
          },
        },
        {
          // Gleiche Seite, Nr. 2 (PDF Freistellungsauftrag für Kapitalerträge).
          id: "flatex-freistellung",
          titel: "Freistellungsauftrag",
          satz: "Der Freistellungsauftrag von flatex für deine Kapitalerträge. Ausgefüllt und unterschrieben geht er an flatex.",
          knopf: "Formular öffnen",
          ziel: {
            art: "extern",
            url: "https://konto.flatex.de/formularcenter/public/1321003.pdf",
            quelle: "https://www.flatex.de/service/formulare/",
            gelesen: HEUTE,
          },
        },
        {
          // Gleiche Seite, Nr. 3 (PDF POSTIDENT-Coupon, „in jeder Postfiliale der Deutschen Post AG möglich“).
          id: "flatex-postident",
          titel: "PostIdent-Coupon",
          satz: "Für die Ausweisprüfung in der Postfiliale. Ausdrucken und mitnehmen.",
          knopf: "Coupon öffnen",
          ziel: {
            art: "extern",
            url: "https://konto.flatex.de/formularcenter/public/1300104.pdf",
            quelle: "https://www.flatex.de/service/formulare/",
            gelesen: HEUTE,
          },
        },
        {
          // flatex.de/produkte-handel/produkte/wertpapierkredite/: „Kreditvergabe: Für Neukunden mit Kontoeröffnung automatisch“,
          // „Ablehnung: … teilen Sie uns dies bitte in Textform mit“ (gelesen 19.11.2026). Der Text zum Kopieren steht im Depot-Vergleich.
          id: "flatex-kredit",
          titel: "Verzicht auf den Kredit",
          satz: "Bei flatex richtet sich der Kredit mit der Kontoeröffnung von selbst ein. Den fertigen Text zum Verzichten findest du im Depot-Vergleich.",
          knopf: "Zum Text",
          ziel: { art: "intern", pfad: "/vergleich/depot" },
        },
      ],
    },
    {
      id: "smartbroker",
      titel: "Smartbroker+",
      anbieter: SMARTBROKER,
      karten: [
        {
          id: "smartbroker-eroeffnen",
          titel: "Depot bei Smartbroker+ eröffnen",
          satz: "Hier eröffnest du dein Depot direkt bei Smartbroker+.",
          knopf: "Depot eröffnen*",
          ziel: { art: "partner", kurzname: "smartbroker", src: DOKUMENTE_SRC.smartbroker },
        },
        {
          // smartbrokerplus.de/de-de/depotuebertrag/: „Komplett digital in deiner App“, „Jetzt Depot übertragen“.
          id: "smartbroker-uebertrag",
          titel: "Depotübertrag zu Smartbroker+",
          satz: "Einzelne Wertpapiere oder das ganze Depot übertragen, komplett digital in der App.",
          knopf: "So geht's",
          ziel: {
            art: "extern",
            url: "https://www.smartbrokerplus.de/de-de/depotuebertrag/",
            quelle: "https://www.smartbrokerplus.de/de-de/depotuebertrag/",
            gelesen: HEUTE,
          },
        },
        {
          // Gleiche Seite: „Formular ‚Auslandsdepotübertrag‘ als PDF downloaden“; auch im Formularcenter.
          id: "smartbroker-ausland",
          titel: "Depotübertrag aus dem Ausland",
          satz: "Das Formular für einen Übertrag von einem Broker im Ausland. Du reichst es beim Kundenservice ein.",
          knopf: "Formular öffnen",
          ziel: {
            art: "extern",
            url: "https://content-hub.smartbrokerplus.de/api/sb-media/Auslaendischer_Depotuebertrag_27de52791d.pdf",
            quelle: "https://www.smartbrokerplus.de/de-de/formularcenter/",
            gelesen: HEUTE,
          },
        },
        {
          // smartbrokerplus.de/de-de/formularcenter/: „Alle wichtigen Formulare an einem Ort.“
          id: "smartbroker-formulare",
          titel: "Alle Formulare von Smartbroker+",
          satz: "Das Formularcenter mit allen Formularen an einem Ort.",
          knopf: "Formulare öffnen",
          ziel: {
            art: "extern",
            url: "https://www.smartbrokerplus.de/de-de/formularcenter/",
            quelle: "https://www.smartbrokerplus.de/de-de/formularcenter/",
            gelesen: HEUTE,
          },
        },
      ],
    },
  ],
};

const konto: DokGruppe = {
  id: "konto",
  titel: "Konto wechseln",
  satz: "Beide Banken haben einen Kontowechselservice. Du musst nicht jeden Zahlungspartner einzeln anschreiben.",
  bloecke: [
    {
      id: "norisbank",
      titel: "norisbank",
      anbieter: NORISBANK,
      karten: [
        {
          id: "norisbank-eroeffnen",
          titel: "Konto bei der norisbank eröffnen",
          satz: "Hier eröffnest du dein Konto direkt bei der norisbank.",
          knopf: "Konto eröffnen*",
          ziel: { art: "partner", kurzname: "norisbank", src: DOKUMENTE_SRC.norisbank },
        },
        {
          // norisbank.de/kontowechsel leitet auf diese Seite weiter, Titel: „Girokonto wechseln: Kontowechsel in 10 Minuten“.
          id: "norisbank-wechsel",
          titel: "Kontowechsel in 10 Minuten",
          satz: "Der kostenlose Online-Kontowechselservice meldet deine neue IBAN bei deinen Zahlungspartnern.",
          knopf: "Kontowechsel ansehen",
          ziel: {
            art: "extern",
            url: "https://www.norisbank.de/girokonto/service/kontowechsel.html",
            quelle: "https://www.norisbank.de/girokonto/service/kontowechsel.html",
            gelesen: HEUTE,
          },
        },
        {
          // PDF „Kontowechselhilfe für Girokonten“: „füllen Sie einfach die beigefügte Ermächtigung aus, unterschreiben diese
          // und senden sie an uns zurück. Wir übermitteln dann Ihre Ermächtigung an Ihr bisheriges Kreditinstitut.“
          // Adresse wie in src/data/halalFinanzCheck.ts (Karte „Alles wird für dich rübergezogen“), Quelle norisbank.de/kontowechsel.
          id: "norisbank-hilfe",
          titel: "Kontowechselhilfe zum Ausdrucken",
          satz: "Ermächtigung ausfüllen und unterschreiben. Die norisbank schickt sie an deine alte Bank und übernimmt Daueraufträge und Lastschriften.",
          knopf: "Formular öffnen",
          ziel: {
            art: "extern",
            url: "https://www.norisbank.de/dam/norisbank/de/shared/pdf/nb_Kontowechselhilfe.pdf",
            quelle: "https://www.norisbank.de/girokonto/service/kontowechsel.html",
            gelesen: HEUTE,
          },
        },
      ],
    },
    {
      id: "bbbank",
      titel: "BBBank",
      anbieter: BBBANK,
      karten: [
        {
          id: "bbbank-eroeffnen",
          titel: "Konto bei der BBBank eröffnen",
          satz: "Hier eröffnest du dein Konto direkt bei der BBBank.",
          knopf: "Konto eröffnen*",
          ziel: { art: "partner", kurzname: "bbbank", src: DOKUMENTE_SRC.bbbank },
        },
        {
          // bbbank.de/kontowechsel leitet auf diese Seite weiter, Titel: „Online-Kontowechselservice“, „kostenfrei … in wenigen Minuten“.
          id: "bbbank-wechsel",
          titel: "Online-Kontowechselservice",
          satz: "Kostenlos und in wenigen Minuten: Der Service übernimmt deine Daueraufträge und meldet deine neue Bankverbindung bei deinen Zahlungspartnern.",
          knopf: "Kontowechsel ansehen",
          ziel: {
            art: "extern",
            url: "https://www.bbbank.de/privatkunden/girokonto/kontowechsel.html",
            quelle: "https://www.bbbank.de/privatkunden/girokonto/kontowechsel.html",
            gelesen: HEUTE,
          },
        },
      ],
    },
  ],
};

/** Reihenfolge der Freebies auf der Seite. Titel und Satz kommen aus src/data/vorlagen.ts, ein Test hält beides gleich. */
export const FREEBIE_REIHENFOLGE = [
  "halal-anlagen",
  "top-100-halal-aktien",
  "aktien-check",
  "gold-check",
  "vertrags-ampel",
  "auto-abo-check",
  "rizq",
  "baraka-blocker",
] as const;

const freebieKarten: DokKarte[] = FREEBIE_REIHENFOLGE.map((slug) => {
  const v = vorlageBySlug(slug);
  if (!v) throw new Error(`Freebie fehlt in vorlagen.ts: ${slug}`);
  return {
    id: `freebie-${slug}`,
    titel: v.titel,
    satz: `${v.nutzenZeile}.`,
    knopf: v.gegenEmail ? "Ansehen und holen" : "Ansehen",
    ziel: { art: "intern", pfad: `/vorlagen/${slug}` },
    ...(v.gegenEmail ? { gegenEmail: true as const } : {}),
  };
});

const listen: DokGruppe = {
  id: "listen",
  titel: "Listen und Freebies",
  bloecke: [
    {
      id: "listen-alle",
      karten: [
        {
          id: "halal-anlagen-finden",
          titel: "Halal-Anlagen finden",
          satz: `${ANZAHL_HALAL_ANLAGEN} Anlagen: ETFs, Sukuk, Gold, Silber, Platin und Krypto, mit dem Nachweis dazu.`,
          knopf: "Anlagen ansehen",
          ziel: { art: "intern", pfad: "/halal-anlagen" },
        },
        {
          id: "guide",
          titel: "Halal Investment Guide",
          satz: "Die Grundlagen und der erste Schritt, als PDF in dein Postfach.",
          knopf: "Guide holen",
          ziel: { art: "intern", pfad: "/halal-guide" },
          gegenEmail: true,
        },
        ...freebieKarten,
        {
          id: "girokonto-bonus",
          titel: "Girokonto ohne Zinsen mit Bonus",
          satz: "Drei Girokonten ohne Zinsen im Vergleich, dazu die Startprämie der BBBank.",
          knopf: "Ansehen",
          ziel: { art: "intern", pfad: "/vorlagen/girokonto-bonus" },
        },
      ],
    },
  ],
};

/** Name, Adresse und Satz je Rechner. Die Adressen prüft ein Test gegen die Rechner-Routen. */
const rechnerKarten: DokKarte[] = (
  [
    ["zakat", "Zakat-Rechner", "/zakat-rechner", "Zakat auf Bargeld, Aktien, ETFs, Sukuk, Gold und Krypto ausrechnen."],
    ["bereinigung", "Dividenden reinigen", "/bereinigungsrechner", "Rechne aus, welchen Anteil deiner Erträge du weitergibst."],
    ["rendite", "Renditerechner", "/renditerechner", "So wächst dein Vermögen mit Aktien, Sukuk, Gold und Silber."],
    ["auswandern", "Auswanderungsrechner", "/auswanderungsrechner", "Sieh, wie weit dein Netto in der Türkei, in Dubai oder in Saudi-Arabien reicht."],
    ["budget", "Budgetrechner", "/budgetrechner", "Sieh, wohin dein Netto geht und was übrig bleibt."],
    ["zinskosten", "Zinskosten-Rechner", "/kreditkostenrechner", "Sieh, was ein Kredit über die Laufzeit an Zinsen kostet."],
    ["sparziel", "Sparzielrechner", "/sparzielrechner", "Rechne aus, wann du dein Sparziel erreichst."],
    ["inflation", "Inflationsrechner", "/inflationsrechner", "Sieh, wie viel Kaufkraft dein Geld verliert."],
  ] as const
).map(([id, titel, pfad, satz]) => ({
  id: `rechner-${id}`,
  titel,
  satz,
  knopf: "Rechnen",
  ziel: { art: "intern" as const, pfad },
}));

const rechner: DokGruppe = {
  id: "rechner",
  titel: "Rechner",
  bloecke: [{ id: "rechner-alle", karten: rechnerKarten }],
};

export const DOKUMENTE: DokGruppe[] = [match, depot, konto, listen, rechner];

export const alleKarten = (): DokKarte[] => DOKUMENTE.flatMap((g) => g.bloecke.flatMap((b) => b.karten));

/** Die Adresse einer Karte so, wie sie im Knopf steht. Partner laufen über /out/<kurzname>?src=<Stelle>. */
export const kartenAdresse = (k: DokKarte): string => {
  switch (k.ziel.art) {
    case "intern":
      return k.ziel.pfad;
    case "partner":
      return `/out/${k.ziel.kurzname}?src=${k.ziel.src}`;
    case "extern":
      return k.ziel.url;
  }
};
