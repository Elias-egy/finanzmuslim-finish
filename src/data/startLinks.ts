/**
 * PH4 (16.11.2026): Der Affiliate-Link je Startseite, als kleine Tabelle kurzname zu Link. investmentStart.ts liest
 * seine Links von hier, es gibt sie nur einmal. So kann der Knopf „Zum Angebot“ beim Tippen sofort zum Anbieter
 * springen, ohne vorher die 98 KB der Startseiten zu laden (Elias PH3-03: „Die Dazwischenschritt dauert extrem
 * lange vom Knopf“). {SUBID} ersetzt direktLink in src/lib/direktLink.ts.
 */
export const START_LINKS = {
  "smartsteuer": "https://www.awin1.com/cread.php?awinmid=15043&awinaffid=3099915&clickref={SUBID}",
  "wiso-steuer": "https://www.awin1.com/cread.php?awinmid=17387&awinaffid=3099915&clickref={SUBID}",
  "steuersparerklaerung": "https://www.awin1.com/cread.php?awinmid=13746&awinaffid=3099915&clickref={SUBID}",
  "wundertax": "https://www.financeads.net/tc.php?t=87591C185241894T",
  // VG2 (23.11.2026): financeAds Programm 3654, Textlink 8646 (Geschäftskonto), ohne Sub-ID (Regel financeAds).
  "accountable": "https://www.financeads.net/tc.php?t=87591C3654128646T",
  "kraken": "https://api.skynet.mcanism.com/c/09d9dW",
  "scalable": "https://partner.scalable-capital.de/go.cgi?pid=1017&wmid=250&cpid=1&prid=1&subid={SUBID}&target=Trading-Broker-M",
  "scalable-krypto": "https://partner.scalable-capital.de/go.cgi?pid=1017&wmid=250&cpid=1&prid=1&subid={SUBID}&target=Trading-Broker-M",
  "traders-place": "https://c.neqty.net/trck/eclick/5a4b0eecd844504b7de215a0b61bfb55?subid={SUBID}",
  "traders-place-krypto": "https://c.neqty.net/trck/eclick/5a4b0eecd844504b7de215a0b61bfb55?subid={SUBID}",
  "dkb-depot": "https://c.neqty.net/trck/eclick/175512c2679834b04880de5a3394ea36?subid={SUBID}",
  "finvesto": "https://c.neqty.net/trck/eclick/ca16f02d65f99bd7e0a84991894b75e3?subid={SUBID}",
  "dkb-girokonto": "https://c.neqty.net/trck/eclick/79bc49b9d70debbb2d943925ed126d17?subid={SUBID}",
  "n26": "https://c.neqty.net/trck/eclick/d7289e91a9dbd189bedb781dc15f3a41?subid={SUBID}",
  "bbbank": "https://c.neqty.net/trck/eclick/5a913135bf2744d85558983a6eb6625b?subid={SUBID}",
  "joe-broker": "https://www.financeads.net/tc.php?t=87591C5496129308T",
  "bunq": "https://www.financeads.net/tc.php?t=87591C3156123231T",
  "wise": "https://wise.prf.hn/click/camref:1011l5RuSL/destination:https%3A%2F%2Fwise.com%2Fde%2F",
  "comdirect-girokonto": "https://www.financeads.net/tc.php?t=87591C87024068T",
  "1822direkt-girokonto": "https://www.financeads.net/tc.php?t=87591C10710165T",
  "postbank": "https://www.financeads.net/tc.php?t=87591C426125749T",
  "bbbank-bettersmart": "https://c.neqty.net/trck/eclick/5a913135bf2744d81a8eb17829b592ec115422fda1f305ee?subid={SUBID}",
  "comdirect-depot": "https://www.financeads.net/tc.php?t=87591C87024090T",
  "comdirect-pure-depot": "https://www.financeads.net/tc.php?t=87591C870133258T",
  "finanzen-net-zero": "https://www.financeads.net/tc.php?t=87591C372273516T",
  "finanzen-net-zero-krypto": "https://www.financeads.net/tc.php?t=87591C372295574T",
  "s-broker": "https://www.financeads.net/tc.php?t=87591C19119676T",
  "consorsbank-depot": "https://www.financeads.net/tc.php?t=87591C15240776T",
  "consorsbank-girokonto": "https://www.financeads.net/tc.php?t=87591C15273616T",
  "deutsche-bank-aktivkonto": "https://www.financeads.net/tc.php?t=87591C472101924T",
  "maxblue-depot": "https://www.financeads.net/tc.php?t=87591C47285472T",
  "justtrade": "https://www.financeads.net/tc.php?t=87591C326261718T",
  "justtrade-krypto": "https://www.financeads.net/tc.php?t=87591C326261718T",
  "norisbank": "https://www.financeads.net/tc.php?t=87591C127132812T",
  "commerzbank-girokonto": "https://www.financeads.net/tc.php?t=87591C304057824T",
  "smartbroker": "https://www.financeads.net/tc.php?t=87591C296855636T",
  "smartbroker-krypto": "https://www.financeads.net/tc.php?t=87591C2968124479T",
  "umweltbank": "https://www.financeads.net/tc.php?t=87591C4946128612T",
  "finst": "https://www.financeads.net/tc.php?t=87591C5710135756T",
  "flatex": "https://www.financeads.net/tc.php?t=87591C13010749T",
  "flatex-krypto": "https://www.financeads.net/tc.php?t=87591C130125837T",
  "zoya": "https://zoya.onelink.me/l7r0/finanzmuslim",
} as const satisfies Record<string, string>;

export const startLink = (kurzname?: string): string | undefined =>
  kurzname && Object.prototype.hasOwnProperty.call(START_LINKS, kurzname)
    ? START_LINKS[kurzname as keyof typeof START_LINKS]
    : undefined;

/**
 * Fassung „Depot da, noch leer“ (Hebel CV-LEER, 06.11.2026). ManyChat schickt nach der Treppe
 * („Halal investieren heißt: mindestens 1 € steckt in einer Halal-Anlage“) mit ?src=dmleer<wort>
 * oder fbleer<wort> hierher. Diese Leute haben ein Depot, ihnen fehlt die erste Einzahlung; bei
 * Scalable zählt erst die Einzahlung ab 1 € (belege/scalable/99-cv3-…-fanny-antwort-lead-sale.txt),
 * und 50 von 76 Anmeldungen kamen nie so weit. Darum hier kein Eröffnungsvideo, sondern drei Schritte.
 * Belege: data/conversion/2026-11-04-ein-euro-je-depot.md im Vault (Sparplan ab 1 € bei Scalable,
 * Traders Place, Smartbroker+; Überweisung ab 1 € schaltet nur bei Scalable belegt das Depot frei).
 */
export const LEER_QUELLE = /^(?:dm|fb)leer[a-z0-9]*$/;

export const istLeerQuelle = (src: string | null | undefined): boolean => !!src && LEER_QUELLE.test(src);
