(function () {
  const config = window.ARRIVAL_DEFAULT_CONFIG;
  if (!config) return;

  const langs = ["pl", "ru", "uk", "en", "az", "es", "fil", "id", "ne"];
  const pick = (map, lang) => map[lang] || map.en || map.pl || "";
  const text = (pl, ru, uk, en, az, es, fil, id, ne) => ({ pl, ru, uk, en, az, es, fil, id, ne });

  config.version = 10;
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

  const ui = {
    pl: {
      moduleLabel: "Informacja dla kandydata",
      title: "Przyjazd do pracy",
      chooseLanguage: "Wybierz język",
      chooseLocation: "Wybierz lokalizację",
      chooseLocationText: "Kliknij miejsce, do którego jedziesz. Strona pokaże trasę, adres i kontakty tylko dla tej lokalizacji.",
      selectedLocation: "Wybrana lokalizacja",
      showInstruction: "Pokaż trasę",
      checkConnections: "Sprawdź połączenia",
      travelToolHint: "Najpierw sprawdź dojazd do miasta lub stacji. Potem użyj mapy do dokładnego adresu.",
      employee: "Pracownik",
      arrivalDate: "Data przyjazdu",
      location: "Lokalizacja",
      department: "Dział",
      address: "Adres",
      route: "Jak dojechać",
      workType: "Rodzaj pracy",
      arrivalRules: "Informacja o przyjeździe",
      whatToPack: "Co zabrać",
      housing: "Zakwaterowanie",
      contacts: "Kontakt",
      openMaps: "Otwórz Google Maps",
      copyAddress: "Kopiuj adres",
      call: "Zadzwoń",
      whatsapp: "WhatsApp",
      saved: "Zapisano",
      copied: "Skopiowano",
      noWeekend: "W weekend nie przyjmujemy nowych osób.",
      late: "Jeżeli się spóźniasz, od razu zadzwoń do kontaktu z tej lokalizacji.",
      reception: "Przyjmowanie osób: poniedziałek-piątek, 08:00-16:00.",
      hotelReady: "Zakwaterowanie zostało przygotowane.",
      questions: "Masz pytania? Napisz lub zadzwoń do kontaktu dla tej lokalizacji.",
      fromUkraine: "Osoba jedzie z Ukrainy",
      inPoland: "Osoba jest już w Polsce",
      fromCaucasus: "Osoba jedzie z Gruzji lub Azerbejdżanu"
    },
    ru: {
      moduleLabel: "Информация для кандидата",
      title: "Приезд на работу",
      chooseLanguage: "Выберите язык",
      chooseLocation: "Выберите локацию",
      chooseLocationText: "Нажмите место, куда вы едете. Страница покажет маршрут, адрес и контакты только для этой локации.",
      selectedLocation: "Выбранная локация",
      showInstruction: "Показать маршрут",
      checkConnections: "Проверить соединения",
      travelToolHint: "Сначала проверьте дорогу до города или станции. Потом используйте карту до точного адреса.",
      employee: "Работник",
      arrivalDate: "Дата приезда",
      location: "Локация",
      department: "Отдел",
      address: "Адрес",
      route: "Как доехать",
      workType: "Тип работы",
      arrivalRules: "Информация о приезде",
      whatToPack: "Что взять",
      housing: "Проживание",
      contacts: "Контакт",
      openMaps: "Открыть Google Maps",
      copyAddress: "Скопировать адрес",
      call: "Позвонить",
      whatsapp: "WhatsApp",
      saved: "Сохранено",
      copied: "Скопировано",
      noWeekend: "В выходные новых людей не принимаем.",
      late: "Если вы опаздываете, сразу позвоните контакту для этой локации.",
      reception: "Прием людей: понедельник-пятница, 08:00-16:00.",
      hotelReady: "Проживание подготовлено.",
      questions: "Есть вопросы? Напишите или позвоните контакту для этой локации.",
      fromUkraine: "Человек едет из Украины",
      inPoland: "Человек уже находится в Польше",
      fromCaucasus: "Человек едет из Грузии или Азербайджана"
    },
    uk: {
      moduleLabel: "Інформація для кандидата",
      title: "Приїзд на роботу",
      chooseLanguage: "Оберіть мову",
      chooseLocation: "Оберіть локацію",
      chooseLocationText: "Натисніть місце, куди ви їдете. Сторінка покаже маршрут, адресу та контакти тільки для цієї локації.",
      selectedLocation: "Обрана локація",
      showInstruction: "Показати маршрут",
      checkConnections: "Перевірити сполучення",
      travelToolHint: "Спочатку перевірте дорогу до міста або станції. Потім використайте карту до точної адреси.",
      employee: "Працівник",
      arrivalDate: "Дата приїзду",
      location: "Локація",
      department: "Відділ",
      address: "Адреса",
      route: "Як доїхати",
      workType: "Тип роботи",
      arrivalRules: "Інформація про приїзд",
      whatToPack: "Що взяти",
      housing: "Проживання",
      contacts: "Контакт",
      openMaps: "Відкрити Google Maps",
      copyAddress: "Скопіювати адресу",
      call: "Зателефонувати",
      whatsapp: "WhatsApp",
      saved: "Збережено",
      copied: "Скопійовано",
      noWeekend: "У вихідні нових людей не приймаємо.",
      late: "Якщо ви запізнюєтесь, одразу зателефонуйте контакту для цієї локації.",
      reception: "Прийом людей: понеділок-п'ятниця, 08:00-16:00.",
      hotelReady: "Проживання підготовлено.",
      questions: "Є питання? Напишіть або зателефонуйте контакту для цієї локації.",
      fromUkraine: "Людина їде з України",
      inPoland: "Людина вже знаходиться в Польщі",
      fromCaucasus: "Людина їде з Грузії або Азербайджану"
    },
    en: {
      moduleLabel: "Candidate information",
      title: "Arrival for work",
      chooseLanguage: "Choose language",
      chooseLocation: "Choose location",
      chooseLocationText: "Tap the place you are travelling to. The page will show the route, address and contacts only for that location.",
      selectedLocation: "Selected location",
      showInstruction: "Show route",
      checkConnections: "Check connections",
      travelToolHint: "First check travel to the city or station. Then use the map to the exact address.",
      employee: "Employee",
      arrivalDate: "Arrival date",
      location: "Location",
      department: "Department",
      address: "Address",
      route: "How to get there",
      workType: "Type of work",
      arrivalRules: "Arrival information",
      whatToPack: "What to bring",
      housing: "Accommodation",
      contacts: "Contact",
      openMaps: "Open Google Maps",
      copyAddress: "Copy address",
      call: "Call",
      whatsapp: "WhatsApp",
      saved: "Saved",
      copied: "Copied",
      noWeekend: "We do not receive new people on weekends.",
      late: "If you are late, call the contact for this location immediately.",
      reception: "Reception: Monday-Friday, 08:00-16:00.",
      hotelReady: "Accommodation has been prepared.",
      questions: "Questions? Message or call the contact for this location.",
      fromUkraine: "Person travels from Ukraine",
      inPoland: "Person is already in Poland",
      fromCaucasus: "Person travels from Georgia or Azerbaijan"
    },
    az: {
      moduleLabel: "Namizəd üçün məlumat",
      title: "İşə gəliş",
      chooseLanguage: "Dili seçin",
      chooseLocation: "Məkanı seçin",
      chooseLocationText: "Getdiyiniz yeri seçin. Səhifə yalnız həmin məkan üçün marşrutu, ünvanı və əlaqələri göstərəcək.",
      selectedLocation: "Seçilmiş məkan",
      showInstruction: "Marşrutu göstər",
      checkConnections: "Bağlantıları yoxla",
      travelToolHint: "Əvvəlcə şəhərə və ya stansiyaya gedişi yoxlayın. Sonra dəqiq ünvana xəritədən istifadə edin.",
      employee: "İşçi",
      arrivalDate: "Gəliş tarixi",
      location: "Məkan",
      department: "Şöbə",
      address: "Ünvan",
      route: "Necə getmək",
      workType: "İş növü",
      arrivalRules: "Gəliş məlumatı",
      whatToPack: "Nə götürmək",
      housing: "Yaşayış",
      contacts: "Əlaqə",
      openMaps: "Google Maps aç",
      copyAddress: "Ünvanı kopyala",
      call: "Zəng et",
      whatsapp: "WhatsApp",
      saved: "Yadda saxlanıldı",
      copied: "Kopyalandı",
      noWeekend: "Həftəsonu yeni insanları qəbul etmirik.",
      late: "Gecikirsinizsə, dərhal bu məkan üzrə əlaqə şəxsinə zəng edin.",
      reception: "Qəbul: bazar ertəsi-cümə, 08:00-16:00.",
      hotelReady: "Yaşayış hazırlanıb.",
      questions: "Sualınız var? Bu məkan üzrə əlaqəyə yazın və ya zəng edin.",
      fromUkraine: "Şəxs Ukraynadan gəlir",
      inPoland: "Şəxs artıq Polşadadır",
      fromCaucasus: "Şəxs Gürcüstandan və ya Azərbaycandan gəlir"
    },
    es: {
      moduleLabel: "Información para el candidato",
      title: "Llegada al trabajo",
      chooseLanguage: "Elige idioma",
      chooseLocation: "Elige ubicación",
      chooseLocationText: "Toca el lugar al que vas. La página mostrará la ruta, dirección y contactos solo para esa ubicación.",
      selectedLocation: "Ubicación elegida",
      showInstruction: "Mostrar ruta",
      checkConnections: "Comprobar conexiones",
      travelToolHint: "Primero comprueba el viaje a la ciudad o estación. Después usa el mapa hasta la dirección exacta.",
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
      contacts: "Contacto",
      openMaps: "Abrir Google Maps",
      copyAddress: "Copiar dirección",
      call: "Llamar",
      whatsapp: "WhatsApp",
      saved: "Guardado",
      copied: "Copiado",
      noWeekend: "No recibimos nuevas personas durante el fin de semana.",
      late: "Si llegas tarde, llama inmediatamente al contacto de esta ubicación.",
      reception: "Recepción: lunes-viernes, 08:00-16:00.",
      hotelReady: "El alojamiento está preparado.",
      questions: "¿Tienes preguntas? Escribe o llama al contacto de esta ubicación.",
      fromUkraine: "La persona viaja desde Ucrania",
      inPoland: "La persona ya está en Polonia",
      fromCaucasus: "La persona viaja desde Georgia o Azerbaiyán"
    },
    fil: {
      moduleLabel: "Impormasyon para sa kandidato",
      title: "Pagdating sa trabaho",
      chooseLanguage: "Piliin ang wika",
      chooseLocation: "Piliin ang lokasyon",
      chooseLocationText: "Pindutin ang lugar na pupuntahan mo. Ipapakita ng pahina ang ruta, address at kontak para lamang sa lokasyong iyon.",
      selectedLocation: "Napiling lokasyon",
      showInstruction: "Ipakita ang ruta",
      checkConnections: "Suriin ang biyahe",
      travelToolHint: "Una, suriin ang biyahe papunta sa city o station. Pagkatapos gamitin ang mapa papunta sa eksaktong address.",
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
      noWeekend: "Hindi kami tumatanggap ng bagong tao sa weekend.",
      late: "Kung mahuhuli ka, tawagan agad ang kontak para sa lokasyong ito.",
      reception: "Pagtanggap: Lunes-Biyernes, 08:00-16:00.",
      hotelReady: "Nakahanda na ang tirahan.",
      questions: "May tanong? Mag-message o tumawag sa kontak para sa lokasyong ito.",
      fromUkraine: "Ang tao ay bumiyahe mula Ukraine",
      inPoland: "Ang tao ay nasa Poland na",
      fromCaucasus: "Ang tao ay bumiyahe mula Georgia o Azerbaijan"
    },
    id: {
      moduleLabel: "Informasi untuk kandidat",
      title: "Kedatangan kerja",
      chooseLanguage: "Pilih bahasa",
      chooseLocation: "Pilih lokasi",
      chooseLocationText: "Tekan tempat tujuan Anda. Halaman akan menampilkan rute, alamat, dan kontak hanya untuk lokasi itu.",
      selectedLocation: "Lokasi dipilih",
      showInstruction: "Tampilkan rute",
      checkConnections: "Cek koneksi",
      travelToolHint: "Pertama cek perjalanan ke kota atau stasiun. Lalu gunakan peta ke alamat tepat.",
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
      noWeekend: "Kami tidak menerima orang baru pada akhir pekan.",
      late: "Jika terlambat, segera telepon kontak untuk lokasi ini.",
      reception: "Penerimaan: Senin-Jumat, 08:00-16:00.",
      hotelReady: "Akomodasi sudah disiapkan.",
      questions: "Ada pertanyaan? Kirim pesan atau telepon kontak untuk lokasi ini.",
      fromUkraine: "Orang berangkat dari Ukraina",
      inPoland: "Orang sudah berada di Polandia",
      fromCaucasus: "Orang berangkat dari Georgia atau Azerbaijan"
    },
    ne: {
      moduleLabel: "उम्मेदवारको जानकारी",
      title: "काममा आगमन",
      chooseLanguage: "भाषा छान्नुहोस्",
      chooseLocation: "स्थान छान्नुहोस्",
      chooseLocationText: "तपाईं जाने स्थान थिच्नुहोस्। पेजले त्यही स्थानको बाटो, ठेगाना र सम्पर्क मात्र देखाउनेछ।",
      selectedLocation: "छानिएको स्थान",
      showInstruction: "बाटो देखाउनुहोस्",
      checkConnections: "यात्रा जाँच गर्नुहोस्",
      travelToolHint: "पहिले शहर वा स्टेशनसम्मको यात्रा जाँच गर्नुहोस्। त्यसपछि ठ्याक्कै ठेगानासम्म नक्सा प्रयोग गर्नुहोस्।",
      employee: "कामदार",
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
      copyAddress: "ठेगाना कपी गर्नुहोस्",
      call: "कल गर्नुहोस्",
      whatsapp: "WhatsApp",
      saved: "सेभ भयो",
      copied: "कपी भयो",
      noWeekend: "सप्ताहन्तमा नयाँ मानिसहरू स्वीकार गरिँदैन।",
      late: "ढिलो भएमा, यो स्थानको सम्पर्क व्यक्तिलाई तुरुन्त कल गर्नुहोस्।",
      reception: "स्वागत: सोमबार-शुक्रबार, 08:00-16:00.",
      hotelReady: "बसोबास तयार छ।",
      questions: "प्रश्न छ? यो स्थानको सम्पर्कलाई म्यासेज वा कल गर्नुहोस्।",
      fromUkraine: "व्यक्ति युक्रेनबाट आउँदैछ",
      inPoland: "व्यक्ति पहिले नै पोल्याण्डमा छ",
      fromCaucasus: "व्यक्ति जर्जिया वा अजरबैजानबाट आउँदैछ"
    }
  };
  config.ui = ui;

  config.departments = {
    production: text("Produkcja", "Производство", "Виробництво", "Production", "İstehsal", "Producción", "Produksyon", "Produksi", "उत्पादन"),
    warehouse: text("Magazyn", "Склад", "Склад", "Warehouse", "Anbar", "Almacén", "Warehouse", "Gudang", "गोदाम"),
    greenhouse: text("Szklarnia", "Теплица", "Теплиця", "Greenhouse", "İstixana", "Invernadero", "Greenhouse", "Rumah kaca", "ग्रीनहाउस")
  };

  config.packs = {
    ukraine: {
      pl: ["paszport lub karta pobytu", "pieniądze na pierwsze dni", "pościel", "naczynia", "ładowarka do telefonu"],
      ru: ["паспорт или карта побыту", "деньги на первые дни", "постельное белье", "посуда", "зарядка для телефона"],
      uk: ["паспорт або карта побиту", "гроші на перші дні", "постільна білизна", "посуд", "зарядний пристрій"],
      en: ["passport or residence card", "money for the first days", "bedding", "dishes", "phone charger"],
      az: ["pasport və ya yaşayış kartı", "ilk günlər üçün pul", "yataq dəsti", "qab-qacaq", "telefon adapteri"],
      es: ["pasaporte o tarjeta de residencia", "dinero para los primeros días", "ropa de cama", "vajilla", "cargador de teléfono"],
      fil: ["passport o residence card", "pera para sa unang mga araw", "bedding", "pinggan/kagamitan", "phone charger"],
      id: ["paspor atau kartu tinggal", "uang untuk hari-hari pertama", "perlengkapan tidur", "peralatan makan", "charger telepon"],
      ne: ["पासपोर्ट वा residence card", "पहिलो दिनहरूको लागि पैसा", "ओछ्यानको सामान", "भाँडा", "फोन चार्जर"]
    },
    poland: {
      pl: ["dokument tożsamości", "telefon z internetem", "odzież robocza, jeśli została wydana", "rzeczy osobiste"],
      ru: ["документ личности", "телефон с интернетом", "рабочая одежда, если выдана", "личные вещи"],
      uk: ["документ особи", "телефон з інтернетом", "робочий одяг, якщо виданий", "особисті речі"],
      en: ["ID document", "phone with internet", "work clothes if issued", "personal items"],
      az: ["şəxsiyyət sənədi", "internetli telefon", "verilibsə iş geyimi", "şəxsi əşyalar"],
      es: ["documento de identidad", "teléfono con internet", "ropa de trabajo si fue entregada", "cosas personales"],
      fil: ["ID document", "teleponong may internet", "work clothes kung naibigay", "personal na gamit"],
      id: ["dokumen identitas", "telepon dengan internet", "pakaian kerja jika sudah diberikan", "barang pribadi"],
      ne: ["पहिचान कागजात", "इन्टरनेट भएको फोन", "दिइएको भए कामको कपडा", "व्यक्तिगत सामान"]
    },
    caucasus: {
      pl: ["paszport", "wiza lub dokument pobytowy", "ubezpieczenie", "pieniądze na pierwsze dni", "pościel", "naczynia"],
      ru: ["паспорт", "виза или документ пребывания", "страховка", "деньги на первые дни", "постельное белье", "посуда"],
      uk: ["паспорт", "віза або документ перебування", "страхування", "гроші на перші дні", "постільна білизна", "посуд"],
      en: ["passport", "visa or residence document", "insurance", "money for the first days", "bedding", "dishes"],
      az: ["pasport", "viza və ya yaşayış sənədi", "sığorta", "ilk günlər üçün pul", "yataq dəsti", "qab-qacaq"],
      es: ["pasaporte", "visa o documento de residencia", "seguro", "dinero para los primeros días", "ropa de cama", "vajilla"],
      fil: ["passport", "visa o residence document", "insurance", "pera para sa unang mga araw", "bedding", "pinggan/kagamitan"],
      id: ["paspor", "visa atau dokumen tinggal", "asuransi", "uang untuk hari-hari pertama", "perlengkapan tidur", "peralatan makan"],
      ne: ["पासपोर्ट", "भिसा वा residence document", "बीमा", "पहिलो दिनहरूको लागि पैसा", "ओछ्यानको सामान", "भाँडा"]
    }
  };

  const routes = {
    siechnice: {
      pl: [
        "Cel: ul. Opolska 30, 55-011 Siechnice.",
        "Najpierw dojedź do Wrocławia Głównego. To najłatwiejszy punkt przesiadki.",
        "Z Wrocławia Głównego jedź pociągiem regionalnym do stacji Siechnice albo sprawdź autobus w Jakdojade.",
        "Po wyjściu ze stacji w Siechnicach otwórz mapę do ul. Opolskiej 30. Z bagażem albo wieczorem lepiej weź taxi.",
        "Na miejscu sprawdź adres. Jeśli nie widzisz wejścia, zadzwoń do kontaktu dla Siechnic i wyślij swoją lokalizację."
      ],
      ru: [
        "Цель: ul. Opolska 30, 55-011 Siechnice.",
        "Сначала доедьте до Wrocław Główny. Это самый удобный пункт пересадки.",
        "От Wrocław Główny поезжайте региональным поездом до станции Siechnice или проверьте автобус в Jakdojade.",
        "После выхода на станции Siechnice откройте карту до ul. Opolska 30. С багажом или вечером лучше взять такси.",
        "На месте проверьте адрес. Если не видите вход, позвоните контакту для Siechnice и отправьте свою геолокацию."
      ],
      uk: [
        "Ціль: ul. Opolska 30, 55-011 Siechnice.",
        "Спочатку доїдьте до Wrocław Główny. Це найзручніший пункт пересадки.",
        "Від Wrocław Główny їдьте регіональним поїздом до станції Siechnice або перевірте автобус у Jakdojade.",
        "Після виходу на станції Siechnice відкрийте карту до ul. Opolska 30. З багажем або ввечері краще взяти таксі.",
        "На місці перевірте адресу. Якщо не бачите входу, зателефонуйте контакту для Siechnice і надішліть свою геолокацію."
      ],
      en: [
        "Destination: ul. Opolska 30, 55-011 Siechnice.",
        "First travel to Wrocław Główny. This is the easiest transfer point.",
        "From Wrocław Główny take a regional train to Siechnice station or check a bus in Jakdojade.",
        "After leaving the station in Siechnice, open the map to ul. Opolska 30. With luggage or in the evening, take a taxi.",
        "At the address, check the place. If you cannot find the entrance, call the Siechnice contact and send your location."
      ],
      az: [
        "Məqsəd: ul. Opolska 30, 55-011 Siechnice.",
        "Əvvəlcə Wrocław Główny stansiyasına gedin. Bu ən rahat keçid nöqtəsidir.",
        "Wrocław Główny-dən Siechnice stansiyasına regional qatarla gedin və ya Jakdojade-də avtobusu yoxlayın.",
        "Siechnice stansiyasından çıxanda ul. Opolska 30 üçün xəritəni açın. Baqajınız varsa və ya axşamdırsa, taksi götürün.",
        "Ünvanda yeri yoxlayın. Girişi tapa bilmirsinizsə, Siechnice əlaqəsinə zəng edin və yerinizi göndərin."
      ],
      es: [
        "Destino: ul. Opolska 30, 55-011 Siechnice.",
        "Primero llega a Wrocław Główny. Es el punto de transbordo más fácil.",
        "Desde Wrocław Główny toma un tren regional a la estación Siechnice o comprueba un autobús en Jakdojade.",
        "Al salir de la estación en Siechnice, abre el mapa hasta ul. Opolska 30. Con equipaje o por la tarde, mejor toma taxi.",
        "En el lugar, comprueba la dirección. Si no encuentras la entrada, llama al contacto de Siechnice y envía tu ubicación."
      ],
      fil: [
        "Patutunguhan: ul. Opolska 30, 55-011 Siechnice.",
        "Una, pumunta sa Wrocław Główny. Ito ang pinakamadaling transfer point.",
        "Mula Wrocław Główny, sumakay ng regional train papuntang Siechnice station o tingnan ang bus sa Jakdojade.",
        "Paglabas sa station sa Siechnice, buksan ang mapa papuntang ul. Opolska 30. Kung may bagahe o gabi na, mag-taxi.",
        "Pagdating sa address, suriin ang lugar. Kung hindi makita ang pasukan, tawagan ang contact ng Siechnice at ipadala ang iyong lokasyon."
      ],
      id: [
        "Tujuan: ul. Opolska 30, 55-011 Siechnice.",
        "Pertama pergi ke Wrocław Główny. Ini titik transit paling mudah.",
        "Dari Wrocław Główny naik kereta regional ke stasiun Siechnice atau cek bus di Jakdojade.",
        "Setelah keluar dari stasiun di Siechnice, buka peta ke ul. Opolska 30. Jika membawa bagasi atau malam hari, gunakan taksi.",
        "Di alamat, periksa tempatnya. Jika tidak menemukan pintu masuk, telepon kontak Siechnice dan kirim lokasi Anda."
      ],
      ne: [
        "गन्तव्य: ul. Opolska 30, 55-011 Siechnice.",
        "पहिले Wrocław Główny पुग्नुहोस्। यो सबैभन्दा सजिलो ट्रान्सफर स्थान हो।",
        "Wrocław Główny बाट Siechnice स्टेशनसम्म regional train लिनुहोस् वा Jakdojade मा बस जाँच गर्नुहोस्।",
        "Siechnice स्टेशनबाट निस्केपछि ul. Opolska 30 सम्म नक्सा खोल्नुहोस्। सामान धेरै छ वा साँझ छ भने taxi लिनु राम्रो हुन्छ।",
        "ठेगानामा पुगेपछि ठाउँ जाँच गर्नुहोस्। प्रवेशद्वार भेटिएन भने Siechnice सम्पर्कलाई कल गरेर आफ्नो location पठाउनुहोस्।"
      ]
    },
    zgorzelec: {
      pl: [
        "Cel: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Najpierw dojedź do Wrocławia albo bezpośrednio do Zgorzelca, jeśli masz takie połączenie.",
        "Z Wrocławia jedź pociągiem lub autobusem do Zgorzelca.",
        "Po przyjeździe do Zgorzelca otwórz mapę do adresu firmy. Ostatni odcinek możesz pokonać komunikacją miejską albo taxi.",
        "Na miejscu zgłoś się do podpisania dokumentów. Jeśli nie widzisz wejścia, zadzwoń do kontaktu dla Zgorzelca."
      ],
      ru: [
        "Цель: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Сначала доедьте до Вроцлава или напрямую до Zgorzelec, если есть такое соединение.",
        "Из Вроцлава поезжайте поездом или автобусом до Zgorzelec.",
        "После приезда в Zgorzelec откройте карту до адреса фирмы. Последний участок можно проехать городским транспортом или такси.",
        "На месте подойдите для подписания документов. Если не видите вход, позвоните контакту для Zgorzelec."
      ],
      uk: [
        "Ціль: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Спочатку доїдьте до Вроцлава або напряму до Zgorzelec, якщо є таке сполучення.",
        "З Вроцлава їдьте поїздом або автобусом до Zgorzelec.",
        "Після приїзду в Zgorzelec відкрийте карту до адреси фірми. Останню частину можна проїхати міським транспортом або таксі.",
        "На місці зверніться для підписання документів. Якщо не бачите входу, зателефонуйте контакту для Zgorzelec."
      ],
      en: [
        "Destination: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "First travel to Wrocław or directly to Zgorzelec if you have that connection.",
        "From Wrocław take a train or bus to Zgorzelec.",
        "After arriving in Zgorzelec, open the map to the company address. For the final part, use local transport or a taxi.",
        "At the site, report for document signing. If you cannot find the entrance, call the Zgorzelec contact."
      ],
      az: [
        "Məqsəd: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Əvvəlcə Wrocław-a və ya əlaqə varsa birbaşa Zgorzelec-ə gedin.",
        "Wrocław-dan Zgorzelec-ə qatar və ya avtobusla gedin.",
        "Zgorzelec-ə çatdıqdan sonra şirkət ünvanına xəritəni açın. Son hissəni yerli nəqliyyat və ya taksi ilə gedə bilərsiniz.",
        "Yerində sənədləri imzalamaq üçün müraciət edin. Girişi tapa bilmirsinizsə, Zgorzelec əlaqəsinə zəng edin."
      ],
      es: [
        "Destino: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Primero llega a Wrocław o directamente a Zgorzelec si tienes esa conexión.",
        "Desde Wrocław toma tren o autobús a Zgorzelec.",
        "Al llegar a Zgorzelec, abre el mapa hasta la dirección de la empresa. El último tramo puedes hacerlo en transporte local o taxi.",
        "En el lugar, preséntate para firmar documentos. Si no encuentras la entrada, llama al contacto de Zgorzelec."
      ],
      fil: [
        "Patutunguhan: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Una, pumunta sa Wrocław o diretso sa Zgorzelec kung may ganoong biyahe.",
        "Mula Wrocław, sumakay ng train o bus papuntang Zgorzelec.",
        "Pagdating sa Zgorzelec, buksan ang mapa papunta sa address ng kumpanya. Para sa huling bahagi, gumamit ng local transport o taxi.",
        "Sa lugar, mag-report para sa pagpirma ng dokumento. Kung hindi makita ang pasukan, tawagan ang contact ng Zgorzelec."
      ],
      id: [
        "Tujuan: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "Pertama pergi ke Wrocław atau langsung ke Zgorzelec jika ada koneksi tersebut.",
        "Dari Wrocław naik kereta atau bus ke Zgorzelec.",
        "Setelah tiba di Zgorzelec, buka peta ke alamat perusahaan. Bagian terakhir bisa memakai transport lokal atau taksi.",
        "Di lokasi, lapor untuk tanda tangan dokumen. Jika tidak menemukan pintu masuk, telepon kontak Zgorzelec."
      ],
      ne: [
        "गन्तव्य: Citronex, ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec.",
        "पहिले Wrocław पुग्नुहोस् वा सम्भव भए सिधै Zgorzelec जानुहोस्।",
        "Wrocław बाट Zgorzelec सम्म train वा bus लिनुहोस्।",
        "Zgorzelec पुगेपछि कम्पनीको ठेगानासम्म नक्सा खोल्नुहोस्। अन्तिम भाग local transport वा taxi बाट जान सकिन्छ।",
        "स्थानमा पुगेपछि कागजातमा हस्ताक्षरका लागि रिपोर्ट गर्नुहोस्। प्रवेशद्वार भेटिएन भने Zgorzelec सम्पर्कलाई कल गर्नुहोस्।"
      ]
    },
    bogatynia: {
      pl: [
        "Cel: Niedów 9, 59-900 Niedów. Trasa zwykle prowadzi przez Wrocław i Zgorzelec.",
        "Najpierw dojedź do Wrocławia, a potem pociągiem lub autobusem do Zgorzelca.",
        "Ze Zgorzelca sprawdź bus lub autobus w kierunku Bogatyni. W e-podróżniku wpisz trasę Zgorzelec - Bogatynia.",
        "Jeżeli dojedziesz tylko do Bogatyni, zostań tam i zadzwoń do Natalii. Ostatni odcinek do Niedowa najlepiej ustalić telefonicznie.",
        "Nie jedź w ciemno do innej miejscowości. Jeśli nie jesteś pewien, zostań w Zgorzelcu albo Bogatyni i zadzwoń."
      ],
      ru: [
        "Цель: Niedów 9, 59-900 Niedów. Маршрут обычно идет через Вроцлав и Zgorzelec.",
        "Сначала доедьте до Вроцлава, потом поездом или автобусом до Zgorzelec.",
        "Из Zgorzelec проверьте бус или автобус в сторону Bogatynia. В e-podróżnik введите маршрут Zgorzelec - Bogatynia.",
        "Если вы доехали только до Bogatynia, оставайтесь там и позвоните Nataliia. Последний участок до Niedów лучше согласовать по телефону.",
        "Не едьте наугад в другой город. Если не уверены, оставайтесь в Zgorzelec или Bogatynia и звоните."
      ],
      uk: [
        "Ціль: Niedów 9, 59-900 Niedów. Маршрут зазвичай проходить через Вроцлав і Zgorzelec.",
        "Спочатку доїдьте до Вроцлава, потім поїздом або автобусом до Zgorzelec.",
        "Із Zgorzelec перевірте бус або автобус у напрямку Bogatynia. В e-podróżnik введіть маршрут Zgorzelec - Bogatynia.",
        "Якщо ви доїхали тільки до Bogatynia, залишайтеся там і зателефонуйте Nataliia. Останню частину до Niedów краще узгодити телефоном.",
        "Не їдьте навмання в інше місто. Якщо не впевнені, залишайтеся в Zgorzelec або Bogatynia і телефонуйте."
      ],
      en: [
        "Destination: Niedów 9, 59-900 Niedów. The route usually goes through Wrocław and Zgorzelec.",
        "First travel to Wrocław, then by train or bus to Zgorzelec.",
        "From Zgorzelec check a bus toward Bogatynia. In e-podróżnik enter the route Zgorzelec - Bogatynia.",
        "If you reach only Bogatynia, stay there and call Nataliia. The final part to Niedów is best confirmed by phone.",
        "Do not continue blindly to another town. If you are not sure, stay in Zgorzelec or Bogatynia and call."
      ],
      az: [
        "Məqsəd: Niedów 9, 59-900 Niedów. Marşrut adətən Wrocław və Zgorzelec üzərindən keçir.",
        "Əvvəlcə Wrocław-a, sonra qatar və ya avtobusla Zgorzelec-ə gedin.",
        "Zgorzelec-dən Bogatynia istiqamətində bus və ya avtobus yoxlayın. e-podróżnik-də Zgorzelec - Bogatynia marşrutunu yazın.",
        "Yalnız Bogatynia-ya çatsanız, orada qalın və Nataliia-ya zəng edin. Niedów-a son hissəni telefonla dəqiqləşdirmək yaxşıdır.",
        "Başqa şəhərə təxminlə getməyin. Əmin deyilsinizsə, Zgorzelec və ya Bogatynia-da qalın və zəng edin."
      ],
      es: [
        "Destino: Niedów 9, 59-900 Niedów. La ruta normalmente va por Wrocław y Zgorzelec.",
        "Primero llega a Wrocław y después en tren o autobús a Zgorzelec.",
        "Desde Zgorzelec comprueba un bus o autobús hacia Bogatynia. En e-podróżnik escribe la ruta Zgorzelec - Bogatynia.",
        "Si llegas solo a Bogatynia, quédate allí y llama a Nataliia. Es mejor confirmar por teléfono el último tramo a Niedów.",
        "No sigas a otra ciudad sin estar seguro. Si tienes dudas, quédate en Zgorzelec o Bogatynia y llama."
      ],
      fil: [
        "Patutunguhan: Niedów 9, 59-900 Niedów. Karaniwang dumadaan ang ruta sa Wrocław at Zgorzelec.",
        "Una, pumunta sa Wrocław, pagkatapos train o bus papuntang Zgorzelec.",
        "Mula Zgorzelec, tingnan ang bus papuntang Bogatynia. Sa e-podróżnik, ilagay ang rutang Zgorzelec - Bogatynia.",
        "Kung hanggang Bogatynia ka lang nakarating, manatili roon at tawagan si Nataliia. Mas mabuting kumpirmahin sa telepono ang huling bahagi papuntang Niedów.",
        "Huwag magpatuloy nang hindi sigurado sa ibang bayan. Kung hindi sigurado, manatili sa Zgorzelec o Bogatynia at tumawag."
      ],
      id: [
        "Tujuan: Niedów 9, 59-900 Niedów. Rute biasanya melalui Wrocław dan Zgorzelec.",
        "Pertama pergi ke Wrocław, lalu naik kereta atau bus ke Zgorzelec.",
        "Dari Zgorzelec cek bus menuju Bogatynia. Di e-podróżnik masukkan rute Zgorzelec - Bogatynia.",
        "Jika hanya sampai Bogatynia, tetap di sana dan telepon Nataliia. Bagian terakhir ke Niedów sebaiknya dikonfirmasi lewat telepon.",
        "Jangan lanjut menebak ke kota lain. Jika tidak yakin, tetap di Zgorzelec atau Bogatynia dan telepon."
      ],
      ne: [
        "गन्तव्य: Niedów 9, 59-900 Niedów. बाटो सामान्यतया Wrocław र Zgorzelec हुँदै जान्छ।",
        "पहिले Wrocław पुग्नुहोस्, त्यसपछि train वा bus बाट Zgorzelec जानुहोस्।",
        "Zgorzelec बाट Bogatynia तर्फ bus जाँच गर्नुहोस्। e-podróżnik मा Zgorzelec - Bogatynia route राख्नुहोस्।",
        "यदि Bogatynia सम्म मात्र पुग्नुभयो भने, त्यहीँ बस्नुहोस् र Nataliia लाई कल गर्नुहोस्। Niedów सम्मको अन्तिम भाग फोनमा पुष्टि गर्नु राम्रो हुन्छ।",
        "निश्चित नभई अर्को शहरतर्फ नजानुहोस्। शंका भए Zgorzelec वा Bogatynia मा बस्नुहोस् र कल गर्नुहोस्।"
      ]
    },
    ryczywol: {
      pl: [
        "Cel: Ryczywół / zakwaterowanie Wilczkowice Górne 40, 26-900 Kozienice.",
        "Najpierw dojedź do Warszawy Zachodniej. To najłatwiejszy punkt przesiadki.",
        "Z Warszawy Zachodniej sprawdź autobus lub bus do Kozienic.",
        "Z Kozienic jedź w kierunku Ryczywołu lub Ryczywół Szklarnia. Jeżeli nie ma kursu, nie jedź dalej samodzielnie.",
        "Jeśli utkniesz w Warszawie albo Kozienicach, zostań w miejscu i zadzwoń do Ludmiły lub koordynatora."
      ],
      ru: [
        "Цель: Ryczywół / проживание Wilczkowice Górne 40, 26-900 Kozienice.",
        "Сначала доедьте до Warszawa Zachodnia. Это самый удобный пункт пересадки.",
        "От Warszawa Zachodnia проверьте автобус или бус до Kozienice.",
        "Из Kozienice ехайте в сторону Ryczywół или Ryczywół Szklarnia. Если рейса нет, не продолжайте самостоятельно.",
        "Если вы застряли в Варшаве или Kozienice, оставайтесь на месте и звоните Ludmiła или координатору."
      ],
      uk: [
        "Ціль: Ryczywół / проживання Wilczkowice Górne 40, 26-900 Kozienice.",
        "Спочатку доїдьте до Warszawa Zachodnia. Це найзручніший пункт пересадки.",
        "Від Warszawa Zachodnia перевірте автобус або бус до Kozienice.",
        "Із Kozienice їдьте в напрямку Ryczywół або Ryczywół Szklarnia. Якщо рейсу немає, не продовжуйте самостійно.",
        "Якщо ви застрягли у Варшаві або Kozienice, залишайтеся на місці і телефонуйте Ludmiła або координатору."
      ],
      en: [
        "Destination: Ryczywół / accommodation Wilczkowice Górne 40, 26-900 Kozienice.",
        "First travel to Warszawa Zachodnia. This is the easiest transfer point.",
        "From Warszawa Zachodnia check a bus or minibus to Kozienice.",
        "From Kozienice go toward Ryczywół or Ryczywół Szklarnia. If there is no connection, do not continue alone.",
        "If you get stuck in Warsaw or Kozienice, stay where you are and call Ludmiła or the coordinator."
      ],
      az: [
        "Məqsəd: Ryczywół / yaşayış Wilczkowice Górne 40, 26-900 Kozienice.",
        "Əvvəlcə Warszawa Zachodnia-ya gedin. Bu ən rahat keçid nöqtəsidir.",
        "Warszawa Zachodnia-dan Kozienice-yə avtobus və ya mikroavtobus yoxlayın.",
        "Kozienice-dən Ryczywół və ya Ryczywół Szklarnia istiqamətinə gedin. Reys yoxdursa, tək davam etməyin.",
        "Warszawa və ya Kozienice-də qalsanız, olduğunuz yerdə qalın və Ludmiła-ya və ya koordinatora zəng edin."
      ],
      es: [
        "Destino: Ryczywół / alojamiento Wilczkowice Górne 40, 26-900 Kozienice.",
        "Primero llega a Warszawa Zachodnia. Es el punto de transbordo más fácil.",
        "Desde Warszawa Zachodnia comprueba un autobús o minibús a Kozienice.",
        "Desde Kozienice ve hacia Ryczywół o Ryczywół Szklarnia. Si no hay conexión, no continúes solo.",
        "Si te quedas bloqueado en Varsovia o Kozienice, quédate donde estás y llama a Ludmiła o al coordinador."
      ],
      fil: [
        "Patutunguhan: Ryczywół / tirahan Wilczkowice Górne 40, 26-900 Kozienice.",
        "Una, pumunta sa Warszawa Zachodnia. Ito ang pinakamadaling transfer point.",
        "Mula Warszawa Zachodnia, tingnan ang bus o minibus papuntang Kozienice.",
        "Mula Kozienice, pumunta sa direksyon ng Ryczywół o Ryczywół Szklarnia. Kung walang biyahe, huwag magpatuloy mag-isa.",
        "Kung ma-stuck ka sa Warsaw o Kozienice, manatili sa lugar at tawagan si Ludmiła o ang coordinator."
      ],
      id: [
        "Tujuan: Ryczywół / akomodasi Wilczkowice Górne 40, 26-900 Kozienice.",
        "Pertama pergi ke Warszawa Zachodnia. Ini titik transit paling mudah.",
        "Dari Warszawa Zachodnia cek bus atau minibus ke Kozienice.",
        "Dari Kozienice pergi ke arah Ryczywół atau Ryczywół Szklarnia. Jika tidak ada koneksi, jangan lanjut sendirian.",
        "Jika terjebak di Warsaw atau Kozienice, tetap di tempat dan telepon Ludmiła atau koordinator."
      ],
      ne: [
        "गन्तव्य: Ryczywół / बसोबास Wilczkowice Górne 40, 26-900 Kozienice.",
        "पहिले Warszawa Zachodnia पुग्नुहोस्। यो सबैभन्दा सजिलो ट्रान्सफर स्थान हो।",
        "Warszawa Zachodnia बाट Kozienice जाने bus वा minibus जाँच गर्नुहोस्।",
        "Kozienice बाट Ryczywół वा Ryczywół Szklarnia तर्फ जानुहोस्। connection छैन भने एक्लै अगाडि नजानुहोस्।",
        "Warsaw वा Kozienice मा अड्किनुभयो भने, त्यहीँ बस्नुहोस् र Ludmiła वा coordinator लाई कल गर्नुहोस्।"
      ]
    }
  };

  const notes = {
    siechnice: text(
      "Jeśli nie możesz znaleźć wejścia, zadzwoń do kontaktu dla Siechnic i wyślij swoją lokalizację.",
      "Если не можете найти вход, позвоните контакту для Siechnice и отправьте свою геолокацию.",
      "Якщо не можете знайти вхід, зателефонуйте контакту для Siechnice і надішліть свою геолокацію.",
      "If you cannot find the entrance, call the Siechnice contact and send your location.",
      "Girişi tapa bilmirsinizsə, Siechnice əlaqəsinə zəng edin və yerinizi göndərin.",
      "Si no encuentras la entrada, llama al contacto de Siechnice y envía tu ubicación.",
      "Kung hindi makita ang pasukan, tawagan ang contact ng Siechnice at ipadala ang iyong lokasyon.",
      "Jika tidak menemukan pintu masuk, telepon kontak Siechnice dan kirim lokasi Anda.",
      "प्रवेशद्वार भेटिएन भने Siechnice सम्पर्कलाई कल गरेर आफ्नो location पठाउनुहोस्।"
    ),
    zgorzelec: text(
      "Po przyjeździe zgłoś się do podpisania dokumentów. Kontakt: Anastasiia Derepa, +48 797 684 159.",
      "После приезда подойдите для подписания документов. Контакт: Anastasiia Derepa, +48 797 684 159.",
      "Після приїзду зверніться для підписання документів. Контакт: Anastasiia Derepa, +48 797 684 159.",
      "After arrival, report for document signing. Contact: Anastasiia Derepa, +48 797 684 159.",
      "Gəldikdən sonra sənədləri imzalamaq üçün müraciət edin. Əlaqə: Anastasiia Derepa, +48 797 684 159.",
      "Al llegar, preséntate para firmar documentos. Contacto: Anastasiia Derepa, +48 797 684 159.",
      "Pagdating, mag-report para sa pagpirma ng dokumento. Contact: Anastasiia Derepa, +48 797 684 159.",
      "Setelah tiba, lapor untuk tanda tangan dokumen. Kontak: Anastasiia Derepa, +48 797 684 159.",
      "पुगेपछि कागजातमा हस्ताक्षरका लागि रिपोर्ट गर्नुहोस्। सम्पर्क: Anastasiia Derepa, +48 797 684 159."
    ),
    bogatynia: text(
      "Po przyjeździe zadzwoń do Natalii: +48 609 809 601.",
      "После приезда позвоните Nataliia: +48 609 809 601.",
      "Після приїзду зателефонуйте Nataliia: +48 609 809 601.",
      "After arrival, call Nataliia: +48 609 809 601.",
      "Gəldikdən sonra Nataliia-ya zəng edin: +48 609 809 601.",
      "Al llegar, llama a Nataliia: +48 609 809 601.",
      "Pagdating, tawagan si Nataliia: +48 609 809 601.",
      "Setelah tiba, telepon Nataliia: +48 609 809 601.",
      "पुगेपछि Nataliia लाई कल गर्नुहोस्: +48 609 809 601."
    ),
    ryczywol: text(
      "Po przyjeździe zadzwoń do Ludmiły: +48 536 110 591.",
      "После приезда позвоните Ludmiła: +48 536 110 591.",
      "Після приїзду зателефонуйте Ludmiła: +48 536 110 591.",
      "After arrival, call Ludmiła: +48 536 110 591.",
      "Gəldikdən sonra Ludmiła-ya zəng edin: +48 536 110 591.",
      "Al llegar, llama a Ludmiła: +48 536 110 591.",
      "Pagdating, tawagan si Ludmiła: +48 536 110 591.",
      "Setelah tiba, telepon Ludmiła: +48 536 110 591.",
      "पुगेपछि Ludmiła लाई कल गर्नुहोस्: +48 536 110 591."
    )
  };

  const work = {
    production: {
      pl: ["produkcja", "prace pomocnicze", "pakowanie"],
      ru: ["производство", "вспомогательные работы", "упаковка"],
      uk: ["виробництво", "допоміжні роботи", "пакування"],
      en: ["production", "support tasks", "packing"],
      az: ["istehsal", "köməkçi işlər", "qablaşdırma"],
      es: ["producción", "trabajos auxiliares", "empaque"],
      fil: ["produksyon", "support tasks", "pagpa-pack"],
      id: ["produksi", "tugas pendukung", "pengemasan"],
      ne: ["उत्पादन", "सहायक काम", "प्याकिङ"]
    },
    warehouse: {
      pl: ["magazyn", "sortowanie", "kompletacja zamówień"],
      ru: ["склад", "сортировка", "комплектация заказов"],
      uk: ["склад", "сортування", "комплектація замовлень"],
      en: ["warehouse", "sorting", "order picking"],
      az: ["anbar", "çeşidləmə", "sifariş toplama"],
      es: ["almacén", "clasificación", "preparación de pedidos"],
      fil: ["warehouse", "sorting", "order picking"],
      id: ["gudang", "penyortiran", "pengambilan pesanan"],
      ne: ["गोदाम", "छनोट", "अर्डर तयार गर्ने"]
    },
    greenhouse: {
      pl: ["szklarnia", "pielęgnacja roślin", "zbiory"],
      ru: ["теплица", "уход за растениями", "сбор урожая"],
      uk: ["теплиця", "догляд за рослинами", "збір урожаю"],
      en: ["greenhouse", "plant care", "harvesting"],
      az: ["istixana", "bitki baxımı", "yığım"],
      es: ["invernadero", "cuidado de plantas", "cosecha"],
      fil: ["greenhouse", "pag-aalaga ng halaman", "pag-aani"],
      id: ["rumah kaca", "perawatan tanaman", "panen"],
      ne: ["ग्रीनहाउस", "बिरुवा हेरचाह", "कटाइ"]
    }
  };

  const linkText = {
    trainWroSie: text("1. Pociąg: Wrocław Główny → Siechnice", "1. Поезд: Wrocław Główny → Siechnice", "1. Поїзд: Wrocław Główny → Siechnice", "1. Train: Wrocław Główny → Siechnice", "1. Qatar: Wrocław Główny → Siechnice", "1. Tren: Wrocław Główny → Siechnice", "1. Train: Wrocław Główny → Siechnice", "1. Kereta: Wrocław Główny → Siechnice", "1. Train: Wrocław Główny → Siechnice"),
    cityWroOpolska: text("2. Miasto: Wrocław Główny → Opolska 30", "2. Город: Wrocław Główny → Opolska 30", "2. Місто: Wrocław Główny → Opolska 30", "2. City transport: Wrocław Główny → Opolska 30", "2. Şəhər nəqliyyatı: Wrocław Główny → Opolska 30", "2. Transporte urbano: Wrocław Główny → Opolska 30", "2. City transport: Wrocław Główny → Opolska 30", "2. Transport kota: Wrocław Główny → Opolska 30", "2. City transport: Wrocław Główny → Opolska 30"),
    mapExact: text("Mapa do dokładnego adresu", "Карта до точного адреса", "Карта до точної адреси", "Map to the exact address", "Dəqiq ünvana xəritə", "Mapa a la dirección exacta", "Mapa papunta sa eksaktong address", "Peta ke alamat tepat", "ठ्याक्कै ठेगानासम्म नक्सा"),
    emergency: text("Awaryjnie: trasa z mojej lokalizacji", "Аварийно: маршрут от моего местоположения", "Терміново: маршрут з моєї локації", "Emergency: route from my location", "Təcili: mənim yerimdən marşrut", "Emergencia: ruta desde mi ubicación", "Emergency: ruta mula sa aking lokasyon", "Darurat: rute dari lokasi saya", "आपतकालीन: मेरो location बाट route"),
    trainWroZgo: text("1. Pociąg: Wrocław Główny → Zgorzelec", "1. Поезд: Wrocław Główny → Zgorzelec", "1. Поїзд: Wrocław Główny → Zgorzelec", "1. Train: Wrocław Główny → Zgorzelec", "1. Qatar: Wrocław Główny → Zgorzelec", "1. Tren: Wrocław Główny → Zgorzelec", "1. Train: Wrocław Główny → Zgorzelec", "1. Kereta: Wrocław Główny → Zgorzelec", "1. Train: Wrocław Główny → Zgorzelec"),
    busZgoBog: text("3. Bus: Zgorzelec → Bogatynia", "3. Бус: Zgorzelec → Bogatynia", "3. Бус: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia", "3. Bus: Zgorzelec → Bogatynia"),
    warsawKoz: text("1. Bus/pociąg: Warszawa Zachodnia → Kozienice", "1. Бус/поезд: Warszawa Zachodnia → Kozienice", "1. Бус/поїзд: Warszawa Zachodnia → Kozienice", "1. Bus/train: Warszawa Zachodnia → Kozienice", "1. Bus/qatar: Warszawa Zachodnia → Kozienice", "1. Bus/tren: Warszawa Zachodnia → Kozienice", "1. Bus/train: Warszawa Zachodnia → Kozienice", "1. Bus/kereta: Warszawa Zachodnia → Kozienice", "1. Bus/train: Warszawa Zachodnia → Kozienice"),
    compare: text("Sprawdź alternatywne połączenie", "Проверить альтернативное соединение", "Перевірити альтернативне сполучення", "Check an alternative connection", "Alternativ bağlantını yoxla", "Comprobar conexión alternativa", "Suriin ang alternatibong biyahe", "Cek koneksi alternatif", "वैकल्पिक connection जाँच गर्नुहोस्")
  };
  const noteText = {
    main: text("Najlepszy pierwszy wybór.", "Лучший первый вариант.", "Найкращий перший варіант.", "Best first choice.", "Ən yaxşı ilk seçim.", "Mejor primera opción.", "Pinakamagandang unang opsyon.", "Pilihan pertama terbaik.", "सबैभन्दा राम्रो पहिलो विकल्प।"),
    exact: text("Użyj do ostatniego odcinka.", "Используйте для последнего участка.", "Використайте для останньої частини.", "Use for the final part.", "Son hissə üçün istifadə edin.", "Úsalo para el último tramo.", "Gamitin para sa huling bahagi.", "Gunakan untuk bagian terakhir.", "अन्तिम भागको लागि प्रयोग गर्नुहोस्।"),
    unknown: text("Gdy nie wiesz, skąd startujesz.", "Когда не знаете, откуда стартуете.", "Коли не знаєте, звідки стартуєте.", "When you do not know where you start from.", "Haradan başladığınızı bilməyəndə.", "Cuando no sabes desde dónde sales.", "Kapag hindi mo alam saan magsisimula.", "Jika tidak tahu mulai dari mana.", "कहाँबाट सुरु गर्ने थाहा नभएमा।")
  };

  const jakdojadeRoute = (city, from, to) =>
    `https://jakdojade.pl/${city}/trasa/z--${encodeURIComponent(from)}--do--${encodeURIComponent(to)}`;
  const googleTransit = (from, to) =>
    `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=transit`;
  const googleTo = (to) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(to)}&travelmode=transit`;
  const travelLink = (priority, label, note, url) => ({ priority, label, note, url });

  const routeLinks = {
    siechnice: [
      travelLink(1, linkText.trainWroSie, noteText.main, "https://koleo.pl/rozklad-pkp/wroclaw-glowny/siechnice"),
      travelLink(2, linkText.cityWroOpolska, noteText.exact, jakdojadeRoute("wroclaw", "Wrocław Główny", "Opolska 30, Siechnice")),
      travelLink(3, linkText.mapExact, noteText.exact, googleTransit("Wrocław Główny", "Opolska 30, 55-011 Siechnice")),
      travelLink(9, linkText.emergency, noteText.unknown, googleTo("Opolska 30, 55-011 Siechnice"))
    ],
    zgorzelec: [
      travelLink(1, linkText.trainWroZgo, noteText.main, "https://koleo.pl/rozklad-pkp/wroclaw-glowny/zgorzelec"),
      travelLink(2, linkText.compare, noteText.main, jakdojadeRoute("wroclaw", "Wrocław", "Zgorzelec")),
      travelLink(3, linkText.mapExact, noteText.exact, googleTransit("Zgorzelec", "Bohaterów II Armii Wojska Polskiego 64, Zgorzelec")),
      travelLink(9, linkText.emergency, noteText.unknown, googleTo("Bohaterów II Armii Wojska Polskiego 64, Zgorzelec"))
    ],
    bogatynia: [
      travelLink(1, linkText.trainWroZgo, noteText.main, "https://koleo.pl/rozklad-pkp/wroclaw-glowny/zgorzelec"),
      travelLink(2, linkText.compare, noteText.main, jakdojadeRoute("wroclaw", "Wrocław", "Zgorzelec")),
      travelLink(3, linkText.busZgoBog, noteText.exact, "https://www.e-podroznik.pl/rozklad-jazdy-pks-autobusy"),
      travelLink(4, linkText.mapExact, noteText.exact, googleTransit("Zgorzelec", "Niedów 9, 59-900 Niedów")),
      travelLink(9, linkText.emergency, noteText.unknown, googleTo("Niedów 9, 59-900 Niedów"))
    ],
    ryczywol: [
      travelLink(1, linkText.warsawKoz, noteText.main, jakdojadeRoute("warszawa", "Warszawa Zachodnia", "Kozienice")),
      travelLink(2, linkText.compare, noteText.main, "https://www.e-podroznik.pl/rozklad-jazdy-pks-autobusy"),
      travelLink(3, linkText.mapExact, noteText.exact, googleTransit("Warszawa Zachodnia", "Wilczkowice Górne 40, 26-900 Kozienice")),
      travelLink(9, linkText.emergency, noteText.unknown, googleTo("Wilczkowice Górne 40, 26-900 Kozienice"))
    ]
  };

  const locationFixes = {
    siechnice: {
      short: "ul. Opolska 30",
      address: ["ul. Opolska 30", "55-011 Siechnice", "Polska"],
      mapQuery: "ul. Opolska 30, 55-011 Siechnice, Polska",
      note: notes.siechnice,
      work: { production: work.production, warehouse: work.warehouse }
    },
    zgorzelec: {
      short: "Citronex, ul. Bohaterów II Armii Wojska Polskiego 64",
      address: ["Citronex Sp. z o.o.", "ul. Bohaterów II Armii Wojska Polskiego 64", "59-900 Zgorzelec", "Polska"],
      mapQuery: "Citronex Sp. z o.o., ul. Bohaterów II Armii Wojska Polskiego 64, 59-900 Zgorzelec, Polska",
      note: notes.zgorzelec,
      work: { warehouse: work.warehouse, production: work.production }
    },
    bogatynia: {
      short: "Niedów 9",
      address: ["Niedów 9", "59-900 Niedów", "Polska"],
      mapQuery: "Niedów 9, 59-900 Niedów, Polska",
      note: notes.bogatynia,
      work: { production: work.production, greenhouse: work.greenhouse }
    },
    ryczywol: {
      name: "Ryczywół",
      short: "Ryczywół Szklarnia",
      address: ["Wilczkowice Górne 40", "26-900 Kozienice", "Polska"],
      mapQuery: "Wilczkowice Górne 40, 26-900 Kozienice, Polska",
      note: notes.ryczywol,
      work: { greenhouse: work.greenhouse }
    }
  };

  Object.entries(routes).forEach(([key, route]) => {
    if (!config.locations || !config.locations[key]) return;
    const place = config.locations[key];
    Object.assign(place, locationFixes[key] || {});
    place.route = route;
    place.routeLinks = routeLinks[key] || [];
  });

  const contacts = config.contacts || (config.contacts = {});
  function ensureContact(group, person) {
    const list = contacts[group] || (contacts[group] = []);
    const clean = String(person.phone || "").replace(/\D/g, "");
    if (!list.some((item) => String(item.phone || "").replace(/\D/g, "") === clean)) {
      list.unshift(person);
    }
  }
  ensureContact("ryczywol", { name: "Ludmiła", phone: "+48 536 110 591", role: "Zakwaterowanie" });
  ensureContact("bogatynia_zgorzelec", { name: "Nataliia", phone: "+48 609 809 601", role: "Zakwaterowanie" });

  const candidateLabels = {
    pl: {
      travelTo: "Jedziesz do",
      emergency: "W razie problemu",
      lostTitle: "Nie wiesz, gdzie wysiąść albo gdzie jest wejście?",
      lostText: "Nie jedź dalej w ciemno. Otwórz mapę albo przejdź do kontaktów tej lokalizacji.",
      map: "Mapa",
      googleMaps: "Google Maps",
      numbers: "Numery",
      whatsapp: "WhatsApp",
      copyAddress: "Kopiuj adres",
      contact: "Kontakt",
      contactTitle: "Kontakt w razie problemu",
      contactHint: "Numery i WhatsApp są pokazane tylko dla wybranej lokalizacji.",
      phone: "Telefon",
      accommodation: "Zakwaterowanie",
      recruitment: "Rekrutacja",
      coordinator: "Koordynator",
      recruiter: "Rekruter",
      hr: "Kadry"
    },
    ru: {
      travelTo: "Вы едете в",
      emergency: "Если возникла проблема",
      lostTitle: "Не знаете, где выйти или где вход?",
      lostText: "Не продолжайте наугад. Откройте карту или перейдите к контактам этой локации.",
      map: "Карта",
      googleMaps: "Google Maps",
      numbers: "Номера",
      whatsapp: "WhatsApp",
      copyAddress: "Скопировать адрес",
      contact: "Контакт",
      contactTitle: "Контакт при проблеме",
      contactHint: "Номера и WhatsApp показаны только для выбранной локации.",
      phone: "Телефон",
      accommodation: "Проживание",
      recruitment: "Рекрутинг",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадры"
    },
    uk: {
      travelTo: "Ви їдете до",
      emergency: "У разі проблеми",
      lostTitle: "Не знаєте, де вийти або де вхід?",
      lostText: "Не їдьте далі навмання. Відкрийте карту або перейдіть до контактів цієї локації.",
      map: "Карта",
      googleMaps: "Google Maps",
      numbers: "Номери",
      whatsapp: "WhatsApp",
      copyAddress: "Скопіювати адресу",
      contact: "Контакт",
      contactTitle: "Контакт у разі проблеми",
      contactHint: "Номери та WhatsApp показані тільки для обраної локації.",
      phone: "Телефон",
      accommodation: "Проживання",
      recruitment: "Рекрутинг",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадри"
    },
    en: {
      travelTo: "You are going to",
      emergency: "If there is a problem",
      lostTitle: "Not sure where to get off or where the entrance is?",
      lostText: "Do not continue guessing. Open the map or go to contacts for this location.",
      map: "Map",
      googleMaps: "Google Maps",
      numbers: "Numbers",
      whatsapp: "WhatsApp",
      copyAddress: "Copy address",
      contact: "Contact",
      contactTitle: "Contact if there is a problem",
      contactHint: "Phone numbers and WhatsApp are shown only for the selected location.",
      phone: "Phone",
      accommodation: "Accommodation",
      recruitment: "Recruitment",
      coordinator: "Coordinator",
      recruiter: "Recruiter",
      hr: "HR"
    }
  };
  const candidateRest = {
    az: ["Siz gedirsiniz", "Problem olarsa", "Harada düşəcəyinizi və ya girişin harada olduğunu bilmirsiniz?", "Təxminlə davam etməyin. Xəritəni açın və ya bu məkanın əlaqələrinə keçin.", "Xəritə", "Nömrələr", "Ünvanı kopyala", "Əlaqə", "Problem olarsa əlaqə", "Nömrələr və WhatsApp yalnız seçilmiş məkan üçün göstərilir.", "Telefon", "Yaşayış", "Rekrutasiya", "Koordinator", "Rekruter", "Kadrlar"],
    es: ["Vas a", "Si hay un problema", "¿No sabes dónde bajar o dónde está la entrada?", "No sigas adivinando. Abre el mapa o ve a los contactos de esta ubicación.", "Mapa", "Números", "Copiar dirección", "Contacto", "Contacto si hay un problema", "Los números y WhatsApp se muestran solo para la ubicación elegida.", "Teléfono", "Alojamiento", "Reclutamiento", "Coordinador", "Reclutador", "RR. HH."],
    fil: ["Pupunta ka sa", "Kung may problema", "Hindi mo alam kung saan bababa o saan ang pasukan?", "Huwag magpatuloy nang hulaan lang. Buksan ang mapa o pumunta sa mga kontak ng lokasyong ito.", "Mapa", "Numero", "Kopyahin ang address", "Kontak", "Kontak kung may problema", "Ang mga numero at WhatsApp ay para lamang sa napiling lokasyon.", "Telepono", "Tirahan", "Rekrutment", "Koordinator", "Rekruter", "HR"],
    id: ["Anda pergi ke", "Jika ada masalah", "Tidak tahu harus turun di mana atau pintu masuknya di mana?", "Jangan lanjut menebak. Buka peta atau pergi ke kontak untuk lokasi ini.", "Peta", "Nomor", "Salin alamat", "Kontak", "Kontak jika ada masalah", "Nomor telepon dan WhatsApp hanya untuk lokasi yang dipilih.", "Telepon", "Akomodasi", "Rekrutmen", "Koordinator", "Perekrut", "HR"],
    ne: ["तपाईं जाँदै हुनुहुन्छ", "समस्या भएमा", "कहाँ झर्ने वा प्रवेशद्वार कहाँ छ थाहा छैन?", "अनुमान गरेर अगाडि नजानुहोस्। नक्सा खोल्नुहोस् वा यो स्थानको सम्पर्कमा जानुहोस्।", "नक्सा", "नम्बर", "ठेगाना कपी गर्नुहोस्", "सम्पर्क", "समस्या भएमा सम्पर्क", "नम्बर र WhatsApp छानिएको स्थानका लागि मात्र देखिन्छ।", "फोन", "बसोबास", "भर्ना", "कोर्डिनेटर", "रिक्रुटर", "HR"]
  };
  Object.entries(candidateRest).forEach(([lang, values]) => {
    candidateLabels[lang] = {
      travelTo: values[0],
      emergency: values[1],
      lostTitle: values[2],
      lostText: values[3],
      map: values[4],
      googleMaps: "Google Maps",
      numbers: values[5],
      whatsapp: "WhatsApp",
      copyAddress: values[6],
      contact: values[7],
      contactTitle: values[8],
      contactHint: values[9],
      phone: values[10],
      accommodation: values[11],
      recruitment: values[12],
      coordinator: values[13],
      recruiter: values[14],
      hr: values[15]
    };
  });
  window.CANDIDATE_LANGUAGE_LABELS = candidateLabels;

  langs.forEach((lang) => {
    if (!config.ui[lang]) config.ui[lang] = config.ui.en;
    Object.values(config.locations || {}).forEach((place) => {
      if (place.route && !place.route[lang]) place.route[lang] = place.route.en;
      if (place.note && !place.note[lang]) place.note[lang] = place.note.en;
    });
  });

  window.ARRIVAL_TRANSLATION_PICK = pick;
})();
