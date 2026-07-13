# Przyjazd do pracy

Strona informacyjna dla kandydatów przyjeżdżających do pracy w Polsce.

## Najważniejsze linki

**Link dla kandydata:**

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/
```

Ten link można wysyłać kandydatom. Kandydat widzi tylko instrukcję dojazdu, język, lokalizację, kontakty i potrzebne informacje.

**Generator linków:**

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/generator.html
```

Ten link jest tylko do użytku wewnętrznego. Nie wysyłać kandydatom.

## Jak przygotować link dla kandydata

1. Otwórz `generator.html`.
2. Wybierz język kandydata.
3. Wybierz lokalizację pracy.
4. Wpisz imię, nazwisko i datę przyjazdu, jeśli są potrzebne.
5. Wybierz dział i kraj, z którego kandydat jedzie.
6. Zaznacz zakwaterowanie, jeśli kandydat ma je mieć pokazane.
7. Kliknij `Kopiuj link`.
8. Wyślij kandydatowi tylko wygenerowany link.

## Przykład linku dla kandydata

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/?lang=uk&location=ryczywol&name=Ivan&surname=Petrenko&date=2026-07-20&department=greenhouse&country=ukraine&hotel=yes
```

## Obsługiwane parametry linku

| Parametr | Znaczenie | Przykład |
| --- | --- | --- |
| `lang` | język strony | `pl`, `uk`, `ru`, `en`, `ka`, `az` |
| `location` | lokalizacja docelowa | `siechnice`, `ryczywol`, `bogatynia`, `zgorzelec` |
| `name` | imię kandydata | `Ivan` |
| `surname` | nazwisko kandydata | `Petrenko` |
| `date` | data przyjazdu | `2026-07-20` |
| `department` | dział pracy | `production`, `warehouse`, `greenhouse` |
| `country` | skąd jedzie kandydat | `ukraine`, `poland`, `caucasus` |
| `hotel` | informacja o zakwaterowaniu | `yes` |

## Lokalizacje

- `siechnice` - Siechnice
- `ryczywol` - Ryczywół
- `bogatynia` - Bogatynia
- `zgorzelec` - Zgorzelec

## Co widzi kandydat

- wybór języka,
- wybór lokalizacji,
- adres docelowy,
- instrukcję dojazdu,
- rzeczy do zabrania,
- kontakty bez wewnętrznych opisów typu rekrutacja/koordynacja,
- przyciski Google Maps, telefon i WhatsApp.

## Czego nie wysyłać kandydatowi

Nie wysyłać:

```text
https://oleksandrkiris.github.io/przyjazd-do-pracy/generator.html
```

To jest narzędzie wewnętrzne do tworzenia linków.

## Pliki projektu

- `index.html` - czysta strona dla kandydata.
- `generator.html` - wewnętrzny generator linków.
- `app.js` - logika strony kandydata.
- `share.js` - logika generatora linków.
- `data/config.js` - dane lokalizacji, teksty i tłumaczenia.
- `styles.css` - główny wygląd strony.
- `share.css` - wygląd generatora.
- `sw.js` - cache/PWA.

## Ważne

Strona kandydata i generator są rozdzielone. Kandydat powinien dostawać wyłącznie link wygenerowany w `generator.html`, który prowadzi do głównej strony `index.html`.
