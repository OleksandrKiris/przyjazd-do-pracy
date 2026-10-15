const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

// Exercise the real CLI and its existing data/encoding/language checks.
// Every public response is a local fixture; no request or candidate action is sent.
function runCheck(scenario = {}) {
  const preload = `
    const fs = require("node:fs");
    const path = require("node:path");
    const originalRead = fs.readFileSync.bind(fs);
    const scenario = ${JSON.stringify(scenario)};
    const root = ${JSON.stringify(root)};
    function fixture(file, remote) {
      let text = originalRead(path.join(root, file), "utf8");
      if (["index.html", "sw.js"].includes(file)) {
        const marker = (file === "index.html"
          ? text.match(/name="candidate-page-version" content="([^"]+)"/)
          : text.match(/const CACHE_NAME = "([^"]+)"/))?.[1];
        if (!marker) throw Error("fixture has no release marker: " + file);
        if (scenario.future) text = text.replace(marker, marker + "-future");
        if (remote && scenario.stale === file) text = text.replace(marker + (scenario.future ? "-future" : ""), "v46-fast-navigation");
        if (scenario.missingLocal === file && !remote) text = text.replace(marker, "");
        if (scenario.missingRemote === file && remote) text = text.replace(marker, "");
      }
      if (remote && scenario.encoding === file) text += " RyczywĂ";
      if (remote && scenario.languageMissing && file === "language-options.js") text = text.replaceAll("Polski", "removed");
      return text;
    }
    fs.readFileSync = function(file, ...args) {
      const relative = path.relative(root, String(file));
      if (["index.html", "sw.js"].includes(relative) && (scenario.future || scenario.missingLocal)) return fixture(relative, false);
      return originalRead(file, ...args);
    };
    global.fetch = async (url, options) => {
      if (options?.cache !== "no-store") throw Error("public request must bypass cache");
      const parsed = new URL(url);
      if (parsed.origin !== "https://example.invalid") throw Error("unexpected request origin");
      const file = parsed.pathname.replace(/^\\/arrival\\//, "") || "index.html";
      const allowed = ["index.html", "app.js", "language-options.js", "translations.js", "sw.js", "tools/validate-site.js"];
      if (!allowed.includes(file)) throw Error("unexpected resource " + file);
      return { ok: scenario.httpError !== file, status: scenario.httpError === file ? 503 : 200, text: async () => fixture(file, true) };
    };
    process.argv = [process.execPath, "quality-check.js", "--public", "https://example.invalid/arrival/"];
    require(${JSON.stringify(path.join(root, "tools/quality-check.js"))});
  `;
  const result = spawnSync(process.execPath, ["-e", preload], { cwd: root, encoding: "utf8", timeout: 10000 });
  assert.equal(result.error, undefined);
  return { status: result.status, output: result.stdout + result.stderr };
}

test("matching current release passes the complete public checker", () => {
  const result = runCheck();
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /QUALITY_OK=true/);
  assert.match(result.output, /MATRIXCHECKS=36/);
});

test("a future checked release needs no hard-coded validator update", () => {
  const result = runCheck({ future: true });
  assert.equal(result.status, 0, result.output);
});

for (const file of ["index.html", "sw.js"]) {
  const message = file === "index.html" ? /Public index does not match/ : /Public service worker does not match/;
  for (const scenario of ["stale", "missingLocal", "missingRemote"]) {
    test(`${scenario} ${file} fails closed`, () => {
      const result = runCheck({ [scenario]: file });
      assert.equal(result.status, 1, result.output);
      assert.match(result.output, message);
    });
  }
}

test("a stale worker also fails against a future checked release", () => {
  const result = runCheck({ future: true, stale: "sw.js" });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Public service worker does not match/);
});

test("HTTP failure remains a failure", () => {
  const result = runCheck({ httpError: "app.js" });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Public app: HTTP 503/);
});

test("broken encoding remains a failure", () => {
  const result = runCheck({ encoding: "translations.js" });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Public translations: broken encoding/);
});

test("missing language remains a failure", () => {
  const result = runCheck({ languageMissing: true });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /Public languages: missing Polski/);
});
