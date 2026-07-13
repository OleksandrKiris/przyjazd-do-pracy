const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const publicIndex = process.argv.indexOf("--public");
const publicBase = publicIndex >= 0 ? String(process.argv[publicIndex + 1] || "").replace(/\/?$/, "/") : "";
const requiredLanguages = ["pl", "ru", "uk", "en", "az", "es", "fil", "id", "ne"];
const requiredLocations = ["siechnice", "zgorzelec", "bogatynia", "ryczywol"];
const requiredUiKeys = [
  "moduleLabel",
  "title",
  "chooseLanguage",
  "chooseLocation",
  "chooseLocationText",
  "showInstruction",
  "checkConnections",
  "travelToolHint",
  "address",
  "route",
  "workType",
  "arrivalRules",
  "whatToPack",
  "contacts",
  "openMaps",
  "copyAddress",
  "call",
  "whatsapp",
  "questions"
];
const allowedHosts = new Set([
  "koleo.pl",
  "jakdojade.pl",
  "www.google.com",
  "google.com",
  "www.e-podroznik.pl"
]);
const urlAliases = [
  ["ua", "rycz", "uk", "ryczywol"],
  ["ukr", "bogat", "uk", "bogatynia"],
  ["russian", "zgorz", "ru", "zgorzelec"],
  ["english", "siech", "en", "siechnice"],
  ["spanish", "siechnice", "es", "siechnice"],
  ["nepali", "ryczywół", "ne", "ryczywol"]
];
const visibleFiles = [
  "index.html",
  "app.js",
  "candidate-improvements.js",
  "language-options.js",
  "translations.js",
  "data/overrides.js"
];
const mojibakeTokens = ["Đ", "Ă", "Ĺ", "Ń", "ŕ", "á", "Â", "â†", "GĂ", "NiedĂ", "RyczywĂ", "WrocĹ"];
const candidateForbidden = [
  /\badmin\b/i,
  /panel admin/i,
  /generator/i,
  /koordynatorza/i,
  /rekruterza/i
];
const requiredRouteStages = {
  siechnice: [
    { priority: 1, urlIncludes: ["koleo.pl", "wroclaw-glowny", "siechnice"] },
    { priority: 2, originIncludes: "Stacja kolejowa Siechnice", destinationIncludes: "Opolska 30" },
    { priority: 3, urlIncludes: ["jakdojade.pl"], urlDecodedIncludes: ["Wrocław Główny", "Opolska 30"] },
    { priority: 9, destinationIncludes: "Opolska 30", noOrigin: true }
  ],
  zgorzelec: [
    { priority: 1, urlIncludes: ["koleo.pl", "wroclaw-glowny", "zgorzelec"] },
    { priority: 2, originIncludes: "Zgorzelec dworzec kolejowy", destinationIncludes: "Bohaterów II Armii Wojska Polskiego 64" },
    { priority: 3, urlIncludes: ["jakdojade.pl"], urlDecodedIncludes: ["Wrocław", "Zgorzelec"] },
    { priority: 9, destinationIncludes: "Bohaterów II Armii Wojska Polskiego 64", noOrigin: true }
  ],
  bogatynia: [
    { priority: 1, urlIncludes: ["koleo.pl", "wroclaw-glowny", "zgorzelec"] },
    { priority: 2, urlIncludes: ["e-podroznik.pl"] },
    { priority: 3, originIncludes: "Bogatynia", destinationIncludes: "Niedów 9" },
    { priority: 4, urlIncludes: ["jakdojade.pl"], urlDecodedIncludes: ["Wrocław", "Zgorzelec"] },
    { priority: 9, destinationIncludes: "Niedów 9", noOrigin: true }
  ],
  ryczywol: [
    { priority: 1, urlIncludes: ["e-podroznik.pl"] },
    { priority: 2, originIncludes: "Kozienice", destinationIncludes: "Wilczkowice Górne 40" },
    { priority: 3, originIncludes: "Warszawa Zachodnia", destinationIncludes: "Kozienice" },
    { priority: 9, destinationIncludes: "Wilczkowice Górne 40", noOrigin: true }
  ]
};
const requiredContactRules = {
  siechnice: {
    primaryName: "Fariz Injaev",
    primaryRole: "Koordynator",
    requiredPeople: [
      { name: "Fariz Injaev", role: "Koordynator" },
      { name: "Yuliia Kernichenko", role: "Rekruter" }
    ]
  }
};
const errors = [];
const warnings = [];
const report = {
  languages: requiredLanguages.length,
  locations: requiredLocations.length,
  matrixChecks: 0,
  routeLinks: 0,
  public: Boolean(publicBase)
};

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadScript(context, relativePath) {
  vm.runInContext(read(relativePath), context, { filename: relativePath });
}

