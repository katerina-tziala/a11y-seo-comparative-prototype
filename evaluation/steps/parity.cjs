// parity.cjs: the visual-parity comparison of the two implementations (evaluation protocol, P8.3).
// Normally started by evaluate.cjs (env RUN, URL_A = baseline, URL_B = accessibility-governed, OUT).
// For each viewport (desktop, mobile, emulated 200% zoom) and each state of the page, it:
//   1. measures the position and size of every visible element in both implementations;
//   2. matches the elements by visible text and document order (not by tag name);
//   3. compares geometry (difference above 0.5 CSS px) and 37 computed CSS properties, including ::before and ::after,
//      ignoring a property only when it cannot paint in both implementations, and comparing url(...) values without the deployment path;
//   4. saves a full-page screenshot of the initial state and a screenshot of the changed region for every other state.
// Output: <run>_parity_measurements.json and <run>_parity_report.html (A = baseline, B = accessibility-governed).
// --mode=geometry and --mode=style add a deliberate difference to test the script itself; their files are never evidence.
const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const RUN = process.env.RUN;
const URL_A = process.env.URL_A;
const URL_B = process.env.URL_B;
if (!RUN || !/^[A-Za-z0-9_-]+$/.test(RUN) || !URL_A || !URL_B)
  throw Error("Set RUN, URL_A and URL_B");
const mode =
  process.argv.find((a) => a.startsWith("--mode="))?.split("=")[1] ||
  (process.argv.includes("--inject") ? "geometry" : "normal");
if (!["normal", "geometry", "style"].includes(mode))
  throw Error("Use --mode=normal|geometry|style");
const injected = mode !== "normal";
const index = mode;
const SUFFIX = mode === "normal" ? "" : "-probe-" + mode; // probe runs check the script itself and are never evidence
const VNAME = { A: "baseline", B: "governed" };
const kebab = (s) => String(s).replace(/_/g, "-");
const DRY = /^dryrun/.test(RUN) || mode !== "normal";
const OUT = path.resolve(
  process.env.OUT ||
    path.join(__dirname, "..", "..", "evidence", RUN, "parity"),
);
const STYLE_PROPERTIES = [
  "color",
  "background-color",
  "background-image",
  ...["top", "right", "bottom", "left"].flatMap((side) => [
    `border-${side}-width`,
    `border-${side}-style`,
    `border-${side}-color`,
  ]),
  "border-radius",
  ...["top-left", "top-right", "bottom-right", "bottom-left"].map(
    (corner) => `border-${corner}-radius`,
  ),
  "outline-width",
  "outline-style",
  "outline-color",
  "outline-offset",
  "box-shadow",
  "text-decoration-line",
  "text-decoration-color",
  "text-decoration-thickness",
  "text-underline-offset",
  "opacity",
  "transform",
  "visibility",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
];
// Lossless interning avoids repeating identical computed-style maps across every state.
const styleTable = [],
  styleIds = new Map();
