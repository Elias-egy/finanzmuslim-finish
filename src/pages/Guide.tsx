import Seo from "@/components/Seo";
import GuideAnmeldung from "@/components/optin/GuideAnmeldung";

/**
 * /guide: die eine Seite für den einen Guide, den Halal Starter Guide (AG4, 23.11.2026, Elias: „bei der Anmeldung zum
 * Guide kriegt man jetzt nur noch einen … Gib mir deinen Vorname-Mail und ich schicke den Guide direkt zu“).
 * Vorname und E-Mail, ein Knopf, kein Fragebogen: Die Karte schickt an Make (Szenario 7640717, Freebie „guide“),
 * dort landet die Adresse in „Guide-Eingang“, und ohne Stufe kommt der Guide über die Gruppe „Einsteiger“.
 * Danach die Danke-Seite /danke/guide. Ersetzt /halal-guide (leitet hierher) samt Stufenfrage und FAQ.
 * AG4-03 (24.11.2026, Elias: „Versuch die Seite mal so zu machen wie bei Acquisition.com“): Handy-Aufbau wie dessen
 * Roadmap-Seite: Marke, Titel mit der Psychologie „Find the constraint holding your business back“, ein Satz mit
 * „in 30 Sekunden“ und dem Hinweis, dass Elias per Mail erreichbar ist (statt „free call“), kleines Produktbild
 * (Titelseite und zwei Innenseiten, ohne Foto von Elias), Vorname, E-Mail, Knopf „Guide schicken“. Sonst nichts.
 * AG4-06 (24.11.2026): der Block steht als Bauteil in components/optin/GuideAnmeldung.tsx, die Startseite nutzt dasselbe.
 */
const Guide = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Halal Starter Guide: kostenlos als PDF | finanzmuslim"
      description="Der kostenlose Halal Starter Guide auf 14 Seiten: Zinsen im Alltag erkennen, Bankkonto ohne Zinsen, erstes Depot und die häufigsten Fehler. Per Mail als PDF."
      path="/guide"
      brotkrumen={[{ name: "Halal Starter Guide", path: "/guide" }]}
    />

    <main>
      <GuideAnmeldung />
    </main>
  </div>
);

export default Guide;