function localized(value, lang) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || value.pl || "";
  }
  return value || "";
}

function hasBrokenEncoding(value) {
  const text = String(value || "");
  return mojibakeTokens.some((token) => text.includes(token));
}

function flattenText(value, output = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => flattenText(item, output));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => flattenText(item, output));
  } else if (value != null) {
    output.push(String(value));
  }
  return output;
}

function normalizeLanguage(value, languages) {
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
  return languages[normalized] ? normalized : "pl";
}

function normalizeLocation(value, locations) {
  const key = String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (key.includes("ryczy") || key.includes("rycz")) return "ryczywol";
  if (key.includes("bogat")) return "bogatynia";
  if (key.includes("zgorz")) return "zgorzelec";
  if (key.includes("siech")) return "siechnice";
  return locations[key] ? key : "siechnice";
}

function validateVisibleFiles() {
  visibleFiles.forEach((relativePath) => {
    const content = read(relativePath);
    if (hasBrokenEncoding(content)) fail(`${relativePath}: broken encoding token found`);
    candidateForbidden.forEach((pattern) => {
      if (pattern.test(content) && relativePath !== "tools/quality-check.js") {
        warn(`${relativePath}: candidate-facing text may contain internal wording: ${pattern}`);
      }
    });
  });
}

function validateMatrix(config) {
  requiredLanguages.forEach((lang) => {
    requiredUiKeys.forEach((key) => {
      const value = config.ui?.[lang]?.[key];
      if (!value) fail(`${lang}: missing UI key ${key}`);
      if (hasBrokenEncoding(value)) fail(`${lang}: UI key ${key} has broken encoding`);
    });
  });

  requiredLocations.forEach((locationKey) => {
    const place = config.locations?.[locationKey];
    if (!place) {
      fail(`Missing location ${locationKey}`);
      return;
    }

    requiredLanguages.forEach((lang) => {
      report.matrixChecks += 1;
      const route = localized(place.route, lang);
      const note = localized(place.note, lang);
      const workGroups = Object.values(place.work || {});

      if (!Array.isArray(route) || route.length < 4) fail(`${locationKey}/${lang}: route has too few steps`);
      flattenText(route).forEach((text) => {
        if (!text.trim()) fail(`${locationKey}/${lang}: empty route text`);
        if (hasBrokenEncoding(text)) fail(`${locationKey}/${lang}: route has broken encoding`);
      });
      if (note && hasBrokenEncoding(note)) fail(`${locationKey}/${lang}: note has broken encoding`);

      if (!workGroups.length) fail(`${locationKey}/${lang}: missing work groups`);
      workGroups.forEach((group) => {
        const items = localized(group, lang);
        if (!Array.isArray(items) || !items.length) fail(`${locationKey}/${lang}: missing localized work items`);
        flattenText(items).forEach((text) => {
          if (hasBrokenEncoding(text)) fail(`${locationKey}/${lang}: work item has broken encoding`);
        });
      });
    });
  });
}

