import Seo from "@/components/Seo";

const Impressum = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Seo
      title="Impressum – finanzmuslim"
      description="Impressum und rechtliche Angaben zu finanzmuslim, Bildung für halal Investieren."
      path="/impressum"
      brotkrumen={[{ name: "Impressum", path: "/impressum" }]}
    />

    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">Impressum</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Angaben gemäß § 5 DDG:</h2>
        <p className="text-muted-foreground leading-relaxed">
          Elias El-Gendy
          <br />
          Otto-Speckter-Straße 19a
          <br />
          22307 Hamburg
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Kontakt:</h2>
        <p className="text-muted-foreground leading-relaxed">
          E-Mail: elias@finanzmuslim.com
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Steuerliche Angaben:</h2>
        <p className="text-muted-foreground leading-relaxed">
          Steuernummer: 43/054/05731
          <br />
          Zuständiges Finanzamt: Finanzamt Hamburg-Nord
          <br />
          Kleinunternehmer gemäß § 19 UStG
        </p>
      </section>
    </main>
  </div>
);

export default Impressum;
