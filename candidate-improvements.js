(function () {
  const $ = (id) => document.getElementById(id);
  const mapUrl = "https://maps.app.goo.gl/GJc55GLUWFPa6MMcA";

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
      role: person?.role || "Kontakt"
    };
  }

  function languageBadge(code) {
    return {
      pl: "PL",
      uk: "UA",
      ru: "RU",
      en: "EN",
      ka: "GE",
      az: "AZ"
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
      <div class="mobile-hero-label">Jedziesz do</div>
      <h2>${place.name}</h2>
      <p>${address}</p>
      <div class="mobile-hero-contact">
        <span>${contact.role}</span>
        <strong>${contact.name}</strong>
      </div>
      <div class="mobile-hero-actions">
        <button type="button" data-help-action="maps">Mapa</button>
        <button type="button" data-help-action="call">Numery</button>
        <button type="button" data-help-action="whatsapp">WhatsApp</button>
      </div>
    `;
  }

  function renderHelp() {
    const target = $("helpSection");
    const place = currentPlace();
    if (!target || !place) return;
    target.innerHTML = `
      <div class="help-copy">
        <span>W razie problemu</span>
        <h2>Nie wiesz gdzie wysiąść albo nie możesz znaleźć wejścia?</h2>
        <p>Nie jedź dalej w ciemno. Zadzwoń, napisz na WhatsApp albo otwórz mapę i sprawdź adres.</p>
      </div>
      <div class="help-actions">
        <button type="button" data-help-action="maps">Google Maps</button>
        <button type="button" data-help-action="call">Numery</button>
        <button type="button" data-help-action="whatsapp">WhatsApp</button>
        <button type="button" data-help-action="copy-address">Kopiuj adres</button>
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
      <button type="button" data-help-action="maps">Mapa</button>
      <button type="button" data-help-action="call">Numery</button>
      <button type="button" data-help-action="whatsapp">WhatsApp</button>
    `;
    bar.dataset.phone = contact.phone;
    bar.dataset.whatsapp = contact.whatsapp;
  }

  function addContactRoles() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    const people = config?.contacts?.[contactKeyForCurrentLocation()] || [];
    const roleByName = new Map(people.map((person) => [person.name, person.role || "Kontakt"]));
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
    return config?.locations?.[key]?.name || key || "Kontakt";
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
        <p class="contact-role">${escapeHtml(person.role || "Kontakt")}</p>
        <div class="contact-actions">
          <a class="contact-phone" href="${escapeHtml(telHref(person.phone))}">${escapeHtml(person.phone)}</a>
          <a class="contact-whatsapp" href="${escapeHtml(whatsappHref(person.whatsapp || person.phone))}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </article>
    `).join("");

    section.innerHTML = `
      <h2>Kontakt w razie problemu</h2>
      <h3>${escapeHtml(contactTitleForKey(key))}</h3>
      <div class="contact-grid">${cards}</div>
      <p><strong>Wybierz osobę z listy. Numery i WhatsApp są tylko dla wybranej lokalizacji.</strong></p>
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
    if (title) title.textContent = "Kontakt w razie problemu";
    const hint = document.querySelector("#contactsPage > p strong");
    if (hint) hint.textContent = "Wybierz osobę z listy. Numery i WhatsApp są tylko dla wybranej lokalizacji.";
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
    improveLanguageSwitcher();
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
