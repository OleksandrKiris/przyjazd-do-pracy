(function () {
  const $ = (id) => document.getElementById(id);
  const mapUrl = "https://maps.app.goo.gl/GJc55GLUWFPa6MMcA";

  function currentPlace() {
    const config = window.ARRIVAL_DEFAULT_CONFIG;
    if (!config || !config.locations) return null;
    const params = new URLSearchParams(location.search);
    const raw = (params.get("location") || params.get("lokalizacja") || "siechnice").toLowerCase();
    const key = raw.includes("ryczy") ? "ryczywol"
      : raw.includes("bogat") ? "bogatynia"
      : raw.includes("zgorz") ? "zgorzelec"
      : "siechnice";
    return config.locations[key] || config.locations.siechnice;
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
        <button type="button" data-help-action="call">Zadzwoń</button>
        <button type="button" data-help-action="whatsapp">WhatsApp</button>
        <button type="button" data-help-action="copy-address">Kopiuj adres</button>
      </div>
    `;
  }

  function updateContactTitle() {
    const title = document.querySelector("#contactsPage h2");
    if (title) title.textContent = "Kontakt w razie problemu";
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
    renderHelp();
    updateContactTitle();
    filterContacts();
  }

  document.addEventListener("click", (event) => {
    const helpButton = event.target.closest("[data-help-action]");
    if (helpButton) {
      const place = currentPlace();
      if (!place) return;
      const action = helpButton.dataset.helpAction;
      if (action === "maps") open(mapsFor(place), "_blank");
      if (action === "call") location.href = `tel:${place.phone}`;
      if (action === "whatsapp") open(`https://wa.me/${normalizePhone(place.whatsapp || place.phone)}`, "_blank");
      if (action === "copy-address") copyAddress(place);
      return;
    }

    if (event.target.closest("[data-location], [data-lang]")) {
      setTimeout(refresh, 0);
    }
  });

  refresh();
})();
