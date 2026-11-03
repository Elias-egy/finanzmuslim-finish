import re, sys
S = sys.argv[1]; ziel = sys.argv[2]
D = "2026-11-03"
W = "~/Documents/dev/fm-seo23"
PROS = "https://www.blackrock.com/ch/individual/en/literature/prospectus/ishares-ii-plc-prospectus-en.pdf"
EQ = (f"{PROS}, Verkaufsprospekt iShares II plc vom 21.09.2026, S. 88 f., Abschnitt „SHARI'AH EQUITY FUNDS PANEL“: „The Shari'ah Equity Funds Panel has issued a Fatwa in respect of the Shari'ah Equity Funds. Subject to the Funds’ compliance, the Shari'ah Equity Funds Panel will issue an annual Shari’ah compliance certificate for the Shari'ah Equity Funds.“; Mitglieder: „As at the date of this Prospectus, the members of the Shari'ah Equity Funds Panel are: Dr Mohamed Elgari … Sheikh Nizam Yaquby … Dr Mohammed Daud Bakar“; S. 2 Begriffe: „“Shari'ah Equity Funds”, together, iShares MSCI EM Islamic UCITS ETF, iShares MSCI USA Islamic UCITS ETF and iShares MSCI World Islamic UCITS ETF.“, {D}")
SUK = (f"{PROS}, Verkaufsprospekt iShares II plc vom 21.09.2026, S. 89: „As at the date of this Prospectus, the members of the Sukuk Fund Panel comprised of the Amanie Advisors Shari'ah Supervisory Board Members“ und „The Sukuk Fund Panel has issued a Fatwa in respect of the Sukuk Fund. Subject to the Sukuk Fund’s compliance with Shari’ah, the Sukuk Fund Panel will issue an annual Shari’ah compliance certificate for the Sukuk Fund.“, {D}")
PUR = (f"{PROS}, Verkaufsprospekt iShares II plc vom 21.09.2026, S. 124 f.: „In the event of any interest arising … or if Investments yield small percentages of income inconsistent with Shar'iah, that gain, profit or income will then need to be “purified” by way of a donation to approved charities approved by the Shari’ah Equity Funds Panel or the Sukuk Fund Panel for purification purposes.“ und „none of the Shari'ah Compliant Funds … can guarantee that any impure dividend monies donated to a charity will not be used for non-Shari'ah compliant purposes“; S. 2: „“Shari’ah Compliant Funds”, together, the Shari'ah Equity Funds and the Sukuk Fund.“ (vier iShares-ETFs der Liste), {D}")
MSCI = "https://www.msci.com/index/methodology/latest/Islamic"
M_INTRO = f"{MSCI}, MSCI Islamic Index Series Methodology (Dezember 2025), Abschnitt 1: „The MSCI Islamic Index Methodology has been approved as Sharia compliant by MSCI’s Sharia advisors’ committee of Sharia scholars.“; Abschnitt 3.3 Periodic Certification: „MSCI's Sharia advisors will issue a periodic certification covering that period of review“, {D}"
M_21 = f"{MSCI}, Methodik Dezember 2025, Abschnitt 2.1 Business Activity Screening: „Sharia investment principles do not allow investment in companies which are directly active in, or derive more than 5% of their revenue (cumulatively) from the following activities“, darunter „Alcohol“, „Pork related products“, „Conventional Financial Services: commercial banks … including insurance“, {D}"
M_22 = f"{MSCI}, Methodik Dezember 2025, Abschnitt 2.2 Financial Ratio Screening: „Sharia investment principles do not allow investment in companies deriving significant income from interest or companies that have excessive leverage“, Grenze Total Debt 33,33 %, {D}"
M_23 = f"{MSCI}, Methodik Dezember 2025, Abschnitt 2.3 Dividend Purification: „If a company derives part of its total income from interest income and/or from prohibited activities, Sharia investment principles state that this proportion must be deducted from the dividend paid out to shareholders and given to charity.“, {D}"
M_FN4 = f"{MSCI}, Methodik Dezember 2025, Abschnitt 2.1 mit Fußnote 4: „(Sum of Revenue from prohibited activities including Interest Income) / (Total Income)“ unter 5 % bleibt im Index, also verdienen auch aufgenommene Firmen etwas an Zinsen; Abschnitt 2.3 wie dort, {D}"
INV = f"https://www.invesco.com/content/dam/invesco/emea/en/product-documents/etf/fund/ssb-certificate/invesco-dow-jones-islamic-global-developed-markets-ucits-etf_ssb-certficate_en_2023.pdf, Shariah Compliance Certificate: „Date: 15-October-2024“, „INVESCO DOW JONES ISLAMIC GLOBAL DEVELOPED MARKETS UCITS ETF FINANCIAL YEAR END 2023“, „The Shariah Supervisory Board (“SSB”) of Amanie Advisors Ltd. … has performed its Shariah audit … for the period from 01 January 2023 to 31 December 2023“, „Amanie has found that the Fund has performed its Shariah compliant business activities as per the relevant Shariah requirements“, {D}"
SAT = f"https://hanetf.com/wp-content/assets/Saturna%20Al%20Kawthar%20-%20Shariah%20Compliance%20Cert%20FYE%20-%202025%20(Final%20&%20Executed).pdf, Shariah Compliance Certificate: „Date: 22-May-2026“, „SATURNA AL KAWTHAR GLOBAL FOCUSED EQUITY UCITS ETF FINANCIAL YEAR END 2025“, „The Shariah Supervisory Board (“SSB”) of Amanie Advisors Ltd. (“Amanie”), through Amanie, has performed its Shariah audit“, Zeitraum „01 January 2025 to 31 December 2025“, {D}"
HSBC = f"https://www.assetmanagement.hsbc.co.uk/api/v1/download/document/ie000x9fti22/gb/en/factsheet, HSBC MSCI World Islamic Screened UCITS ETF, Monthly report 30 September 2026, Investment strategy: „The Shariah committee monitors the Fund periodically and issues an annual Shariah certificate on the Fund’s compliance with Shariah principles.“, {D}"
XTR = f"https://etf.dws.com/download/asset/338a9b54-af7b-4d09-ad33-9bcaacb30ac5, Xtrackers-II-Verkaufsprospekt, Anhang Salam-Sukuk-ETF (wortgleich in {W}/src/data/halalAnlagen.ts, zertifikatHinweis xtrackers-ii-salam-usd-global-aggregate-sukuk): „The Management Company has appointed ASB Capital Limited (the „Shari’a Consultant“) to provide Shari’a consultation services“, {D}"
ACHT = (f"{W}/src/data/halalAnlagen.ts, Felder zertifikatLink und zertifikatHinweis der acht ISIN aus src/data/halalEtfListe.ts; je ETF ein Nachweis vom Anbieter oder Prüfer: drei iShares-Aktien-ETFs Prospekt S. 88 f. (Fatwa des Shari'ah Equity Funds Panel), iShares USD Sukuk Prospekt S. 89 (Fatwa des Sukuk Fund Panel), Invesco Dow Jones Zertifikat Amanie FYE 2023, Saturna Zertifikat Amanie FYE 2025, HSBC Factsheet 30.09.2026 (Shariah committee, annual certificate), Invesco MSCI ACWI über die MSCI-Methodik (Index von Sharia scholars freigegeben), {D}")
SIEBEN = (f"{W}/src/data/halalEtfListe.ts, Fonds-Prüfung bei sieben der acht: iShares World, USA, EM ({PROS} S. 88 f., Fatwa des Shari'ah Equity Funds Panel), iShares USD Sukuk (S. 89, Sukuk Fund Panel), Invesco Dow Jones (Amanie-Zertifikat FYE 2023), Saturna (Amanie-Zertifikat FYE 2025), HSBC (Factsheet 30.09.2026: „The Shariah committee monitors the Fund periodically“); nur über den Index: Invesco MSCI ACWI Islamic (MSCI-Methodik Abschnitt 1), {D}")
ZWOELF = f"{W}/src/data/anlagenKaufbar.ts, ISIN der acht ETFs aus src/data/halalEtfListe.ts und der vier weiteren unter der Renditetabelle (HSBC USA, Europe, EM Islamic Screened, Xtrackers Salam Sukuk), je mit Anbieter-Nachweis in src/data/halalAnlagen.ts (zertifikatLink); kaufbar laut ANLAGEN_KAUFBAR je Depot mit Quelle, {D}"
DEPOTZINS = f"{W}/src/data/brokerVergleich.ts, quellen.zinsfreiAbStart je Depot vom Anbieter: Traders Place https://tradersplace.de/konditionen/deine-konditionen „EUR-Verrechnungskonto Guthabenzinssatz 0% p.a.“; Scalable https://de.scalable.capital/zinsuebersicht „Verrechnungskonten 0 % p.a.“ ohne PRIME+, {D}"
VERGL = f"{W}/src/data/brokerVergleich.ts, Merkmal zinsfreiAbStart „Ohne Zinsen nutzbar“ je Depot mit Anbieter-Quelle (quellen.zinsfreiAbStart.url), dazu halalEtfsFonds je Depot; die Seite /vergleich/depot zeigt beides, {D}"
QURAN = f"https://quran.com/2/275, Sure 2, Vers 275 (Sahih International): „But Allah has permitted trade and has forbidden interest.“; „permitted“ steht für aḥalla, Wurzel von halal, {D}"
AUTOR = f"~/Desktop/0_ABLAGE/AgenticOS/AgenticOS/raw/2026-11-03-elias-seo35-tauRes-schule-sachkunde.md, Elias' eigene Angabe zu TauRes und Sachkunde; Satz beschreibt seine frühere Tätigkeit, kein Urteil über ein Produkt, {D}"
SBZ = f"https://www.smartbrokerplus.de/de-de/konditionen/, Konditionen Smartbroker+, Abschnitt „Zinskonto (Baader)“: „Guthabenzinsen* Zinssatz für Guthaben auf dem Zinskonto 2,25 % p.a. (variabel)“; unter „Wertpapierverwahrung und Kontoführung (Baader)“: „Kontoführung inklusive Währungskonten Kostenlos“ ohne Guthabenzins; Zinskonto-Seite: „auf das Guthaben auf einem separat zu eröffnendem Zinskonto“, abgerufen {D}; dazu Traders Place und Scalable wie bei den Depot-Zinsen: " + DEPOTZINS
INSTA = f"https://www.instagram.com/finanz.muslim/, Profil @finanz.muslim; Satz nennt das Thema des Kanals, kein Urteil über ein Produkt, {D}"

