const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const requiredLanguages = ["pl", "ru", "uk", "en", "az", "es", "fil", "id", "ne"];
const requiredLocations = ["siechnice", "zgorzelec", "bogatynia", "ryczywol"];
const visibleTextFiles = ["language-options.js", "translations.js", "index.html"];
const mojibakePattern = /Đ|Ă|Ĺ|Ń|ŕ|á|Â|â†|GĂ|NiedĂ|RyczywĂ|WrocĹ/;
const errors = [];

function fail(message) {
  errors.push(message);
}

function loadScript(context, relativePath) {
  const filePath = path.join(root, relativePath);
  const code = fs.readFileSync(filePath, "utf8");
  vm.runInContext(code, context, { filename: relativePath });
}

visibleTextFiles.forEach((relativePath) => {
  const code = fs.readFileSync(path.join(root, relativePath), "utf8");
  if (mojibakePattern.test(code)) {
    fail(`${relativePath}: visible text contains broken encoding`);
  }
});

function digits(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function isValidPhone(phone) {
  const clean = digits(phone);
  return clean.length >= 11 && clean.length <= 15 && clean.startsWith("48");
}

function validateUrl(locationKey, link) {
  try {
    const url = new URL(link.url);
    if (url.protocol !== "https:") {
      fail(`${locationKey}: route link must use HTTPS`);
    }
  } catch (error) {
    fail(`${locationKey}: route link has invalid URL`);
  }
}

function localized(value, lang = "en") {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value[lang] || value.en || value.pl || "";
  }
  return value || "";
}

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
}

if (config) {
  const languageCodes = Object.keys(config.languages || {});
  requiredLanguages.forEach((code) => {
    if (!languageCodes.includes(code)) fail(`Missing language: ${code}`);
    if (!config.ui || !config.ui[code]) fail(`Missing UI translations for language: ${code}`);
  });

  if (languageCodes.length !== requiredLanguages.length) {
    fail(`Expected ${requiredLanguages.length} languages, found ${languageCodes.length}`);
  }

  requiredLocations.forEach((locationKey) => {
    const place = config.locations && config.locations[locationKey];
    if (!place) {
      fail(`Missing location: ${locationKey}`);
      return;
    }

    if (!place.address || !place.address.length) {
      fail(`${locationKey}: missing address`);
    }

    if (!isValidPhone(place.phone)) {
      fail(`${locationKey}: invalid main phone ${place.phone || ""}`);
    }

    requiredLanguages.forEach((code) => {
      const route = place.route && place.route[code];
      if (!Array.isArray(route) || route.length < 4) {
        fail(`${locationKey}: route for ${code} must contain at least 4 steps`);
      }
    });

    if (!Array.isArray(place.routeLinks) || place.routeLinks.length < 3) {
      fail(`${locationKey}: missing useful route search links`);
    } else {
      let previousPriority = 0;
      let hasEmergencyFromCurrentLocation = false;
      place.routeLinks.forEach((link) => {
        if (!localized(link.label)) fail(`${locationKey}: route link without label`);
        requiredLanguages.forEach((code) => {
          if (!localized(link.label, code)) fail(`${locationKey}: route link missing label for ${code}`);
          if (link.note && !localized(link.note, code)) fail(`${locationKey}: route link missing note for ${code}`);
        });
        if (!link.url) fail(`${locationKey}: route link without URL`);
        if (link.url) validateUrl(locationKey, link);
        if ((link.priority || 99) < previousPriority) {
          fail(`${locationKey}: route links are not sorted by priority`);
        }
        previousPriority = link.priority || 99;

        const urlText = String(link.url || "");
        if ((link.priority || 99) >= 9 && /google\.com\/maps\/dir/i.test(urlText) && !/origin=/i.test(urlText)) {
          hasEmergencyFromCurrentLocation = true;
        }
      });
      if (!hasEmergencyFromCurrentLocation) {
        fail(`${locationKey}: missing emergency map link from current location`);
      }
    }
  });

  Object.entries(config.contacts || {}).forEach(([group, people]) => {
    if (!Array.isArray(people) || !people.length) {
      fail(`${group}: contact group is empty`);
      return;
    }
    people.forEach((person) => {
      if (!person.name) fail(`${group}: contact without name`);
      if (!person.role) fail(`${group}: contact ${person.name || "unknown"} without role`);
      if (!isValidPhone(person.phone)) fail(`${group}: invalid contact phone ${person.phone || ""}`);
    });
  });

  ["siechnice", "ryczywol", "bogatynia_zgorzelec"].forEach((group) => {
    if (!config.contacts || !config.contacts[group] || !config.contacts[group].length) {
      fail(`Missing required candidate contact group: ${group}`);
    }
  });
}

if (errors.length) {
  console.error("VALIDATION_OK=false");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("VALIDATION_OK=true");
console.log(`LANGUAGES=${requiredLanguages.length}`);
console.log(`LOCATIONS=${requiredLocations.length}`);
