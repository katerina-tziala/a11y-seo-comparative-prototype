"use strict";
// capture.cjs: DOM facts, element and viewport screenshots, and the element that has focus (P6.1, P6.2).
const path = require("path");
const ctx = require("./context.cjs");

// Plain DOM facts of all elements that match a selector.
async function dom(page, selector, fn) {
  return page.$$eval(
    selector,
    (els, f) => els.map((el, i) => new Function("el", "i", f)(el, i)),
    fn,
  );
}
const DESCRIBE = `
  const r = el.getBoundingClientRect();
  return { tag: el.tagName.toLowerCase(), id: el.id || null, cls: el.getAttribute('class'),
    text: (el.innerText || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 120),
    x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY) };`;
async function shot(page, selector, v, id, vp, input = null) {
  try {
    const loc = page.locator(selector).first();
    if (!(await loc.isVisible())) return null;
    const name = ctx.fileName(v, id, vp, "png", { input });
    await loc.screenshot({ path: path.join(ctx.OUT, name) });
    return name;
  } catch {
    return null;
  }
}
async function viewportShot(page, v, id, vp, input = null) {
  const name = ctx.fileName(v, id, vp, "png", { input, numbered: true });
  await page.screenshot({ path: path.join(ctx.OUT, name) });
  return name;
}
async function describeActive(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { tag: "body" };
    const sec = el.closest("[id]");
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: el.getAttribute("class"),
      text: (el.innerText || el.getAttribute("aria-label") || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 80),
      inside: sec ? sec.id : null,
      inFooter: !!el.closest("footer"),
      inFaq: !!el.closest("#faq"),
    };
  });
}

// ---------- the checks ----------

module.exports = { dom, DESCRIBE, shot, viewportShot, describeActive };