def frage(text):
    return f"{W}/src/pages/blog/HalalEtf.tsx, Überschrift oder Frage, keine Aussage; die Antwort im Text darunter trägt ihren eigenen Beleg in dieser Datei ({text}), {D}"

regeln = [
 (r"^\+ Eigenes Gremium mit Fatwa\.$|Platz 1 hat ein eigenes Gremium mit Fatwa|prüft ihn ein eigenes Gremium bei iShares|hat dieser Fonds ein eigenes Gremium, das Shari'ah Equity|prüft ihn dasselbe Gremium wie Platz 1|^\+ Gremium mit Fatwa wie Platz 1|Dasselbe Gremium bei iShares|vom selben Gremium bei iShares|^Es hat eine Fatwa erteilt und soll", None),
 (r"Sukuk Fund Panel|Sukuk-Gremium", SUK),
 (r"Invesco Dow|^\+ Eigenes Zertifikat für genau|Letztes Zertifikat gilt für 2023|Amanie Advisors hat ein Shariah-Zertifikat|Sein Shariah-Zertifikat kommt von Amanie", INV),
 (r"HSBC|Shariah-Ausschuss", HSBC),
 (r"Frisches Zertifikat für 2025|Shariah Supervisory Board von Amanie|unterschriebene Zertifikat|Sein Zertifikat ist frisch", SAT),
 (r"Methodik des Index hat MSCI|Das Zertifikat gilt für den Index, dem der Fonds folgt|Sein Zertifikat gilt für den Index, dem er folgt", M_INTRO),
 (r"Salam Sukuk", XTR),
 (r"sieben der acht|bei sieben prüft", SIEBEN),
 (r"Die Reihenfolge folgt islamischen Kriterien", SIEBEN),
 (r"^Zertifikat ansehen$|^GEPRÜFT VON$|^ZERTIFIKAT$", ACHT),
 (r"Shariah-Prüfung durchfällt|nach islamischen Regeln|geprüft nach islamischen Regeln|filtert nicht nach islamischen Regeln|Shariah-Prüfung bestehen|Ein Halal ETF lässt sie weg|Raus fliegt auch", None),
 (r"Auch geprüfte Firmen verdienen", M_FN4),
 (r"reinigen\?|Spende|spendet|unreinen", None),
 (r"Zinsen aufs Guthaben: 0", DEPOTZINS),
 (r"Auch beim Depot zählen die Zinsen|Viele Depots zahlen Zinsen|Zinsen aufs Guthaben zahlt|wie es mit Zinsen umgeht", VERGL),
 (r"Statt Zinsen bekommst du|islamische Gegenstück zu Anleihen", None),
 (r"Halal heißt erlaubt", QURAN),
 (r"TauRes", AUTOR),
 (r"Instagram", INSTA),
 (r"12 Halal ETFs", ZWOELF),
 (r"Halal ETFs dieser Liste: \d von 8", None),
 (r"\?$|^Beste Halal|^BESTE HALAL|^Die besten Halal|^Welcher Halal ETF zu dir passt|^Was ein Halal ETF ist|^Halal ETF oder Halal Fonds|^Depots für deinen|^8 Halal ETFs auf einen Blick|Halal ETF Liste im Vergleich|^Zur Datenbank|^Auf YouTube", "FRAGE"),
]