function validateRouteLinks(config) {
  requiredLocations.forEach((locationKey) => {
    const place = config.locations?.[locationKey];
    const links = place?.routeLinks || [];
    let fallbackCount = 0;
    links.forEach((link) => {
      report.routeLinks += 1;
      let parsed;
      try {
        parsed = new URL(link.url);
      } catch {
        fail(`${locationKey}: invalid route link URL`);
        return;
      }
      if (parsed.protocol !== "https:") fail(`${locationKey}: non-HTTPS route link ${link.url}`);
      if (!allowedHosts.has(parsed.hostname)) warn(`${locationKey}: route link uses unlisted host ${parsed.hostname}`);
      if (/\s/.test(link.url)) fail(`${locationKey}: route link contains raw whitespace`);
      if ((link.priority || 99) >= 9 && parsed.hostname.includes("google") && !parsed.searchParams.has("origin")) {
        fallbackCount += 1;
      }
      requiredLanguages.forEach((lang) => {
        const label = localized(link.label, lang);
        const note = localized(link.note, lang);
        if (!label) fail(`${locationKey}/${lang}: route link missing label`);
        if (hasBrokenEncoding(label)) fail(`${locationKey}/${lang}: route link label has broken encoding`);
        if (note && hasBrokenEncoding(note)) fail(`${locationKey}/${lang}: route link note has broken encoding`);
      });
    });
    if (!fallbackCount) fail(`${locationKey}: missing fallback route from current location`);
  });
}

function validateRouteStages(config) {
  Object.entries(requiredRouteStages).forEach(([locationKey, stages]) => {
    const links = config.locations?.[locationKey]?.routeLinks || [];
    stages.forEach((stage) => {
      const link = links.find((item) => (item.priority || 99) === stage.priority);
      if (!link) {
        fail(`${locationKey}: missing route stage priority ${stage.priority}`);
        return;
      }

      let parsed;
      try {
        parsed = new URL(link.url);
      } catch {
        fail(`${locationKey}: invalid URL for route stage ${stage.priority}`);
        return;
      }

      const decodedUrl = decodeURIComponent(link.url);
      (stage.urlIncludes || []).forEach((part) => {
        if (!link.url.includes(part)) fail(`${locationKey}: stage ${stage.priority} URL must include ${part}`);
      });
      (stage.urlDecodedIncludes || []).forEach((part) => {
        if (!decodedUrl.includes(part)) fail(`${locationKey}: stage ${stage.priority} decoded URL must include ${part}`);
      });

      if (stage.originIncludes) {
        const origin = parsed.searchParams.get("origin") || "";
        if (!origin.includes(stage.originIncludes)) {
          fail(`${locationKey}: stage ${stage.priority} origin must include "${stage.originIncludes}", got "${origin}"`);
        }
      }

      if (stage.destinationIncludes) {
        const destination = parsed.searchParams.get("destination") || decodedUrl;
        if (!destination.includes(stage.destinationIncludes)) {
          fail(`${locationKey}: stage ${stage.priority} destination must include "${stage.destinationIncludes}", got "${destination}"`);
        }
      }

      if (stage.noOrigin && parsed.searchParams.has("origin")) {
        fail(`${locationKey}: fallback stage ${stage.priority} must not have fixed origin`);
      }
    });
  });
}

function validatePhones(config) {
  Object.entries(config.contacts || {}).forEach(([group, people]) => {
    people.forEach((person) => {
      const digits = String(person.phone || "").replace(/\D/g, "");
      if (!digits.startsWith("48") || digits.length !== 11) fail(`${group}: invalid Polish phone ${person.phone}`);
    });
  });
  requiredLocations.forEach((locationKey) => {
    const digits = String(config.locations?.[locationKey]?.phone || "").replace(/\D/g, "");
    if (!digits.startsWith("48") || digits.length !== 11) fail(`${locationKey}: invalid main phone`);
  });
}

