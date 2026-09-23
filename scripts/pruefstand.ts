/**
 * Prüfstand der Vergleiche für Elias: eine Tabelle mit allen Anbietern aus Depot, Girokonto und
 * Krypto, genau mit den Werten, die die Seite zur Laufzeit zeigt (nach vergleichKorrekturenDaten.ts).
 *
 *   npx tsx scripts/pruefstand.ts
 *
 * Schreibt ~/rebrand/web/pruefstand.html, erreichbar unter http://localhost:5200/pruefstand.html.
 * Nur lesend, ändert keine Daten und gehört nicht zur ausgelieferten Website.
 */
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { brokerVergleich, DEPOT_FINANZ_MAX, DEPOT_ZEILEN } from "../src/data/brokerVergleich";
import { girokontoVergleich, GIRO_FINANZ_MAX, GIRO_ZEILEN } from "../src/data/girokontoVergleich";
import { kryptoVergleich, KRYPTO_FINANZ_MAX, KRYPTO_ZEILEN } from "../src/data/kryptoVergleich";
import { empfehlbar } from "../src/data/vergleichAssistent";
import { dealFuer } from "../src/data/deals";
import { anfrageFuer, ANFRAGEN, type Anfrage } from "../src/data/anfragenLog";
import { STUFEN_STAND } from "../src/data/stufenPruefung";
import { werteAus } from "../src/lib/vergleichAssistent";
import type { RohAnbieter } from "../src/data/vergleichHelfer";
import type { VergleichsZeile } from "../src/components/vergleich/vergleichTypen";

type Bereich = { id: "depot" | "girokonto" | "krypto"; name: string; liste: RohAnbieter[]; zeilen: VergleichsZeile[]; max: Record<string, number> };

const BEREICHE: Bereich[] = [
  { id: "depot", name: "Depot", liste: brokerVergleich, zeilen: DEPOT_ZEILEN, max: DEPOT_FINANZ_MAX },
  { id: "girokonto", name: "Girokonto", liste: girokontoVergleich, zeilen: GIRO_ZEILEN, max: GIRO_FINANZ_MAX },
  { id: "krypto", name: "Krypto", liste: kryptoVergleich, zeilen: KRYPTO_ZEILEN, max: KRYPTO_FINANZ_MAX },
];

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const quelleArt = (url?: string, hinweis?: string) => {
  if (!url && !hinweis) return "keine";
  if (/Schriftlich bestätigt|Schriftlich von/i.test(hinweis ?? "")) return "Mail";
  if (/finanzfluss\.de/.test(url ?? "")) return "Finanzfluss";
  return "Anbieterseite";
};

type Zeile = {
  bereich: string;
  rang: number | null;
  nummerEins: boolean;
  name: string;
  status: "gruen" | "offen" | "rot";
  empfehlbar: boolean;
  partner: boolean;
  bonus: string | null;
  ffRang: number | null;
  abgeraten: boolean;
  felder: { label: string; wert: string; art: string; url?: string; stand?: string; hinweis?: string }[];
  kosten: string;
  haus?: string;
  produkt?: string;
  anfrage?: Anfrage;
};

const zeilen: Zeile[] = [];

