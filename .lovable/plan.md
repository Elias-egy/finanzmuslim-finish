## Änderungen nur in `src/pages/Index.tsx`

1. **Investmentstart-Kachel** (neben Tools/Blog) bekommt das aktuelle „Über Elias"-Bild:
   - `portalTiles.investmentstart.image` von `investmentstart-graph.jpg` auf `guide-elias-vortrag.webp` umstellen.

2. **„Über Elias"-Sektion** bekommt dasselbe Portrait wie „Von Elias, Gründer von Amanah" auf `/halal-guide`:
   - Neuen Import `story-elias-paneele.jpg` ergänzen und im `<img>` der Über-Elias-Sektion einsetzen (ersetzt `guide-elias-vortrag.webp` dort).

3. Nicht mehr genutzten Import `investmentstart-graph.jpg` entfernen, sofern er nirgends sonst verwendet wird (kurz per grep prüfen).

## Bewusst nicht angefasst
- `/dein-investmentstart` selbst, `/halal-guide`, Alt-Texte-Bedeutung, Layout/Klassen, Assets bleiben unverändert (keine neuen Bilder, nur Referenz-Tausch).