EXTRA = [
 (r"Islamic-Index von Dow Jones|Darum stecken teils andere Firmen drin", "INV.rsplit(', ',1)[0] + '; Fondsname „Invesco Dow Jones Islamic Global Developed Markets“ (Industrieländer), ' + D"),
 (r"Er folgt dem MSCI World Islamic Screened", "HSBC.rsplit(', ',1)[0] + '; Abschnitt Investment strategy: „made up of large and mid-cap companies … that comply with Shariah investment principles, as defined by the Index Provider“, ' + D"),
 (r"Smartbroker\+ zahlt|Zinsen nur auf eigenem Zinskonto", "SBZ"),
 (r"^\+ Eigenes Gremium mit Fatwa\.$", "EQ"),
 (r"Acht Halal ETFs im Vergleich", "ACHT"),
 (r"Halal Investment Guide", "f'{W}/src/pages/HalalGuide.tsx, Route /halal-guide, Name des kostenlosen Guides von finanzmuslim, keine Aussage über ein Produkt, {D}'"),
 (r"bekannteste Halal ETF", "EQ.rsplit(', ',1)[0] + '; dazu „bekanntest“: größter Fonds der Liste mit 1.577 Mio. € (src/data/halalAnlagen.ts groesse, justETF) und bei 27 Depots kaufbar (src/data/anlagenKaufbar.ts), ' + D"),
 (r"Im Video erkläre ich", "f'https://www.youtube.com/watch?v=uO0ZnlaFolw, Video von finanzmuslim, Ankündigung des Inhalts, kein Urteil im Satz; Urteile zu den acht ETFs wie bei „Beste Halal ETFs 2026“, {D}'"),
 (r"Andere Namen dafür sind islamische|So nennen sich ETFs mit Islamic", "f'{W}/src/data/halalEtfListe.ts, Namen der acht ETFs (iShares MSCI World Islamic, Invesco Dow Jones Islamic …); der Satz beschreibt Namen, nach ~/.claude/CLAUDE.md §5 ist „Islamic“ im Namen kein Halal-Urteil, {D}'"),
 (r"kein Nachhaltigkeitsfonds", "M_21.rsplit(', ',1)[0] + '; die Ausschlüsse folgen Sharia-Grundsätzen (Abschnitte 2.1 und 2.2), nicht ESG-Kriterien, ' + D"),
 (r"nicht sicher", "HSBC.rsplit(', ',1)[0] + '; Abschnitt Main risks: „The value of investible securities can change over time due to a wide variety of factors“, ' + D"),
 (r"folgt meist einem Index und wird an der Börse", "f'{W}/src/data/halalAnlagen.ts, Feld bauart „passiv“ bei sieben der acht ETFs der Liste (Ausnahme Saturna, „aktiv“), alle als UCITS ETF börsengehandelt, {D}'"),
 (r"Halal Fonds wird meist aktiv|aktiver Shariah-Fonds aus unserer Datenbank kostet 1,81", "f'{W}/src/data/halalAnlagen.ts, Franklin Shariah Technology Fund A (acc) USD, ISIN LU2458330086, kosten 1.81, kostenLabel „1,81 %“, Shariah-Nachweis zertifikatLink https://www.franklintempleton.ch/download/en-ch/ANNUAL-REPORT/b5b23ffc-daa4-49c1-9b03-8a28a3c4c53e/FTSF-annual-report-en-ch.pdf; Platz 1 kosten 0.3, {D}'"),
 (r"ob es ein Shariah-Zertifikat gibt und wie alt", "f'{W}/src/data/halalAnlagen.ts, Felder zertifikatArt, zertifikatLink, zertifikatHinweis je Anlage; Handlungsrat ohne Urteil über ein Produkt, {D}'"),
 (r"keine Fatwa und keine Anlageberatung", "f'{W}/src/pages/blog/HalalEtf.tsx, Rechtshinweis; der Satz verneint eine Fatwa, er urteilt nicht, {D}'"),
]

