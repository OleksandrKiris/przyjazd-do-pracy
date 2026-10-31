(function () {
  const languageKey = "arrival-guide-language";
  const serviceLabels = {
    pl: ["Firma PrimServ", "Oferty pracy", "Bot Telegram"],
    ru: ["Компания PrimServ", "Вакансии", "Telegram-бот"],
    uk: ["Компанія PrimServ", "Вакансії", "Telegram-бот"],
    en: ["Company PrimServ", "Vacancies", "Telegram bot"],
    az: ["PrimServ şirkəti", "Vakansiyalar", "Telegram botu"],
    es: ["Empresa PrimServ", "Vacantes", "Bot de Telegram"],
    fil: ["Kumpanya PrimServ", "Mga bakanteng trabaho", "Telegram bot"],
    id: ["Perusahaan PrimServ", "Lowongan kerja", "Bot Telegram"],
    ne: ["PrimServ कम्पनी", "रिक्त पदहरू", "Telegram बोट"]
  };
  const hydraLabels = {
    pl: "Wróć do Hydry",
    ru: "Вернуться в Hydra",
    uk: "Повернутися до Hydra",
    en: "Back to Hydra",
    az: "Hydra-ya qayıt",
    es: "Volver a Hydra",
    fil: "Bumalik sa Hydra",
    id: "Kembali ke Hydra",
    ne: "Hydra मा फर्कनुहोस्"
  };
  let config;
  let state;
  const packingKey = "primserv.arrival.packing.v1";
  let packing;
  let packingRaw = null;
  let packingWritable = true;
  let packingSaved = false;
  let packingCopyAttempt = 0;
  const packingLabels = {
    pl: ["Zaznacz spakowane rzeczy. Zapis tylko na tym urządzeniu; bez wysyłania.", "Zapisano na tym urządzeniu.", "Nie zapisano. Zaznaczenia działają tylko w tej sesji; poprzednie dane pozostają bez zmian."],
    uk: ["Позначайте зібрані речі. Збереження лише на цьому пристрої; без надсилання.", "Збережено на цьому пристрої.", "Не збережено. Позначки діють лише в цьому сеансі; попередні дані не змінено."],
    ru: ["Отмечайте собранные вещи. Сохранение только на этом устройстве; без отправки.", "Сохранено на этом устройстве.", "Не сохранено. Отметки действуют только в этом сеансе; предыдущие данные не изменены."],
    en: ["Mark packed items. Saved only on this device; nothing is sent.", "Saved on this device.", "Not saved. Marks work only in this session; previous data is unchanged."],
    az: ["Yığdığınız əşyaları işarələyin. Yalnız bu cihazda saxlanılır; heç nə göndərilmir.", "Bu cihazda yadda saxlanıldı.", "Saxlanılmadı. İşarələr yalnız bu sessiyada işləyir; əvvəlki məlumatlar dəyişməyib."],
    es: ["Marca lo que ya has preparado. Se guarda solo en este dispositivo; no se envía nada.", "Guardado en este dispositivo.", "No se ha guardado. Las marcas solo se mantienen durante esta sesión; los datos anteriores no han cambiado."],
    fil: ["Markahan ang mga naimpakeng gamit. Sa device na ito lang ise-save; walang ipapadala.", "Na-save sa device na ito.", "Hindi na-save. Sa session na ito lang mananatili ang mga marka; hindi nabago ang dating data."],
    id: ["Tandai barang yang sudah dikemas. Disimpan hanya di perangkat ini; tidak ada yang dikirim.", "Tersimpan di perangkat ini.", "Tidak tersimpan. Tanda hanya berlaku selama sesi ini; data sebelumnya tidak berubah."],
    ne: ["तयार पारेका सामानमा चिन्ह लगाउनुहोस्। यस उपकरणमा मात्र सुरक्षित हुन्छ; केही पठाइँदैन।", "यस उपकरणमा सुरक्षित भयो।", "सुरक्षित भएन। चिन्हहरू यस सत्रमा मात्र रहन्छन्; पहिलेका डेटा परिवर्तन भएका छैनन्।"]
  };

  const copyFallbackLabels = {
    pl: "Nie udało się skopiować automatycznie. Zaznacz i skopiuj adres z pola poniżej.",
    ru: "Автоматическое копирование не удалось. Выделите и скопируйте адрес из поля ниже.",
    uk: "Не вдалося скопіювати автоматично. Виділіть і скопіюйте адресу з поля нижче.",
    en: "Automatic copying failed. Select and copy the address from the field below.",
    az: "Avtomatik köçürmə alınmadı. Aşağıdakı xanadakı ünvanı seçib köçürün.",
    es: "No se ha podido copiar automáticamente. Selecciona y copia la dirección del campo de abajo.",
    fil: "Hindi awtomatikong nakopya. Piliin at kopyahin ang address sa field sa ibaba.",
    id: "Penyalinan otomatis gagal. Pilih dan salin alamat dari kolom di bawah.",
    ne: "स्वचालित रूपमा प्रतिलिपि गर्न सकिएन। तलको बाकसबाट ठेगाना छानेर प्रतिलिपि गर्नुहोस्।"
  };

  const packingChoiceLabels = {
    pl: ["Wybierz listę rzeczy", "Wybierz wariant", "Ukraina", "Polska", "Gruzja / Azerbejdżan", "Inny / nie wiem", "Zaznaczenia są zachowywane osobno dla każdej listy.", "Zapytaj koordynatora, która lista dotyczy Twojego przyjazdu."],
    uk: ["Оберіть список речей", "Оберіть варіант", "Україна", "Польща", "Грузія / Азербайджан", "Інше / не впевнений", "Позначки зберігаються окремо для кожного списку.", "Уточніть у координатора, який список стосується вашого приїзду."],
    ru: ["Выберите список вещей", "Выберите вариант", "Украина", "Польша", "Грузия / Азербайджан", "Другое / не уверен", "Отметки сохраняются отдельно для каждого списка.", "Уточните у координатора, какой список относится к вашему приезду."],
    en: ["Choose your packing list", "Choose an option", "Ukraine", "Poland", "Georgia / Azerbaijan", "Other / not sure", "Checkmarks are kept separately for each list.", "Ask your coordinator which list applies to your arrival."],
    az: ["Əşya siyahısını seçin", "Variant seçin", "Ukrayna", "Polşa", "Gürcüstan / Azərbaycan", "Digər / əmin deyiləm", "İşarələr hər siyahı üçün ayrıca saxlanılır.", "Gəlişinizə hansı siyahının aid olduğunu koordinatordan dəqiqləşdirin."],
    es: ["Elige tu lista de equipaje", "Elige una opción", "Ucrania", "Polonia", "Georgia / Azerbaiyán", "Otro / no estoy seguro", "Las marcas se conservan por separado para cada lista.", "Pregunta a tu coordinador qué lista corresponde a tu llegada."],
    fil: ["Piliin ang listahan ng dadalhin", "Pumili ng opsyon", "Ukraine", "Poland", "Georgia / Azerbaijan", "Iba / hindi sigurado", "Magkahiwalay na naka-save ang mga tsek sa bawat listahan.", "Tanungin ang coordinator kung aling listahan ang angkop sa iyong pagdating."],
    id: ["Pilih daftar barang bawaan", "Pilih opsi", "Ukraina", "Polandia", "Georgia / Azerbaijan", "Lainnya / belum yakin", "Tanda centang disimpan terpisah untuk setiap daftar.", "Tanyakan kepada koordinator daftar mana yang sesuai untuk kedatangan Anda."],
    ne: ["ल्याउने सामानको सूची छान्नुहोस्", "विकल्प छान्नुहोस्", "युक्रेन", "पोल्यान्ड", "जर्जिया / अजरबैजान", "अन्य / निश्चित छैन", "हरेक सूचीका चिन्हहरू छुट्टाछुट्टै सुरक्षित रहन्छन्।", "तपाईंको आगमनका लागि कुन सूची लागू हुन्छ भनेर संयोजकलाई सोध्नुहोस्।"]
  };

  const packingProgressLabels = {
    pl: "Spakowano: {checked} z {total}",
    uk: "Зібрано: {checked} із {total}",
    ru: "Собрано: {checked} из {total}",
    en: "Packed: {checked} of {total}",
    az: "Yığılıb: {checked} / {total}",
    es: "Preparado: {checked} de {total}",
    fil: "Naimpakeng gamit: {checked} / {total}",
    id: "Barang dikemas: {checked} dari {total}",
    ne: "तयार सामान: {checked} / {total}"
  };

  const packingCopyLabels = {
    pl: ["Kopiuj listę rzeczy", "Nie udało się skopiować automatycznie. Zaznacz i skopiuj poniższą listę.", "Lista do skopiowania"],
    uk: ["Копіювати список речей", "Не вдалося скопіювати автоматично. Виділіть і скопіюйте список нижче.", "Список для копіювання"],
    ru: ["Копировать список вещей", "Не удалось скопировать автоматически. Выделите и скопируйте список ниже.", "Список для копирования"],
    en: ["Copy packing list", "Automatic copying failed. Select and copy the list below.", "List to copy"],
    az: ["Əşya siyahısını kopyala", "Avtomatik kopyalama alınmadı. Aşağıdakı siyahını seçib kopyalayın.", "Kopyalanacaq siyahı"],
    es: ["Copiar lista de equipaje", "No se pudo copiar automáticamente. Selecciona y copia la lista de abajo.", "Lista para copiar"],
    fil: ["Kopyahin ang listahan ng dadalhin", "Hindi awtomatikong nakopya. Piliin at kopyahin ang listahan sa ibaba.", "Listahang kokopyahin"],
    id: ["Salin daftar barang bawaan", "Penyalinan otomatis gagal. Pilih dan salin daftar di bawah.", "Daftar untuk disalin"],
    ne: ["सामानको सूची प्रतिलिपि गर्नुहोस्", "स्वतः प्रतिलिपि हुन सकेन। तलको सूची चयन गरेर प्रतिलिपि गर्नुहोस्।", "प्रतिलिपि गर्ने सूची"]
  };

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
      languageFallback: ["ka", "hy"].includes(String(requestedLang).toLowerCase()),
      name: params.get("name") || params.get("imie") || "",
      surname: params.get("surname") || params.get("nazwisko") || "",
      date: params.get("date") || params.get("data") || "",
      location: normalizeLocation(params.get("location") || params.get("lokalizacja") || "siechnice"),
      department: params.get("department") || params.get("dzial") || "production",
      hotel: ["yes", "tak", "true", "1"].includes((params.get("hotel") || "").toLowerCase()),
      country: params.get("country") || params.get("kraj") || "ukraine",
      packingChoice: params.has("pack") ? (["ukraine", "poland", "caucasus", "other"].includes(params.get("pack")) ? params.get("pack") : "") : null
    };
  }

  function setLanguage(lang, restoreFocus = false) {
    state.lang = normalizeLanguage(lang);
    state.languageFallback = false;
    storeLanguage(state.lang);
    syncUrlWithState();
    render();
    if (restoreFocus) {
      $("languageGate").querySelector(`[data-lang="${state.lang}"]`)?.focus({ preventScroll: true });
    }
  }

  function setLocation(locationKey) {
    state.location = normalizeLocation(locationKey);
    syncUrlWithState();
    render();
    const target = $("instructionStart");
    target.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function render() {
    document.documentElement.lang = state.lang;
    document.documentElement.dataset.arrivalLocation = state.location;
    document.title = `${t("title")} · PrimServ`;
    renderHydraLink();
    renderServiceLinks();
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

    if (state.packingChoice !== null && url.searchParams.get("pack") !== (state.packingChoice || "choose")) {
      url.searchParams.set("pack", state.packingChoice || "choose");
      changed = true;
    }

    if (changed) {
      try {
        history.replaceState(history.state, "", url);
      } catch (error) {
        // Restricted browser contexts may block URL updates. Keep the selected
        // language/location usable in memory; do not interrupt rendering.
      }
    }
  }

  function renderHydraLink() {
    const link = $("hydraLink");
    if (!link) return;
    const hydraLang = state.lang === "uk" ? "ua" : state.lang;
    link.href = `https://oleksandrkiris.github.io/citronex-hydra-project/?lang=${encodeURIComponent(hydraLang)}`;
    const label = hydraLabels[state.lang] || hydraLabels.en;
    link.textContent = label;
    link.setAttribute("aria-label", label);
  }

  function renderServiceLinks() {
    const labels = serviceLabels[state.lang] || serviceLabels.en;
    ["companyLink", "jobsLink", "botLink"].forEach((id, index) => {
      const link = $(id);
      if (link) link.textContent = labels[index];
    });
    const jobsLink = $("jobsLink");
    if (jobsLink) {
      const url = new URL("https://oleksandrkiris.github.io/kiris-jobs/");
      url.searchParams.set("lang", state.lang);
      jobsLink.href = url.toString();
    }
    const fallback = $("languageFallback");
    if (fallback) fallback.hidden = !state.languageFallback;
  }

  function renderLanguageControls() {
    $("languageGate").innerHTML = Object.entries(config.languages)
      .map(([code, label]) => `
        <button type="button" class="${code === state.lang ? "active" : ""}" aria-pressed="${code === state.lang}" data-lang="${code}">
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
        <button type="button" class="location-tile ${key === state.location ? "active" : ""}" aria-pressed="${key === state.location}" data-location="${key}" style="--tile-accent:${escapeHtml(place.accent || "#d71920")}">
          <span>${escapeHtml(place.name)}</span>
          <small>${escapeHtml(place.short || place.address[0])}</small>
          <strong>${escapeHtml(t("showInstruction"))}</strong>
        </button>
      `)
      .join("");
  }

  function renderGuide() {
    packingCopyAttempt++;
    const place = config.locations[state.location] || config.locations.siechnice;
    document.documentElement.style.setProperty("--primary", place.accent || "#1f7a8c");
    const address = place.address.join(", ");
    const addressHtml = place.address.map((line) => escapeHtml(line)).join("<br>");
    const workItems = localizedList(place.work[state.department] || Object.values(place.work)[0] || []);
    const packKey = state.packingChoice !== null ? state.packingChoice : state.country === "poland" ? "poland" : ["georgia", "azerbaijan", "ka", "az"].includes(state.country) ? "caucasus" : "ukraine";

    $("guide").innerHTML = `
      ${panel(t("address"), `<p>${addressHtml}</p>
        <button type="button" data-action="copy-address">${escapeHtml(t("copyAddress"))}</button>
        <div id="addressCopyFallback" class="address-copy-fallback" hidden>
          <p id="addressCopyHint" role="status">${escapeHtml(copyFallbackLabels[state.lang])}</p>
          <textarea id="addressCopyValue" rows="3" readonly aria-label="${escapeHtml(t("address"))}" aria-describedby="addressCopyHint">${escapeHtml(address)}</textarea>
        </div>`)}
      ${panel(t("route"), `${routeSteps(localizedList(place.route))}${routeLinks(place.routeLinks)}`)}
      ${panel(t("workType"), list(workItems))}
      ${panel(t("arrivalRules"), `<p>${escapeHtml(t("reception"))}</p><p>${escapeHtml(t("noWeekend"))}</p><p>${escapeHtml(t("late"))}</p>`)}
      ${panel(t("whatToPack"), packingChoiceContent(packKey), "packing-panel")}
      ${state.hotel ? panel(t("housing"), `<p>${escapeHtml(t("hotelReady"))}</p>`) : ""}
      ${place.note ? panel(t("contacts"), `<p>${escapeHtml(localizedText(place.note))}</p>${place.coordinators ? list(place.coordinators) : ""}`) : ""}
      <section class="panel wide">
        <h2>${escapeHtml(place.name)}</h2>
        <div class="action-grid">
          <button type="button" data-action="maps">${escapeHtml(t("openMaps"))}</button>
          <button type="button" data-action="call">${escapeHtml(t("call"))}</button>
          <button type="button" data-action="whatsapp">${escapeHtml(t("whatsapp"))}</button>
        </div>
      </section>
    `;

    $("guide").querySelector('[data-action="maps"]').addEventListener("click", () => {
      open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery || address)}`, "_blank");
    });
    $("guide").querySelector('[data-action="copy-address"]').addEventListener("click", () => copyText(address));
    if (Object.hasOwn(config.packs, packKey)) $("packingCopyBtn")?.addEventListener("click", () => copyPackingList(packKey));
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
    $("contactsPage").innerHTML = `<h2 id="contactsTitle">${escapeHtml(t("contacts"))}</h2>${groups}<p><strong>${escapeHtml(t("questions"))}</strong></p>`;
  }

  function panel(title, body, extraClass = "") {
    return `<section class="panel${extraClass ? ` ${escapeHtml(extraClass)}` : ""}"><h2>${escapeHtml(title)}</h2>${body}</section>`;
  }

  function loadPacking() {
    // Only public list identity and boolean marks; never arrival state/URL data.
    packing = { version: 1, lists: {} };
    for (const [key, value] of Object.entries(config.packs)) {
      packing.lists[key] = { items: [...value.en], checked: value.en.map(() => false) };
    }
    try {
      packingRaw = localStorage.getItem(packingKey);
      if (packingRaw === null) return;
      const saved = JSON.parse(packingRaw);
      if (!saved || saved.version !== 1 || Object.keys(saved).sort().join() !== "lists,version" ||
          !saved.lists || Object.keys(saved.lists).sort().join() !== Object.keys(packing.lists).sort().join()) throw Error("Unknown format");
      for (const key of Object.keys(packing.lists)) {
        const entry = saved.lists[key];
        if (!entry || Object.keys(entry).sort().join() !== "checked,items" ||
            JSON.stringify(entry.items) !== JSON.stringify(packing.lists[key].items) ||
            !Array.isArray(entry.checked) || entry.checked.length !== entry.items.length ||
            !entry.checked.every(value => typeof value === "boolean")) throw Error("Changed list");
      }
      packing = saved;
      packingSaved = true;
    } catch (error) {
      // Never replace unreadable, unknown, older-content or future saved data.
      packingWritable = false;
    }
  }

  function packingMessage(index) {
    const lang = packingLabels[state.lang] ? state.lang : "en";
    const prefix = lang !== state.lang ? "English (EN): " : "";
    return { lang, text: prefix + packingLabels[lang][index] };
  }

  function packingChoiceContent(key) {
    const labels = packingChoiceLabels[state.lang] || packingChoiceLabels.en;
    const options = [["", labels[1]], ["ukraine", labels[2]], ["poland", labels[3]], ["caucasus", labels[4]], ["other", labels[5]]];
    const chooser = `<div class="packing-choice"><label for="packingChoice">${escapeHtml(labels[0])}</label>
      <select id="packingChoice" aria-describedby="packingChoiceHint">${options.map(([value, label]) => `<option value="${value}"${value === key ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>
      <p id="packingChoiceHint">${escapeHtml(labels[6])}</p></div>`;
    if (!Object.hasOwn(config.packs, key)) return chooser + (key === "other" ? `<p id="packingChoiceHelp" role="status">${escapeHtml(labels[7])}</p>` : "");
    return `${chooser}<p><strong>${escapeHtml(packLabel(key))}</strong></p>${packingList(key)}`;
  }

  function packingList(key) {
    const hint = packingMessage(0);
    const status = packingMessage(!packingWritable ? 2 : packingSaved ? 1 : 0);
    const items = localizedList(config.packs[key]);
    const progress = packingProgressMessage(key);
    const copy = packingCopyLabels[state.lang] || packingCopyLabels.en;
    return `<p id="packingHint" lang="${hint.lang}">${escapeHtml(hint.text)}</p>
      <p id="packingProgress" class="packing-progress" lang="${progress.lang}">${escapeHtml(progress.text)}</p>
      <ul class="packing-list">${items.map((item, index) => `<li><label>
        <input type="checkbox" data-pack="${key}" data-pack-index="${index}" aria-describedby="packingHint packingProgress" ${packing.lists[key].checked[index] ? "checked" : ""}>
        <span>${escapeHtml(item)}</span></label></li>`).join("")}</ul>
      <p id="packingStatus" role="status" aria-live="polite" lang="${status.lang}">${escapeHtml(status.text)}</p>
      <div id="packingCopyActions" class="packing-copy-actions">
        <button type="button" id="packingCopyBtn" data-action="copy-packing" lang="${state.lang}">${escapeHtml(copy[0])}</button>
        <div id="packingCopyFallback" class="address-copy-fallback" hidden>
          <p id="packingCopyHint" role="status" lang="${state.lang}">${escapeHtml(copy[1])}</p>
          <label for="packingCopyValue" lang="${state.lang}">${escapeHtml(copy[2])}</label>
          <textarea id="packingCopyValue" rows="10" readonly lang="${state.lang}" aria-label="${escapeHtml(copy[2])}" aria-describedby="packingCopyHint">${escapeHtml(packingCopyText(key))}</textarea>
        </div>
      </div>`;
  }

  function packingCopyText(key) {
    return [packLabel(key), ...localizedList(config.packs[key]).map((item, index) =>
      `${packing.lists[key].checked[index] ? "[x]" : "[ ]"} ${item}`)].join("\n");
  }

  function packingProgressMessage(key) {
    const lang = Object.hasOwn(packingProgressLabels, state.lang) ? state.lang : "en";
    const marks = packing.lists[key].checked;
    const text = packingProgressLabels[lang]
      .replace("{checked}", String(marks.filter(value => value).length))
      .replace("{total}", String(marks.length));
    return { lang, text };
  }

  $("guide")?.addEventListener("change", (event) => {
    const input = event.target;
    if (input.id === "packingChoice") {
      state.packingChoice = ["ukraine", "poland", "caucasus", "other"].includes(input.value) ? input.value : "";
      syncUrlWithState();
      renderGuide();
      $("packingChoice")?.focus({ preventScroll: true });
      return;
    }
    const key = input.dataset?.pack;
    const index = Number(input.dataset?.packIndex);
    if (input.type !== "checkbox" || !Object.hasOwn(packing.lists, key) ||
        !Number.isInteger(index) || index < 0 || index >= packing.lists[key].checked.length) return;
    packingCopyAttempt++;
    packing.lists[key].checked[index] = input.checked;
    packingSaved = false;
    if (packingWritable) {
      try {
        // Fail closed on a concurrent tab/update instead of overwriting its data.
        if (localStorage.getItem(packingKey) !== packingRaw) throw Error("Changed storage");
        const next = JSON.stringify(packing);
        localStorage.setItem(packingKey, next);
        packingRaw = next;
        packingSaved = true;
      } catch (error) {
        packingWritable = false;
      }
    }
    const status = packingMessage(packingSaved ? 1 : 2);
    $("packingStatus").textContent = status.text;
    $("packingStatus").setAttribute("lang", status.lang);
    const progress = packingProgressMessage(key);
    $("packingProgress").textContent = progress.text;
    $("packingProgress").setAttribute("lang", progress.lang);
    const copyField = $("packingCopyValue");
    if (copyField) copyField.value = packingCopyText(key);
    // Do not re-render the checkbox: keyboard focus and current scroll survive.
  });

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
      ka: "en",
      hy: "en",
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

  async function copyText(text) {
    const fallback = $("addressCopyFallback");
    const visibleField = $("addressCopyValue");
    if (fallback) fallback.hidden = true;
    // Keep this click's elements: a later city/language render must not show a stale address.
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast(t("copied"));
        return;
      }
    } catch (error) {
      // Permission denial and synchronous failures can still use the legacy copy path.
    }
    if (fallbackCopy(text)) {
      toast(t("copied"));
    } else if (fallback?.isConnected && visibleField?.value === text) {
      // Never report success when the browser refused both copy methods.
      $("toast").classList.remove("show");
      fallback.hidden = false;
      visibleField.focus();
      visibleField.select();
      visibleField.setSelectionRange(0, text.length);
    }
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
      return document.execCommand("copy") === true;
    } catch (error) {
      return false;
    } finally {
      field.remove();
    }
  }

  async function copyPackingList(key) {
    if (!Object.hasOwn(config.packs, key)) return;
    const field = $("packingCopyValue"), fallback = $("packingCopyFallback"), origin = $("packingCopyBtn");
    if (!field || !fallback) return;
    const text = packingCopyText(key), attempt = ++packingCopyAttempt;
    field.value = text;
    fallback.hidden = true;
    const current = () => attempt === packingCopyAttempt && field.isConnected && fallback.isConnected && field.value === text;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        if (current()) toast(t("copied"));
        return;
      }
    } catch (error) {
      // Try the existing legacy copy path only for this still-current list action.
    }
    if (!current()) return;
    if (fallbackCopy(text)) {
      if (current()) {
        origin?.focus({ preventScroll: true });
        toast(t("copied"));
      }
    } else if (current()) {
      $("toast").classList.remove("show");
      fallback.hidden = false;
      field.focus();
      field.select();
      field.setSelectionRange(0, text.length);
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

  let toastTimer;
  function toast(message) {
    const node = $("toast");
    node.textContent = message;
    node.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("show"), 1800);
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
    if (button) setLanguage(button.dataset.lang, document.activeElement === button);
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
      loadPacking();
      syncUrlWithState();
      setupFrontendStandard();
      render();
    } catch (error) {
      showFatalError(error);
    }
  }

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.update().catch((error) => {
        console.warn("Service worker update check failed", error);
      });
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
