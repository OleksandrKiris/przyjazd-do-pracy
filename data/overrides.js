(function () {
  const config = window.ARRIVAL_DEFAULT_CONFIG;
  if (!config || !config.locations || !config.locations.siechnice) return;

  const siechnice = config.locations.siechnice;
  const mapsUrl = "https://maps.app.goo.gl/GJc55GLUWFPa6MMcA";

  siechnice.short = "ul. Opolska 30";
  siechnice.address = ["ul. Opolska 30", "55-011 Siechnice", "Polska"];
  siechnice.mapQuery = "ul. Opolska 30, 55-011 Siechnice, Polska";
  siechnice.mapUrl = mapsUrl;

  if (Array.isArray(siechnice.routeLinks)) {
    const mapLink = siechnice.routeLinks.find((link) => /mapa/i.test(link.label || ""));
    if (mapLink) {
      mapLink.label = "Mapa Google - ul. Opolska 30";
      mapLink.url = mapsUrl;
    } else {
      siechnice.routeLinks.push({ label: "Mapa Google - ul. Opolska 30", url: mapsUrl });
    }
  }

  siechnice.route.pl = [
    "Wpisz w telefonie dokładny adres: ul. Opolska 30, 55-011 Siechnice. Najlepiej od razu otwórz Google Maps z tej strony.",
    "Jeżeli jedziesz z zagranicy lub z innego miasta, najpierw dojedź do Wrocławia Głównego. To najprostszy punkt przesiadki.",
    "Z Wrocławia Głównego jedź pociągiem regionalnym do stacji Siechnice. Przed wyjazdem sprawdź aktualną godzinę odjazdu.",
    "Po wyjściu ze stacji Siechnice włącz Google Maps i idź lub jedź taxi pod ul. Opolską 30. Jeżeli masz ciężki bagaż, lepiej weź taxi.",
    "Po dotarciu pod adres sprawdź, czy jesteś przy ul. Opolskiej 30. Jeżeli nie widzisz wejścia albo nie jesteś pewien miejsca, zadzwoń do kontaktu ze strony.",
    "Nie jedź pod inny adres i nie czekaj bez kontaktu. Jeśli się zgubiłeś, wyślij swoją lokalizację przez WhatsApp."
  ];

  const routes = config.locations;
  const contacts = config.contacts || (config.contacts = {});
  const ensureContact = (key, contact) => {
    const list = contacts[key] || (contacts[key] = []);
    const normalizedPhone = contact.phone.replace(/\s+/g, "");
    if (!list.some((item) => (item.phone || "").replace(/\s+/g, "") === normalizedPhone)) {
      list.unshift(contact);
    }
  };

  ensureContact("ryczywol", { name: "Ludmiła", phone: "+48 536 110 591", role: "Zakwaterowanie" });
  ensureContact("bogatynia_zgorzelec", { name: "Nataliia", phone: "+48 609 809 601", role: "Zakwaterowanie" });

  if (routes.ryczywol) {
    routes.ryczywol.route.pl = [
      "Najpierw dojedź do Warszawy Zachodniej. To najłatwiejszy punkt przesiadki w kierunku Kozienic.",
      "Na Warszawie Zachodniej znajdź autobus albo bus do Kozienic. Przed wyjazdem sprawdź godzinę kursu w aktualnym rozkładzie.",
      "W Kozienicach przesiądź się na transport w kierunku Ryczywołu. Szukaj przystanku lub kursu do Ryczywół Szklarnia.",
      "Jeżeli nie ma kursu do Ryczywołu albo nie wiesz gdzie wysiąść, zostań w Kozienicach i od razu zadzwoń do kontaktu ze strony.",
      "Adres zakwaterowania to Wilczkowice Górne 40, 26-900 Kozienice. Ten adres pokaż kierowcy taxi, jeśli jedziesz taksówką.",
      "Po przyjeździe zadzwoń do administratora lub kontaktu ze strony. Nie czekaj bez informacji, szczególnie wieczorem."
    ];
  }

  if (routes.bogatynia) {
    routes.bogatynia.route.pl = [
      "Twój adres docelowy to Niedów 9, 59-900 Niedów. Zapisz ten adres w telefonie przed wyjazdem.",
      "Najpierw dojedź do Zgorzelca. To najważniejszy punkt przesiadki dla trasy do Bogatyni i Niedowa.",
      "Ze Zgorzelca jedź busem albo autobusem w kierunku Bogatyni. Przed wyjazdem sprawdź aktualny rozkład ASTEL, Bieleccy albo e-podróżnik.",
      "Jeżeli masz wysiąść w Bogatyni, po wyjściu z autobusu od razu zadzwoń do kontaktu ze strony i potwierdź dalszy dojazd.",
      "Ostatni odcinek Bogatynia -> Niedów najlepiej przejechać taxi albo transportem ustalonym z kontaktem.",
      "Nie jedź w ciemno do innej miejscowości. Jeśli nie jesteś pewien, czy wysiąść w Zgorzelcu, Bogatyni czy Niedowie, zadzwoń przed dalszą jazdą."
    ];
  }

  if (routes.zgorzelec) {
    routes.zgorzelec.route.pl = [
      "Twój adres docelowy to Citronex Sp. z o.o., ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
      "Dojedź pociągiem albo autobusem do Zgorzelca. Najwygodniej celować w centrum miasta albo okolice dworca.",
      "Po przyjeździe do Zgorzelca wpisz w Google Maps: Bohaterów II Armii Wojska Polskiego 64.",
      "Z dworca lub przystanku jedź pod firmę taxi albo komunikacją miejską. Jeżeli trasa autobusu przejeżdża blisko tej ulicy, wysiądź na najbliższym przystanku.",
      "Po wejściu na teren firmy zgłoś się do podpisania dokumentów. Nie zaczynaj pracy bez zgłoszenia.",
      "Jeżeli nie możesz znaleźć właściwego wejścia albo się spóźniasz, zadzwoń do kontaktu ze strony i wyślij swoją lokalizację."
    ];
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="maps"]');
    if (!button) return;
    const params = new URLSearchParams(location.search);
    const locationKey = (params.get("location") || params.get("lokalizacja") || "siechnice").toLowerCase();
    if (!locationKey.includes("siech")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(mapsUrl, "_blank");
  }, true);
})();
