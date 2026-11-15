/**
 * „Besondere Eigenschaften“ je Girokonto aus dem Finanzfluss-Vergleich (abgerufen 19.09.2026, Zeile
 * „Besondere Eigenschaften“, ~/rebrand/data/finanzfluss/girokonto_2026-09-19.json). Schlüssel ist der Produktname
 * bei Finanzfluss (`finanzfluss.produkt`). Aufgenommen ist, was dort als Vorteil steht; Hinweise auf Nachteile
 * (keine Einlagensicherung, IBAN-Verlust, Kontowechsel kostet) stehen hier bewusst nicht. Wörtlich, nur die
 * Schreibweise von Zahl und Zeichen („15 €“). Handgepflegt, wird nicht erzeugt.
 */
export const BESONDERS_JE_PRODUKT: Record<string, string[]> = {
  "Norisbank Top-Girokonto": ["24/7 erreichbar"],
  "C24 Smart": ["0,05 % Cashback"],
  "BBVA Girokonto": ["3,75 % Cashback (max. 15 € p.M., gilt in den ersten 6 Monaten)"],
  "Trade Republic": ["1 % Cashback (max. 15 € p.M.)", "24/7 erreichbar"],
  "Revolut Standard": ["beliebig viele Unterkonten", "Währungskonten in über 30 verschiedenen Währungen"],
  "C24 Plus": ["0,5 % Cashback (max. 12 € p.M.)"],
  "C24 Max": ["1 % Cashback (max. 24 € p.M.)"],
  "Comdirect Girokonto Aktiv": ["5 % Cashback (bis 50 €/Monat) auf Visa Debit Kartenumsatz. Aktion 3 Monate lang"],
  "Tomorrow Plus": ["Girokonto bei einer nachhaltigen Bank", "Auslandsreise-, Kranken-, Notfall-, Ticket-, Reiserücktritt-, Gepäck- & Handydiebstahl-Versicherung"],
  "Tomorrow Now": ["Girokonto bei einer nachhaltigen Bank", "Pay-What-You-Want-Funktion"],
  "Tomorrow Change": ["Girokonto bei einer nachhaltigen Bank", "Auslandsreise-, Kranken-, Notfall- & Ticketversicherung"],
  "Revolut Plus": ["beliebig viele Unterkonten", "Währungskonten in über 30 verschiedenen Währungen"],
  "Revolut Premium": ["beliebig viele Unterkonten", "Währungskonten in über 30 verschiedenen Währungen"],
  "Revolut Metal": ["beliebig viele Unterkonten", "Währungskonten in über 30 verschiedenen Währungen"],
  "Ethikbank Girokonto": ["Girokonto bei einer nachhaltigen Bank"],
  "Revolut Ultra": ["beliebig viele Unterkonten", "Währungskonten in über 30 verschiedenen Währungen"],
  "GLS Konto": ["Girokonto bei einer nachhaltigen Bank"],
  "UmweltGiro": ["Nachhaltige Bank"],
};
