# Przyjazd do pracy

Modul informacyjny dla pracownikow przyjezdzajacych do pracy w Polsce.

## Funkcje

- wybor jezyka: polski, ukrainski, rosyjski, angielski, gruzinski, azerski
- zapamietywanie wybranego jezyka
- instrukcje dla lokalizacji: Siechnice, Ryczywol, Bogatynia, Zgorzelec
- link personalizowany przez parametry URL
- centralna konfiguracja danych i tlumaczen
- panel admina dzialajacy w przegladarce przez `localStorage`
- kopiowanie linku, QR, druk do PDF, PWA/offline
- akcje: Google Maps, kopiuj adres, zadzwon, WhatsApp

## Uruchomienie

Otworz `index.html` w przegladarce albo opublikuj katalog przez GitHub Pages.

Parametry linku:

```text
?name=Ivan&surname=Petrenko&date=2026-08-01&location=siechnice&lang=uk&department=production&hotel=yes&country=ukraine
```

## Publikacja na GitHub Pages

1. Utworz nowe repozytorium na GitHub.
2. Wgraj wszystkie pliki z tego katalogu.
3. W ustawieniach repo wlacz GitHub Pages dla galezi `main` i katalogu root.

## Panel admina

Kliknij ikone ustawien w prawym gornym rogu. Zmiany sa zapisywane lokalnie w przegladarce. Mozesz eksportowac konfiguracje do JSON i zaimportowac ja pozniej.