def beleg(s):
    for m_, b_ in EXTRA:
        if re.search(m_, s): return eval(b_)
    if re.search(r"Ein Halal ETF lässt sie weg|Raus fliegt auch", s): return M_22 if "Schulden" in s else M_21
    if re.search(r"Shariah-Prüfung durchfällt|Banken", s): return M_21
    if re.search(r"Statt Zinsen bekommst du|islamische Gegenstück zu Anleihen|Sukuk sind", s):
        return f"{PROS}, Verkaufsprospekt iShares II plc vom 21.09.2026, S. 2 Begriffe: „“Sukuk”, are investment certificates commercially similar to fixed income securities, that provide evidence of an“ Beteiligung an Vermögenswerten (Satz fortgesetzt im Prospekt), dazu S. 89 Fatwa des Sukuk Fund Panel und S. 124 Abschnitt „Impact of Shari’ah on Performance“: „the inability to invest in interest bearing securities“, {D}"
    if re.search(r"reinigen\?|Spende|spendet|unreinen", s): return PUR if re.search(r"iShares|Platz 1|Fonds selbst|der Fonds", s) else M_23
    if re.search(r"Halal ETFs dieser Liste: \d von 8", s): return f"{W}/src/data/halalEtfListe.ts, etfsBei() zählt aus src/data/anlagenKaufbar.ts je Depot die kaufbaren der acht ETFs, je Eintrag mit Quelle des Depots; Halal-Status der acht wie in dieser Datei unter „Beste Halal ETFs 2026“, {D}"
    for muster, b in regeln:
        if re.search(muster, s):
            if b is None:
                if re.search(r"Shari'ah Equity|iShares|Platz 1|Fatwa erteilt und soll", s): return EQ
                if re.search(r"islamischen Regeln|Shariah-Prüfung", s): return M_21
                continue
            if b == "FRAGE": return frage("Halal-Status der acht ETFs wie bei „Beste Halal ETFs 2026“: " + ACHT.split(", ",1)[1][:0] + "Nachweise aus halalAnlagen.ts")
            return b
    return None

