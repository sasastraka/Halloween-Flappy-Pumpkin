# 02 Game Design a herní mechaniky

## Fyzikální model
Jádrem hratelnosti je simulace gravitace. Postava dýně má definovanou vertikální rychlost, na kterou neustále působí gravitační konstanta. Hráč svým zásahem udělí dýni negativní vertikální impulz, čímž dýně "vzletí".

## Detekce kolizí
Kolizní systém pracuje na principu AABB (Axis-Aligned Bounding Box). V každém snímku hra porovnává souřadnice dýně se souřadnicemi aktuálně zobrazených náhrobků. Pokud dojde k překryv, vyvolá se stav "Game Over".

## Dynamická obtížnost
Aby hra nebyla po čase nudná, implementoval jsem algoritmus pro zvyšování obtížnosti:
- **Zmenšování mezer:** Počáteční mezera se postupně snižuje ze 280px na 170px.
- **Zrychlování:** Rychlost posunu náhrobků se lineárně zvyšuje v závislosti na dosažených bodech.

---
[🏠 Zpět na hlavní menu](README.md)