function validateContactRules(config) {
  Object.entries(requiredContactRules).forEach(([group, rule]) => {
    const people = config.contacts?.[group] || [];
    const primary = people[0];
    if (!primary) {
      fail(`${group}: missing contact list`);
      return;
    }
    if (primary.name !== rule.primaryName) {
      fail(`${group}: primary contact must be ${rule.primaryName}, got ${primary.name}`);
    }
    if (!String(primary.role || "").includes(rule.primaryRole)) {
      fail(`${group}: primary contact role must include ${rule.primaryRole}, got ${primary.role}`);
    }
    rule.requiredPeople.forEach((expected) => {
      const person = people.find((item) => item.name === expected.name);
      if (!person) {
        fail(`${group}: missing contact ${expected.name}`);
        return;
      }
      if (!String(person.role || "").includes(expected.role)) {
        fail(`${group}: ${expected.name} role must include ${expected.role}, got ${person.role}`);
      }
    });
  });
}

function validateAliases(config) {
  urlAliases.forEach(([langIn, locIn, langOut, locOut]) => {
    const normalizedLang = normalizeLanguage(langIn, config.languages || {});
    const normalizedLoc = normalizeLocation(locIn, config.locations || {});
    if (normalizedLang !== langOut) fail(`Alias lang ${langIn}: expected ${langOut}, got ${normalizedLang}`);
    if (normalizedLoc !== locOut) fail(`Alias location ${locIn}: expected ${locOut}, got ${normalizedLoc}`);
  });
}

async function validatePublic() {
  if (!publicBase) return;
  const stamp = Date.now();
  const assets = {
    index: `${publicBase}?quality=${stamp}`,
    app: `${publicBase}app.js?quality=${stamp}`,
    languages: `${publicBase}language-options.js?quality=${stamp}`,
    translations: `${publicBase}translations.js?quality=${stamp}`,
    serviceWorker: `${publicBase}sw.js?quality=${stamp}`,
    validator: `${publicBase}tools/validate-site.js?quality=${stamp}`
  };

  const fetched = {};
  for (const [key, url] of Object.entries(assets)) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      fail(`Public ${key}: HTTP ${response.status}`);
      continue;
    }
    fetched[key] = await response.text();
  }

  if (fetched.index && !fetched.index.includes("v43-contact-roles")) fail("Public index is not v43");
  if (fetched.serviceWorker && !fetched.serviceWorker.includes("arrival-guide-v43-contact-roles")) fail("Public service worker is not v43");
  Object.entries(fetched).forEach(([key, content]) => {
    if (key === "validator") return;
    if (hasBrokenEncoding(content)) fail(`Public ${key}: broken encoding token found`);
  });
  ["Polski", "Русский", "Українська", "English", "Azərbaycanca", "Español", "Filipino", "Indonesia", "नेपाली"].forEach((label) => {
    if (fetched.languages && !fetched.languages.includes(label)) fail(`Public languages: missing ${label}`);
  });
}

async function main() {
  validateVisibleFiles();

  const context = vm.createContext({
    window: {},
    document: { addEventListener() {} },
    location: { search: "" },
    open() {},
    console,
    structuredClone: (value) => JSON.parse(JSON.stringify(value))
  });
  loadScript(context, "data/config.js");
  loadScript(context, "data/overrides.js");
  loadScript(context, "language-options.js");
  const config = context.window.ARRIVAL_DEFAULT_CONFIG;

  if (!config) {
    fail("Configuration was not created");
  } else {
    validateMatrix(config);
    validateRouteLinks(config);
    validateRouteStages(config);
    validatePhones(config);
    validateContactRules(config);
    validateAliases(config);
  }

  await validatePublic();

  report.errors = errors.length;
  report.warnings = warnings.length;
  if (warnings.length) warnings.forEach((message) => console.warn(`WARN ${message}`));
  if (errors.length) {
    console.error("QUALITY_OK=false");
    errors.forEach((message) => console.error(`- ${message}`));
    process.exit(1);
  }

  console.log("QUALITY_OK=true");
  Object.entries(report).forEach(([key, value]) => console.log(`${key.toUpperCase()}=${value}`));
}

main().catch((error) => {
  console.error("QUALITY_OK=false");
  console.error(error);
  process.exit(1);
});