for (const b of BEREICHE) {
  const erg = werteAus(b.liste, b.id, b.max, { wuensche: [], gewichte: [] });
  const rang = new Map(erg.passt.map((t, i) => [t.anbieter.id, i + 1]));
  const halalZeilen = b.zeilen.filter((z) => z.gruppe === "halal");
  const kostenZeilen = b.zeilen.filter((z) => z.gruppe === "kosten" && z.imRaster).slice(0, 2);

  for (const a of b.liste) {
    const felder = halalZeilen.map((z) => {
      const w = a.werte[z.key];
      const q = a.quellen?.[z.key];
      return {
        label: z.label,
        wert: w === null || w === undefined ? "noch nicht geprüft" : String(w),
        art: quelleArt(q?.url, q?.hinweis),
        url: q?.url,
        stand: q?.stand,
        hinweis: q?.hinweis,
      };
    });
    const ampelWerte = halalZeilen.filter((z) => z.art === "ampel").map((z) => a.werte[z.key]);
    const status: Zeile["status"] = a.abgeraten || ampelWerte.includes("schlecht")
      ? "rot"
      : ampelWerte.every((w) => w === "gut")
        ? "gruen"
        : "offen";
    const deal = dealFuer(a.id);
    zeilen.push({
      bereich: b.name,
      rang: rang.get(a.id) ?? null,
      nummerEins: rang.get(a.id) === 1,
      name: `${a.name} ${a.produkt}`,
      status,
      empfehlbar: empfehlbar(a.id),
      partner: !!a.link,
      bonus: deal?.betrag ? `${deal.betrag} €` : null,
      ffRang: a.finanzfluss?.rang ?? null,
      abgeraten: !!a.abgeraten,
      felder,
      haus: (a as { haus?: string }).haus,
      produkt: a.produkt,
      anfrage: anfrageFuer((a as { haus?: string }).haus),
      kosten: kostenZeilen.map((z) => `${z.label}: ${a.werte[z.key] ?? "?"}`).join(" · "),
    });
  }
}

const zaehle = (bereich: string) => {
  const l = zeilen.filter((z) => z.bereich === bereich);
  return {
    gesamt: l.length,
    gruen: l.filter((z) => z.status === "gruen").length,
    offen: l.filter((z) => z.status === "offen").length,
    rot: l.filter((z) => z.status === "rot").length,
    partnerGruen: l.filter((z) => z.partner && z.status === "gruen").length,
    partnerOffen: l.filter((z) => z.partner && z.status === "offen").length,
  };
};

const zelle = (f: Zeile["felder"][number]) => {
  const ton =
    f.wert === "gut" ? "gut" : f.wert === "teils" ? "teils" : f.wert === "schlecht" ? "schlecht" : f.wert === "noch nicht geprüft" ? "offen" : "text";
  const anzeige = { gut: "ja", teils: "teils", schlecht: "nein", offen: "offen" }[ton as "gut"] ?? f.wert;
  const titel = [f.hinweis, f.stand ? `Stand ${f.stand}` : "", f.url].filter(Boolean).join("\n");
  const quelle = f.art === "keine" ? "" : `<a class="q q-${f.art === "Mail" ? "mail" : f.art === "Finanzfluss" ? "ff" : "seite"}" href="${esc(f.url ?? "#")}" target="_blank" rel="noopener">${esc(f.art)}${f.stand ? " " + esc(f.stand) : ""}</a>`;
  return `<td class="f" title="${esc(titel)}"><span class="pill ${ton}">${esc(anzeige)}</span>${quelle}${f.hinweis ? `<div class="hw">${esc(f.hinweis)}</div>` : ""}</td>`;
};


/** Was wir den Anbieter gefragt haben, und was kam. Ohne Eintrag: nie gefragt. */
const anfrageZelle = (z: Zeile) => {
  const a = z.anfrage;
  if (!a) return `<td class="anf"><span class="pill offen">nie gefragt</span></td>`;
  if (a.keinMailWeg && a.vorgaenge.length === 0)
    return `<td class="anf"><span class="pill teils">kein Mail-Weg</span><div class="hw">${esc(a.naechsterSchritt ?? "")}</div></td>`;
  const rein = a.vorgaenge.filter((v) => v.richtung === "rein");
  const letzte = a.vorgaenge[a.vorgaenge.length - 1];
  const ton = rein.length === 0 ? "offen" : a.naechsterSchritt ? "teils" : "gut";
  const kopf = rein.length === 0 ? `gefragt ${esc(a.vorgaenge[0]?.datum ?? "")}` : `${rein.length} Antwort${rein.length > 1 ? "en" : ""}`;
  const liste = a.vorgaenge
    .map((v) => `<div class="v"><b>${esc(v.datum)}</b> ${v.richtung === "raus" ? "→" : "←"} ${esc(v.kanal)}${v.zeichen ? " " + esc(v.zeichen) : ""}${v.adresse ? " " + esc(v.adresse) : ""}<br>${esc(v.kern)}</div>`)
    .join("");
  const schritt = a.naechsterSchritt ? `<div class="schritt">Nächster Schritt: ${esc(a.naechsterSchritt)}</div>` : "";
  return `<td class="anf" title="${esc(a.vorgaenge.map((v) => `${v.datum} ${v.richtung === "raus" ? "→" : "←"} ${v.kern}`).join("\n"))}"><span class="pill ${ton}">${kopf}</span>${letzte ? `<div class="klein">zuletzt ${esc(letzte.datum)}</div>` : ""}<div class="hw">${liste}${schritt}</div></td>`;
};

