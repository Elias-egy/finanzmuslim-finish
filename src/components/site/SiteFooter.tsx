import { Link } from "react-router-dom";
import { Instagram, Youtube, Music2 } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import type { NavEntry } from "@/components/site/navData";

const Soon = ({ label }: { label: string }) => (
  <span className="flex min-h-[36px] items-center gap-2 text-[14px] text-muted-foreground/60">
    {label}
    <span className="badge-soon">bald</span>
  </span>
);

const Item = ({ item }: { item: NavEntry }) =>
  item.to ? (
    <Link
      to={item.to}
      className="flex min-h-[36px] items-center text-[14px] text-foreground hover:text-primary transition-colors"
    >
      {item.label}
    </Link>
  ) : (
    <Soon label={item.label} />
  );

const wissen: NavEntry[] = [
  { label: "Alle Themen", to: "/wissen" },
  { label: "Was ist Riba", to: "/wissen/was-ist-riba" },
  { label: "Halal investieren für Anfänger", to: "/halal-guide" },
  { label: "Halal ETFs", to: "/dein-investmentstart" },
  { label: "Zakat berechnen", to: "/zakat-rechner" },
];

const werkzeuge: NavEntry[] = [
  { label: "Rechner", to: "/rechner" },
  { label: "Vergleiche", to: "/vergleiche" },
  { label: "Halal Investment Guide", to: "/halal-guide" },
];

const ueber: NavEntry[] = [
  { label: "Über mich" },
  { label: "So verdiene ich Geld", to: "/wie-ich-geld-verdiene" },
  { label: "Deals", to: "/deals" },
  { label: "Impressum", to: "/impressum" },
  { label: "Datenschutz", to: "/datenschutz" },
];

const Column = ({ title, items }: { title: string; items: NavEntry[] }) => (
  <div>
    <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
    <ul>
      {items.map((i) => (
        <li key={i.label}>
          <Item item={i} />
        </li>
      ))}
    </ul>
  </div>
);

export const SiteFooter = () => (
  <footer className="bg-card border-t border-border">
    <div className="container py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark className="text-xl" />
          <p className="mt-2 text-[14px] text-muted-foreground">Finanzen, Investieren, islamkonform.</p>
          <div className="mt-4 flex items-center gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:text-primary transition-colors"
            >
              <Music2 className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>

        <Column title="Wissen" items={wissen} />
        <Column title="Werkzeuge" items={werkzeuge} />
        <Column title="Über" items={ueber} />
      </div>

      <div className="mt-12 border-t border-border pt-6 space-y-2">
        <p className="text-[13px] text-muted-foreground">© 2026 finanzmuslim</p>
        <p className="text-[13px] text-muted-foreground">
          Mit * markierte Links sind Werbe- oder Affiliate-Links. Wenn du darüber ein Produkt abschließt,
          erhalte ich eine Provision. Für dich entstehen dadurch keine Mehrkosten.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
