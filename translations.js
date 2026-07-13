(function () {
  const q = (selector) => document.querySelector(selector);
  const qa = (selector) => Array.from(document.querySelectorAll(selector));
  const labels = window.CANDIDATE_LANGUAGE_LABELS || {};

  function currentLang() {
    const params = new URLSearchParams(location.search);
    const code = params.get("lang") || document.documentElement.lang || "pl";
    return labels[code] ? code : "pl";
  }

  function tr(key) {
    const lang = currentLang();
    return labels[lang]?.[key] || labels.en?.[key] || labels.pl?.[key] || key;
  }

  function digits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function role(value) {
    return String(value || "")
      .replace(/Zakwaterowanie/g, tr("accommodation"))
      .replace(/Rekrutacja/g, tr("recruitment"))
      .replace(/Koordynacja/g, tr("coordinator"))
      .replace(/Koordynator/g, tr("coordinator"))
      .replace(/Rekruter/g, tr("recruiter"))
      .replace(/Kadry/g, tr("hr"))
      .replace(/Kontakt/g, tr("contact"));
  }

  function setText(selector, value) {
    const node = q(selector);
    if (node) node.textContent = value;
  }

  function normalizeContacts() {
    setText("#contactsPage h2", tr("contactTitle"));
    setText("#contactsPage > p strong", tr("contactHint"));

    qa("#contactsPage .contact-role").forEach((node) => {
      node.textContent = role(node.textContent);
    });

    qa("#contactsPage .contact-phone").forEach((link) => {
      const number = `+${digits(link.textContent)}`;
      link.href = `tel:${number}`;
      link.textContent = `${tr("phone")} ${number}`;
    });

    qa("#contactsPage .contact-whatsapp").forEach((link) => {
      const phone = link.closest(".contact-card")?.querySelector(".contact-phone")?.textContent || "";
      const number = digits(phone);
      if (number) link.href = `https://wa.me/${number}`;
      link.textContent = tr("whatsapp");
    });
  }

  function applyTranslations() {
    if (!q("#translatedCandidateCss")) {
      const style = document.createElement("style");
      style.id = "translatedCandidateCss";
      style.textContent = ".contact-card a::before{content:\"\"!important}";
      document.head.appendChild(style);
    }

    setText(".mobile-hero-label", tr("travelTo"));
    setText(".help-copy span", tr("emergency"));
    setText(".help-copy h2", tr("lostTitle"));
    setText(".help-copy p", tr("lostText"));

    qa('[data-help-action="maps"]').forEach((button) => {
      button.textContent = button.closest(".help-actions") ? tr("googleMaps") : tr("map");
    });
    qa('[data-help-action="call"]').forEach((button) => {
      button.textContent = tr("numbers");
    });
    qa('[data-help-action="whatsapp"]').forEach((button) => {
      button.textContent = tr("whatsapp");
    });
    qa('[data-help-action="copy-address"]').forEach((button) => {
      button.textContent = tr("copyAddress");
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
