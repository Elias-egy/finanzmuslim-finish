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
          ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">3. Erhebung und Verarbeitung personenbezogener Daten</h2>
        <p className="text-muted-foreground leading-relaxed">
          Bei der Nutzung dieser Website werden automatisch technische Daten (z.B. IP-Adresse,
          Browsertyp, Datum und Uhrzeit der Anfrage) durch unseren Hosting-Provider erfasst.
          Diese Daten werden nur zur technischen Bereitstellung der Seite genutzt und nicht
          mit anderen Datenquellen zusammengeführt.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">4. Newsletter & Anmeldeformular</h2>
        <p className="text-muted-foreground leading-relaxed">
          Wenn du dich für unseren Newsletter oder den Halal-Investment-Guide anmeldest,
          erheben wir folgende personenbezogene Daten: E-Mail-Adresse, Vorname, Nachname
          sowie dein Erfahrungslevel. Die Verarbeitung erfolgt auf Grundlage deiner Einwilligung
          (Art. 6 Abs. 1 lit. a DSGVO) und dient allein dem Versand der angeforderten Inhalte.
          Du kannst deine Einwilligung jederzeit per E-Mail an elias@finanzmuslim.com widerrufen.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">5. Weitergabe an Dritte</h2>
        <p className="text-muted-foreground leading-relaxed">
          Wir geben deine Daten nicht an unbefugte Dritte weiter. Zur technischen Abwicklung
          setzen wir ggf. Dienstleister (z.B. Hosting, E-Mail-Versand) ein, die nach Art. 28 DSGVO
          als Auftragsverarbeiter gebunden sind.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">6. Dauer der Speicherung</h2>
        <p className="text-muted-foreground leading-relaxed">
          Deine Daten werden so lange gespeichert, wie sie für den jeweiligen Zweck erforderlich
          sind oder bis du deine Einwilligung widerrufst.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">7. Deine Rechte</h2>
        <p className="text-muted-foreground leading-relaxed">
          Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO). Zum Ausüben deiner Rechte
          oder bei Fragen zum Datenschutz erreichst du uns unter elias@finanzmuslim.com.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">8. Kontakt für Datenschutzanfragen</h2>
        <p className="text-muted-foreground leading-relaxed">
          Elias El-Gendy
          <br />
          E-Mail: elias@finanzmuslim.com
        </p>
      </section>
    </main>
  </div>
);

export default Datenschutz;
