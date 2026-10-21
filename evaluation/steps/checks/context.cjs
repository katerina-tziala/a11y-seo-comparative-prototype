"use strict";
// context.cjs: the settings and the shared state of one run of the checks script.
// The checks follow the Evaluation Check Plan; file names follow the evaluation protocol (P6.4).
const fs = require("fs");
const path = require("path");

const RUN = process.env.RUN;
if (!RUN || !/^[a-z0-9-]+$/.test(RUN)) {
  console.error("Set RUN to a lowercase run name, for example final01");
  process.exit(1);
}
if (!process.env.BASELINE_URL || !process.env.GOVERNED_URL) {
  console.error("Set BASELINE_URL and GOVERNED_URL");
  process.exit(1);
}
const VERSIONS = [
  { key: "baseline", url: process.env.BASELINE_URL },
  { key: "governed", url: process.env.GOVERNED_URL },
];
const VIEWPORTS = {
  desktop: {
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  mobile: {
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  },
};
const MOBILE_ONLY = new Set(["CF31", "CF36", "CF40"]);
// Optional: ONLY=CF27,CF35 runs only these checks (default: all).
const ONLY = (process.env.ONLY || "")
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);
const wanted = (id) => !ONLY.length || ONLY.includes(id);
// Output folder of the checks: evidence/<run>/checks (P6.5). evaluate.cjs passes it in OUT.
const OUT = path.resolve(
  process.env.OUT ||
    path.join(__dirname, "..", "..", "..", "evidence", RUN, "checks"),
);
const LOGFILE = `${RUN}_checks_log.json`;
if (fs.existsSync(path.join(OUT, LOGFILE))) {
  console.error(`Refusing to overwrite ${OUT}. Use a new RUN.`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const log = {
  run: RUN,
  dryRunOnly: /^dryrun/.test(RUN),
  started: new Date().toISOString(),
  versions: VERSIONS,
  environment: {},
  generatedHtml: {},
  results: [],
};
// File names follow the protocol (P6.4): <run>_<implementation>_<item>_<viewport>[-<input>][_<NN>].<ext>
const counters = {};
const used = new Set();
function fileName(v, id, vp, ext, { input = null, numbered = false } = {}) {
  const base = `${RUN}_${v}_${id}_${vp}${input ? "-" + input : ""}`;
  if (numbered) {
    counters[base] = (counters[base] || 0) + 1;
    return `${base}_${String(counters[base]).padStart(2, "0")}.${ext}`;
  }
  let name = `${base}.${ext}`;
  if (used.has(name)) {
    counters[base] = (counters[base] || 1) + 1;
    name = `${base}_${String(counters[base]).padStart(2, "0")}.${ext}`;
  }
  used.add(name);
  return name;
}
function record(id, v, vp, input, values, files = [], error = null) {
  log.results.push({
    id,
    version: v,
    viewport: vp,
    input,
    values,
    files,
    error,
  });
  console.log(
    JSON.stringify({ id, version: v, viewport: vp, input, ok: !error }),
  );
}

// The browser is launched by index.cjs and shared by all checks.
module.exports = {
  RUN,
  VERSIONS,
  VIEWPORTS,
  MOBILE_ONLY,
  ONLY,
  wanted,
  OUT,
  LOGFILE,
  log,
  fileName,
  record,
  browser: null,
};
