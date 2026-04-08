# 04 Audio doprovod a zvukové efekty

## Web Audio API
Audio složka hry nevyužívá audio soubory, ale je syntetizována přímo přes Web Audio API. To extrémně snižuje datovou náročnost projektu.
- **Ambientní šum:** Nízký, kolísavý tón vytvářející pocit napětí.
- **Interakční zvuky:** Skok má specifický "flap" zvuk, průlet mezerou vysoké pípnutí a náraz drsný klesající tón.

## Mute systém
Uživatel má plnou kontrolu nad zvukem pomocí tlačítka Mute, které je ošetřeno metodou `.blur()`, aby mezerník nechtěně nepřepínal zvuk během skákání.

---
[🏠 Zpět na hlavní menu](README.md)
