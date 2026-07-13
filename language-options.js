(function () {
  const config = window.ARRIVAL_DEFAULT_CONFIG;
  if (!config) return;

  config.version = 9;
  config.languages = {
    pl: "Polski",
    ru: "Русский",
    uk: "Українська",
    en: "English",
    az: "Azərbaycanca",
    es: "Español",
    fil: "Filipino",
    id: "Indonesia",
    ne: "नेपाली"
  };

  const ui = config.ui || {};
  const base = ui.en || ui.pl || {};

  const withBase = (values) => ({ ...base, ...values });

  ui.es = withBase({
    moduleLabel: "Información",
    title: "Llegada al trabajo",
    chooseLanguage: "Idioma",
    chooseLocation: "Elige ubicación",
    chooseLocationText: "Toca el lugar al que vas. La página mostrará la ruta y los contactos solo para esa ubicación.",
    selectedLocation: "Ubicación elegida",
    showInstruction: "Mostrar ruta",
    checkConnections: "Comprobar conexiones",
    employee: "Trabajador",
    arrivalDate: "Fecha de llegada",
    location: "Ubicación",
    department: "Departamento",
    address: "Dirección",
    route: "Cómo llegar",
    workType: "Tipo de trabajo",
    arrivalRules: "Información de llegada",
    whatToPack: "Qué llevar",
    housing: "Alojamiento",
    contacts: "Contactos",
    openMaps: "Abrir Google Maps",
    copyAddress: "Copiar dirección",
    call: "Llamar",
    whatsapp: "WhatsApp",
    saved: "Guardado",
    copied: "Copiado",
    noWeekend: "Fin de semana: no recibimos trabajadores.",
    late: "Si llegas tarde, informa obligatoriamente al contacto.",
    reception: "Recepción de trabajadores: lunes-viernes, 08:00-16:00.",
    hotelReady: "El alojamiento está preparado.",
    questions: "¿Tienes preguntas? Escribe por WhatsApp.",
    fromUkraine: "La persona viaja desde Ucrania",
    inPoland: "La persona ya está en Polonia",
    fromCaucasus: "La persona viaja desde Georgia o Azerbaiyán"
  });

  ui.fil = withBase({
    moduleLabel: "Impormasyon",
    title: "Pagdating sa trabaho",
    chooseLanguage: "Wika",
    chooseLocation: "Piliin ang lokasyon",
    chooseLocationText: "Pindutin ang lugar na pupuntahan mo. Ipapakita ng pahina ang ruta at kontak para sa lokasyong iyon lamang.",
    selectedLocation: "Napiling lokasyon",
    showInstruction: "Ipakita ang ruta",
    checkConnections: "Suriin ang byahe",
    employee: "Empleyado",
    arrivalDate: "Petsa ng pagdating",
    location: "Lokasyon",
    department: "Departamento",
    address: "Address",
    route: "Paano pumunta",
    workType: "Uri ng trabaho",
    arrivalRules: "Impormasyon sa pagdating",
    whatToPack: "Ano ang dadalhin",
    housing: "Tirahan",
    contacts: "Kontak",
    openMaps: "Buksan ang Google Maps",
    copyAddress: "Kopyahin ang address",
    call: "Tumawag",
    whatsapp: "WhatsApp",
    saved: "Nai-save",
    copied: "Nakopya",
    noWeekend: "Weekend: hindi kami tumatanggap ng empleyado.",
    late: "Kung mahuhuli ka, ipaalam agad sa kontak.",
    reception: "Pagtanggap ng empleyado: Lunes-Biyernes, 08:00-16:00.",
    hotelReady: "Nakahanda na ang tirahan.",
    questions: "May tanong? Sumulat sa WhatsApp.",
    fromUkraine: "Ang tao ay bumiyahe mula Ukraine",
    inPoland: "Ang tao ay nasa Poland na",
    fromCaucasus: "Ang tao ay bumiyahe mula Georgia o Azerbaijan"
  });

  ui.id = withBase({
    moduleLabel: "Informasi",
    title: "Kedatangan kerja",
    chooseLanguage: "Bahasa",
    chooseLocation: "Pilih lokasi",
    chooseLocationText: "Tekan lokasi tujuan Anda. Halaman akan menampilkan rute dan kontak hanya untuk lokasi itu.",
    selectedLocation: "Lokasi dipilih",
    showInstruction: "Tampilkan rute",
    checkConnections: "Cek koneksi",
    employee: "Pekerja",
    arrivalDate: "Tanggal kedatangan",
    location: "Lokasi",
    department: "Departemen",
    address: "Alamat",
    route: "Cara menuju lokasi",
    workType: "Jenis pekerjaan",
    arrivalRules: "Informasi kedatangan",
    whatToPack: "Yang perlu dibawa",
    housing: "Akomodasi",
    contacts: "Kontak",
    openMaps: "Buka Google Maps",
    copyAddress: "Salin alamat",
    call: "Telepon",
    whatsapp: "WhatsApp",
    saved: "Tersimpan",
    copied: "Disalin",
    noWeekend: "Akhir pekan: kami tidak menerima pekerja.",
    late: "Jika terlambat, wajib memberi tahu kontak.",
    reception: "Penerimaan pekerja: Senin-Jumat, 08:00-16:00.",
    hotelReady: "Akomodasi sudah disiapkan.",
    questions: "Ada pertanyaan? Tulis di WhatsApp.",
    fromUkraine: "Orang berangkat dari Ukraina",
    inPoland: "Orang sudah berada di Polandia",
    fromCaucasus: "Orang berangkat dari Georgia atau Azerbaijan"
  });

  ui.ne = withBase({
    moduleLabel: "जानकारी",
    title: "काममा आगमन",
    chooseLanguage: "भाषा",
    chooseLocation: "स्थान छान्नुहोस्",
    chooseLocationText: "तपाईं जाने स्थान थिच्नुहोस्। पृष्ठले त्यही स्थानको बाटो र सम्पर्क मात्र देखाउनेछ।",
    selectedLocation: "छानिएको स्थान",
    showInstruction: "बाटो देखाउनुहोस्",
    checkConnections: "यात्रा जाँच गर्नुहोस्",
    employee: "कर्मचारी",
    arrivalDate: "आगमन मिति",
    location: "स्थान",
    department: "विभाग",
    address: "ठेगाना",
    route: "कसरी पुग्ने",
    workType: "कामको प्रकार",
    arrivalRules: "आगमन जानकारी",
    whatToPack: "के ल्याउने",
    housing: "बसोबास",
    contacts: "सम्पर्क",
    openMaps: "Google Maps खोल्नुहोस्",
    copyAddress: "ठेगाना कपि गर्नुहोस्",
    call: "कल गर्नुहोस्",
    whatsapp: "WhatsApp",
    saved: "सेभ भयो",
    copied: "कपि भयो",
    noWeekend: "सप्ताहन्त: कर्मचारी स्वीकार गरिँदैन।",
    late: "ढिलो भएमा अनिवार्य रूपमा सम्पर्क व्यक्तिलाई जानकारी दिनुहोस्।",
    reception: "कर्मचारी स्वागत: सोमबार-शुक्रबार, 08:00-16:00।",
    hotelReady: "बसोबास तयार छ।",
    questions: "प्रश्न छ? WhatsApp मा लेख्नुहोस्।",
    fromUkraine: "व्यक्ति युक्रेनबाट आउँदैछ",
    inPoland: "व्यक्ति पहिले नै पोल्याण्डमा छ",
    fromCaucasus: "व्यक्ति जर्जिया वा अजरबैजानबाट आउँदैछ"
  });

  config.ui = ui;

  const setRoute = (key, route) => {
    if (config.locations && config.locations[key]) {
      config.locations[key].route = route;
    }
  };

  setRoute("siechnice", {
    pl: [
      "Cel: ul. Opolska 30, 55-011 Siechnice.",
      "Transport publiczny: jedź do Wrocławia Głównego, potem pociągiem regionalnym albo autobusem do Siechnic.",
      "Ostatni odcinek: ze stacji lub przystanku w Siechnicach otwórz mapę do ul. Opolskiej 30. Jeśli masz bagaż albo jest późno, weź taxi.",
      "Samochód/taxi: wpisz w nawigacji ul. Opolska 30, 55-011 Siechnice i jedź bezpośrednio pod adres.",
      "Na miejscu: jeśli nie widzisz wejścia, zadzwoń do kontaktu dla Siechnic i wyślij swoją lokalizację."
    ],
    en: [
      "Destination: ul. Opolska 30, 55-011 Siechnice.",
      "Public transport: travel to Wroclaw Glowny, then take a regional train or bus to Siechnice.",
      "Final part: from the station or stop in Siechnice, open the map to ul. Opolska 30. If you have luggage or it is late, take a taxi.",
      "Car/taxi: enter ul. Opolska 30, 55-011 Siechnice in navigation and go directly to the address.",
      "On arrival: if you cannot find the entrance, call the Siechnice contact and send your location."
    ]
  });

  setRoute("zgorzelec", {
    pl: [
      "Cel: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
      "Transport publiczny: jedź do Wrocławia, potem pociągiem albo autobusem do Zgorzelca.",
      "Ostatni odcinek: ze stacji lub centrum Zgorzelca jedź taxi albo komunikacją miejską pod adres firmy.",
      "Samochód/taxi: wpisz dokładnie ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
      "Na miejscu: zgłoś się do podpisania dokumentów. Jeśli nie możesz znaleźć wejścia, zadzwoń do Anastasii."
    ],
    en: [
      "Destination: Citronex, ul. Bohaterow II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
      "Public transport: travel to Wroclaw, then take a train or bus to Zgorzelec.",
      "Final part: from the station or centre of Zgorzelec, take a taxi or local transport to the company address.",
      "Car/taxi: enter exactly ul. Bohaterow II Armii Wojska Polskiego 64, Zgorzelec.",
      "On arrival: go to sign the documents. If you cannot find the entrance, call Anastasiia."
    ]
  });

  setRoute("bogatynia", {
    pl: [
      "Cel: Niedów 9, 59-900 Niedów. Trasa zwykle prowadzi przez Wrocław i Zgorzelec.",
      "Transport publiczny: jedź do Wrocławia, potem do Zgorzelca. Ze Zgorzelca jedź busem lub autobusem w kierunku Bogatyni albo Niedowa.",
      "Ostatni odcinek: jeśli dojedziesz tylko do Bogatyni, dalej do Niedowa jedź taxi albo transportem ustalonym z koordynatorem.",
      "Samochód/taxi: wpisz Niedów 9, 59-900 Niedów. Jeśli kierowca nie zna miejsca, pokaż mapę.",
      "Problem: nie jedź do innej miejscowości w ciemno. Zostań w Zgorzelcu lub Bogatyni i zadzwoń do Natalii."
    ],
    en: [
      "Destination: Niedow 9, 59-900 Niedow. The route usually goes through Wroclaw and Zgorzelec.",
      "Public transport: travel to Wroclaw, then to Zgorzelec. From Zgorzelec take a bus toward Bogatynia or Niedow.",
      "Final part: if you arrive only in Bogatynia, continue to Niedow by taxi or by transport agreed with the coordinator.",
      "Car/taxi: enter Niedow 9, 59-900 Niedow. If the driver does not know the place, show the map.",
      "Problem: do not continue blindly to another town. Stay in Zgorzelec or Bogatynia and call Nataliia."
    ]
  });

  setRoute("ryczywol", {
    pl: [
      "Cel: Ryczywół / zakwaterowanie Wilczkowice Górne 40, 26-900 Kozienice.",
      "Transport publiczny: jedź do Warszawy Zachodniej, potem autobusem lub busem do Kozienic.",
      "Ostatni odcinek: z Kozienic jedź w kierunku Ryczywołu lub Ryczywół Szklarnia. Jeśli nie ma kursu, nie jedź dalej samodzielnie.",
      "Samochód/taxi: wpisz Wilczkowice Górne 40, 26-900 Kozienice albo Ryczywół Szklarnia, zgodnie z instrukcją od kontaktu.",
      "Problem: jeśli utkniesz w Warszawie albo Kozienicach, zostań w miejscu i zadzwoń do Ludmiły lub koordynatora."
    ],
    en: [
      "Destination: Ryczywol / accommodation Wilczkowice Gorne 40, 26-900 Kozienice.",
      "Public transport: travel to Warszawa Zachodnia, then take a bus or minibus to Kozienice.",
      "Final part: from Kozienice go toward Ryczywol or Ryczywol Szklarnia. If there is no connection, do not continue alone.",
      "Car/taxi: enter Wilczkowice Gorne 40, 26-900 Kozienice or Ryczywol Szklarnia, according to the contact instruction.",
      "Problem: if you get stuck in Warsaw or Kozienice, stay where you are and call Ludmila or the coordinator."
    ]
  });

  window.CANDIDATE_LANGUAGE_LABELS = {
    es: {
      travelTo: "Vas a",
      emergency: "Si hay un problema",
      lostTitle: "¿No sabes dónde bajar o dónde está la entrada?",
      lostText: "No sigas adivinando. Abre el mapa o ve a los contactos de esta ubicación.",
      map: "Mapa",
      googleMaps: "Google Maps",
      numbers: "Números",
      whatsapp: "WhatsApp",
      copyAddress: "Copiar dirección",
      contact: "Contacto",
      contactTitle: "Contacto si hay un problema",
      contactHint: "Los números y WhatsApp se muestran solo para la ubicación elegida.",
      phone: "Teléfono",
      accommodation: "Alojamiento",
      recruitment: "Reclutamiento",
      coordinator: "Coordinador",
      recruiter: "Reclutador",
      hr: "RR. HH."
    },
    fil: {
      travelTo: "Pupunta ka sa",
      emergency: "Kung may problema",
      lostTitle: "Hindi mo alam kung saan bababa o saan ang pasukan?",
      lostText: "Huwag magpatuloy nang hulaan lang. Buksan ang mapa o pumunta sa mga kontak ng lokasyong ito.",
      map: "Mapa",
      googleMaps: "Google Maps",
      numbers: "Numero",
      whatsapp: "WhatsApp",
      copyAddress: "Kopyahin ang address",
      contact: "Kontak",
      contactTitle: "Kontak kung may problema",
      contactHint: "Ang mga numero at WhatsApp ay para lamang sa napiling lokasyon.",
      phone: "Telepono",
      accommodation: "Tirahan",
      recruitment: "Rekrutment",
      coordinator: "Koordinator",
      recruiter: "Rekruter",
      hr: "HR"
    },
    id: {
      travelTo: "Anda pergi ke",
      emergency: "Jika ada masalah",
      lostTitle: "Tidak tahu harus turun di mana atau pintu masuknya di mana?",
      lostText: "Jangan lanjut menebak. Buka peta atau pergi ke kontak untuk lokasi ini.",
      map: "Peta",
      googleMaps: "Google Maps",
      numbers: "Nomor",
      whatsapp: "WhatsApp",
      copyAddress: "Salin alamat",
      contact: "Kontak",
      contactTitle: "Kontak jika ada masalah",
      contactHint: "Nomor telepon dan WhatsApp hanya untuk lokasi yang dipilih.",
      phone: "Telepon",
      accommodation: "Akomodasi",
      recruitment: "Rekrutmen",
      coordinator: "Koordinator",
      recruiter: "Perekrut",
      hr: "HR"
    },
    ne: {
      travelTo: "तपाईं जाँदै हुनुहुन्छ",
      emergency: "समस्या भएमा",
      lostTitle: "कहाँ झर्ने वा प्रवेशद्वार कहाँ छ थाहा छैन?",
      lostText: "अनुमान गरेर अगाडि नजानुहोस्। नक्सा खोल्नुहोस् वा यस स्थानका सम्पर्कमा जानुहोस्।",
      map: "नक्सा",
      googleMaps: "Google Maps",
      numbers: "नम्बर",
      whatsapp: "WhatsApp",
      copyAddress: "ठेगाना कपि गर्नुहोस्",
      contact: "सम्पर्क",
      contactTitle: "समस्या भएमा सम्पर्क",
      contactHint: "नम्बर र WhatsApp छानिएको स्थानका लागि मात्र देखाइन्छ।",
      phone: "फोन",
      accommodation: "बसोबास",
      recruitment: "भर्ना",
      coordinator: "समन्वयकर्ता",
      recruiter: "भर्तीकर्ता",
      hr: "HR"
    }
  };
})();
