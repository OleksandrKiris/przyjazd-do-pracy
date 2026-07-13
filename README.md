# Przyjazd do pracy

Strona informacyjna dla kandydatów przyjeżdżających do pracy w Polsce.

## Link do wysyłania kandydatom

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/
```

To jest główny i jedyny link projektu. Kandydat widzi instrukcję dojazdu, język, lokalizację, adres, kontakty i najważniejsze informacje przed przyjazdem.

## Link z wybraną lokalizacją i językiem

Link można przygotować ręcznie przez parametry URL.

Przykład dla kandydata po ukraińsku, lokalizacja Ryczywół:

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/?lang=uk&location=ryczywol
```

Przykład z datą i imieniem:

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/?lang=uk&location=ryczywol&name=Ivan&surname=Petrenko&date=2026-07-20
```

## Parametry linku

| Parametr | Znaczenie | Przykład |
| --- | --- | --- |
| `lang` | język strony | `pl`, `uk`, `ru`, `en`, `ka`, `az` |
| `location` | lokalizacja docelowa | `siechnice`, `ryczywol`, `bogatynia`, `zgorzelec` |
| `name` | imię kandydata | `Ivan` |
| `surname` | nazwisko kandydata | `Petrenko` |
| `date` | data przyjazdu | `2026-07-20` |
| `department` | dział pracy | `production`, `warehouse`, `greenhouse` |
| `country` | skąd jedzie kandydat | `ukraine`, `poland`, `caucasus` |
| `hotel` | pokazuje informację o zakwaterowaniu | `yes` |

## Lokalizacje

- `siechnice` - Siechnice
- `ryczywol` - Ryczywół
- `bogatynia` - Bogatynia
- `zgorzelec` - Zgorzelec

## Języki

- `pl` - polski
- `uk` - ukraiński
- `ru` - rosyjski
- `en` - angielski
- `ka` - gruziński
- `az` - azerski

## Co widzi kandydat

- wybór języka,
- wybór lokalizacji,
- adres docelowy,
- instrukcję dojazdu,
- rzeczy do zabrania,
- kontakty bez wewnętrznych opisów rekrutacyjnych,
- przyciski Google Maps, telefon i WhatsApp.

## Pliki projektu

- `index.html` - strona dla kandydata.
- `app.js` - logika strony.
- `data/config.js` - dane lokalizacji, teksty i tłumaczenia.
- `styles.css` - wygląd strony.
- `sw.js` - cache/PWA.

## Ważne

Projekt nie ma panelu admina ani generatora linków. Wszystkie linki dla kandydatów prowadzą do głównej strony:

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/
```