function internStyles(measurements) {
  const intern = (styles) => {
    const key = JSON.stringify(styles);
    if (!styleIds.has(key)) {
      styleIds.set(key, styleTable.length);
      styleTable.push(styles);
    }
    return styleIds.get(key);
  };
  for (const el of measurements.elements) {
    el.styleId = intern(el.styles);
    delete el.styles;
    for (const pseudo of Object.values(el.pseudo))
      if (pseudo) {
        pseudo.styleId = intern(pseudo.styles);
        delete pseudo.styles;
      }
  }
  return measurements;
}
const tolerance = 0.5;
const views = [
  {
    id: "desktop",
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  {
    id: "mobile",
    width: 375,
    height: 667,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  },
  {
    id: "zoom200",
    width: 640,
    height: 400,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
  },
];
const selectors = {
  hero_primary: ".hero .button-row > :nth-child(1)",
  hero_secondary: ".hero .button-row > :nth-child(2)",
  learn_more: ".card-link",
  faq_audit: ".faq-layout .button-row > *",
  submit: '.audit-form [type="submit"]',
  radio_card: ".radio-card",
  footer_link: ".footer-column-explore a",
  social_icon: ".social-link",
};
const compact = (s) => s.replace(/\s+/g, " ").trim();
async function neutral(page) {
  await page.mouse.move(-20, -20);
}
async function assetsReady(page) {
  await page.waitForFunction(
    () => !!document.querySelector(".menu-toggle") || innerWidth >= 1180,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(async (img) => {
        if (!img.complete)
          await new Promise((resolve, reject) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener(
              "error",
              () => reject(Error("Image load failed: " + img.currentSrc)),
              { once: true },
            );
          });
        if (!img.naturalWidth) throw Error("Broken image: " + img.currentSrc);
        await img.decode();
      }),
    );
  });
  await page.waitForTimeout(80);
}
async function stable(page) {
  let previous = "",
    count = 0;
  for (let n = 0; n < 20; n++) {
    const current = await page.evaluate(() =>
      JSON.stringify([
        document.documentElement.scrollHeight,
        scrollX,
        scrollY,
        ...[...document.querySelectorAll("body *")]
          .filter((el) => el.getClientRects().length)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return [r.x, r.y, r.width, r.height];
          }),
      ]),
    );
    count = current === previous ? count + 1 : 0;
    if (count >= 2) return;
    previous = current;
    await page.waitForTimeout(60);
  }
  throw Error("Layout did not stabilize");
}
async function center(page, locator) {
  await locator.evaluate((el) =>
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    }),
  );
  await stable(page);
}
async function pointerClick(page, locator) {
  await center(page, locator);
  await locator.click();
}
function stateList(view) {
  const states = [{ id: "initial", kind: "initial" }];
  if (view.id === "desktop")
    for (let i = 0; i < 7; i++)
      states.push({
        id: `hover_header_${i + 1}`,
        kind: "hover",
        selector: "#site-nav > a",
        nth: i,
      });
  for (const [id, selector] of Object.entries(selectors))
    states.push({ id: `hover_${id}`, kind: "hover", selector, nth: 0 });
  states.push(
    { id: "pointer_focus_text", kind: "pointer", selector: "#audit-name" },
    { id: "pointer_focus_radio", kind: "pointer", selector: ".radio-card" },
    { id: "pressed_submit", kind: "pressed", selector: selectors.submit },
  );
  if (view.id === "mobile") states.push({ id: "menu_open", kind: "menu" });
  states.push(
    { id: "faq_second_open", kind: "faq" },
    { id: "form_errors", kind: "errors" },
    { id: "form_checked", kind: "checked" },
    { id: "form_confirmation", kind: "confirmation" },
  );
  for (const position of ["start", "middle", "end"])
    states.push({ id: `packages_${position}`, kind: "table", position });
  return states;
}
async function setupState(page, state) {
  if (state.kind === "initial") return { produced: true };
  if (["hover", "pointer", "pressed"].includes(state.kind)) {
    const target = page.locator(state.selector).nth(state.nth || 0);
    await center(page, target);
    if (state.kind === "hover") {
      await target.hover();
      return {
        produced: await target.evaluate((el) => el.matches(":hover")),
        target: await target.evaluate((el) => ({
          text: el.textContent.trim(),
          tag: el.tagName,
        })),
      };
    }
    if (state.kind === "pointer") {
      await target.click();
      await neutral(page);
      return {
        produced: true,
        requested: "pointer focus after click",
        target: await target.evaluate((el) => ({
          tag: el.tagName,
          text: el.textContent.trim(),
          isActive: el === document.activeElement,
        })),
      };
    }
    const box = await target.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    return {
      produced: await target.evaluate((el) => el.matches(":active")),
      mouseHeld: true,
    };
  }
  if (state.kind === "menu") {
    await pointerClick(page, page.locator(".menu-toggle"));
    await neutral(page);
    return { produced: await page.locator("#site-nav").isVisible() };
  }
  if (state.kind === "faq") {
    await pointerClick(page, page.locator(".accordion-trigger").nth(1));
    await neutral(page);
    return {
      produced: await page.locator("#faq-panel-1").isVisible(),
      firstAnswerAlsoOpen: await page.locator("#faq-panel-0").isVisible(),
    };
  }
  if (state.kind === "errors") {
    await pointerClick(page, page.locator(selectors.submit));
    await neutral(page);
    const errors = await page.locator(".field-message").allTextContents();
    return {
      produced: errors.some((t) => t.includes("A name is required")),
      messages: errors.map(compact),
    };
  }
  if (state.kind === "checked") {
    await pointerClick(page, page.locator(".radio-card").first());
    await neutral(page);
    return {
      produced: await page.locator("#concern-accessibility").isChecked(),
    };
  }
  if (state.kind === "confirmation") {
    await page.locator("#audit-name").fill("Dry Run");
    await page.locator("#audit-email").fill("dryrun@example.com");
    await page.locator("#audit-website").fill("https://example.com");
    await page
      .locator("#audit-details")
      .fill("Dry run only. No research evidence.");
    await pointerClick(page, page.locator(".radio-card").first());
    await pointerClick(page, page.locator(selectors.submit));
    await neutral(page);
    await page
      .locator(".audit-overlay.is-active")
      .waitFor({ state: "visible" });
    return {
      produced: await page.locator("#audit-edit").isVisible(),
      message: await page.locator("#audit-status").textContent(),
    };
  }
  if (state.kind === "table") {
    const scroller = page.locator(".table-scroll");
    const dimensions = await scroller.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }));
    if (dimensions.scrollWidth - dimensions.clientWidth <= 0.5)
      return {
        produced: false,
        notApplicable: true,
        reason: "Packages table has no horizontal overflow",
        ...dimensions,
      };
    await center(page, scroller);
    const scroll = await scroller.evaluate((el, position) => {
      const max = el.scrollWidth - el.clientWidth;
      const wanted =
        position === "start" ? 0 : position === "end" ? max : max / 2;
      el.scrollLeft = wanted;
      return { max, wanted, actual: el.scrollLeft };
    }, state.position);
    await neutral(page);
    return {
      produced: Math.abs(scroll.actual - scroll.wanted) <= 0.5,
      ...dimensions,
      ...scroll,
    };
  }
  throw Error("Unknown state " + state.id);
}
// DOM order and visible text are the match keys. Tags/paths are diagnostic only.
async function measure(page) {
  return page.evaluate((properties) => {
    const readStyle = (style) =>
      Object.fromEntries(
        properties.map((property) => [
          property,
          style.getPropertyValue(property).trim(),
        ]),
      );
    const readPseudo = (el, pseudo) => {
      const style = getComputedStyle(el, pseudo),
        content = style.content;
      return content === "none" || content === "normal"
        ? null
        : { content, styles: readStyle(style) };
    };
    const all = [
      document.documentElement,
      ...document.documentElement.querySelectorAll("*"),
    ];
    const info = new Map();
    const ignored = new Set([
      "SCRIPT",
      "STYLE",
      "HEAD",
      "TITLE",
      "META",
      "LINK",
      "NOSCRIPT",
      "TEMPLATE",
    ]);
    function basics(el) {
      if (info.has(el)) return info.get(el);
      const style = getComputedStyle(el),
        r = el.getBoundingClientRect();
      const parent = el.parentElement ? basics(el.parentElement) : null;
      const clipZero = /rect\(0px[, ]+0px[, ]+0px[, ]+0px\)/.test(style.clip);
      const srOnly =
        (r.width <= 1.1 &&
          r.height <= 1.1 &&
          (style.overflow === "hidden" || style.position === "absolute")) ||
        clipZero ||
        /inset\(50%\)/.test(style.clipPath);
      const hidden =
        ignored.has(el.tagName) ||
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.visibility === "collapse" ||
        Number(style.opacity) === 0 ||
        srOnly ||
        !!parent?.hidden;
      let visible =
        !hidden &&
        r.width > 0 &&
        r.height > 0 &&
        el.getClientRects().length > 0;
      // Keep off-viewport document content; exclude content wholly clipped by scroll/overflow ancestors.
      let left = r.left,
        right = r.right,
        top = r.top,
        bottom = r.bottom;
      if (visible)
        for (
          let p = el.parentElement;
          p && p !== document.body && p !== document.documentElement;
          p = p.parentElement
        ) {
          const ps = getComputedStyle(p),
            pr = p.getBoundingClientRect();
          if (["hidden", "clip", "auto", "scroll"].includes(ps.overflowX)) {
            left = Math.max(left, pr.left + p.clientLeft);
            right = Math.min(right, pr.left + p.clientLeft + p.clientWidth);
          }
          if (["hidden", "clip", "auto", "scroll"].includes(ps.overflowY)) {
            top = Math.max(top, pr.top + p.clientTop);
            bottom = Math.min(bottom, pr.top + p.clientTop + p.clientHeight);
          }
        }
      visible = visible && right - left > 0 && bottom - top > 0;
      const value = { style, r, hidden, visible };
      info.set(el, value);
      return value;
    }
    for (const el of all) basics(el);
    const textCache = new Map();
    function visibleText(el) {
      if (textCache.has(el)) return textCache.get(el);
      const state = info.get(el);
      if (!state || state.hidden) return "";
      let parts = [];
      if (
        (el.tagName === "INPUT" &&
          !["radio", "checkbox", "hidden"].includes(el.type)) ||
        el.tagName === "TEXTAREA"
      )
        parts.push(el.value || "");
      for (const node of el.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (!node.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(node);
          if (
            [...range.getClientRects()].some((r) => r.width > 0 && r.height > 0)
          )
            parts.push(node.textContent);
        } else if (node.nodeType === Node.ELEMENT_NODE)
          parts.push(visibleText(node));
      }
      const text = parts.join(" ").replace(/\s+/g, " ").trim();
      textCache.set(el, text);
      return text;
    }
    function domPath(el) {
      const parts = [];
      while (el && el !== document.documentElement) {
        parts.unshift([...el.parentElement.children].indexOf(el));
        el = el.parentElement;
      }
      return parts.join(".");
    }
    const elements = [];
    const excluded = { hidden: 0, noVisibleBoxOrClipped: 0 };
    all.forEach((el, domOrder) => {
      const state = info.get(el);
      if (!state.visible) {
        excluded[state.hidden ? "hidden" : "noVisibleBoxOrClipped"]++;
        return;
      }
      const r = state.r;
      elements.push({
        order: elements.length,
        domOrder,
        text: visibleText(el),
        tag: el.tagName.toLowerCase(),
        id: el.id || "",
        className: el.getAttribute("class") || "",
        domPath: domPath(el),
        bounds: {
          x: r.x + scrollX,
          y: r.y + scrollY,
          width: r.width,
          height: r.height,
        },
        styles: readStyle(state.style),
        pseudo: {
          "::before": readPseudo(el, "::before"),
          "::after": readPseudo(el, "::after"),
        },
      });
    });
    const active = document.activeElement;
    const table = document.querySelector(".table-scroll");
    return {
      pageHeight: Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      ),
      pageWidth: document.documentElement.scrollWidth,
      scroll: { x: scrollX, y: scrollY },
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      media: {
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
        hover: matchMedia("(hover: hover)").matches,
        pointerFine: matchMedia("(pointer: fine)").matches,
      },
      focus: {
        tag: active.tagName.toLowerCase(),
        id: active.id,
        text: (active.textContent || "").trim().replace(/\s+/g, " "),
        focusVisible: active.matches(":focus-visible"),
      },
      tableScroll: table
        ? { left: table.scrollLeft, max: table.scrollWidth - table.clientWidth }
        : null,
      assets: {
        fonts: document.fonts.status,
        images: [...document.images].length,
        imagesLoaded: [...document.images].filter(
          (i) => i.complete && i.naturalWidth > 0,
        ).length,
      },
      excluded,
      elements,
    };
  }, STYLE_PROPERTIES);
}
function matchAndCompare(a, b) {
  if (!a || !b)
    return {
      status: "unavailable",
      reason: "One or both states could not be captured",
      matched: 0,
      differences: [],
    };
  const aa = a.elements,
    bb = b.elements;
  const pairs = [],
    unmatchedA = [],
    unmatchedB = [];
  if (aa.length === bb.length && aa.every((el, i) => el.text === bb[i].text))
    for (let i = 0; i < aa.length; i++) pairs.push([i, i]);
  else {
    const dp = Array.from(
      { length: aa.length + 1 },
      () => new Uint32Array(bb.length + 1),
    );
    for (let i = aa.length - 1; i >= 0; i--)
      for (let j = bb.length - 1; j >= 0; j--)
        dp[i][j] =
          aa[i].text === bb[j].text
            ? 1 + dp[i + 1][j + 1]
            : Math.max(dp[i + 1][j], dp[i][j + 1]);
    let i = 0,
      j = 0;
    while (i < aa.length && j < bb.length) {
      if (aa[i].text === bb[j].text) {
        pairs.push([i++, j++]);
      } else if (dp[i + 1][j] >= dp[i][j + 1]) unmatchedA.push(i++);
      else unmatchedB.push(j++);
    }
    while (i < aa.length) unmatchedA.push(i++);
    while (j < bb.length) unmatchedB.push(j++);
  }
  const differences = [];
  let stylePropertyComparisons = 0,
    pseudoElementPairsCompared = 0,
    pseudoPresenceComparisons = 0;
  for (const [i, j] of pairs) {
    const av = aa[i],
      bv = bb[j],
      delta = {};
    for (const k of ["x", "y", "width", "height"])
      if (Math.abs(bv.bounds[k] - av.bounds[k]) > tolerance)
        delta[k] = bv.bounds[k] - av.bounds[k];
    const styleDifferences = [];
    function compareStyle(scope, aId, bId) {
      const aStyles = styleTable[aId],
        bStyles = styleTable[bId];
      const kebab = (p) => p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
      const get = (s, k) =>
        s[k] ?? s[k.replace(/-([a-z])/g, (m, c) => c.toUpperCase())];
      // Remove the deployment folder from url(...), so the same file on /baseline/ and /a11y-governed/ compares equal
      const norm = (v) =>
        typeof v === "string"
          ? v.replace(
              /url\("?[^")]*\/a11y-seo-comparative-prototype\/[^/]+\/([^")]*)"?\)/g,
              "url($1)",
            )
          : v;
      // A property is invisible when it cannot paint: border colour with no border, outline colour or offset with no outline, decoration colour with no decoration
      const invisible = (s, p) => {
        const k = kebab(p);
        const side = k.match(/^border-(top|right|bottom|left)-color$/);
        if (side) {
          const w = get(s, `border-${side[1]}-width`),
            st = get(s, `border-${side[1]}-style`);
          return w === "0px" || st === "none" || st === "hidden";
        }
        if (k === "outline-color" || k === "outline-offset") {
          const w = get(s, "outline-width"),
            st = get(s, "outline-style");
          return w === "0px" || st === "none";
        }
        if (
          k === "text-decoration-color" ||
          k === "text-decoration-thickness" ||
          k === "text-underline-offset"
        )
          return get(s, "text-decoration-line") === "none";
        return false;
      };
      for (const property of STYLE_PROPERTIES) {
        stylePropertyComparisons++;
        if (invisible(aStyles, property) && invisible(bStyles, property))
          continue;
        if (norm(aStyles[property]) !== norm(bStyles[property]))
          styleDifferences.push({
            scope,
            property,
            A: aStyles[property],
            B: bStyles[property],
          });
      }
    }
    compareStyle("element", av.styleId, bv.styleId);
    for (const scope of ["::before", "::after"]) {
      const pa = av.pseudo[scope],
        pb = bv.pseudo[scope];
      pseudoPresenceComparisons++;
      if (!!pa !== !!pb)
        styleDifferences.push({
          scope,
          property: "content/presence",
          A: pa?.content ?? null,
          B: pb?.content ?? null,
        });
      else if (pa && pb) {
        pseudoElementPairsCompared++;
        if (pa.content !== pb.content)
          styleDifferences.push({
            scope,
            property: "content",
            A: pa.content,
            B: pb.content,
          });
        compareStyle(scope, pa.styleId, pb.styleId);
      }
    }
    if (Object.keys(delta).length || styleDifferences.length)
      differences.push({
        orderA: i,
        orderB: j,
        text: av.text,
        tagA: av.tag,
        tagB: bv.tag,
        boundsA: av.bounds,
        boundsB: bv.bounds,
        delta,
        styleDifferences,
      });
  }
  for (const i of unmatchedA)
    differences.push({ type: "unmatched-A", element: aa[i] });
  for (const j of unmatchedB)
    differences.push({ type: "unmatched-B", element: bb[j] });
  const pageHeightDelta = b.pageHeight - a.pageHeight;
  const pageWidthDelta = b.pageWidth - a.pageWidth;
  const geometryElementDifferences = differences.filter(
    (d) => d.type || Object.keys(d.delta).length,
  ).length;
  const styledElementDifferences = differences.filter(
    (d) => d.styleDifferences?.length,
  ).length;
  return {
    status:
      differences.length ||
      Math.abs(pageHeightDelta) > tolerance ||
      Math.abs(pageWidthDelta) > tolerance
        ? "differs"
        : "same",
    geometryStatus:
      geometryElementDifferences ||
      Math.abs(pageHeightDelta) > tolerance ||
      Math.abs(pageWidthDelta) > tolerance
        ? "differs"
        : "same",
    styleStatus: styledElementDifferences ? "differs" : "same",
    geometryElementDifferences,
    styledElementDifferences,
    stylePropertyComparisons,
    pseudoElementPairsCompared,
    pseudoPresenceComparisons,
    matched: pairs.length,
    elementCountA: aa.length,
    elementCountB: bb.length,
    pageHeightA: a.pageHeight,
    pageHeightB: b.pageHeight,
    pageHeightDelta,
    pageWidthDelta,
    unmatchedA: unmatchedA.length,
    unmatchedB: unmatchedB.length,
    differences,
  };
}
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function htmlReport(report) {
  const cards = report.results
    .map((r) => {
      const c = r.comparison;
      const diffrows = c.differences
        .map((d) =>
          d.type
            ? `<tr><td>${esc(d.type)}</td><td>${esc(d.element.text.slice(0, 400))}</td><td colspan="4"><pre>${esc(JSON.stringify(d.element, null, 2))}</pre></td></tr>`
            : `<tr><td>${d.orderA} / ${d.orderB}</td><td>${esc(d.text.slice(0, 400) || "(no visible text)")}<br><small>${esc(d.tagA)} / ${esc(d.tagB)} (diagnostic)</small></td><td><b>A</b> ${esc(JSON.stringify(d.boundsA))}<br><b>B</b> ${esc(JSON.stringify(d.boundsB))}</td><td>${esc(JSON.stringify(d.delta))}</td><td colspan="2">${d.styleDifferences.map((v) => `<p><b>${esc(v.scope)} / ${esc(v.property)}</b><br>A: <code>${esc(v.A)}</code><br>B: <code>${esc(v.B)}</code></p>`).join("") || "None"}</td></tr>`,
        )
        .join("");
      return `<section id="${r.viewport}-${r.state}" class="${c.status}"><h2>${esc(r.viewport)} / ${esc(r.state)} — ${esc(c.status)}</h2><p>Geometry: ${esc(c.geometryStatus ?? c.status)}; styles: ${esc(c.styleStatus ?? c.status)}. Matched elements: ${c.matched}; page height A/B: ${c.pageHeightA ?? "—"} / ${c.pageHeightB ?? "—"}; height delta: ${c.pageHeightDelta ?? "—"} CSS px.</p>${r.notes?.length ? `<p>${esc(r.notes.join(" "))}</p>` : ""}
    <div class="screens">${["A", "B"].map((v) => (r[v]?.screenshot ? `<figure><figcaption>${esc(VNAME[v])} — ${esc(r[v].capture.kind)} — <a href="${esc(r[v].screenshot)}">open screenshot</a></figcaption><div class="image-scroll"><img loading="lazy" src="${esc(r[v].screenshot)}" alt="${esc(VNAME[v] + " " + r.viewport + " " + r.state)}"></div></figure>` : `<p>Version ${v}: ${esc(r[v]?.reason || r[v]?.error || "unavailable")}</p>`)).join("")}</div>
    ${diffrows ? `<div class="diff-table"><table><thead><tr><th>Order A/B</th><th>Visible text</th><th>Geometry A/B (CSS px)</th><th>Geometry B − A</th><th colspan="2">Computed style differences</th></tr></thead><tbody>${diffrows}</tbody></table></div>` : "<p>No differing elements.</p>"}</section>`;
    })
    .join("");
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(RUN)} visual parity (P8.3)${esc(SUFFIX)}</title><style>body{font:15px system-ui;margin:24px;color:#172e2a}h1{font-size:26px}section{border-top:3px solid #aaa;margin-top:28px;padding-top:12px}.same{border-color:#08745b}.differs{border-color:#bd2525}.screens{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0;min-width:0}.image-scroll{max-height:650px;overflow:auto;border:1px solid #aaa;background:#eee}img{display:block;max-width:100%;height:auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:8px;text-align:left;vertical-align:top}td{overflow-wrap:anywhere}.diff-table{overflow:auto}pre{white-space:pre-wrap}nav a{display:inline-block;margin:4px}small{color:#555}</style><h1>${esc(RUN)} / visual parity (P8.3) / ${esc(mode)}</h1>${DRY ? "<p><strong>Dry run or probe: not research evidence.</strong></p>" : ""}<p>A = baseline; B = governed (accessibility-governed implementation).</p><p>Playwright ${report.playwrightVersion}; Chrome ${esc(report.chromeVersion)}; geometry tolerance &gt; ${tolerance} CSS px; styles compare exact computed values; elapsed ${report.durationMs / 1000}s.</p><p>${esc(JSON.stringify(report.summary))}</p><p>Only initial screenshots are full-page. Other screenshots show the affected region with a 16 CSS px margin, clamped to document bounds. Measurements and style comparisons cover all rendered elements throughout the document. Match by normalized visible text and document order; ignore tags. All ${STYLE_PROPERTIES.length} properties are compared on each matched element and its generated ::before/::after pseudo-elements (including empty-string content). Computed-style maps are losslessly interned in the JSON styleTable.</p><nav>${report.results.map((r) => `<a href="#${r.viewport}-${r.state}">${esc(r.viewport + "/" + r.state)} (${r.comparison.status})</a>`).join("")}</nav>${cards}</html>`;
}
async function captureState(page, state, file) {
  if (state.kind === "initial") {
    await page.screenshot({ path: file, fullPage: true, caret: "hide" });
    return { kind: "full-page", marginCssPx: 0 };
  }
  let locator;
  if (["hover", "pointer", "pressed"].includes(state.kind))
    locator = page.locator(state.selector).nth(state.nth || 0);
  else if (state.kind === "menu") locator = page.locator(".site-header");
  else if (state.kind === "faq")
    locator = page.locator(".accordion-item").nth(1);
  else if (["errors", "checked", "confirmation"].includes(state.kind))
    locator = page.locator(".audit-card");
  else if (state.kind === "table") locator = page.locator(".table-scroll");
  else throw Error("No screenshot region for " + state.id);
  const region = await locator.evaluate((el, kind) => {
    const rects = [el.getBoundingClientRect()];
    if (kind === "menu")
      rects.push(document.querySelector("#site-nav").getBoundingClientRect());
    const left = Math.min(...rects.map((r) => r.left)) + scrollX,
      top = Math.min(...rects.map((r) => r.top)) + scrollY;
    const right = Math.max(...rects.map((r) => r.right)) + scrollX,
      bottom = Math.max(...rects.map((r) => r.bottom)) + scrollY;
    const documentWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
      ),
      documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );
    const x = Math.max(0, Math.floor(left - 16)),
      y = Math.max(0, Math.floor(top - 16));
    return {
      x,
      y,
      width: Math.min(documentWidth, Math.ceil(right + 16)) - x,
      height: Math.min(documentHeight, Math.ceil(bottom + 16)) - y,
    };
  }, state.kind);
  if (region.width <= 0 || region.height <= 0)
    throw Error("Invalid screenshot clip " + JSON.stringify(region));
  // Document-coordinate clip avoids scrolling or moving the mouse while a state is active.
  // fullPage selects document coordinates; clip limits the actual captured bitmap to this region.
  // Playwright sends only this rectangle to Chrome through its existing emulation session.
  await page.screenshot({
    path: file,
    fullPage: true,
    clip: region,
    caret: "hide",
    scale: "device",
  });
  const pixelScale = await page.evaluate(() => devicePixelRatio);
  return {
    kind: "region",
    marginCssPx: 16,
    clip: region,
    pixelScale,
    regionFor: state.kind,
  };
}
(async () => {
  const started = performance.now();
  await fs.mkdir(OUT, { recursive: true });
  const jsonFile = `${RUN}_parity_measurements${SUFFIX}.json`,
    htmlFile = `${RUN}_parity_report${SUFFIX}.html`;
  try {
    await fs.access(path.join(OUT, jsonFile));
    throw Error("Completed run exists: " + jsonFile);
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const report = {
    schemaVersion: 2,
    smoke: process.argv.includes("--smoke"),
    run: RUN,
    dryRunOnly: DRY,
    researchEvidence: !DRY,
    mode,
    injected,
    versionNames: VNAME,
    injection:
      mode === "geometry"
        ? {
            version: "B",
            viewport: "desktop",
            state: "initial",
            css: ".hero h1 { padding-top: 2px !important; }",
          }
        : mode === "style"
          ? {
              version: "B",
              viewport: "desktop",
              state: "hover_header_1",
              css: "#site-nav > a:first-child { color: rgb(180, 0, 180) !important; }",
            }
          : null,
    styleProperties: STYLE_PROPERTIES,
    styleTable,
    inputs: { URL_A, URL_B },
    playwrightVersion: require("playwright/package.json").version,
    chromeVersion: browser.version(),
    channel: "chrome",
    headless: true,
    startedAt: new Date().toISOString(),
    toleranceCssPx: tolerance,
    viewports: views,
    measurementDefinition:
      "Rendered DOM boxes in document coordinates including off-viewport content; hidden/sr-only/zero-box/wholly overflow-clipped nodes excluded. Matching: LCS of normalized visible text in document order, tag names ignored. Repeated empty-text matches follow order and may be ambiguous if markup structure changes.",
    results: [],
    errors: [],
  };
  for (const view of views) {
    for (const state of stateList(view).filter(
      (s) =>
        !process.argv.includes("--smoke") ||
        {
          desktop: [
            "initial",
            "hover_header_1",
            "pressed_submit",
            "form_errors",
          ],
          mobile: ["menu_open", "packages_middle"],
          zoom200: ["form_confirmation"],
        }[view.id].includes(s.id),
    )) {
      const result = {
        viewport: view.id,
        state: state.id,
        kind: state.kind,
        notes: [],
      };
      for (const [version, url] of [
        ["A", URL_A],
        ["B", URL_B],
      ]) {
        const context = await browser.newContext({
          viewport: { width: view.width, height: view.height },
          screen: { width: view.width, height: view.height },
          deviceScaleFactor: view.deviceScaleFactor,
          isMobile: view.isMobile,
          hasTouch: view.hasTouch,
          reducedMotion: "reduce",
          locale: "en-US",
          timezoneId: "Europe/Athens",
        });
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        page.setDefaultNavigationTimeout(30000);
        const pageErrors = [];
        page.on("pageerror", (e) => pageErrors.push(e.message));
        try {
          await neutral(page);
          await page.goto(url, { waitUntil: "networkidle" });
          // Each state has its own new context/page: stronger isolation than reloading a previous form state.
          await assetsReady(page);
          await page.addStyleTag({
            content: "* { caret-color: transparent !important; }",
          });
          const proof = await setupState(page, state);
          if (
            injected &&
            version === "B" &&
            view.id === report.injection.viewport &&
            state.id === report.injection.state
          ) {
            await page.addStyleTag({ content: report.injection.css });
            await page.waitForFunction(
              (mode) =>
                mode === "geometry"
                  ? getComputedStyle(document.querySelector(".hero h1"))
                      .paddingTop === "2px"
                  : getComputedStyle(
                      document.querySelector("#site-nav > a:first-child"),
                    ).color === "rgb(180, 0, 180)",
              mode,
            );
          }
          if (proof.notApplicable) {
            result[version] = {
              notApplicable: true,
              reason: proof.reason,
              proof,
            };
          } else {
            if (!proof.produced)
              throw Error(
                "Requested state was not reached: " + JSON.stringify(proof),
              );
            // Normalize document scroll before large off-viewport clips so sticky header paint stays at document top.
            // Focus, checked/open/confirmation state and the table's own scrollLeft are retained.
            if (
              ["faq", "errors", "checked", "confirmation", "table"].includes(
                state.kind,
              )
            )
              await page.evaluate(() =>
                window.scrollTo({ left: 0, top: 0, behavior: "instant" }),
              );
            await stable(page);
            const measurements = internStyles(await measure(page));
            const screenshot = `${RUN}_${VNAME[version]}_parity${SUFFIX}_${view.id}_${kebab(state.id)}.png`;
            const capture = await captureState(
              page,
              state,
              path.join(OUT, screenshot),
            );
            result[version] = {
              proof,
              screenshot,
              capture,
              ...measurements,
              pageErrors,
            };
            if (state.kind === "hover" && view.hasTouch)
              result.notes.push(
                `${version}: mouse hover injected in touch/mobile emulation; this is not a physical touchscreen hover.`,
              );
          }
        } catch (e) {
          result[version] = { error: e.message };
          report.errors.push({
            viewport: view.id,
            state: state.id,
            version,
            message: e.message,
          });
        } finally {
          if (!page.isClosed()) await page.mouse.up().catch(() => {});
          await neutral(page).catch(() => {});
          await context.close();
        }
      }
      if (result.A?.notApplicable && result.B?.notApplicable)
        result.comparison = {
          status: "not-applicable",
          reason: result.A.reason,
          matched: 0,
          differences: [],
        };
      else
        result.comparison = matchAndCompare(
          result.A?.elements ? result.A : null,
          result.B?.elements ? result.B : null,
        );
      report.results.push(result);
      console.log(
        JSON.stringify({
          mode,
          viewport: view.id,
          state: state.id,
          status: result.comparison.status,
          matched: result.comparison.matched,
          differences: result.comparison.differences.length,
          errors: report.errors.length,
        }),
      );
      // Persist progress even if a later state cannot be produced.
      await fs.writeFile(
        path.join(OUT, `${RUN}_parity_progress${SUFFIX}.json`),
        JSON.stringify({
          dryRunOnly: DRY,
          completed: report.results.length,
          last: state.id,
          errors: report.errors,
        }),
      );
    }
  }
  await browser.close();
  report.durationMs = Math.round(performance.now() - started);
  report.finishedAt = new Date().toISOString();
  report.summary = {
    stateViewportPairs: report.results.length,
    comparedPairs: report.results.filter((r) =>
      ["same", "differs"].includes(r.comparison.status),
    ).length,
    same: report.results.filter((r) => r.comparison.status === "same").length,
    differs: report.results.filter((r) => r.comparison.status === "differs")
      .length,
    notApplicable: report.results.filter(
      (r) => r.comparison.status === "not-applicable",
    ).length,
    unavailable: report.results.filter(
      (r) => r.comparison.status === "unavailable",
    ).length,
    elementPairsCompared: report.results.reduce(
      (s, r) => s + r.comparison.matched,
      0,
    ),
    differingElements: report.results.reduce(
      (s, r) => s + r.comparison.differences.length,
      0,
    ),
    geometryDifferingStates: report.results.filter(
      (r) => r.comparison.geometryStatus === "differs",
    ).length,
    styleDifferingStates: report.results.filter(
      (r) => r.comparison.styleStatus === "differs",
    ).length,
    geometryDifferingElements: report.results.reduce(
      (s, r) => s + (r.comparison.geometryElementDifferences || 0),
      0,
    ),
    styleDifferingElements: report.results.reduce(
      (s, r) => s + (r.comparison.styledElementDifferences || 0),
      0,
    ),
    stylePropertyComparisons: report.results.reduce(
      (s, r) => s + (r.comparison.stylePropertyComparisons || 0),
      0,
    ),
    pseudoElementPairsCompared: report.results.reduce(
      (s, r) => s + (r.comparison.pseudoElementPairsCompared || 0),
      0,
    ),
    pseudoPresenceComparisons: report.results.reduce(
      (s, r) => s + (r.comparison.pseudoPresenceComparisons || 0),
      0,
    ),
    uniqueStyleMaps: styleTable.length,
  };
  await fs.writeFile(path.join(OUT, jsonFile), JSON.stringify(report));
  await fs.writeFile(path.join(OUT, htmlFile), htmlReport(report));
  const runFiles = (await fs.readdir(OUT)).filter(
    (f) =>
      f.startsWith(`${RUN}_`) &&
      (SUFFIX ? f.includes(SUFFIX) : !f.includes("-probe-")) &&
      !f.includes("_parity_manifest"),
  );
  const sizes = await Promise.all(
    runFiles.map(async (file) => ({
      file,
      bytes: (await fs.stat(path.join(OUT, file))).size,
    })),
  );
  await fs.writeFile(
    path.join(OUT, `${RUN}_parity_manifest${SUFFIX}.json`),
    JSON.stringify(
      {
        dryRunOnly: DRY,
        files: sizes,
        totalBytes: sizes.reduce((s, f) => s + f.bytes, 0),
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      complete: true,
      ...report.summary,
      durationMs: report.durationMs,
      totalBytes: sizes.reduce((s, f) => s + f.bytes, 0),
      jsonFile,
      htmlFile,
    }),
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
