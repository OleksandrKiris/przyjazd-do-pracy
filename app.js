(function () {
  const languageKey = "arrival-guide-language";
  let config;
  let state;

  const $ = (id) => document.getElementById(id);
  const t = (key) => (config.ui[state.lang] && config.ui[state.lang][key]) || config.ui.pl[key] || key;

  function loadConfig() {
    if (!window.ARRIVAL_DEFAULT_CONFIG) {
      throw new Error("Brak pliku data/config.js albo konfiguracja nie zostala zaladowana.");
    }

    if (typeof structuredClone === "function") {
      return structuredClone(window.ARRIVAL_DEFAULT_CONFIG);
    }

    return JSON.parse(JSON.stringify(window.ARRIVAL_DEFAULT_CONFIG));
  }

  function readState() {
    const params = new URLSearchParams(location.search);
    const savedLang = getStoredLanguage();
    const requestedLang = params.get("lang") || savedLang || "pl";
    return {
      lang: normalizeLanguage(requestedLang),
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
    state.lang = normalizeLanguage(lang);
    storeLanguage(state.lang);
    const url = new URL(location.href);
    url.searchParams.set("lang", state.lang);
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
    renderHydraLink();
    renderLanguageControls();
    renderTexts();
    renderSummary();
    renderLocationTiles();
    renderGuide();
    renderContacts();
  }

  function syncUrlWithState() {
    const url = new URL(location.href);
    let changed = false;
    const currentLang = url.searchParams.get("lang");
    const currentLocation = url.searchParams.get("location");

    if (currentLang !== state.lang) {
      url.searchParams.set("lang", state.lang);
      changed = true;
    }

    if (currentLocation !== state.location) {
      url.searchParams.set("location", state.location);
      changed = true;
    }

    if (url.searchParams.has("lokalizacja")) {
      url.searchParams.delete("lokalizacja");
      changed = true;
    }

    if (changed) history.replaceState(null, "", url);
  }

  function renderHydraLink() {
    const link = $("hydraLink");
    if (!link) return;
    link.href = `https://oleksandrkiris.github.io/citronex-hydra-project/?lang=${encodeURIComponent(state.lang)}`;
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
      ${panel(t("route"), `${routeSteps(localizedList(place.route))}${routeLinks(place.routeLinks)}`)}
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

  function routeSteps(items) {
    return `
      <ol class="route-steps">
        ${items.map((item, index) => `
          <li>
            <span>${index + 1}</span>
            <p>${formatRouteStep(item)}</p>
          </li>
        `).join("")}
      </ol>
    `;
  }

  function formatRouteStep(item) {
    const text = escapeHtml(item);
    const splitAt = text.indexOf(": ");
    if (splitAt > 0 && splitAt <= 28) {
      return `<strong>${text.slice(0, splitAt + 1)}</strong> ${text.slice(splitAt + 2)}`;
    }
    return text;
  }

  function routeLinks(links) {
    if (!links || !links.length) return "";
    const orderedLinks = [...links].sort((a, b) => (a.priority || 99) - (b.priority || 99));
    return `
      <div class="route-links">
        <h3>${escapeHtml(t("checkConnections"))}</h3>
        <p class="route-links-hint">${escapeHtml(t("travelToolHint"))}</p>
        <div>
          ${orderedLinks.map((link) => `
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">
              <span>${escapeHtml(localizedText(link.label))}</span>
              ${link.note ? `<small>${escapeHtml(localizedText(link.note))}</small>` : ""}
            </a>
          `).join("")}
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
    if (key.includes("ryczy") || key.includes("rycz")) return "ryczywol";
    if (key.includes("bogat")) return "bogatynia";
    if (key.includes("zgorz")) return "zgorzelec";
    if (key.includes("siech")) return "siechnice";
    return config?.locations?.[key] ? key : "siechnice";
  }

  function normalizeLanguage(value) {
    const key = String(value || "").toLowerCase();
    const aliases = {
      ua: "uk",
      ukrainian: "uk",
      ukrainianu: "uk",
      ukr: "uk",
      russian: "ru",
      rus: "ru",
      english: "en",
      polski: "pl",
      polish: "pl",
      filipino: "fil",
      tagalog: "fil",
      indonesian: "id",
      nepali: "ne",
      nepal: "ne",
      azerbaijani: "az",
      azeri: "az",
      spanish: "es"
    };
    const normalized = aliases[key] || key;
    return config?.languages?.[normalized] ? normalized : "pl";
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => toast(t("copied"))).catch(() => fallbackCopy(text));
      return;
    }

    fallbackCopy(text);
  }

  function fallbackCopy(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
      toast(t("copied"));
    } finally {
      field.remove();
    }
  }

  function getStoredLanguage() {
    try {
      return window.localStorage ? localStorage.getItem(languageKey) : "";
    } catch (error) {
      return "";
    }
  }

  function storeLanguage(lang) {
    try {
      if (window.localStorage) localStorage.setItem(languageKey, lang);
    } catch (error) {
      // Some browser/file modes block storage. The URL parameter still keeps the choice.
    }
  }

  function showFatalError(error) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div class="app-error">
        <strong>Strona nie mogla sie uruchomic.</strong>
        <span>${escapeHtml(error.message || error)}</span>
      </div>`
    );
    console.error(error);
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

  function setupFrontendStandard() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("button, .location-tile, .route-links a, .contact-card a, .hydra-link");
      if (!target) return;
      target.classList.add("is-pressed");
      setTimeout(() => target.classList.remove("is-pressed"), 220);
    }, { capture: true });
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

  function init() {
    try {
      config = loadConfig();
      state = readState();
      syncUrlWithState();
      setupFrontendStandard();
      render();
    } catch (error) {
      showFatalError(error);
    }
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      try {
        const key = "arrival-guide-sw-reload-v48";
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch (error) {
        // Session storage can be unavailable in private modes.
      }
      setTimeout(() => location.reload(), 250);
    });

    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.update();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch((error) => {
      console.warn("Service worker registration failed", error);
    });
  }

  init();
})();
