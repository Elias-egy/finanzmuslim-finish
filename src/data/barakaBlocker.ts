export type Blocker = {
  nr: number;
  titel: string;
  text: string;
  stattdessen: string;
  quelle: string;
  umstritten?: boolean;
};

export const blocker: Blocker[] = [
  {
    nr: 1,
    titel: "Zins, in jeder Richtung",
    text: "Nicht nur genommen, auch gegeben, verbucht und bezeugt. Der Vers sagt, dass Allah den Zins zunichte macht und die Almosen wachsen lässt, also genau die Bewegung, um die es bei Baraka geht.",
    stattdessen: "Guthabenzins beim Broker und bei der Bank abschalten, Dispo kündigen statt nur nicht nutzen, bestehende Zinserträge nicht behalten.",
    quelle: "Quran 2:276 und 2:278 bis 279. Zur Beteiligung: Muslim 1598, überliefert von Jābir.",
  },
  {
    nr: 2,
    titel: "Die abgerissene Verwandtschaft",
    text: "Wer die Verwandtschaftsbande pflegt, dem wird die Versorgung erweitert und die Lebenszeit verlängert, heißt es in der Überlieferung. Das ist eine der wenigen Stellen, an denen Rizq direkt an ein Verhalten geknüpft wird.",
    stattdessen: "Der Hadith spricht von denen, die dich abgeschnitten haben. Der erste Anruf ist der, den du nicht schuldest.",
    quelle: "Buchari 5986, überliefert von Anas.",
  },
  {
    nr: 3,
    titel: "Verschwendung",
    text: "Die Verschwender werden im Quran als Brüder der Satane bezeichnet. Gemeint ist nicht Sparsamkeit als Tugend, sondern das Zerstreuen von etwas, das dir anvertraut wurde.",
    stattdessen: "Einen Monat lang jede Ausgabe notieren, ohne etwas zu ändern. Die meisten finden den Posten selbst, bevor jemand ihn nennt.",
    quelle: "Quran 17:26 bis 27. Zum Maßhalten: Quran 25:67.",
  },
  {
    nr: 4,
    titel: "Unterlassene Zakat",
    text: "Zakat ist keine Spende, sondern ein Anteil, der anderen bereits gehört. Wer ihn zurückhält, behält fremdes Eigentum im eigenen Vermögen.",
    stattdessen: "Einen festen Stichtag im Jahr setzen, den Hawl-Tag, und ihn jedes Jahr gleich lassen. Der häufigste Fehler ist nicht Verweigerung, sondern Vergessen.",
    quelle: "Quran 9:34 bis 35. Zur Berechnung: Buchari 1454.",
  },
  {
    nr: 5,
    titel: "Unehrlichkeit im Handel",
    text: "Wenn Käufer und Verkäufer wahrhaftig sind und offenlegen, wird ihr Geschäft gesegnet. Verschweigen sie und lügen, wird der Segen ihres Geschäfts ausgelöscht. Der Hadith nennt beide Richtungen im selben Satz.",
    stattdessen: "Den Mangel nennen, bevor gefragt wird. Das gilt für den Gebrauchtwagen genauso wie für die eigene Dienstleistung.",
    quelle: "Buchari 2079, Muslim 1532, überliefert von Ḥakīm ibn Ḥizām.",
  },
  {
    nr: 6,
    titel: "Der zu früh verschlafene Morgen",
    text: "Der Prophet ﷺ bat um Segen für seine Gemeinschaft in ihren frühen Stunden. Der Überlieferung nach schickte er Handelszüge am frühen Morgen los.",
    stattdessen: "Nicht früher aufstehen, sondern nach dem Fajr wach bleiben. Das ist der Teil, um den es in der Überlieferung geht.",
    quelle: "Abū Dāwūd 2606, Tirmidhi 1212, überliefert von Ṣakhr al-Ghāmidī.",
  },
  {
    nr: 7,
    titel: "Der falsche Eid im Geschäft",
    text: "Ein Schwur macht die Ware gangbar und den Gewinn zunichte, heißt es. Gemeint ist der beiläufige Schwur, der ein Geschäft schneller schließen soll.",
    stattdessen: "Preis und Zustand nennen und stehen lassen. Wer schwören muss, verkauft etwas, das für sich allein nicht trägt.",
    quelle: "Buchari 2087, Muslim 1606, überliefert von Abū Hurayra.",
  },
  {
    nr: 8,
    titel: "Gharar, die verkaufte Ungewissheit",
    text: "Verträge, bei denen Leistung oder Gegenleistung im Ungewissen bleiben, sind untersagt. Darunter fallen nach verbreiteter Auffassung CFDs, Hebelprodukte und Wetten auf Kursrichtungen.",
    stattdessen: "Anteile kaufen, die dir wirklich gehören. Kein Hebel, kein Leerverkauf, kein Produkt, dessen Auszahlung du nicht erklären kannst.",
    quelle: "Muslim 1513, überliefert von Abū Hurayra. Umstritten: Wo genau zulässige Unsicherheit endet und Gharar beginnt, wird unterschiedlich beurteilt, besonders bei Versicherungen und Termingeschäften.",
    umstritten: true,
  },
  {
    nr: 9,
    titel: "Der zurückgehaltene Lohn",
    text: "Gib dem Arbeiter seinen Lohn, bevor sein Schweiß trocknet. In einer weiteren Überlieferung nennt Allah drei Menschen, gegen die Er am Tag der Auferstehung auftritt, darunter der, der einen Arbeiter voll arbeiten lässt und ihm den Lohn vorenthält.",
    stattdessen: "Auch die kleine Rechnung sofort begleichen. Der Punkt gilt für Auftraggeber genauso wie für Arbeitgeber.",
    quelle: "Ibn Māja 2443, überliefert von ʿAbdullāh ibn ʿUmar; Buchari 2227. Umstritten: Ob eine vertraglich vereinbarte Zahlungsfrist darunter fällt, wird unterschiedlich beurteilt.",
    umstritten: true,
  },
  {
    nr: 10,
    titel: "Undank für das Vorhandene",
    text: "Wenn ihr dankbar seid, werde Ich euch gewiss mehr geben. Der Vers stellt Dankbarkeit vor die Mehrung, nicht danach.",
    stattdessen: "Auf den schauen, der weniger hat, nicht auf den, der mehr hat. Genau das rät der Hadith bei Muslim 2963.",
    quelle: "Quran 14:7.",
  },
];
