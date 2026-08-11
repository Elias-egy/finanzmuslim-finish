import Seo from "@/components/Seo";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

const Index = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Seo title="finanzmuslim – Finanzportal" description="finanzmuslim – Wissen, Rechner und Orientierung für islamkonforme Finanzen." path="/" />
    <SiteHeader active="/" />
    <main className="flex-1 flex items-center justify-center px-6 py-32">
      <h1 className="headline text-3xl md:text-5xl text-center">Neue Startseite folgt</h1>
    </main>
    <SiteFooter />
  </div>
);

export default Index;
