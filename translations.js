(function () {
  const labels = {
    pl: {
      travelTo: "Jedziesz do",
      emergency: "W razie problemu",
      lostTitle: "Nie wiesz gdzie wysiąść albo nie możesz znaleźć wejścia?",
      lostText: "Nie jedź dalej w ciemno. Otwórz mapę albo przejdź do listy kontaktów dla tej lokalizacji.",
      map: "Mapa",
      googleMaps: "Google Maps",
      numbers: "Numery",
      whatsapp: "WhatsApp",
      copyAddress: "Kopiuj adres",
      contactTitle: "Kontakt w razie problemu",
      contactHint: "Wybierz osobę z listy. Numery i WhatsApp są tylko dla wybranej lokalizacji.",
      phone: "Telefon",
      accommodation: "Zakwaterowanie",
      recruitment: "Rekrutacja",
      coordinator: "Koordynator",
      recruiter: "Rekruter",
      hr: "Kadry",
      contact: "Kontakt"
    },
    uk: {
      travelTo: "Ви їдете до",
      emergency: "У разі проблеми",
      lostTitle: "Не знаєте, де вийти або де знайти вхід?",
      lostText: "Не їдьте далі навмання. Відкрийте карту або перейдіть до контактів для цієї локації.",
      map: "Карта",
      googleMaps: "Google Maps",
      numbers: "Номери",
      whatsapp: "WhatsApp",
      copyAddress: "Скопіювати адресу",
      contactTitle: "Контакт у разі проблеми",
      contactHint: "Виберіть людину зі списку. Номери та WhatsApp показані тільки для вибраної локації.",
      phone: "Телефон",
      accommodation: "Проживання",
      recruitment: "Рекрутація",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадри",
      contact: "Контакт"
    },
    ru: {
      travelTo: "Вы едете в",
      emergency: "Если возникла проблема",
      lostTitle: "Не знаете, где выйти или где найти вход?",
      lostText: "Не едьте дальше наугад. Откройте карту или перейдите к контактам для этой локации.",
      map: "Карта",
      googleMaps: "Google Maps",
      numbers: "Номера",
      whatsapp: "WhatsApp",
      copyAddress: "Скопировать адрес",
      contactTitle: "Контакт в случае проблемы",
      contactHint: "Выберите человека из списка. Номера и WhatsApp показаны только для выбранной локации.",
      phone: "Телефон",
      accommodation: "Проживание",
      recruitment: "Рекрутация",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадры",
      contact: "Контакт"
    },
    en: {
      travelTo: "You are going to",
      emergency: "If there is a problem",
      lostTitle: "Not sure where to get off or where the entrance is?",
      lostText: "Do not continue guessing. Open the map or go to the contact list for this location.",
      map: "Map",
      googleMaps: "Google Maps",
      numbers: "Numbers",
      whatsapp: "WhatsApp",
      copyAddress: "Copy address",
      contactTitle: "Contact if there is a problem",
      contactHint: "Choose a person from the list. Phone numbers and WhatsApp are shown only for the selected location.",
      phone: "Phone",
      accommodation: "Accommodation",
      recruitment: "Recruitment",
      coordinator: "Coordinator",
      recruiter: "Recruiter",
      hr: "HR",
      contact: "Contact"
    },
    ka: {
      travelTo: "მიდიხართ",
      emergency: "პრობლემის შემთხვევაში",
      lostTitle: "არ იცით სად ჩამოხვიდეთ ან სად არის შესასვლელი?",
      lostText: "ნუ წახვალთ ბრმად. გახსენით რუკა ან გადადით ამ ლოკაციის კონტაქტების სიაზე.",
      map: "რუკა",
      googleMaps: "Google Maps",
      numbers: "ნომრები",
      whatsapp: "WhatsApp",
      copyAddress: "მისამართის კოპირება",
      contactTitle: "კონტაქტი პრობლემის შემთხვევაში",
      contactHint: "აირჩიეთ ადამიანი სიიდან. ნომრები და WhatsApp ნაჩვენებია მხოლოდ არჩეული ლოკაციისთვის.",
      phone: "ტელეფონი",
      accommodation: "საცხოვრებელი",
      recruitment: "რეკრუტაცია",
      coordinator: "კოორდინატორი",
      recruiter: "რეკრუტერი",
      hr: "კადრები",
      contact: "კონტაქტი"
    },
    az: {
      travelTo: "Gedirsiniz",
      emergency: "Problem olarsa",
      lostTitle: "Harada düşəcəyinizi və ya girişi harada tapacağınızı bilmirsiniz?",
      lostText: "Təxminlə davam etməyin. Xəritəni açın və ya bu məkan üçün əlaqə siyahısına keçin.",
      map: "Xəritə",
      googleMaps: "Google Maps",
      numbers: "Nömrələr",
      whatsapp: "WhatsApp",
      copyAddress: "Ünvanı kopyala",
      contactTitle: "Problem olarsa əlaqə",
      contactHint: "Siyahıdan bir nəfəri seçin. Nömrələr və WhatsApp yalnız seçilmiş məkan üçündür.",
      phone: "Telefon",
      accommodation: "Yaşayış",
      recruitment: "Rekrutasiya",
      coordinator: "Koordinator",
      recruiter: "Rekruter",
      hr: "Kadrlar",
      contact: "Əlaqə"
    }
  };

  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));

  function lang() {
    const params = new URLSearchParams(location.search);
    const code = params.get("lang") || document.documentElement.lang || "pl";
    return labels[code] ? code : "pl";
  }

  function t(key) {
    return labels[lang()][key] || labels.pl[key] || key;
  }

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function role(value) {
    return String(value || "")
      .replace(/Zakwaterowanie/g, t("accommodation"))
      .replace(/Rekrutacja/g, t("recruitment"))
      .replace(/Koordynacja/g, t("coordinator"))
      .replace(/Koordynator/g, t("coordinator"))
      .replace(/Rekruter/g, t("recruiter"))
      .replace(/Kadry/g, t("hr"))
      .replace(/Kontakt/g, t("contact"));
  }

  function setText(selector, value) {
    const node = q(selector);
    if (node) node.textContent = value;
  }

  function normalizeContacts() {
    setText("#contactsPage h2", t("contactTitle"));
    setText("#contactsPage > p strong", t("contactHint"));
    qa("#contactsPage .contact-role").forEach((node) => {
      node.textContent = role(node.textContent);
    });
    qa("#contactsPage .contact-phone").forEach((link) => {
      const number = `+${digits(link.textContent)}`;
      link.href = `tel:${number}`;
      link.textContent = `${t("phone")} ${number}`;
    });
    qa("#contactsPage .contact-whatsapp").forEach((link) => {
      const phone = link.closest(".contact-card")?.querySelector(".contact-phone")?.textContent || "";
      const number = digits(phone);
      if (number) link.href = `https://wa.me/${number}`;
      link.textContent = t("whatsapp");
    });
  }

  function applyTranslations() {
    if (!q("#translatedCandidateCss")) {
      const style = document.createElement("style");
      style.id = "translatedCandidateCss";
      style.textContent = ".contact-card a::before{content:\"\"!important}";
      document.head.appendChild(style);
    }

    setText(".mobile-hero-label", t("travelTo"));
    setText(".help-copy span", t("emergency"));
    setText(".help-copy h2", t("lostTitle"));
    setText(".help-copy p", t("lostText"));

    qa('[data-help-action="maps"]').forEach((button) => {
      button.textContent = button.closest(".help-actions") ? t("googleMaps") : t("map");
    });
    qa('[data-help-action="call"]').forEach((button) => {
      button.textContent = t("numbers");
    });
    qa('[data-help-action="whatsapp"]').forEach((button) => {
      button.textContent = t("whatsapp");
    });
    qa('[data-help-action="copy-address"]').forEach((button) => {
      button.textContent = t("copyAddress");
    });

    const heroRole = q(".mobile-hero-contact span");
    if (heroRole) heroRole.textContent = role(heroRole.textContent);

    normalizeContacts();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-lang], [data-location]")) {
      setTimeout(applyTranslations, 25);
      setTimeout(applyTranslations, 150);
    }
  });

  applyTranslations();
})();