/** Ein Fragezeichen je Haus: wo noch etwas offen ist und was als Nächstes dran ist. */
const fragezeichen = () => {
  const offeneHaeuser = new Map<string, { namen: string[]; anfrage?: Anfrage }>();
  for (const z of zeilen) {
    if (z.status === "gruen") continue;
    const key = z.haus ?? z.name;
    const e = offeneHaeuser.get(key) ?? { namen: [], anfrage: z.anfrage };
    e.namen.push(z.name);
    offeneHaeuser.set(key, e);
  }
  const zeile = (key: string, e: { namen: string[]; anfrage?: Anfrage }) => {
    const a = e.anfrage;
    const lage = !a
      ? '<span class="pill offen">nie gefragt</span>'
      : a.keinMailWeg && a.vorgaenge.length === 0
        ? '<span class="pill teils">kein Mail-Weg</span>'
        : a.vorgaenge.some((v) => v.richtung === "rein")
          ? '<span class="pill gut">hat geantwortet</span>'
          : '<span class="pill offen">wartet auf Antwort</span>';
    const wann = a?.vorgaenge.length ? ` seit ${esc(a.vorgaenge[0].datum)}` : "";
    return `<tr><td class="name">${esc(a?.anbieter ?? key)}</td><td>${lage}${wann}</td><td class="klein">${esc(e.namen.slice(0, 4).join(", "))}${e.namen.length > 4 ? ` und ${e.namen.length - 4} weitere` : ""}</td><td class="klein">${esc(a?.naechsterSchritt ?? (a ? "Antwort abwarten" : "noch nie angefragt"))}</td></tr>`;
  };
  const sortiert = [...offeneHaeuser.entries()].sort((x, y) => {
    const rang = (e: { anfrage?: Anfrage }) => (!e.anfrage ? 0 : e.anfrage.keinMailWeg ? 3 : e.anfrage.naechsterSchritt ? 1 : 2);
    return rang(x[1]) - rang(y[1]) || x[0].localeCompare(y[0], "de");
  });
  return `
  <section class="bereich">
    <h2>Fragezeichen <small>${sortiert.length} Anbieter mit mindestens einem offenen oder roten Feld · Reihenfolge: zuerst, was sich lohnt</small></h2>
    <div class="scroll"><table>
      <thead><tr><th>Anbieter</th><th>Lage</th><th>Betroffene Produkte</th><th>Nächster Schritt</th></tr></thead>
      <tbody>${sortiert.map(([k, e]) => zeile(k, e)).join("")}</tbody>
    </table></div>
  </section>`;
};

/**
 * Stufen-Prüfung (Elias-Regel 23.09.2026): jede Tarifstufe ist ein eigenes Produkt. Hier steht je Haus mit
 * mehreren Stufen, wo mehrere Stufen denselben Beleg tragen. "nennt Stufe" heißt: Belegtext oder URL enthalten
 * den Stufennamen. Alles andere ist ein pauschaler Beleg und gehört je Stufe nachgeprüft (Stand in stufenPruefung.ts).
 */
