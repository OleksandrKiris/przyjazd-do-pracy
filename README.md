# Przyjazd do pracy

Strona informacyjna dla kandydatów przyjeżdżających do pracy w Polsce.

## Kontrola jakości

`npm test` sprawdza dane, macierz języków/lokalizacji i 12 testów walidatora publikacji bez połączeń sieciowych.
`npm run quality:public` sprawdza publiczną stronę: znacznik wersji HTML i nazwę cache porównuje z aktualnie sprawdzanym lokalnym źródłem, a nie ze stałą historyczną wersją.
Uruchamiaj kontrolę publiczną z rewizji, której publikację sprawdzasz; rozbieżność podczas wdrażania jest prawidłowo zgłaszana jako błąd.

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
| `lang` | język strony | `pl`, `uk`, `ru`, `en`, `az`, `es`, `fil`, `id`, `ne` |
| `location` | lokalizacja docelowa | `siechnice`, `ryczywol`, `bogatynia`, `zgorzelec` |
| `name` | imię kandydata | `Ivan` |
| `surname` | nazwisko kandydata | `Petrenko` |
| `date` | data przyjazdu | `2026-07-20` |
| `department` | dział pracy | `production`, `warehouse`, `greenhouse` |
| `country` | poprzedni sposób domyślnego wyboru listy rzeczy | `ukraine`, `poland`, `georgia`, `azerbaijan` |
| `pack` | jawny wybór listy rzeczy; ma pierwszeństwo przed `country` | `choose`, `ukraine`, `poland`, `caucasus`, `other` |
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
- `az` - azerski
- `es` - hiszpański
- `fil` - filipiński
- `id` - indonezyjski
- `ne` - nepalski

Starsze parametry `lang=ka` i `lang=hy` otwierają angielską wersję z widoczną informacją o zmianie języka. Nie są pełnymi wersjami gruzińską ani ormiańską.

## Lista rzeczy i postęp pakowania

Wybierz listę w sekcji rzeczy do zabrania. Licznik nad nią pokazuje liczbę zaznaczonych rzeczy i liczbę wszystkich pozycji; zaznaczenia każdej listy są oddzielne. Warianty „Wybierz wariant” i „Inny / nie wiem” nie pokazują wymyślonej listy ani licznika.

Licznik opisuje bieżące zaznaczenia. Gdy przeglądarka nie pozwala zapisać danych, nadal działa w tej sesji, a dotychczasowy komunikat wyjaśnia brak zapisu. Po pierwszym poprawnym pobraniu strony lista i licznik działają także bez sieci; mapy, połączenia i zewnętrzne serwisy wymagają połączenia. Nic nie jest wysyłane przez zaznaczanie rzeczy.

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
