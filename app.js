(function () {
  const storageKey = "arrival-guide-config";
  const languageKey = "arrival-guide-language";
  let config = loadConfig();
  let state = readState();

  const $ = (id) => document.getElementById(id);
  const t = (key) => (config.ui[state.lang] && config.ui[state.lang][key]) || config.ui.pl[key] || key;

  function loadConfig() {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return structuredClone(window.ARRIVAL_DEFAULT_CONFIG);
    try {
      return JSON.parse(saved);
    } catch {
      return structuredClone(window.ARRIVAL_DEFAULT_CONFIG);
    }
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const savedLang = localStorage.getItem(languageKey);
    return {
      lang: params.get("lang") || savedLang || "pl",
      name: params.get("name") || params.get("imie") || "",
      surname: params.get("surname") || params.get("nazwisko") || "",
      date: params.get("date") || params.get("data") || "",
      location: params.get("location") || params.get("lokalizacja") || "siechnice",
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
    state.location = locationKey;
    const url = new URL(location.href);
    url.searchParams.set("location", locationKey);
    history.replaceState(null, "", url);
    render();
  }

  function render() {
    document.documentElement.lang = state.lang;
    renderLanguageControls();
    renderTexts();
    renderSummary();
    renderTabs();
    renderGuide();
    renderContacts();
    $("configEditor").value = JSON.stringify(config, null, 2);
  }

  function renderLanguageControls() {
    const select = $("languageSelect");
    select.innerHTML = Object.entries(config.languages)
      .map(([code, label]) => `<option value="${code}">${escapeHtml(label)}</option>`)
      .join("");
    select.value = state.lang;

    $("languageGate").innerHTML = Object.entries(config.languages)
      .map(([code, label]) => `<button type="button" data-lang="${code}">${escapeHtml(label)}</button>`)
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

  function renderTabs() {
    $("locationTabs").innerHTML = Object.entries(config.locations)
      .map(([key, place]) => `<button type="button" class="${key === state.location ? "active" : ""}" data-location="${key}">${escapeHtml(place.name)}</button>`)
      .join("");
  }

  function renderGuide() {
    const place = config.locations[state.location] || config.locations.siechnice;
    document.documentElement.style.setProperty("--primary", place.accent || "#1f7a8c");
    const address = place.address.join(", ");
    const addressHtml = place.address.map((line) => escapeHtml(line)).join("<br>");
    const workItems = place.work[state.department] || Object.values(place.work)[0] || [];
    const packKey = state.country === "poland" ? "poland" : ["georgia", "azerbaijan", "ka", "az"].includes(state.country) ? "caucasus" : "ukraine";

    $("guide").innerHTML = `
      ${panel(t("address"), `<p>${addressHtml}</p>`)}
      ${panel(t("route"), list(place.route))}
      ${panel(t("workType"), list(workItems))}
      ${panel(t("arrivalRules"), `<p>${escapeHtml(t("reception"))}</p><p>${escapeHtml(t("noWeekend"))}</p><p>${escapeHtml(t("late"))}</p>`)}
      ${panel(t("whatToPack"), `<p><strong>${escapeHtml(packLabel(packKey))}</strong></p>${list(config.packs[packKey])}`)}
      ${state.hotel ? panel(t("housing"), `<p>${escapeHtml(t("hotelReady"))}</p>`) : ""}
      ${place.note ? panel(t("contacts"), `<p>${escapeHtml(place.note)}</p>${place.coordinators ? list(place.coordinators) : ""}`) : ""}
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

  function packLabel(key) {
    if (key === "poland") return t("inPoland");
    if (key === "caucasus") return t("fromCaucasus");
    return t("fromUkraine");
  }

  function labelForDepartment(key) {
    const labels = {
      production: { pl: "Produkcja", uk: "Виробництво", ru: "Производство", en: "Production", ka: "წარმოება", az: "İstehsal" },
      warehouse: { pl: "Magazyn", uk: "Склад", ru: "Склад", en: "Warehouse", ka: "საწყობი", az: "Anbar" },
      greenhouse: { pl: "Szklarnia", uk: "Теплиця", ru: "Теплица", en: "Greenhouse", ka: "სათბური", az: "İstixana" }
    };
    return (labels[key] && (labels[key][state.lang] || labels[key].pl)) || key || "-";
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

  $("languageSelect").addEventListener("change", (event) => setLanguage(event.target.value));
  $("languageGate").addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (button) setLanguage(button.dataset.lang);
  });
  $("locationTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-location]");
    if (button) setLocation(button.dataset.location);
  });
  $("copyLinkBtn").addEventListener("click", () => copyText(location.href));
  $("qrBtn").addEventListener("click", () => drawQr(location.href));
  $("printBtn").addEventListener("click", () => print());
  $("adminToggle").addEventListener("click", () => $("adminPanel").classList.add("open"));
  $("adminClose").addEventListener("click", () => $("adminPanel").classList.remove("open"));
  $("saveConfigBtn").addEventListener("click", () => {
    config = JSON.parse($("configEditor").value);
    localStorage.setItem(storageKey, JSON.stringify(config));
    toast(t("saved"));
    render();
  });
  $("resetConfigBtn").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    config = structuredClone(window.ARRIVAL_DEFAULT_CONFIG);
    render();
  });
  $("exportConfigBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = Object.assign(document.createElement("a"), { href: url, download: "arrival-config.json" });
    link.click();
    URL.revokeObjectURL(url);
  });
  $("importConfigInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    config = JSON.parse(await file.text());
    localStorage.setItem(storageKey, JSON.stringify(config));
    render();
  });

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }

  render();
})();
