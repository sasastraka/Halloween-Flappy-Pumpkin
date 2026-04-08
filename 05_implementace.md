# 05 Technická implementace

## Herní smyčka
Základem je funkce `loop`, která využívá `window.requestAnimationFrame()`. To zajišťuje plynulý pohyb synchronizovaný s obnovovací frekvencí monitoru (typicky 60 FPS).

## Správa stavu
Hra se nachází v jednom ze tří stavů: Active (hra běží), Paused (hra je zastavena klávesou ESC) a GameOver (čekání na restart).

## Local Storage
Pro ukládání nejlepšího výsledku jsem využil `window.localStorage`. Rekord zůstane uložen v prohlížeči i po zavření okna nebo restartu PC.

---
[🏠 Zpět na hlavní menu](README.md)
