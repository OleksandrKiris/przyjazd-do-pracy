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

  const completeRoutes = {
    siechnice: {
      pl: [
        "Cel: ul. Opolska 30, 55-011 Siechnice.",
        "Transport publiczny: jedź do Wrocławia Głównego, potem pociągiem regionalnym albo autobusem do Siechnic.",
        "Ostatni odcinek: ze stacji lub przystanku w Siechnicach otwórz mapę do ul. Opolskiej 30. Jeśli masz bagaż albo jest późno, weź taxi.",
        "Samochód/taxi: wpisz w nawigacji ul. Opolska 30, 55-011 Siechnice i jedź bezpośrednio pod adres.",
        "Na miejscu: jeśli nie widzisz wejścia, zadzwoń do kontaktu dla Siechnic i wyślij swoją lokalizację."
      ],
      ru: [
        "Цель: ул. Opolska 30, 55-011 Siechnice.",
        "Общественный транспорт: доедьте до Wrocław Główny, затем региональным поездом или автобусом до Siechnice.",
        "Последний участок: от станции или остановки в Siechnice откройте карту до ul. Opolska 30. Если у вас багаж или поздно, возьмите такси.",
        "Авто/такси: введите в навигации ul. Opolska 30, 55-011 Siechnice и езжайте прямо по адресу.",
        "На месте: если не видите вход, позвоните контакту для Siechnice и отправьте свою геолокацию."
      ],
      uk: [
        "Ціль: вул. Opolska 30, 55-011 Siechnice.",
        "Громадський транспорт: доїдьте до Wrocław Główny, потім регіональним поїздом або автобусом до Siechnice.",
        "Остання частина: від станції або зупинки в Siechnice відкрийте карту до ul. Opolska 30. Якщо маєте багаж або вже пізно, візьміть таксі.",
        "Авто/таксі: введіть у навігації ul. Opolska 30, 55-011 Siechnice і їдьте прямо за адресою.",
        "На місці: якщо не бачите входу, зателефонуйте контакту для Siechnice і надішліть свою геолокацію."
      ],
      en: [
        "Destination: ul. Opolska 30, 55-011 Siechnice.",
        "Public transport: travel to Wroclaw Glowny, then take a regional train or bus to Siechnice.",
        "Final part: from the station or stop in Siechnice, open the map to ul. Opolska 30. If you have luggage or it is late, take a taxi.",
        "Car/taxi: enter ul. Opolska 30, 55-011 Siechnice in navigation and go directly to the address.",
        "On arrival: if you cannot find the entrance, call the Siechnice contact and send your location."
      ],
      az: [
        "Məqsəd: ul. Opolska 30, 55-011 Siechnice.",
        "İctimai nəqliyyat: Wrocław Główny stansiyasına gedin, sonra regional qatar və ya avtobusla Siechnice-yə gedin.",
        "Son hissə: Siechnice stansiyasından və ya dayanacağından ul. Opolska 30 ünvanını xəritədə açın. Baqajınız varsa və ya gecdirsə, taksi götürün.",
        "Avtomobil/taksi: naviqasiyaya ul. Opolska 30, 55-011 Siechnice yazın və birbaşa ünvana gedin.",
        "Yerində: girişi tapa bilmirsinizsə, Siechnice kontaktına zəng edin və lokasiyanızı göndərin."
      ],
      es: [
        "Destino: ul. Opolska 30, 55-011 Siechnice.",
        "Transporte público: llega a Wrocław Główny y después toma un tren regional o autobús a Siechnice.",
        "Último tramo: desde la estación o parada en Siechnice abre el mapa hasta ul. Opolska 30. Si tienes equipaje o es tarde, toma un taxi.",
        "Coche/taxi: escribe ul. Opolska 30, 55-011 Siechnice en la navegación y ve directo a la dirección.",
        "Al llegar: si no encuentras la entrada, llama al contacto de Siechnice y envía tu ubicación."
      ],
      fil: [
        "Patutunguhan: ul. Opolska 30, 55-011 Siechnice.",
        "Public transport: pumunta muna sa Wrocław Główny, pagkatapos sumakay ng regional train o bus papuntang Siechnice.",
        "Huling bahagi: mula sa station o hintuan sa Siechnice, buksan ang mapa papuntang ul. Opolska 30. Kung may bagahe ka o gabi na, mag-taxi.",
        "Kotse/taxi: ilagay sa navigation ang ul. Opolska 30, 55-011 Siechnice at dumiretso sa address.",
        "Pagdating: kung hindi mo makita ang entrance, tawagan ang contact para sa Siechnice at ipadala ang iyong location."
      ],
      id: [
        "Tujuan: ul. Opolska 30, 55-011 Siechnice.",
        "Transportasi umum: pergi ke Wrocław Główny, lalu naik kereta regional atau bus ke Siechnice.",
        "Bagian terakhir: dari stasiun atau halte di Siechnice, buka peta ke ul. Opolska 30. Jika membawa bagasi atau sudah malam, gunakan taksi.",
        "Mobil/taksi: masukkan ul. Opolska 30, 55-011 Siechnice di navigasi dan langsung ke alamat.",
        "Saat tiba: jika tidak menemukan pintu masuk, telepon kontak Siechnice dan kirim lokasi Anda."
      ],
      ne: [
        "गन्तव्य: ul. Opolska 30, 55-011 Siechnice.",
        "सार्वजनिक यातायात: पहिले Wrocław Główny जानुहोस्, त्यसपछि regional train वा bus बाट Siechnice जानुहोस्.",
        "अन्तिम भाग: Siechnice को station वा stop बाट ul. Opolska 30 को map खोल्नुहोस्। सामान छ वा ढिलो भएको छ भने taxi लिनुहोस्.",
        "कार/taxi: navigation मा ul. Opolska 30, 55-011 Siechnice राख्नुहोस् र सिधै address मा जानुहोस्.",
        "पुगेपछि: entrance भेटिएन भने Siechnice contact लाई call गर्नुहोस् र आफ्नो location पठाउनुहोस्."
      ]
    },
    zgorzelec: {
      pl: [
        "Cel: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Transport publiczny: jedź do Wrocławia, potem pociągiem albo autobusem do Zgorzelca.",
        "Ostatni odcinek: ze stacji lub centrum Zgorzelca jedź taxi albo komunikacją miejską pod adres firmy.",
        "Samochód/taxi: wpisz dokładnie ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "Na miejscu: zgłoś się do podpisania dokumentów. Jeśli nie możesz znaleźć wejścia, zadzwoń do Anastasii."
      ],
      ru: [
        "Цель: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Общественный транспорт: доедьте до Wrocław, затем поездом или автобусом до Zgorzelec.",
        "Последний участок: от станции или центра Zgorzelec поезжайте на такси или городским транспортом к адресу фирмы.",
        "Авто/такси: введите точно ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "На месте: подойдите для подписания документов. Если не можете найти вход, позвоните Анастасии."
      ],
      uk: [
        "Ціль: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Громадський транспорт: доїдьте до Wrocław, потім поїздом або автобусом до Zgorzelec.",
        "Остання частина: від станції або центру Zgorzelec їдьте таксі або міським транспортом до адреси фірми.",
        "Авто/таксі: введіть точно ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "На місці: підійдіть для підписання документів. Якщо не можете знайти вхід, зателефонуйте Анастасії."
      ],
      en: [
        "Destination: Citronex, ul. Bohaterow II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Public transport: travel to Wroclaw, then take a train or bus to Zgorzelec.",
        "Final part: from the station or centre of Zgorzelec, take a taxi or local transport to the company address.",
        "Car/taxi: enter exactly ul. Bohaterow II Armii Wojska Polskiego 64, Zgorzelec.",
        "On arrival: go to sign the documents. If you cannot find the entrance, call Anastasiia."
      ],
      az: [
        "Məqsəd: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "İctimai nəqliyyat: Wrocław-a gedin, sonra qatar və ya avtobusla Zgorzelec-ə gedin.",
        "Son hissə: Zgorzelec stansiyasından və ya mərkəzindən şirkət ünvanına taksi və ya şəhər nəqliyyatı ilə gedin.",
        "Avtomobil/taksi: naviqasiyaya dəqiq ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec yazın.",
        "Yerində: sənədləri imzalamaq üçün müraciət edin. Girişi tapa bilmirsinizsə, Anastasiia-ya zəng edin."
      ],
      es: [
        "Destino: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Transporte público: llega a Wrocław y después toma un tren o autobús a Zgorzelec.",
        "Último tramo: desde la estación o el centro de Zgorzelec toma un taxi o transporte local hasta la dirección de la empresa.",
        "Coche/taxi: escribe exactamente ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "Al llegar: preséntate para firmar documentos. Si no encuentras la entrada, llama a Anastasiia."
      ],
      fil: [
        "Patutunguhan: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Public transport: pumunta sa Wrocław, pagkatapos sumakay ng train o bus papuntang Zgorzelec.",
        "Huling bahagi: mula sa station o sentro ng Zgorzelec, mag-taxi o lokal na transport papunta sa address ng kumpanya.",
        "Kotse/taxi: ilagay nang eksakto sa navigation ang ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "Pagdating: pumunta para pumirma ng dokumento. Kung hindi makita ang entrance, tawagan si Anastasiia."
      ],
      id: [
        "Tujuan: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Transportasi umum: pergi ke Wrocław, lalu naik kereta atau bus ke Zgorzelec.",
        "Bagian terakhir: dari stasiun atau pusat Zgorzelec, gunakan taksi atau transportasi lokal ke alamat perusahaan.",
        "Mobil/taksi: masukkan dengan tepat ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec.",
        "Saat tiba: datang untuk menandatangani dokumen. Jika tidak menemukan pintu masuk, telepon Anastasiia."
      ],
      ne: [
        "गन्तव्य: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "सार्वजनिक यातायात: Wrocław जानुहोस्, त्यसपछि train वा bus बाट Zgorzelec जानुहोस्.",
        "अन्तिम भाग: Zgorzelec station वा center बाट company address सम्म taxi वा local transport लिनुहोस्.",
        "कार/taxi: navigation मा ठ्याक्कै ul. Bohaterów II Armii Wojska Polskiego 64, Zgorzelec राख्नुहोस्.",
        "पुगेपछि: documents sign गर्न जानुहोस्। entrance भेटिएन भने Anastasiia लाई call गर्नुहोस्."
      ]
    },
    bogatynia: {
      pl: [
        "Cel: Niedów 9, 59-900 Niedów. Trasa zwykle prowadzi przez Wrocław i Zgorzelec.",
        "Transport publiczny: jedź do Wrocławia, potem do Zgorzelca. Ze Zgorzelca jedź busem lub autobusem w kierunku Bogatyni albo Niedowa.",
        "Ostatni odcinek: jeśli dojedziesz tylko do Bogatyni, dalej do Niedowa jedź taxi albo transportem ustalonym z koordynatorem.",
        "Samochód/taxi: wpisz Niedów 9, 59-900 Niedów. Jeśli kierowca nie zna miejsca, pokaż mapę.",
        "Problem: nie jedź do innej miejscowości w ciemno. Zostań w Zgorzelcu lub Bogatyni i zadzwoń do Natalii."
      ],
      ru: [
        "Цель: Niedów 9, 59-900 Niedów. Маршрут обычно идет через Wrocław и Zgorzelec.",
        "Общественный транспорт: доедьте до Wrocław, затем до Zgorzelec. Из Zgorzelec едьте автобусом или бусом в сторону Bogatynia или Niedów.",
        "Последний участок: если доедете только до Bogatynia, дальше до Niedów езжайте на такси или транспортом, согласованным с координатором.",
        "Авто/такси: введите Niedów 9, 59-900 Niedów. Если водитель не знает место, покажите карту.",
        "Проблема: не езжайте в другой город наугад. Останьтесь в Zgorzelec или Bogatynia и позвоните Наталии."
      ],
      uk: [
        "Ціль: Niedów 9, 59-900 Niedów. Маршрут зазвичай проходить через Wrocław і Zgorzelec.",
        "Громадський транспорт: доїдьте до Wrocław, потім до Zgorzelec. Із Zgorzelec їдьте бусом або автобусом у напрямку Bogatynia або Niedów.",
        "Остання частина: якщо доїдете тільки до Bogatynia, далі до Niedów їдьте таксі або транспортом, узгодженим з координатором.",
        "Авто/таксі: введіть Niedów 9, 59-900 Niedów. Якщо водій не знає місце, покажіть карту.",
        "Проблема: не їдьте в інше місто навмання. Залишайтеся в Zgorzelec або Bogatynia і телефонуйте Наталії."
      ],
      en: [
        "Destination: Niedow 9, 59-900 Niedow. The route usually goes through Wroclaw and Zgorzelec.",
        "Public transport: travel to Wroclaw, then to Zgorzelec. From Zgorzelec take a bus toward Bogatynia or Niedow.",
        "Final part: if you arrive only in Bogatynia, continue to Niedow by taxi or by transport agreed with the coordinator.",
        "Car/taxi: enter Niedow 9, 59-900 Niedow. If the driver does not know the place, show the map.",
        "Problem: do not continue blindly to another town. Stay in Zgorzelec or Bogatynia and call Nataliia."
      ],
      az: [
        "Məqsəd: Niedów 9, 59-900 Niedów. Marşrut adətən Wrocław və Zgorzelec üzərindən gedir.",
        "İctimai nəqliyyat: Wrocław-a, sonra Zgorzelec-ə gedin. Zgorzelec-dən Bogatynia və ya Niedów istiqamətinə avtobus və ya mikroavtobusla gedin.",
        "Son hissə: yalnız Bogatynia-ya çatsanız, Niedów-a taksi ilə və ya koordinatorla razılaşdırılmış nəqliyyatla gedin.",
        "Avtomobil/taksi: Niedów 9, 59-900 Niedów yazın. Sürücü yeri bilmirsə, xəritəni göstərin.",
        "Problem: başqa şəhərə təxminən getməyin. Zgorzelec və ya Bogatynia-da qalın və Nataliia-ya zəng edin."
      ],
      es: [
        "Destino: Niedów 9, 59-900 Niedów. Normalmente la ruta va por Wrocław y Zgorzelec.",
        "Transporte público: llega a Wrocław y luego a Zgorzelec. Desde Zgorzelec toma bus o minibús hacia Bogatynia o Niedów.",
        "Último tramo: si llegas solo a Bogatynia, continúa a Niedów en taxi o con transporte acordado con el coordinador.",
        "Coche/taxi: escribe Niedów 9, 59-900 Niedów. Si el conductor no conoce el lugar, muestra el mapa.",
        "Problema: no viajes a otro pueblo sin estar seguro. Quédate en Zgorzelec o Bogatynia y llama a Nataliia."
      ],
      fil: [
        "Patutunguhan: Niedów 9, 59-900 Niedów. Karaniwang ruta ay dadaan sa Wrocław at Zgorzelec.",
        "Public transport: pumunta sa Wrocław, pagkatapos sa Zgorzelec. Mula Zgorzelec, sumakay ng bus o minibus papuntang Bogatynia o Niedów.",
        "Huling bahagi: kung hanggang Bogatynia ka lang makarating, pumunta sa Niedów sa pamamagitan ng taxi o transport na napag-usapan sa coordinator.",
        "Kotse/taxi: ilagay ang Niedów 9, 59-900 Niedów. Kung hindi alam ng driver ang lugar, ipakita ang mapa.",
        "Problema: huwag pumunta sa ibang bayan kung hindi sigurado. Manatili sa Zgorzelec o Bogatynia at tawagan si Nataliia."
      ],
      id: [
        "Tujuan: Niedów 9, 59-900 Niedów. Rute biasanya melalui Wrocław dan Zgorzelec.",
        "Transportasi umum: pergi ke Wrocław, lalu ke Zgorzelec. Dari Zgorzelec naik bus atau minibus menuju Bogatynia atau Niedów.",
        "Bagian terakhir: jika hanya sampai Bogatynia, lanjutkan ke Niedów dengan taksi atau transportasi yang disepakati dengan koordinator.",
        "Mobil/taksi: masukkan Niedów 9, 59-900 Niedów. Jika pengemudi tidak tahu tempatnya, tunjukkan peta.",
        "Masalah: jangan pergi ke kota lain dengan menebak. Tetap di Zgorzelec atau Bogatynia dan telepon Nataliia."
      ],
      ne: [
        "गन्तव्य: Niedów 9, 59-900 Niedów. सामान्यतया route Wrocław र Zgorzelec हुँदै जान्छ.",
        "सार्वजनिक यातायात: Wrocław जानुहोस्, त्यसपछि Zgorzelec जानुहोस्। Zgorzelec बाट Bogatynia वा Niedów तर्फ bus/minibus लिनुहोस्.",
        "अन्तिम भाग: यदि Bogatynia सम्म मात्र पुग्नुभयो भने, Niedów सम्म taxi वा coordinator सँग मिलाएको transport लिनुहोस्.",
        "कार/taxi: Niedów 9, 59-900 Niedów राख्नुहोस्। driver लाई ठाउँ थाहा छैन भने map देखाउनुहोस्.",
        "समस्या: निश्चित नभई अर्को town नजानुहोस्। Zgorzelec वा Bogatynia मा बस्नुहोस् र Nataliia लाई call गर्नुहोस्."
      ]
    },
    ryczywol: {
      pl: [
        "Cel: Ryczywół / zakwaterowanie Wilczkowice Górne 40, 26-900 Kozienice.",
        "Transport publiczny: jedź do Warszawy Zachodniej, potem autobusem lub busem do Kozienic.",
        "Ostatni odcinek: z Kozienic jedź w kierunku Ryczywołu lub Ryczywół Szklarnia. Jeśli nie ma kursu, nie jedź dalej samodzielnie.",
        "Samochód/taxi: wpisz Wilczkowice Górne 40, 26-900 Kozienice albo Ryczywół Szklarnia, zgodnie z instrukcją od kontaktu.",
        "Problem: jeśli utkniesz w Warszawie albo Kozienicach, zostań w miejscu i zadzwoń do Ludmiły lub koordynatora."
      ],
      ru: [
        "Цель: Ryczywół / проживание Wilczkowice Górne 40, 26-900 Kozienice.",
        "Общественный транспорт: доедьте до Warszawa Zachodnia, затем автобусом или бусом до Kozienice.",
        "Последний участок: из Kozienice езжайте в сторону Ryczywół или Ryczywół Szklarnia. Если рейса нет, не езжайте дальше самостоятельно.",
        "Авто/такси: введите Wilczkowice Górne 40, 26-900 Kozienice или Ryczywół Szklarnia согласно инструкции контакта.",
        "Проблема: если застряли в Warszawa или Kozienice, оставайтесь на месте и звоните Людмиле или координатору."
      ],
      uk: [
        "Ціль: Ryczywół / проживання Wilczkowice Górne 40, 26-900 Kozienice.",
        "Громадський транспорт: доїдьте до Warszawa Zachodnia, потім автобусом або бусом до Kozienice.",
        "Остання частина: із Kozienice їдьте в напрямку Ryczywół або Ryczywół Szklarnia. Якщо рейсу немає, не їдьте далі самостійно.",
        "Авто/таксі: введіть Wilczkowice Górne 40, 26-900 Kozienice або Ryczywół Szklarnia згідно з інструкцією контакту.",
        "Проблема: якщо застрягли у Warszawa або Kozienice, залишайтеся на місці і телефонуйте Людмилі або координатору."
      ],
      en: [
        "Destination: Ryczywol / accommodation Wilczkowice Gorne 40, 26-900 Kozienice.",
        "Public transport: travel to Warszawa Zachodnia, then take a bus or minibus to Kozienice.",
        "Final part: from Kozienice go toward Ryczywol or Ryczywol Szklarnia. If there is no connection, do not continue alone.",
        "Car/taxi: enter Wilczkowice Gorne 40, 26-900 Kozienice or Ryczywol Szklarnia, according to the contact instruction.",
        "Problem: if you get stuck in Warsaw or Kozienice, stay where you are and call Ludmila or the coordinator."
      ],
      az: [
        "Məqsəd: Ryczywół / yaşayış Wilczkowice Górne 40, 26-900 Kozienice.",
        "İctimai nəqliyyat: Warszawa Zachodnia-ya gedin, sonra avtobus və ya mikroavtobusla Kozienice-yə gedin.",
        "Son hissə: Kozienice-dən Ryczywół və ya Ryczywół Szklarnia istiqamətinə gedin. Reys yoxdursa, təkbaşına davam etməyin.",
        "Avtomobil/taksi: kontaktın göstərişinə görə Wilczkowice Górne 40, 26-900 Kozienice və ya Ryczywół Szklarnia yazın.",
        "Problem: Warszawa və ya Kozienice-də qalsanız, olduğunuz yerdə qalın və Ludmila-ya və ya koordinatora zəng edin."
      ],
      es: [
        "Destino: Ryczywół / alojamiento Wilczkowice Górne 40, 26-900 Kozienice.",
        "Transporte público: llega a Warszawa Zachodnia y después toma autobús o minibús a Kozienice.",
        "Último tramo: desde Kozienice ve hacia Ryczywół o Ryczywół Szklarnia. Si no hay conexión, no continúes solo.",
        "Coche/taxi: escribe Wilczkowice Górne 40, 26-900 Kozienice o Ryczywół Szklarnia, según la instrucción del contacto.",
        "Problema: si te quedas bloqueado en Varsovia o Kozienice, quédate en el lugar y llama a Ludmila o al coordinador."
      ],
      fil: [
        "Patutunguhan: Ryczywół / tirahan Wilczkowice Górne 40, 26-900 Kozienice.",
        "Public transport: pumunta sa Warszawa Zachodnia, pagkatapos sumakay ng bus o minibus papuntang Kozienice.",
        "Huling bahagi: mula Kozienice, pumunta sa direksyon ng Ryczywół o Ryczywół Szklarnia. Kung walang biyahe, huwag magpatuloy mag-isa.",
        "Kotse/taxi: ilagay ang Wilczkowice Górne 40, 26-900 Kozienice o Ryczywół Szklarnia, ayon sa instruction ng contact.",
        "Problema: kung ma-stuck ka sa Warsaw o Kozienice, manatili sa lugar at tawagan si Ludmila o ang coordinator."
      ],
      id: [
        "Tujuan: Ryczywół / akomodasi Wilczkowice Górne 40, 26-900 Kozienice.",
        "Transportasi umum: pergi ke Warszawa Zachodnia, lalu naik bus atau minibus ke Kozienice.",
        "Bagian terakhir: dari Kozienice pergi ke arah Ryczywół atau Ryczywół Szklarnia. Jika tidak ada koneksi, jangan lanjut sendirian.",
        "Mobil/taksi: masukkan Wilczkowice Górne 40, 26-900 Kozienice atau Ryczywół Szklarnia, sesuai instruksi kontak.",
        "Masalah: jika terjebak di Warsaw atau Kozienice, tetap di tempat dan telepon Ludmila atau koordinator."
      ],
      ne: [
        "गन्तव्य: Ryczywół / accommodation Wilczkowice Górne 40, 26-900 Kozienice.",
        "सार्वजनिक यातायात: Warszawa Zachodnia जानुहोस्, त्यसपछि bus वा minibus बाट Kozienice जानुहोस्.",
        "अन्तिम भाग: Kozienice बाट Ryczywół वा Ryczywół Szklarnia तर्फ जानुहोस्। connection छैन भने एक्लै अगाडि नजानुहोस्.",
        "कार/taxi: contact को instruction अनुसार Wilczkowice Górne 40, 26-900 Kozienice वा Ryczywół Szklarnia राख्नुहोस्.",
        "समस्या: Warsaw वा Kozienice मा अड्किनुभयो भने त्यहीँ बस्नुहोस् र Ludmila वा coordinator लाई call गर्नुहोस्."
      ]
    }
  };

  Object.entries(completeRoutes).forEach(([key, route]) => setRoute(key, route));

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
