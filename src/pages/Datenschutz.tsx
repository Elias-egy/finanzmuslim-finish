import Seo from "@/components/Seo";

const Datenschutz = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Seo
      title="Datenschutz – finanzmuslim"
      description="Datenschutzerklärung von finanzmuslim, Informationen zur Verarbeitung personenbezogener Daten."
      path="/datenschutz"
      brotkrumen={[{ name: "Datenschutz", path: "/datenschutz" }]}
    />

    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">Datenschutzerklärung</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">1. Verantwortlicher</h2>
        <p className="text-muted-foreground leading-relaxed">
          Elias El-Gendy
          <br />
          Otto-Speckter-Straße 19a
          <br />
          22307 Hamburg
          <br />
          E-Mail: elias@finanzmuslim.com
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">2. Allgemeines zur Datenverarbeitung</h2>
        <p className="text-muted-foreground leading-relaxed">
          Der Schutz deiner persönlichen Daten ist uns wichtig. Wir verarbeiten deine Daten
          ausschließlich auf Grundlage der Datenschutz-Grundverordnung (DSGVO) und des
          Bundesdatenschutzgesetzes. Diese Seite setzt keine Analyse- oder Werbe-Tools ein und
          setzt keine Cookies, die eine Einwilligung brauchen. Schriften liegen auf unserem
          eigenen Server, es wird keine Schrift von Google geladen.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">3. Hosting und Server-Logfiles</h2>
        <p className="text-muted-foreground leading-relaxed">
          Diese Website wird über GitHub Pages ausgeliefert, einen Dienst der GitHub, Inc.,
          88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf einer Seite
          verarbeitet GitHub technische Daten wie IP-Adresse, Browsertyp, Datum und Uhrzeit der
          Anfrage und die aufgerufene Adresse, um die Seite auszuliefern und den Betrieb abzusichern
          (Art. 6 Abs. 1 lit. f DSGVO). GitHub ist nach dem EU-US Data Privacy Framework
          zertifiziert. Wir haben auf diese Logfiles keinen Zugriff und werten sie nicht aus.
          Weitere Informationen:{" "}
          <a
            href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Datenschutzerklärung von GitHub
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">4. Newsletter, Guide und kostenlose Vorlagen</h2>
        <p className="text-muted-foreground leading-relaxed">
          Wenn du den Freitagsbrief, den Halal Investment Guide oder eine unserer Vorlagen
          anforderst, erheben wir deine E-Mail-Adresse und, falls du sie angibst, deinen Vornamen
          und dein Erfahrungslevel. Dazu speichern wir, über welchen Weg du dich eingetragen hast
          (zum Beispiel eine bestimmte Vorlage auf dieser Website oder ein Stichwort auf
          Instagram), in welcher Sprache du unsere E-Mails bekommen möchtest und welche Themen dich
          interessieren. So bekommst du die passenden E-Mails in deiner Sprache. Die Verarbeitung
          erfolgt auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) und dient dem
          Versand der angeforderten Inhalte und unseres Newsletters rund um islamkonformes
          Finanzwissen.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Nach der Anmeldung bekommst du eine E-Mail mit einem Bestätigungslink. Erst wenn du ihn
          anklickst, bist du eingetragen (Double-Opt-in). Wir speichern den Zeitpunkt der Anmeldung
          und der Bestätigung sowie die dabei verwendete IP-Adresse, um deine Einwilligung
          nachweisen zu können (Art. 6 Abs. 1 lit. f DSGVO, unser berechtigtes Interesse an diesem
          Nachweis).
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          In unseren E-Mails messen wir, ob sie geöffnet und welche Links angeklickt werden. Dafür
          enthält jede E-Mail ein unsichtbares Bild, das beim Öffnen vom Server von MailerLite
          geladen wird, und die Links führen zunächst über MailerLite. So sehen wir, welche Themen
          dich interessieren, und machen den Newsletter besser. Maßgeblich ist für uns die
          Klickrate, weil manche E-Mail-Programme das Bild auch ohne Öffnen laden. Diese Messung ist
          Teil deiner Einwilligung in den Newsletter (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1
          TDDDG). Wenn du nicht gemessen werden möchtest, kannst du dich jederzeit abmelden.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Du kannst deine Einwilligung jederzeit widerrufen, über den Abmeldelink in jeder E-Mail
          oder per E-Mail an elias@finanzmuslim.com.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Für die Verwaltung, den Versand und die Messung nutzen wir MailerLite (MailerLite Limited,
          88 Harcourt Street, Dublin 2, D02 DK18, Irland). MailerLite speichert die Daten in der
          EU. Die Übergabe der Formulardaten an MailerLite läuft über den Automatisierungsdienst
          Make. Vertragspartner für Make ist Celonis, Inc., One World Trade Center, 87th Floor,
          New York, NY 10007, USA. Celonis, Inc. ist nach dem EU-US Data Privacy Framework
          zertifiziert. Beide Anbieter verarbeiten die Daten in unserem Auftrag nach Art. 28 DSGVO.
        </p>
        {/* Offen vor dem Livegang: Vertragspartner für Make mit Elias' Make-Rechnung abgleichen.
            Makes AV-Vertrag (Version Mai 2024, Ziffer 7) kennt Celonis, Inc. (USA, DPF) und
            Celonis-Firmen in der EU. Stand der Angaben: 24.09.2026. */}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">5. Umfragen</h2>
        <p className="text-muted-foreground leading-relaxed">
          In einigen E-Mails verlinken wir eine kurze Umfrage. Sie läuft über Tally (Tally BV,
          Sint-Pietersnieuwstraat 11, 9000 Gent, Belgien), das die Antworten in unserem Auftrag nach
          Art. 28 DSGVO in der EU speichert. Die Teilnahme ist freiwillig. Wir verarbeiten deine
          Antworten auf Grundlage deiner Einwilligung durch die Teilnahme (Art. 6 Abs. 1 lit. a
          DSGVO) und werten sie aus, um den Newsletter an deinen Fragen auszurichten. Welche Angaben
          eine Umfrage abfragt, steht in der Umfrage selbst.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">6. Videos und Anbieter-Logos</h2>
        <p className="text-muted-foreground leading-relaxed">
          Videos auf dieser Website liegen auf unserem eigenen Server, es wird kein Videodienst eines Dritten geladen.
        </p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          In den Vergleichen zeigen wir die Logos der Anbieter. Diese Bilder lädt dein Browser vom Dienst logo.dev.
          Dabei wird deine IP-Adresse an logo.dev übertragen. Rechtsgrundlage ist unser berechtigtes Interesse an
          einer übersichtlichen Darstellung (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen:{" "}
          <a
            href="https://www.logo.dev/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            Datenschutzerklärung von logo.dev
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">7. Partnerlinks</h2>
        <p className="text-muted-foreground leading-relaxed">
          Links, die mit einem Sternchen (*) markiert sind, sind Partnerlinks. Klickst du darauf und
          eröffnest beim Anbieter ein Konto, bekommen wir eine Provision. Für dich ändert sich der
          Preis nicht. Beim Klick wird dein Browser zum Anbieter beziehungsweise zu dessen
          Partnernetzwerk weitergeleitet, das den Klick zur Zuordnung der Provision speichert. Ab
          diesem Moment gilt die Datenschutzerklärung des jeweiligen Anbieters.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">8. Weitergabe an Dritte</h2>
        <p className="text-muted-foreground leading-relaxed">
          Wir geben deine Daten nicht an unbefugte Dritte weiter. Außer den oben genannten
          Dienstleistern (GitHub, MailerLite, Make, Tally, logo.dev) setzen wir keine weiteren
          Auftragsverarbeiter ein.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">9. Dauer der Speicherung</h2>
        <p className="text-muted-foreground leading-relaxed">
          Deine Daten werden so lange gespeichert, wie sie für den jeweiligen Zweck erforderlich
          sind oder bis du deine Einwilligung widerrufst. Nach einer Abmeldung vom Newsletter
          löschen wir deine Adresse aus der Verteilerliste.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">10. Deine Rechte</h2>
        <p className="text-muted-foreground leading-relaxed">
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO) sowie das Recht, dich bei
          einer Datenschutz-Aufsichtsbehörde zu beschweren. Zum Ausüben deiner Rechte oder bei
          Fragen zum Datenschutz erreichst du uns unter elias@finanzmuslim.com.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">11. Kontakt für Datenschutzanfragen</h2>
        <p className="text-muted-foreground leading-relaxed">
          Elias El-Gendy
          <br />
          E-Mail: elias@finanzmuslim.com
        </p>
        <p className="mt-3 text-[13px] text-muted-foreground">Stand: 24. September 2026</p>
      </section>

    </main>
  </div>
);

export default Datenschutz;