const stufenPruefung = () => {
  const gruppen = new Map<string, Zeile[]>();
  for (const z of zeilen) {
    if (!z.haus) continue;
    const k = `${z.bereich}|${z.haus}`;
    gruppen.set(k, [...(gruppen.get(k) ?? []), z]);
  }
  const reihen: string[] = [];
  let pauschal = 0;
  for (const [k, l] of [...gruppen.entries()].sort((a, b) => a[0].localeCompare(b[0], "de"))) {
    if (l.length < 2) continue;
    const labels = [...new Set(l.flatMap((z) => z.felder.map((f) => f.label)))];
    const teile: string[] = [];
    let offenGruppe = false;
    for (const label of labels) {
      const mit = l.map((z) => ({ z, f: z.felder.find((f) => f.label === label) })).filter((x) => x.f?.url);
      const byUrl = new Map<string, typeof mit>();
      for (const m of mit) byUrl.set(m.f!.url!, [...(byUrl.get(m.f!.url!) ?? []), m]);
      for (const [url, gruppe] of byUrl) {
        if (gruppe.length < 2 || /finanzfluss\.de/.test(url)) continue;
        const nennt = gruppe.map((m) => {
          const prod = (m.z.produkt ?? "").toLowerCase();
          return prod.length > 2 && ((m.f!.hinweis ?? "").toLowerCase().includes(prod) || url.toLowerCase().includes(prod));
        });
        const alle = nennt.every(Boolean);
        if (!alle) offenGruppe = true;
        teile.push(`<div><b>${esc(label)}</b>: ${gruppe.map((m, i) => `${esc(m.z.produkt)}${nennt[i] ? " ✓" : ""}`).join(", ")} <span class="klein">(${esc(url.replace(/^https?:\/\//, "").slice(0, 60))})</span></div>`);
      }
    }
    if (!teile.length) continue;
    const [bereich, haus] = k.split("|");
    const st = STUFEN_STAND[haus];
    if (offenGruppe && !st?.geprueft) pauschal++;
    const lage = st?.geprueft
      ? `<span class="pill gut">stufenweise geprüft</span> <span class="klein">${esc(st.geprueft)}</span>`
      : offenGruppe
        ? '<span class="pill offen">pauschaler Beleg</span>'
        : '<span class="pill gut">Stufe genannt</span>';
    reihen.push(`<tr><td class="name">${esc(l[0].name.split(" ")[0])} <span class="klein">${esc(bereich)}</span></td><td>${lage}</td><td class="klein">${teile.join("")}</td><td class="klein">${esc(st?.notiz ?? "")}</td></tr>`);
  }
  return `
  <section class="bereich">
    <h2>Stufen-Prüfung <small>${pauschal} Häuser mit Belegen, die mehrere Stufen gemeinsam tragen · jede Stufe zählt als eigenes Produkt · ✓ = Belegtext nennt die Stufe</small></h2>
    <div class="scroll"><table>
      <thead><tr><th>Anbieter</th><th>Lage</th><th>Feld: Stufen mit demselben Beleg</th><th>Notiz</th></tr></thead>
      <tbody>${reihen.join("")}</tbody>
    </table></div>
  </section>`;
};

const tabelle = (b: Bereich) => {
  const l = zeilen.filter((z) => z.bereich === b.name).sort((x, y) => (x.rang ?? 999) - (y.rang ?? 999) || x.name.localeCompare(y.name, "de"));
  const kopf = l[0]?.felder.map((f) => `<th>${esc(f.label)}</th>`).join("") ?? "";
  const k = zaehle(b.name);
  return `
  <section class="bereich" data-bereich="${b.id}">
    <h2>${esc(b.name)} <small>${k.gesamt} Produkte · <b class="c-gut">${k.gruen} alles ja</b> · <b class="c-offen">${k.offen} offen</b> · <b class="c-rot">${k.rot} mit Nein</b> (davon ${zeilen.filter((z) => z.bereich === b.name && z.abgeraten).length} abgeraten) · Partner: ${k.partnerGruen} grün, ${k.partnerOffen} offen</small></h2>
    <div class="scroll"><table>
      <thead><tr><th>Rang</th><th>Produkt</th><th>Status</th><th>Partner</th><th>Bonus</th><th>Anfragen</th>${kopf}<th>Kosten</th><th>FF-Rang</th></tr></thead>
      <tbody>${l
        .map(
          (z) => `<tr class="st-${z.status}${z.nummerEins ? " eins" : ""}" data-status="${z.status}" data-partner="${z.partner}" data-name="${esc(z.name.toLowerCase())}">
        <td class="num">${z.rang ?? "–"}${z.nummerEins ? ' <span class="badge">Nr. 1</span>' : ""}</td>
        <td class="name">${esc(z.name)}</td>
        <td><span class="pill ${z.status === "gruen" ? "gut" : z.status === "rot" ? "schlecht" : "offen"}">${z.status === "gruen" ? "alles ja" : z.status === "rot" ? "mind. ein Nein" : "offen"}</span>${z.abgeraten ? '<div class="klein rot">abgeraten, kein Partnerlink</div>' : ""}${z.empfehlbar ? "" : '<div class="klein">wird nicht beworben</div>'}</td>
        <td>${z.partner ? "✓" : ""}</td>
        <td>${z.bonus ?? ""}</td>
        ${anfrageZelle(z)}
        ${z.felder.map(zelle).join("")}
        <td class="kosten">${esc(z.kosten)}</td>
        <td class="num">${z.ffRang ?? ""}</td>
      </tr>`,
        )
        .join("")}</tbody>
    </table></div>
  </section>`;
};

