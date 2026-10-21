"use strict";
// index.cjs: runs all checks of the Evaluation Check Plan on both implementations and both viewports,
// and writes the checks log (<run>_checks_log.json). It records values; it does not judge them.
// Normally started by evaluate.cjs. Alone: RUN=<run> BASELINE_URL=... GOVERNED_URL=... node steps/checks/index.cjs
// Optional: ONLY=CF27,CF35 runs only these checks.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const ctx = require("./context.cjs");
const { domChecks } = require("./dom-checks.cjs");
const {
  tabWalk,
  cf38Supplementary,
  cf39,
  cf40,
  cf36,
  cf35,
  cf27,
} = require("./keyboard-checks.cjs");

(async () => {
  ctx.browser = await chromium.launch({ channel: "chrome", headless: true });
  ctx.log.environment = {
    chrome: ctx.browser.version(),
    node: process.version,
    playwright: require("playwright/package.json").version,
  };
  console.log(JSON.stringify(ctx.log.environment));
  for (const ver of ctx.VERSIONS) {
    for (const vp of Object.keys(ctx.VIEWPORTS)) {
      const tag = `${ver.key} ${vp}`;
      const step = async (name, fn) => {
        const DOM_IDS = [
          "CF09",
          "CF10",
          "CF11",
          "CF14",
          "CF15",
          "CF16",
          "CF17",
          "CF18",
          "CF19",
          "CF21",
          "CF22",
          "CF23",
          "CF27",
          "CF29",
          "CF31",
          "CF32",
          "CF33",
          "CF34",
          "CF46",
          "CF48",
          "SI01",
          "SI02",
          "SI03",
          "SI04",
          "SI05",
          "SI06",
          "SI07",
          "SI08",
          "SI11",
          "SI12",
        ];
        const ids = { DOM: DOM_IDS, TABWALK: ["CF38", "CF41", "TABWALK"] }[
          name
        ] || [name];
        if (!ids.some(ctx.wanted)) return;
        try {
          await fn();
        } catch (e) {
          ctx.record(
            name,
            ver.key,
            vp,
            "run",
            null,
            [],
            `${tag}: ${(e && e.message) || e}`,
          );
        }
      };
      await step("DOM", () => domChecks(ver, vp));
      await step("TABWALK", () => tabWalk(ver, vp));
      await step("CF38", () => cf38Supplementary(ver, vp));
      await step("CF39", () => cf39(ver, vp));
      for (const input of ["keyboard", "pointer"]) {
        await step("CF35", () => cf35(ver, vp, input));
        await step("CF27", () => cf27(ver, vp, input));
        if (vp === "mobile") await step("CF36", () => cf36(ver, input));
      }
      if (vp === "mobile") await step("CF40", () => cf40(ver));
    }
  }
  await ctx.browser.close();
  ctx.log.finished = new Date().toISOString();
  fs.writeFileSync(
    path.join(ctx.OUT, ctx.LOGFILE),
    JSON.stringify(ctx.log, null, 1),
  );
  const errors = ctx.log.results.filter((r) => r.error);
  console.log(
    JSON.stringify({
      complete: true,
      results: ctx.log.results.length,
      errors: errors.length,
      out: ctx.OUT,
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
