(function () {
  const publicBaseUrl = "https://oleksandrkiris.github.io/przyjazd-do-pracy/";
  const departments = {
    production: { pl: "Produkcja", uk: "Виробництво", ru: "Производство", en: "Production", ka: "წარმოება", az: "Istehsal" },
    warehouse: { pl: "Magazyn", uk: "Склад", ru: "Склад", en: "Warehouse", ka: "საწყობი", az: "Anbar" },
    greenhouse: { pl: "Szklarnia", uk: "Теплиця", ru: "Теплица", en: "Greenhouse", ka: "სათბური", az: "İstixana" }
  };

  const $ = (id) => document.getElementById(id);

  function readState() {
    const params = new URLSearchParams(location.search);
    return {
      lang: params.get("lang") || document.documentElement.lang || "pl",
      location: params.get("location") || params.get("lokalizacja") || "siechnice",
      name: params.get("name") || params.get("imie") || "",
      surname: params.get("surname") || params.get("nazwisko") || "",
      date: params.get("date") || params.get("data") || "",
      department: params.get("department") || params.get("dzial") || "production",
      country: normalizeCountry(params.get("country") || params.get("kraj") || "ukraine"),
      hotel: ["yes", "tak", "true", "1"].includes((params.get("hotel") || "").toLowerCase())
    };
  }

  function writeForm(state) {
    setValue("candidateLang", state.lang);
    setValue("candidateLocation", state.location);
    setValue("candidateName", state.name);
    setValue("candidateSurname", state.surname);
    setValue("candidateDate", state.date);
    setValue("candidateDepartment", state.department);
    setValue("candidateCountry", state.country);
    const hotel = $("candidateHotel");
    if (hotel) hotel.checked = state.hotel;
    updateSummary(state);
    updateLink(state);
  }

  function readForm() {
    return {
      lang: $("candidateLang")?.value || "pl",
      location: $("candidateLocation")?.value || "siechnice",
      name: $("candidateName")?.value.trim() || "",
      surname: $("candidateSurname")?.value.trim() || "",
      date: $("candidateDate")?.value || "",
      department: $("candidateDepartment")?.value || "production",
      country: $("candidateCountry")?.value || "ukraine",
      hotel: Boolean($("candidateHotel")?.checked)
    };
  }

  function syncFromForm() {
    const state = readForm();
    updateCurrentUrl(state);
    updateSummary(state);
    updateLink(state);
  }

  function buildLink(state) {
    const url = new URL(publicBaseUrl);
    setOrDelete(url.searchParams, "lang", state.lang);
    setOrDelete(url.searchParams, "location", state.location);
    setOrDelete(url.searchParams, "name", state.name);
    setOrDelete(url.searchParams, "surname", state.surname);
    setOrDelete(url.searchParams, "date", state.date);
    setOrDelete(url.searchParams, "department", state.department);
    setOrDelete(url.searchParams, "country", state.country);
    setOrDelete(url.searchParams, "hotel", state.hotel ? "yes" : "");
    return url.toString();
  }

  function updateLink(state) {
    const field = $("candidateLink");
    if (field) field.value = buildLink(state);
  }

  function updateCurrentUrl(state) {
    const url = new URL(location.href);
    setOrDelete(url.searchParams, "lang", state.lang);
    setOrDelete(url.searchParams, "location", state.location);
    setOrDelete(url.searchParams, "name", state.name);
    setOrDelete(url.searchParams, "surname", state.surname);
    setOrDelete(url.searchParams, "date", state.date);
    setOrDelete(url.searchParams, "department", state.department);
    setOrDelete(url.searchParams, "country", state.country);
    setOrDelete(url.searchParams, "hotel", state.hotel ? "yes" : "");
    history.replaceState(null, "", url);
  }

  function updateSummary(state) {
    const employee = [state.name, state.surname].filter(Boolean).join(" ");
    if ($("employeeName")) $("employeeName").textContent = employee || "-";
    if ($("arrivalDate")) $("arrivalDate").textContent = state.date || "-";
    if ($("departmentName")) $("departmentName").textContent = departmentLabel(state.department, state.lang);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast("Skopiowano link"));
      return;
    }
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
    showToast("Skopiowano link");
  }

  function showToast(text) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function departmentLabel(key, lang) {
    const labels = departments[key] || departments.production;
    return labels[lang] || labels.pl;
  }

  function normalizeCountry(value) {
    const key = String(value || "").toLowerCase();
    if (["poland", "pl", "polska"].includes(key)) return "poland";
    if (["caucasus", "georgia", "azerbaijan", "ka", "az"].includes(key)) return "caucasus";
    return "ukraine";
  }

  function setValue(id, value) {
    const field = $(id);
    if (field) field.value = value || "";
  }

  function setOrDelete(params, key, value) {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
      return;
    }
    params.set(key, value);
  }

  function init() {
    if (!$("candidateLink")) return;
    writeForm(readState());
    ["candidateLang", "candidateLocation", "candidateName", "candidateSurname", "candidateDate", "candidateDepartment", "candidateCountry", "candidateHotel"].forEach((id) => {
      $(id)?.addEventListener("input", syncFromForm);
      $(id)?.addEventListener("change", syncFromForm);
    });
    $("copyCandidateLinkBtn")?.addEventListener("click", () => copyText(buildLink(readForm())));
    $("openCandidateLinkBtn")?.addEventListener("click", () => open(buildLink(readForm()), "_blank"));
  }

  init();
})();