const stand = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prüfstand Vergleiche</title>
<style>
  :root{--blau:#0057FA;--gut:#1f8a5b;--teils:#b7791f;--rot:#d93838;--grau:#6b7280;--rand:#e5e7eb;--hell:#f7f8fa}
  *{box-sizing:border-box} body{margin:0;font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;color:#111827;background:#fff}
  header{position:sticky;top:0;z-index:5;background:#fff;border-bottom:1px solid var(--rand);padding:14px 20px}
  h1{margin:0 0 4px;font-size:20px} .sub{color:var(--grau);font-size:13px}
  .leiste{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;align-items:center}
  .leiste button{border:1px solid var(--rand);background:#fff;border-radius:999px;padding:6px 12px;cursor:pointer;font:inherit}
  .leiste button.an{background:var(--blau);color:#fff;border-color:var(--blau)}
  .leiste input{border:1px solid var(--rand);border-radius:8px;padding:6px 10px;font:inherit;min-width:220px}
  main{padding:16px 20px 60px}
  .offen-box{border:1px solid #fde68a;background:#fffbeb;border-radius:12px;padding:12px 16px;margin-bottom:18px}
  .offen-box h3{margin:0 0 6px;font-size:15px} .offen-box li{margin:3px 0}
  .legende{color:var(--grau);font-size:12px;margin-bottom:14px}
  h2{font-size:18px;margin:26px 0 8px} h2 small{font-weight:400;color:var(--grau);font-size:13px;margin-left:6px}
  .scroll{overflow-x:auto;border:1px solid var(--rand);border-radius:12px}
  table{border-collapse:collapse;width:100%;min-width:1100px}
  th{position:sticky;top:0;background:var(--hell);text-align:left;font-size:12px;color:#374151;padding:8px;border-bottom:1px solid var(--rand);white-space:nowrap}
  td{padding:8px;border-bottom:1px solid var(--rand);vertical-align:top}
  tr.st-rot td{background:#fdf2f2} tr.eins td{background:#eef4ff}
  td.name{font-weight:600;white-space:nowrap} td.num{text-align:center;white-space:nowrap} td.kosten{font-size:12px;color:#374151;min-width:180px}
  td.f{min-width:170px;max-width:260px}
  td.anf{min-width:150px;max-width:240px}
  td.anf .v{font-size:11px;color:var(--grau);margin-top:4px;padding-left:6px;border-left:2px solid var(--rand)}
  td.anf .schritt{font-size:11px;color:#92400e;margin-top:4px}
  .pill{display:inline-block;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:600;white-space:nowrap}
  .pill.gut{background:#e7f6ee;color:var(--gut)} .pill.teils{background:#fdf3e1;color:var(--teils)} .pill.schlecht{background:#fde8e8;color:var(--rot)}
  .pill.offen{background:#f1f2f4;color:var(--grau)} .pill.text{background:#eef4ff;color:#1e3a8a}
  .q{display:inline-block;margin-left:6px;font-size:11px;text-decoration:none;border-radius:4px;padding:0 5px}
  .q-mail{background:#ede9fe;color:#5b21b6} .q-seite{background:#e0f2fe;color:#075985} .q-ff{background:#fef3c7;color:#92400e}
  .hw{font-size:11px;color:var(--grau);margin-top:3px;display:none} body.details .hw{display:block}
  .klein{font-size:11px;color:var(--grau);margin-top:3px} .klein.rot{color:var(--rot)}
  .badge{background:var(--blau);color:#fff;border-radius:4px;padding:0 5px;font-size:11px}
  .c-gut{color:var(--gut)} .c-offen{color:var(--grau)} .c-rot{color:var(--rot)}
</style></head>
<body>
<header>
  <h1>Prüfstand Vergleiche</h1>
  <div class="sub">Werte wie auf der Seite zur Laufzeit, erzeugt ${esc(stand)}. Nur lokal, wird nicht veröffentlicht.</div>
  <div class="leiste">
    <button data-f="alle" class="an">Alle</button>
    <button data-f="gruen">Nur alles ja</button>
    <button data-f="offen">Nur offen</button>
    <button data-f="rot">Nur mit Nein</button>
    <button data-f="partner">Nur Partner</button>
    <button id="details">Belegtexte zeigen</button>
    <input id="suche" placeholder="Anbieter suchen">
  </div>
</header>
<main>
  <div class="offen-box">
    <h3>Deine offenen Entscheidungen</h3>
    <ol>
      <li><b>Trade Republic:</b> Die Zinsseite sagt „Aktiviere Zinsen in der App“ und zugleich „du kannst die Zinsen deaktivieren“. Das Girokonto steht deshalb auf teils, das Depot auf ja. Beide nutzen dasselbe Cash. Bitte in der App nachsehen, ob Zinsen bei einem neuen Konto sofort laufen.</li>
      <li><b>Scalable und DKB (Partner):</b> 3 Sukuk- und 7 Edelmetall-ISINs in der App suchen.</li>
      <li><b>Anbieter ohne Mail-Weg:</b> in der App fragen oder bewusst auf offen lassen? Die Tabelle „Fragezeichen“ sagt, wen es betrifft.</li>
    </ol>
    <p class="klein">Geklärt: Relai (23.09., klare KI-Antwort zählt), BSDEX (23.09., Staking nur nach eigener Weisung), PSD Nürnberg, Commerzbank, JOE Broker, Berliner Volksbank, finanzen.net zero, finvesto, tradegate.direct, HVB-Girokonten, meine Bank, Haspa, EthikBank, justTRADE, Bitvavo, Smartbroker+.</p>
  </div>
  <div class="legende">Status zählt nur die Halal-Ampeln (Zins, Dispo, Karte, Coins usw.): „alles ja“ heißt jede Ampel belegt ja. Rang = Reihenfolge im Vergleich (nur zinsfreie, geprüfte Anbieter bekommen einen Rang). Quelle: <span class="q q-mail">Mail</span> schriftliche Antwort, <span class="q q-seite">Anbieterseite</span> Seite des Anbieters, <span class="q q-ff">Finanzfluss</span> nur Finanzfluss. Maus auf ein Feld zeigt den Belegtext.</div>
  ${stufenPruefung()}
  ${fragezeichen()}
  ${BEREICHE.map(tabelle).join("\n")}
</main>
<script>
  const knoepfe=[...document.querySelectorAll('[data-f]')]; let filter='alle';
  const anwenden=()=>{const q=document.getElementById('suche').value.toLowerCase();
    document.querySelectorAll('tbody tr').forEach(tr=>{
      const passt=(filter==='alle'||(filter==='partner'?tr.dataset.partner==='true':tr.dataset.status===filter))&&(!q||tr.dataset.name.includes(q));
      tr.style.display=passt?'':'none';});};
  knoepfe.forEach(b=>b.onclick=()=>{filter=b.dataset.f;knoepfe.forEach(x=>x.classList.toggle('an',x===b));anwenden();});
  document.getElementById('suche').oninput=anwenden;
  document.getElementById('details').onclick=e=>{document.body.classList.toggle('details');e.target.classList.toggle('an');};
</script>
</body></html>`;

const ziel = join(homedir(), "rebrand", "web", "pruefstand.html");
writeFileSync(ziel, html);
for (const b of BEREICHE) console.log(b.name, zaehle(b.name));
console.log("geschrieben:", ziel);
