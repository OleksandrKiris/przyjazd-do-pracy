(function () {
  const $ = (id) => document.getElementById(id);
  const mapUrl = "https://maps.app.goo.gl/GJc55GLUWFPa6MMcA";
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
      contact: "Kontakt",
      contactTitle: "Kontakt w razie problemu",
      contactHint: "Wybierz osobę z listy. Numery i WhatsApp są tylko dla wybranej lokalizacji.",
      phone: "Telefon",
      accommodation: "Zakwaterowanie",
      recruitment: "Rekrutacja",
      coordinator: "Koordynator",
      recruiter: "Rekruter",
      hr: "Kadry"
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
      contact: "Контакт",
      contactTitle: "Контакт у разі проблеми",
      contactHint: "Виберіть людину зі списку. Номери та WhatsApp показані тільки для вибраної локації.",
      phone: "Телефон",
      accommodation: "Проживання",
      recruitment: "Рекрутація",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадри"
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
      contact: "Контакт",
      contactTitle: "Контакт в случае проблемы",
      contactHint: "Выберите человека из списка. Номера и WhatsApp показаны только для выбранной локации.",
      phone: "Телефон",
      accommodation: "Проживание",
      recruitment: "Рекрутация",
      coordinator: "Координатор",
      recruiter: "Рекрутер",
      hr: "Кадры"
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
      contact: "Contact",
      contactTitle: "Contact if there is a problem",
      contactHint: "Choose a person from the list. Phone numbers and WhatsApp are shown only for the selected location.",
      phone: "Phone",
      accommodation: "Accommodation",
      recruitment: "Recruitment",
      coordinator: "Coordinator",
      recruiter: "Recruiter",
      hr: "HR"
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
      contact: "კონტაქტი",
      contactTitle: "კონტაქტი პრობლემის შემთხვევაში",
      contactHint: "აირჩიეთ ადამიანი სიიდან. ნომრები და WhatsApp ნაჩვენებია მხოლოდ არჩეული ლოკაციისთვის.",
      phone: "ტელეფონი",
      accommodation: "საცხოვრებელი",
      recruitment: "რეკრუტაცია",
      coordinator: "კოორდინატორი",
      recruiter: "რეკრუტერი",
      hr: "კადრები"
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
      contact: "Əlaqə",
      contactTitle: "Problem olarsa əlaqə",
      contactHint: "Siyahıdan bir nəfəri seçin. Nömrələr və WhatsApp yalnız seçilmiş məkan üçündür.",
      phone: "Telefon",
      accommodation: "Yaşayış",
      recruitment: "Rekrutasiya",
      coordinator: "Koordinator",
      recruiter: "Rekruter",
      hr: "Kadrlar"
    }
  };

  function currentLang() {
    const params = new URLSearchParams(location.search);
    const raw = params.get("lang") || document.documentElement.lang || "pl";
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    return labels[raw] || config?.languages?.[raw] ? raw : "pl";
  }

  function tr(key) {
    const lang = currentLang();
    const extra = window.CANDIDATE_LANGUAGE_LABELS || {};
    return extra[lang]?.[key] || labels[lang]?.[key] || labels.en?.[key] || labels.pl[key] || key;
  }

  function ensureTranslatedCss() {
    if ($("translatedCandidateCss")) return;
    const style = document.createElement("style");
    style.id = "translatedCandidateCss";
    style.textContent = ".contact-card a::before{content:\"\"!important}";
    document.head.appendChild(style);
  }

  function currentPlace() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    if (!config || !config.locations) return null;
    return config.locations[currentLocationKey()] || config.locations.siechnice;
  }

  function currentLocationKey() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    if (!config || !config.locations) return "siechnice";
    const params = new URLSearchParams(location.search);
    const raw = (params.get("location") || params.get("lokalizacja") || "siechnice").toLowerCase();
    const key = raw.includes("ryczy") ? "ryczywol"
      : raw.includes("bogat") ? "bogatynia"
      : raw.includes("zgorz") ? "zgorzelec"
      : "siechnice";
    return config.locations[key] ? key : "siechnice";
  }

  function contactKeyForCurrentLocation() {
    const key = currentLocationKey();
    if (key === "bogatynia" || key === "zgorzelec") return "bogatynia_zgorzelec";
    return key;
  }

  function primaryContact() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    const place = currentPlace();
    const contacts = config?.contacts?.[contactKeyForCurrentLocation()] || [];
    const accommodation = contacts.find((person) => /zakwaterowanie/i.test(person.role || ""));
    const person = accommodation || contacts[0];
    return {
      name: person?.name || place?.name || "",
      phone: person?.phone || place?.phone || "",
      whatsapp: person?.whatsapp || person?.phone || place?.whatsapp || place?.phone || "",
      role: localizedRole(person?.role || "Kontakt")
    };
  }

  function localizedRole(role) {
    const text = String(role || "");
    return text
      .replace(/Zakwaterowanie/g, tr("accommodation"))
      .replace(/Rekrutacja/g, tr("recruitment"))
      .replace(/Koordynacja/g, tr("coordinator"))
      .replace(/Koordynator/g, tr("coordinator"))
      .replace(/Rekruter/g, tr("recruiter"))
      .replace(/Kadry/g, tr("hr"))
      .replace(/Kontakt/g, tr("contact"));
  }

  function languageBadge(code) {
    return {
      pl: "PL",
      uk: "UA",
      ru: "RU",
      en: "EN",
      az: "AZ",
      es: "ES",
      fil: "FIL",
      id: "ID",
      ne: "NE"
    }[code] || String(code || "").toUpperCase();
  }

  function improveLanguageSwitcher() {
    document.querySelectorAll("#languageGate [data-lang]").forEach((button) => {
      const code = button.dataset.lang || "";
      const label = button.querySelector("span")?.textContent.trim() || code;
      const badge = button.querySelector("small");
      button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");
      button.setAttribute("title", label);
      if (badge) badge.textContent = languageBadge(code);
    });
  }

  function ensureTopLanguageSwitcher() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    const header = document.querySelector(".topbar");
    if (!config?.languages || !header) return;

    let wrapper = $("topLanguageSwitcher");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "topLanguageSwitcher";
      wrapper.className = "top-language-switcher";
      wrapper.innerHTML = `
        <label for="topLanguageSelect">Language</label>
        <select id="topLanguageSelect" aria-label="Language"></select>
      `;
      header.appendChild(wrapper);
      wrapper.querySelector("select").addEventListener("change", (event) => {
        const nextLang = event.target.value;
        const existingButton = document.querySelector(`#languageGate [data-lang="${CSS.escape(nextLang)}"]`);
        if (existingButton) {
          existingButton.click();
          setTimeout(refresh, 0);
          return;
        }
        const url = new URL(location.href);
        url.searchParams.set("lang", nextLang);
        localStorage.setItem("arrival-guide-language", nextLang);
        location.href = url.toString();
      });
    }

    const select = $("topLanguageSelect");
    if (!select) return;
    const activeLang = currentLang();
    select.innerHTML = Object.entries(config.languages)
      .map(([code, label]) => `<option value="${escapeHtml(code)}">${escapeHtml(label)}</option>`)
      .join("");
    select.value = activeLang;
  }

  function mapsFor(place) {
    if (!place) return mapUrl;
    if (place.name === "Siechnice") return mapUrl;
    const address = Array.isArray(place.address) ? place.address.join(", ") : place.name;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery || address)}`;
  }

  function normalizePhone(phone) {
    return String(phone || "").replace(/\D/g, "");
  }

  function telHref(phone) {
    const digits = normalizePhone(phone);
    return digits ? `tel:+${digits}` : "";
  }

  function whatsappHref(phone) {
    const digits = normalizePhone(phone);
    return digits ? `https://wa.me/${digits}` : "";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function copyAddress(place) {
    const address = Array.isArray(place.address) ? place.address.join(", ") : "";
    if (!address) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(address);
      return;
    }
    const field = document.createElement("textarea");
    field.value = address;
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }

  function scrollToContacts() {
    const section = $("contactsPage");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function ensureMobileHero() {
    const place = currentPlace();
    if (!place) return;
    const contact = primaryContact();
    const address = Array.isArray(place.address) ? place.address.join(", ") : "";
    let hero = $("mobileCandidateHero");
    if (!hero) {
      hero = document.createElement("section");
      hero.id = "mobileCandidateHero";
      hero.className = "mobile-candidate-hero";
      $("instructionStart")?.insertAdjacentElement("afterend", hero);
    }

    hero.innerHTML = `
      <div class="mobile-hero-label">${escapeHtml(tr("travelTo"))}</div>
      <h2>${place.name}</h2>
      <p>${address}</p>
      <div class="mobile-hero-contact">
        <span>${contact.role}</span>
        <strong>${contact.name}</strong>
      </div>
      <div class="mobile-hero-actions">
        <button type="button" data-help-action="maps">${escapeHtml(tr("map"))}</button>
        <button type="button" data-help-action="call">${escapeHtml(tr("numbers"))}</button>
        <button type="button" data-help-action="whatsapp">${escapeHtml(tr("whatsapp"))}</button>
      </div>
    `;
  }

  function renderHelp() {
    const target = $("helpSection");
    const place = currentPlace();
    if (!target || !place) return;
    target.innerHTML = `
      <div class="help-copy">
        <span>${escapeHtml(tr("emergency"))}</span>
        <h2>${escapeHtml(tr("lostTitle"))}</h2>
        <p>${escapeHtml(tr("lostText"))}</p>
      </div>
      <div class="help-actions">
        <button type="button" data-help-action="maps">${escapeHtml(tr("googleMaps"))}</button>
        <button type="button" data-help-action="call">${escapeHtml(tr("numbers"))}</button>
        <button type="button" data-help-action="whatsapp">${escapeHtml(tr("whatsapp"))}</button>
        <button type="button" data-help-action="copy-address">${escapeHtml(tr("copyAddress"))}</button>
      </div>
    `;
  }

  function ensureStickyActions() {
    const place = currentPlace();
    if (!place) return;
    const contact = primaryContact();
    let bar = $("candidateStickyActions");
    if (!bar) {
      bar = document.createElement("nav");
      bar.id = "candidateStickyActions";
      bar.className = "candidate-sticky-actions";
      bar.setAttribute("aria-label", "Szybkie akcje");
      document.body.appendChild(bar);
    }

    bar.innerHTML = `
      <button type="button" data-help-action="maps">${escapeHtml(tr("map"))}</button>
      <button type="button" data-help-action="call">${escapeHtml(tr("numbers"))}</button>
      <button type="button" data-help-action="whatsapp">${escapeHtml(tr("whatsapp"))}</button>
    `;
    bar.dataset.phone = contact.phone;
    bar.dataset.whatsapp = contact.whatsapp;
  }

  function addContactRoles() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    const people = config?.contacts?.[contactKeyForCurrentLocation()] || [];
    const roleByName = new Map(people.map((person) => [person.name, localizedRole(person.role || "Kontakt")]));
    document.querySelectorAll("#contactsPage .contact-card").forEach((card) => {
      const name = card.querySelector("h3")?.textContent.trim();
      const role = roleByName.get(name);
      if (!role || card.querySelector(".contact-role")) return;
      const badge = document.createElement("p");
      badge.className = "contact-role";
      badge.textContent = role;
      card.querySelector("h3")?.insertAdjacentElement("afterend", badge);
    });
  }

  function contactTitleForKey(key) {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    if (key === "bogatynia_zgorzelec") return "Bogatynia / Zgorzelec";
    return config?.locations?.[key]?.name || key || tr("contact");
  }

  function renderLocationContactsOnly() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    const section = $("contactsPage");
    if (!config || !section) return;
    const key = contactKeyForCurrentLocation();
    const people = config.contacts?.[key] || [];
    const cards = people.map((person) => `
      <article class="contact-card">
        <h3>${escapeHtml(person.name)}</h3>
        <p class="contact-role">${escapeHtml(localizedRole(person.role || "Kontakt"))}</p>
        <div class="contact-actions">
          <a class="contact-phone" href="${escapeHtml(telHref(person.phone))}">${escapeHtml(`${tr("phone")} ${person.phone}`)}</a>
          <a class="contact-whatsapp" href="${escapeHtml(whatsappHref(person.whatsapp || person.phone))}" target="_blank" rel="noopener">${escapeHtml(tr("whatsapp"))}</a>
        </div>
      </article>
    `).join("");

    section.innerHTML = `
      <h2>${escapeHtml(tr("contactTitle"))}</h2>
      <h3>${escapeHtml(contactTitleForKey(key))}</h3>
      <div class="contact-grid">${cards}</div>
      <p><strong>${escapeHtml(tr("contactHint"))}</strong></p>
    `;
  }

  function fixContactPhoneLinks() {
    document.querySelectorAll("#contactsPage .contact-card a[href^='tel:']").forEach((link) => {
      const href = telHref(link.textContent);
      if (href) link.setAttribute("href", href);
    });
    document.querySelectorAll("#contactsPage .contact-whatsapp").forEach((link) => {
      const card = link.closest(".contact-card");
      const phone = card?.querySelector(".contact-phone")?.textContent || "";
      const href = whatsappHref(phone);
      if (href) link.setAttribute("href", href);
    });
  }

  function updateContactTitle() {
    const title = document.querySelector("#contactsPage h2");
    if (title) title.textContent = tr("contactTitle");
    const hint = document.querySelector("#contactsPage > p strong");
    if (hint) hint.textContent = tr("contactHint");
  }

  function contactTitleForCurrentLocation() {
    const place = currentPlace();
    if (!place) return "Siechnice";
    if (place.name === "Bogatynia" || place.name === "Zgorzelec") return "Bogatynia / Zgorzelec";
    return place.name;
  }

  function filterContacts() {
    const section = $("contactsPage");
    if (!section) return;
    const wantedTitle = contactTitleForCurrentLocation();
    Array.from(section.children).forEach((node) => {
      if (node.tagName !== "H3") return;
      const grid = node.nextElementSibling;
      const keep = node.textContent.trim() === wantedTitle;
      node.hidden = !keep;
      if (grid && grid.classList.contains("contact-grid")) grid.hidden = !keep;
    });
  }

  function refresh() {
    ensureTranslatedCss();
    improveLanguageSwitcher();
    ensureTopLanguageSwitcher();
    ensureMobileHero();
    renderHelp();
    ensureStickyActions();
    renderLocationContactsOnly();
    updateContactTitle();
    filterContacts();
    addContactRoles();
    fixContactPhoneLinks();
  }

  document.addEventListener("click", (event) => {
    const helpButton = event.target.closest("[data-help-action]");
    if (helpButton) {
      const place = currentPlace();
      const contact = primaryContact();
      if (!place) return;
      const action = helpButton.dataset.helpAction;
      if (action === "maps") open(mapsFor(place), "_blank");
      if (action === "call") scrollToContacts();
      if (action === "whatsapp") scrollToContacts();
      if (action === "copy-address") copyAddress(place);
      return;
    }

    if (event.target.closest("[data-location], [data-lang]")) {
      setTimeout(refresh, 0);
    }
  });

  document.addEventListener("click", (event) => {
    const directCallButton = event.target.closest('[data-action="call"]');
    if (!directCallButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    scrollToContacts();
  }, true);

  document.addEventListener("click", (event) => {
    const directWhatsappButton = event.target.closest('[data-action="whatsapp"]');
    if (!directWhatsappButton) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    scrollToContacts();
  }, true);

  refresh();
})();