saetze = [l.rstrip("\n").split("\t",1) for l in open(f"{S}/saetze3.txt",encoding="utf8")]
zeilen, offen = [], []
for k, s in saetze:
    b = beleg(s)
    if b is None: offen.append((k,s))
    else: zeilen.append(f"{k}: Beleg: {b}")
print("ohne Regel:", len(offen))
for k,s in offen: print(k, s[:160])
kopf = """# Belege zu /blog/halal-etf (SEO45, 03.11.2026; nachgezogen SEO46 nach Halal-Prüfer r1, 04.11.2026)

Begleitdatei nach `fundament/grundlage/HALAL_PRUEFZEILE.md` (Vault), Abschnitt Belegform. Text: `halal-etf-seo45-entwurf.txt` (innerText der gebauten Seite bei 390 px mit allen Klappzeilen offen, vite preview Port 4179, dazu Titel und Meta). Eine Zeile je Kennung. Originale am 03.11.2026 selbst geladen und gelesen: Verkaufsprospekt iShares II plc vom 21.09.2026, MSCI Islamic Index Series Methodology Dezember 2025, Invesco-Zertifikat FYE 2023, HSBC-Factsheet 30.09.2026.

Vor den Belegen im Text richtiggestellt (SEO45): iShares-Gremien „hat eine Fatwa erteilt und soll jedes Jahr ein Zertifikat ausstellen“ statt „stellt jedes Jahr ein Zertifikat aus“ (Prospekt: „will issue“); „Platz 1 hat ein eigenes Zertifikat“ und „sechs mit eigenem Zertifikat“ ersetzt (ein ausgestelltes iShares-Zertifikat liegt nicht vor); „seit 2026“ bei der Reinigung gestrichen (kein Datum im Prospekt); HSBC „gibt den unreinen Anteil selbst als Spende weiter“ gestrichen (kein Satz von HSBC dazu), dafür Shariah-Ausschuss am Fonds laut Factsheet; „Zertifikat nur für den Index“ bei HSBC und Invesco ACWI aus „Dagegen“ gestrichen; Invesco „Ein neueres haben wir nicht gefunden“ gestrichen; FAQ zur Reinigung ohne „AAOIFI-Standard“, mit MSCI 2.3 und Prospekt; Linktext je Quelle („Verkaufsprospekt ansehen“, „Methodik ansehen“, „Factsheet ansehen“).

Nach dem frischen Halal-Prüfer r1 (SEO46, `fundament/grundlage/playbooks/finanzmuslim/pruefung/halal-blog-halal-etf-seo45.md`): Invesco- und HSBC-Satz auf den Beleg des eigenen Fonds; FAQ Reinigung „Bei den anderen gibst du ihn selbst weiter“ ersetzt durch einen Rat ohne Aussage über die vier Fonds; „Auch dein Depot muss zinsfrei sein“ und „sollte dir keine Zinsen zahlen“ ohne Pflicht gefasst; Smartbroker+ ohne „0 %“ (nur Zinskonto laut Anbieter); Saturna „hat für 2025 geprüft“ statt „prüft jedes Jahr“.

"""
fuss = f"""

Ohne Wort der Liste, trotzdem belegt (SEO45, 03.11.2026):
- „Ja, den kleinen unreinen Anteil gibst du als Spende weiter, wenn der Fonds es nicht selbst tut.“ Beleg: {M_23}
- „Bei den vier iShares-ETFs dieser Liste spendet ihn laut Verkaufsprospekt der Fonds.“ Beleg: {PUR}
- „Bei den anderen sieh im Verkaufsprospekt nach, ob der Fonds spendet. Wenn nicht, gibst du den Anteil selbst weiter.“ Beleg: Handlungsrat ohne Aussage über einen Fonds (für HSBC, Invesco Dow Jones, Invesco MSCI ACWI und Saturna liegt vom Anbieter nichts zur Spende vor); die Pflicht selbst: {M_23}
- „Diesen Anteil deiner Erträge gibst du weiter, bei den vier iShares-ETFs dieser Liste macht das laut Verkaufsprospekt schon der Fonds für dich.“ Beleg: {PUR}
- JSON-LD Organization „Bildung für islamkonformes (halal) Investieren: Guides, Rechner und Kriterien-Checks für Muslime in Deutschland.“ Beleg: {W}/src/pages/blog/HalalEtf.tsx (JSON-LD Organization), beschreibt finanzmuslim selbst, kein Urteil über ein Produkt, {D}
- „Banken und Versicherungen fliegen raus.“ und „Ein normaler ETF wie der MSCI World kauft sie mit.“ Beleg: {M_21}
- „Ein kleiner Rest wird gespendet.“ Beleg: {M_23}
- „Traders Place und Scalable zahlen 0 %, Smartbroker+ zahlt Zinsen nur auf ein eigenes Zinskonto.“ Beleg: {SBZ}
"""
open(ziel,"w",encoding="utf8").write(kopf + "\n".join(zeilen) + fuss)
