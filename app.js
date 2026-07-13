(function () {
  const languageKey = "arrival-guide-language";
  let config = loadConfig();
  let state = readState();

  const $ = (id) => document.getElementById(id);
  const t = (key) => (config.ui[state.lang] && config.ui[state.lang][key]) || config.ui.pl[key] || key;

  function loadConfig() {
    return structuredClone(window.ARRIVAL_DEFAULT_CONFIG);
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const savedLang = localStorage.getItem(languageKey);
    return {
      lang: params.get("lang") || savedLang || "pl",
      name: params.get("name") || params.get("imie") || "",
      surname: params.get("surname") || params.get("nazwisko") || "",
      date: params.get("date") || params.get("data") || "",
      location: normalizeLocation(params.get("location") || params.get("lokalizacja") || "siechnice"),
      department: params.get("department") || params.get("dzial") || "production",
      hotel: ["yes", "tak", "true", "1"].includes((params.get("hotel") || "").toLowerCase()),
      country: params.get("country") || params.get("kraj") || "ukraine"
    };
  }

  function setLanguage(lang) {
    state.lang = lang;
    localStorage.setItem(languageKey, lang);
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    render();
  }

  function setLocation(locationKey) {
    state.location = normalizeLocation(locationKey);
    const url = new URL(location.href);
    url.searchParams.set("location", state.location);
    history.replaceState(null, "", url);
    render();
    $("instructionStart").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function render() {
    document.documentElement.lang = state.lang;
    renderLanguageControls();
    renderTexts();
    renderSummary();
    renderLocationTiles();
    renderGuide();
    renderContacts();
  }

  function renderLanguageControls() {
    $("languageGate").innerHTML = Object.entries(config.languages)
      .map(([code, label]) => `
        <button type="button" class="${code === state.lang ? "active" : ""}" data-lang="${code}">
          <span>${escapeHtml(label)}</span>
          <small>${escapeHtml(code.toUpperCase())}</small>
        </button>
      `)
      .join("");
  }

  function renderTexts() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
  }

  function renderSummary() {
    const place = config.locations[state.location] || config.locations.siechnice;
    const employee = [state.name, state.surname].filter(Boolean).join(" ");
    $("employeeName").textContent = employee || "-";
    $("arrivalDate").textContent = state.date || "-";
    $("locationName").textContent = place.name;
    $("departmentName").textContent = labelForDepartment(state.department);
  }

  function renderLocationTiles() {
    const target = $("locationTiles");
    if (!target) return;
    target.innerHTML = Object.entries(config.locations)
      .map(([key, place]) => `
        <button type="button" class="location-tile ${key === state.location ? "active" : ""}" data-location="${key}" style="--tile-accent:${escapeHtml(place.accent || "#d71920")}">
          <span>${escapeHtml(place.name)}</span>
          <small>${escapeHtml(place.short || place.address[0])}</small>
          <strong>${escapeHtml(t("showInstruction"))}</strong>
        </button>
      `)
      .join("");
  }

  function renderGuide() {
    const place = config.locations[state.location] || config.locations.siechnice;
    document.documentElement.style.setProperty("--primary", place.accent || "#1f7a8c");
    const address = place.address.join(", ");
    const addressHtml = place.address.map((line) => escapeHtml(line)).join("<br>");
    const workItems = localizedList(place.work[state.department] || Object.values(place.work)[0] || []);
    const packKey = state.country === "poland" ? "poland" : ["georgia", "azerbaijan", "ka", "az"].includes(state.country) ? "caucasus" : "ukraine";

    $("guide").innerHTML = `
      ${panel(t("address"), `<p>${addressHtml}</p>`)}
      ${panel(t("route"), `${list(localizedList(place.route))}${routeLinks(place.routeLinks)}`)}
      ${panel(t("workType"), list(workItems))}
      ${panel(t("arrivalRules"), `<p>${escapeHtml(t("reception"))}</p><p>${escapeHtml(t("noWeekend"))}</p><p>${escapeHtml(t("late"))}</p>`)}
      ${panel(t("whatToPack"), `<p><strong>${escapeHtml(packLabel(packKey))}</strong></p>${list(localizedList(config.packs[packKey]))}`)}
      ${state.hotel ? panel(t("housing"), `<p>${escapeHtml(t("hotelReady"))}</p>`) : ""}
      ${place.note ? panel(t("contacts"), `<p>${escapeHtml(localizedText(place.note))}</p>${place.coordinators ? list(place.coordinators) : ""}`) : ""}
      <section class="panel wide">
        <h2>${escapeHtml(place.name)}</h2>
        <div class="action-grid">
          <button type="button" data-action="maps">${escapeHtml(t("openMaps"))}</button>
          <button type="button" data-action="copy-address">${escapeHtml(t("copyAddress"))}</button>
          <button type="button" data-action="call">${escapeHtml(t("call"))}</button>
          <button type="button" data-action="whatsapp">${escapeHtml(t("whatsapp"))}</button>
        </div>
      </section>
    `;

    $("guide").querySelector('[data-action="maps"]').addEventListener("click", () => {
      open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery || address)}`, "_blank");
    });
    $("guide").querySelector('[data-action="copy-address"]').addEventListener("click", () => copyText(address));
    $("guide").querySelector('[data-action="call"]').addEventListener("click", () => { window.location.href = `tel:${place.phone}`; });
    $("guide").querySelector('[data-action="whatsapp"]').addEventListener("click", () => {
      open(`https://wa.me/${normalizePhone(place.whatsapp || place.phone)}`, "_blank");
    });
  }

  function renderContacts() {
    const groups = Object.entries(config.contacts).map(([key, people]) => {
      const title = key === "bogatynia_zgorzelec" ? "Bogatynia / Zgorzelec" : (config.locations[key] && config.locations[key].name) || key;
      const cards = people.map((person) => `
        <article class="contact-card">
          <h3>${escapeHtml(person.name)}</h3>
          <p>${escapeHtml(person.role)}</p>
          <a href="tel:${normalizePhone(person.phone)}">${escapeHtml(person.phone)}</a>
        </article>
      `).join("");
      return `<h3>${escapeHtml(title)}</h3><div class="contact-grid">${cards}</div>`;
    }).join("");
    $("contactsPage").innerHTML = `<h2>${escapeHtml(t("contacts"))}</h2>${groups}<p><strong>${escapeHtml(t("questions"))}</strong></p>`;
  }

  function panel(title, body) {
    return `<section class="panel"><h2>${escapeHtml(title)}</h2>${body}</section>`;
  }

  function list(items) {
    return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function routeLinks(links) {
    if (!links || !links.length) return "";
    return `
      <div class="route-links">
        <h3>${escapeHtml(t("checkConnections"))}</h3>
        <div>
          ${links.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`).join("")}
        </div>
      </div>
    `;
  }

  function packLabel(key) {
    if (key === "poland") return t("inPoland");
    if (key === "caucasus") return t("fromCaucasus");
    return t("fromUkraine");
  }

  function labelForDepartment(key) {
    const labels = config.departments || {};
    return (labels[key] && (labels[key][state.lang] || labels[key].pl)) || key || "-";
  }

  function localizedText(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[state.lang] || value.en || value.pl || Object.values(value)[0] || "";
    }
    return value || "";
  }

  function localizedList(value) {
    const localized = localizedText(value);
    return Array.isArray(localized) ? localized : [localized].filter(Boolean);
  }

  function normalizeLocation(value) {
    const key = String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (key.includes("ryczy")) return "ryczywol";
    if (key.includes("bogat")) return "bogatynia";
    if (key.includes("zgorz")) return "zgorzelec";
    if (key.includes("siech")) return "siechnice";
    return config?.locations?.[key] ? key : "siechnice";
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => toast(t("copied")));
  }

  function toast(message) {
    const node = $("toast");
    node.textContent = message;
    node.classList.add("show");
    setTimeout(() => node.classList.remove("show"), 1800);
  }

  function normalizePhone(phone) {
    return String(phone || "").replace(/\D/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function drawQr(text) {
    const image = $("qrImage");
    image.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(text)}`;
    image.hidden = false;
  }

  $("languageGate")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (button) setLanguage(button.dataset.lang);
  });
  $("locationTiles")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-location]");
    if (button) setLocation(button.dataset.location);
  });
  $("copyLinkBtn")?.addEventListener("click", () => copyText(location.href));
  $("qrBtn")?.addEventListener("click", () => drawQr(location.href));
  $("printBtn")?.addEventListener("click", () => print());

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }

  render();
})();
