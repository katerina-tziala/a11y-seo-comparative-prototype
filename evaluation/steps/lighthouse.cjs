// lighthouse.cjs: the four Lighthouse runs of a run (evaluation protocol, P3.1 to P3.3, P4.2).
// Normally started by evaluate.cjs. Alone: RUN=<run> BASELINE_URL=... GOVERNED_URL=... node steps/lighthouse.cjs
// Lighthouse 13.5.0 is pinned in package.json; the reports are renamed to the protocol names (P6.4).
"use strict";
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RUN = process.env.RUN;
if (!RUN || !/^[a-z0-9-]+$/.test(RUN)) {
  console.error("Set RUN to a lowercase run name, for example final01");
  process.exit(1);
}
const URLS = {
  baseline: process.env.BASELINE_URL,
  governed: process.env.GOVERNED_URL,
};
if (!URLS.baseline || !URLS.governed) {
  console.error("Set BASELINE_URL and GOVERNED_URL");
  process.exit(1);
}
const OUT = path.resolve(
  process.env.OUT ||
    path.join(__dirname, "..", "..", "evidence", RUN, "lighthouse"),
);
fs.mkdirSync(OUT, { recursive: true });
const BIN = path.join(__dirname, "..", "node_modules", ".bin", "lighthouse");
const EXPECTED = require("lighthouse/package.json").version; // pinned in package.json (13.5.0)

// Order of P4.2: each pair runs one directly after the other.
const ORDER = [
  ["baseline", "mobile"],
  ["governed", "mobile"],
  ["baseline", "desktop"],
  ["governed", "desktop"],
];
const runs = [];
for (const [v, mode] of ORDER) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    // one repetition after a loading error or a wrong version (P3.3)
    const nn = String(attempt).padStart(2, "0");
    const prefix = path.join(OUT, `${RUN}_${v}_lighthouse_${mode}_${nn}`);
    const args = [
      URLS[v],
      "--only-categories=accessibility,seo",
      "--chrome-flags=--headless",
      "--output=html",
      "--output=json",
      `--output-path=${prefix}`,
    ];
    if (mode === "desktop") args.push("--preset=desktop");
    const started = new Date().toISOString();
    const p = spawnSync(BIN, args, { stdio: "inherit", env: process.env });
    // Lighthouse writes <prefix>.report.html and <prefix>.report.json; rename them to the protocol names (P6.4).
    for (const ext of ["html", "json"]) {
      const from = `${prefix}.report.${ext}`;
      if (fs.existsSync(from)) fs.renameSync(from, `${prefix}.${ext}`);
    }
    let report = null;
    try {
      report = JSON.parse(fs.readFileSync(`${prefix}.json`, "utf8"));
    } catch {}
    const problems = [];
    if (p.status !== 0) problems.push(`exit code ${p.status}`);
    if (!report) problems.push("no JSON report");
    else {
      if (report.lighthouseVersion !== EXPECTED)
        problems.push(
          `version ${report.lighthouseVersion}, expected ${EXPECTED}`,
        );
      if (report.runtimeError)
        problems.push(`runtime error: ${report.runtimeError.code}`);
    }
    runs.push({
      implementation: v,
      mode,
      attempt,
      files: [`${path.basename(prefix)}.html`, `${path.basename(prefix)}.json`],
      started,
      finished: new Date().toISOString(),
      lighthouseVersion: report && report.lighthouseVersion,
      userAgent:
        report && report.environment && report.environment.hostUserAgent,
      ok: problems.length === 0,
      problems,
    });
    console.log(JSON.stringify(runs[runs.length - 1]));
    if (problems.length === 0) break;
  }
}
fs.writeFileSync(
  path.join(OUT, `${RUN}_lighthouse_runs.json`),
  JSON.stringify(
    { run: RUN, expectedVersion: EXPECTED, urls: URLS, runs },
    null,
    1,
  ),
);
const failed = ORDER.filter(
  ([v, m]) => !runs.some((r) => r.implementation === v && r.mode === m && r.ok),
);
if (failed.length) {
  console.error(
    "Lighthouse failed for: " + failed.map((x) => x.join(" ")).join(", "),
  );
  process.exitCode = 1;
}
