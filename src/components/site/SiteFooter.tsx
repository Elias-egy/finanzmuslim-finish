import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import type { NavEntry } from "@/components/site/navData";

/* Original-Markenlogos der Kanaele, bewusst nicht monochrom. */
const InstagramLogo = ({ muted = false }: { muted?: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="25%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="100%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill={muted ? "#B9BEC8" : "url(#ig-grad)"} />
    <circle cx="12" cy="12" r="4.6" fill="none" stroke="#fff" strokeWidth="2" />
    <circle cx="17.4" cy="6.6" r="1.3" fill="#fff" />
  </svg>
);

const TikTokLogo = ({ muted = false }: { muted?: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#B9BEC8" : "#25F4EE"}
      transform="translate(-1.1 0.7)"
    />
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#CBD0D8" : "#FE2C55"}
      transform="translate(0.9 -0.5)"
    />
    <path
      d="M15.8 4.2c.5 1.9 1.9 3.3 3.8 3.6v2.7c-1.4 0-2.8-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V2.9h2.9c0 .4 0 .9 0 1.3z"
      fill={muted ? "#9AA1AD" : "#000000"}
    />
  </svg>
);

const YouTubeLogo = ({ muted = false }: { muted?: boolean }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <rect x="1" y="4.5" width="22" height="15" rx="4.5" fill={muted ? "#B9BEC8" : "#FF0000"} />
    <path d="M10 8.8l6 3.2-6 3.2V8.8z" fill="#fff" />
  </svg>
);

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
              href="https://instagram.com/finanz.muslim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            >
              <InstagramLogo />
            </a>
            <a
              href="https://tiktok.com/@finanz.muslim"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            >
              <TikTokLogo />
            </a>
            <span
              aria-label="YouTube – noch nicht verfügbar"
              aria-disabled="true"
              title="YouTube folgt"
              className="inline-flex h-11 w-11 cursor-default items-center justify-center rounded-lg opacity-50"
            >
              <YouTubeLogo muted />
            </span>
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
