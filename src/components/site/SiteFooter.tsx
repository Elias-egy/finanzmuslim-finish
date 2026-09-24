import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { InstagramLogo, TikTokLogo, YouTubeLogo } from "@/components/site/SocialLogos";
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
  { label: "Zinsen im Islam", to: "/wissen/zinsen-im-islam" },
  { label: "Halal investieren für Anfänger", to: "/halal-guide" },
  { label: "Halal-Anlagen", to: "/halal-anlagen" },
  { label: "Zakat berechnen", to: "/zakat-rechner" },
];

const werkzeuge: NavEntry[] = [
  { label: "Rechner", to: "/rechner" },
  { label: "Vergleiche", to: "/vergleiche" },
  { label: "Halal Investment Guide", to: "/halal-guide" },
  { label: "Newsletter", to: "/newsletter" },
];

const ueber: NavEntry[] = [
  { label: "Über mich", to: "/ueber-mich" },
  { label: "Kooperationen", to: "/kooperationen" },
  { label: "So verdiene ich Geld", to: "/wie-ich-geld-verdiene" },
  { label: "Deals", to: "/deals" },
  { label: "Impressum", to: "/impressum" },
  { label: "Datenschutz", to: "/datenschutz" },
];

/** Eine Linkspalte. Auf dem Handy stehen die Eintraege zweispaltig,
 *  einspaltig wird die Fusszeile endlos lang. */
const Column = ({ title, items }: { title: string; items: NavEntry[] }) => (
  <div>
    <p className="mb-1 text-[18px] font-bold text-foreground lg:mb-2 lg:text-[12px] lg:font-semibold lg:uppercase lg:tracking-wide lg:text-muted-foreground">
      {title}
    </p>
    <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1">
      {items.filter((i) => i.to).map((i) => (
        <li key={i.label}>
          <Item item={i} />
        </li>
      ))}
    </ul>
  </div>
);

const kanaele = [
  { name: "Instagram", href: "https://instagram.com/finanz.muslim", Logo: InstagramLogo },
  { name: "TikTok", href: "https://tiktok.com/@finanz.muslim", Logo: TikTokLogo },
  { name: "YouTube", href: "https://youtube.com/@finanz.muslim", Logo: YouTubeLogo },
];

export const SiteFooter = () => (
  <footer className="bg-card border-t border-border">
    <div className="container py-10 lg:py-14">
      {/* Social-Kasten oben, wie bei Finanzfluss: eine Flaeche, eine Reihe Symbole. */}
      <div className="rounded-2xl bg-accent px-5 py-5">
        <p className="text-[20px] font-bold text-primary">Hier findest du mich</p>
        <div className="mt-3 flex items-center gap-2">
          {kanaele.map(({ name, href, Logo }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-card"
            >
              <Logo />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-7 lg:mt-12 lg:grid-cols-4 lg:gap-10">
        <div>
          <Wordmark className="text-xl" />
          <p className="mt-2 text-[14px] text-muted-foreground">
            Finanzen, Investieren, islamkonform.
          </p>
        </div>
        <Column title="Wissen" items={wissen} />
        <Column title="Werkzeuge" items={werkzeuge} />
        <Column title="Über" items={ueber} />
      </div>

      <div className="mt-10 border-t border-border pt-6 space-y-2 lg:mt-12">
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
