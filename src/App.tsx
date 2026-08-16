import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { captureSrc } from "@/lib/attribution";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/site/Layout";
import Index from "./pages/Index.tsx";
import InvestmentStart from "./pages/InvestmentStart.tsx";
import HalalGuide from "./pages/HalalGuide.tsx";
import Impressum from "./pages/Impressum.tsx";
import Datenschutz from "./pages/Datenschutz.tsx";
import NotFound from "./pages/NotFound.tsx";

// Lazy: haelt recharts (Renditerechner) aus dem Homepage-Bundle heraus.
const Tools = lazy(() => import("./pages/Tools.tsx"));
const Renditerechner = lazy(() => import("./pages/Renditerechner.tsx"));
const Zakatrechner = lazy(() => import("./pages/Zakatrechner.tsx"));
const WieIchGeldVerdiene = lazy(() => import("./pages/WieIchGeldVerdiene.tsx"));
const VergleichDepot = lazy(() => import("./pages/VergleichDepot.tsx"));
const Rechner = lazy(() => import("./pages/Rechner.tsx"));
const Vergleiche = lazy(() => import("./pages/Vergleiche.tsx"));
const HalalAnlagen = lazy(() => import("./pages/HalalAnlagen.tsx"));
const AnlageDetail = lazy(() => import("./pages/halal-anlagen/AnlageDetail.tsx"));
const Wissen = lazy(() => import("./pages/Wissen.tsx"));
const ZinsenImIslam = lazy(() => import("./pages/wissen/ZinsenImIslam.tsx"));
const HalalGoldKaufen = lazy(() => import("./pages/wissen/HalalGoldKaufen.tsx"));
const IstLeasingHaram = lazy(() => import("./pages/wissen/IstLeasingHaram.tsx"));
const GirokontoOhneZinsen = lazy(() => import("./pages/wissen/GirokontoOhneZinsen.tsx"));
const IstVersicherungHaram = lazy(() => import("./pages/wissen/IstVersicherungHaram.tsx"));
const SindAktienHalal = lazy(() => import("./pages/wissen/SindAktienHalal.tsx"));
const HausKaufenOhneZinsen = lazy(() => import("./pages/wissen/HausKaufenOhneZinsen.tsx"));
const RatenzahlungHaram = lazy(() => import("./pages/wissen/RatenzahlungHaram.tsx"));
const IstBitcoinHalal = lazy(() => import("./pages/wissen/IstBitcoinHalal.tsx"));
const Out = lazy(() => import("./pages/Out.tsx"));
const Deals = lazy(() => import("./pages/Deals.tsx"));
const Vorlagen = lazy(() => import("./pages/Vorlagen.tsx"));
const VorlageHalalAnlagen = lazy(() => import("./pages/vorlagen/HalalAnlagen.tsx"));
const VorlageVertragsAmpel = lazy(() => import("./pages/vorlagen/VertragsAmpel.tsx"));
const VorlageAktienCheck = lazy(() => import("./pages/vorlagen/AktienCheck.tsx"));
const Newsletter = lazy(() => import("./pages/Newsletter.tsx"));

const queryClient = new QueryClient();

const routeFallback = <div className="min-h-screen bg-background" aria-hidden />;

// F3: captured ?src auf jeder Route (nicht nur InvestmentStart), damit die
// Attributionskette Bio/DM -> Guide -> Investmentstart nicht reißt.
const SrcCapture = () => {
  const { search } = useLocation();
  useEffect(() => {
    captureSrc();
  }, [search]);
  return null;
};

// Bei jedem Routenwechsel oben starten — außer wenn ein Anker (#…) angesprungen wird.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SrcCapture />
        <ScrollToTop />
        <Layout>
        <Suspense fallback={routeFallback}>
          <Routes>
            {/* Öffentlich zugängliche Seiten (Launch: 23.7.26) */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/" element={<Index />} />
            <Route path="/dein-investmentstart" element={<InvestmentStart />} />
            <Route path="/dein-investment-start" element={<InvestmentStart />} key="is-alias" />
            <Route path="/halal-guide" element={<HalalGuide />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/renditerechner" element={<Renditerechner />} />
            <Route path="/zakat-rechner" element={<Zakatrechner />} />
            <Route path="/zakatrechner" element={<Zakatrechner />} />
            <Route path="/rechner" element={<Rechner />} />
            <Route path="/wie-ich-geld-verdiene" element={<WieIchGeldVerdiene />} />
            {/* Blog aufgeloest: alles liegt jetzt im Wissensbereich. */}
            <Route path="/blog" element={<Navigate to="/wissen" replace />} />
            <Route path="/blog/*" element={<Navigate to="/wissen" replace />} />
            <Route path="/vergleich/depot" element={<VergleichDepot />} />
            <Route path="/vergleiche" element={<Vergleiche />} />
            <Route path="/halal-anlagen" element={<HalalAnlagen />} />
            <Route path="/halal-anlagen/:slug" element={<AnlageDetail />} />
            <Route path="/wissen" element={<Wissen />} />
            {/* "riba" ist als Suchbegriff wertlos, gesucht wird "zinsen islam".
                Die alte Adresse leitet deshalb dauerhaft auf den neuen Beitrag. */}
            <Route path="/wissen/was-ist-riba" element={<Navigate to="/wissen/zinsen-im-islam" replace />} />
            <Route path="/wissen/zinsen-im-islam" element={<ZinsenImIslam />} />
            <Route path="/wissen/halal-gold-kaufen" element={<HalalGoldKaufen />} />
            <Route path="/wissen/ist-leasing-haram" element={<IstLeasingHaram />} />
            <Route path="/wissen/girokonto-ohne-zinsen" element={<GirokontoOhneZinsen />} />
            <Route path="/wissen/ist-versicherung-haram" element={<IstVersicherungHaram />} />
            <Route path="/wissen/sind-aktien-halal" element={<SindAktienHalal />} />
            <Route path="/wissen/haus-kaufen-ohne-zinsen" element={<HausKaufenOhneZinsen />} />
            <Route path="/wissen/ratenzahlung-haram" element={<RatenzahlungHaram />} />
            <Route path="/wissen/ist-bitcoin-halal" element={<IstBitcoinHalal />} />
            <Route path="/vorlagen" element={<Vorlagen />} />
            <Route path="/vorlagen/halal-anlagen" element={<VorlageHalalAnlagen />} />
            <Route path="/vorlagen/vertrags-ampel" element={<VorlageVertragsAmpel />} />
            <Route path="/vorlagen/aktien-check" element={<VorlageAktienCheck />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/out/:kurzname" element={<Out />} />
            <Route path="/deals" element={<Deals />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
