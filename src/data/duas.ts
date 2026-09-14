export type Dua = {
  nr: string;
  when: string;
  ar: string;
  tr: string;
  de: string;
  quelle: string;
  kurz?: boolean;
};

export const duas: Dua[] = [
  {
    nr: "01 · Das Gute in beiden Häusern",
    when: "Das häufigste Bittgebet des Propheten ﷺ",
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    tr: "Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ʿadhāban-nār",
    de: "Unser Herr, gib uns im Diesseits Gutes und im Jenseits Gutes, und bewahre uns vor der Strafe des Feuers.",
    quelle: "Quran 2:201. Anas berichtet, dies sei das Bittgebet gewesen, das der Prophet ﷺ am häufigsten sprach (Buchari 6389, Muslim 2690).",
  },
  {
    nr: "02 · Das Bittgebet des Musa",
    when: "Gesprochen ohne Obdach und ohne Einkommen",
    ar: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    tr: "Rabbi innī limā anzalta ilayya min khayrin faqīr",
    de: "Mein Herr, ich bin dessen bedürftig, was Du an Gutem zu mir herabsendest.",
    quelle: "Quran 28:24. Musa spricht es, nachdem er aus Ägypten geflohen war und im Schatten saß, ohne Arbeit und ohne Bleibe. Kurz darauf bekommt er beides.",
  },
  {
    nr: "03 · Der Herr aller Herrschaft",
    when: "Wenn Versorgung nach fremder Entscheidung aussieht",
    ar: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ وَتُعِزُّ مَن تَشَاءُ وَتُذِلُّ مَن تَشَاءُ بِيَدِكَ الْخَيْرُ إِنَّكَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    tr: "Qulillāhumma mālikal-mulki tu'til-mulka man tashā'u wa tanziʿul-mulka mimman tashā'u wa tuʿizzu man tashā'u wa tudhillu man tashā'u biyadikal-khayr, innaka ʿalā kulli shay'in qadīr",
    de: "Sag: O Allah, Herr der Herrschaft, Du gibst die Herrschaft, wem Du willst, und nimmst die Herrschaft, wem Du willst. Du ehrst, wen Du willst, und erniedrigst, wen Du willst. In Deiner Hand ist das Gute. Gewiss, Du hast zu allem die Macht.",
    quelle: "Quran 3:26. Der Vers nennt ausdrücklich, dass Geben und Nehmen bei Ihm liegen, nicht beim Arbeitgeber, beim Markt oder beim Amt.",
  },
  {
    nr: "04 · Der Beste der Versorger",
    when: "Beim Bitten um Auskommen für eine Familie",
    ar: "رَبَّنَا أَنزِلْ عَلَيْنَا مَائِدَةً مِّنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِّأَوَّلِنَا وَآخِرِنَا وَآيَةً مِّنكَ وَارْزُقْنَا وَأَنتَ خَيْرُ الرَّازِقِينَ",
    tr: "Rabbanā anzil ʿalaynā mā'idatan minas-samā'i takūnu lanā ʿīdan li-awwalinā wa ākhirinā wa āyatan minka warzuqnā wa anta khayrur-rāziqīn",
    de: "Unser Herr, sende uns einen Tisch vom Himmel herab, der für uns ein Fest sei, für den Ersten von uns und den Letzten, und ein Zeichen von Dir. Und versorge uns, denn Du bist der Beste der Versorger.",
    quelle: "Quran 5:114, das Bittgebet des ʿĪsā. Der Schluss wa anta khayrur-rāziqīn wird häufig einzeln als Rizq-Bitte gesprochen.",
  },
  {
    nr: "05 · Istighfar als Tür",
    when: "Fortlaufend, nicht nur nach einer Sünde",
    ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    tr: "Astaghfirullāha wa atūbu ilayh",
    de: "Ich bitte Allah um Vergebung und wende mich Ihm reuig zu.",
    quelle: "Die Verbindung zwischen Istighfar und Versorgung steht in Quran 71:10 bis 12: Nuh ruft sein Volk zur Vergebungsbitte und nennt als Folge Regen, Vermögen, Kinder, Gärten und Flüsse. Der Wortlaut oben ist die verbreitete Kurzform.",
    kurz: true,
  },
  {
    nr: "06 · Genügsamkeit statt Rechnerei",
    when: "Wenn eine Tür zugeht",
    ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    tr: "Ḥasbunallāhu wa niʿmal-wakīl",
    de: "Allah genügt uns, und wie trefflich ist Er als Sachwalter.",
    quelle: "Quran 3:173. Im unmittelbar folgenden Vers heißt es, sie seien mit Gunst und Huld zurückgekehrt, ohne dass sie Übel berührt hätte.",
    kurz: true,
  },
  {
    nr: "07 · Das Dua für Unabhängigkeit",
    when: "Das zentrale Rizq-Bittgebet",
    ar: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    tr: "Allāhummakfinī bi-ḥalālika ʿan ḥarāmik, wa aghninī bi-faḍlika ʿamman siwāk",
    de: "O Allah, lass mir Dein Erlaubtes genügen, sodass ich Dein Verbotenes nicht brauche, und mache mich durch Deine Huld unabhängig von allen außer Dir.",
    quelle: "Tirmidhi 3563, überliefert von ʿAlī. Das Bittgebet erbittet ausdrücklich nicht mehr, sondern genug aus erlaubter Quelle. Für einen Muslim, der halal investieren will, ist es das passendste der ganzen Sammlung.",
  },
  {
    nr: "08 · Nach dem Fajr-Gebet",
    when: "Morgens, nach dem Salam",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    tr: "Allāhumma innī as'aluka ʿilman nāfiʿan wa rizqan ṭayyiban wa ʿamalan mutaqabbalā",
    de: "O Allah, ich bitte Dich um nützliches Wissen, gute und reine Versorgung und um Taten, die angenommen werden.",
    quelle: "Ibn Māja 925, überliefert von Umm Salama, gesprochen nach dem Fajr-Gebet. Beachte die Reihenfolge: erst Wissen, dann Versorgung, dann Handeln.",
  },
  {
    nr: "09 · Gegen Sorge und Schulden",
    when: "Wenn Schulden drücken",
    ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    tr: "Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan, wal-ʿajzi wal-kasal, wal-bukhli wal-jubn, wa ḍalaʿid-dayni wa ghalabatir-rijāl",
    de: "O Allah, ich suche Zuflucht bei Dir vor Sorge und Trauer, vor Unvermögen und Trägheit, vor Geiz und Feigheit, vor der Last der Schulden und davor, von Menschen überwältigt zu werden.",
    quelle: "Buchari 2893, überliefert von Anas. Sorge, Trägheit und Geiz stehen hier in einer Reihe mit Schulden. Die Überlieferung behandelt sie als verwandte Lasten.",
  },
  {
    nr: "10 · Beim Betreten des Marktes",
    when: "Vor einem Geschäft, einem Kauf, einem Verkauf",
    ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    tr: "Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, yuḥyī wa yumīt, wa huwa ḥayyun lā yamūt, biyadihil-khayr, wa huwa ʿalā kulli shay'in qadīr",
    de: "Es gibt keinen Gott außer Allah, allein, ohne Teilhaber. Ihm gehört die Herrschaft und Ihm gebührt das Lob. Er macht lebendig und lässt sterben, und Er ist der Lebendige, der nicht stirbt. In Seiner Hand ist das Gute, und Er hat zu allem die Macht.",
    quelle: "Tirmidhi 3428, überliefert von ʿUmar. Ausdrücklich für den Ort des Handels überliefert, an dem die meisten Menschen am wenigsten an Allah denken.",
  },
  {
    nr: "11 · Wenn eigene Kraft nicht reicht",
    when: "Bei einer Aufgabe, die zu groß wirkt",
    ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    tr: "Lā ḥawla wa lā quwwata illā billāh",
    de: "Es gibt keine Macht und keine Kraft außer durch Allah.",
    quelle: "Buchari 6384, Muslim 2704. Im Hadith als Schatz aus den Schätzen des Paradieses bezeichnet.",
    kurz: true,
  },
  {
    nr: "12 · Um Zufriedenheit mit dem Zugeteilten",
    when: "Wenn der Vergleich mit anderen nagt",
    ar: "اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ",
    tr: "Allāhumma qanniʿnī bimā razaqtanī wa bārik lī fīh",
    de: "O Allah, mache mich zufrieden mit dem, womit Du mich versorgt hast, und segne es für mich.",
    quelle: "Teil einer längeren Überlieferung bei Ḥākim, Mustadrak 1876. Der Gedanke der Zufriedenheit mit dem Zugeteilten steht auch in Muslim 1054.",
    kurz: true,
  },
  {
    nr: "13 · Am Morgen und am Abend",
    when: "Je einmal nach Fajr und nach Maghrib",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    tr: "Allāhumma innī as'alukal-ʿāfiyata fid-dunyā wal-ākhira",
    de: "O Allah, ich bitte Dich um Wohlergehen im Diesseits und im Jenseits.",
    quelle: "Teil des Morgen- und Abendbittgebets bei Abū Dāwūd 5074 und Ibn Māja 3871. ʿĀfiya umfasst Gesundheit, Sicherheit und Auskommen zugleich.",
    kurz: true,
  },
  {
    nr: "14 · Wenn du nicht weißt, ob es gut für dich ist",
    when: "Vor einer Entscheidung, auch einer finanziellen",
    ar: "اللَّهُمَّ خِرْ لِي وَاخْتَرْ لِي",
    tr: "Allāhumma khir lī wakhtar lī",
    de: "O Allah, wähle für mich das Gute und triff die Wahl für mich.",
    quelle: "Tirmidhi 3516. Die ausführliche Form ist das Istikhāra-Gebet, überliefert bei Buchari 1166, mit zwei Rakʿa vor dem Bittgebet.",
    kurz: true,
  },
];
