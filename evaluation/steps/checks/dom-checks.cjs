"use strict";
// dom-checks.cjs: the checks that read the DOM, the Accessibility Tree and the generated HTML, without key presses:
// CF09 to CF34, CF46, CF48 (accessibility evaluation matrix) and SI01 to SI12 (SEO evaluation matrix).
// One page load per implementation and viewport; each check records its values and an element screenshot.
const fs = require("fs");
const path = require("path");
const ctx = require("./context.cjs");
const { open, load } = require("./browser.cjs");
const { axAll, fullTree } = require("./ax.cjs");
const { dom, DESCRIBE, shot } = require("./capture.cjs");

async function domChecks(ver, vp) {
  const { key: v, url } = ver;
  const s = await open(vp);
  const { page, cdp } = s;
  try {
    const response = await load(page, url, vp);
    const html = await response.text();
    if (vp === "desktop") {
      // the generated HTML as served (P1.3), once per implementation
      const name = `${ctx.RUN}_${v}_generated-html.html`;
      fs.writeFileSync(path.join(ctx.OUT, name), html);
      ctx.log.generatedHtml[v] = name;
    }
    const run = async (id, fn) => {
      if (!ctx.wanted(id) || (ctx.MOBILE_ONLY.has(id) && vp !== "mobile"))
        return;
      try {
        const r = await fn();
        ctx.record(id, v, vp, null, r.values, r.files || []);
      } catch (e) {
        ctx.record(id, v, vp, null, null, [], String((e && e.message) || e));
      }
    };
    const imgCheck = async (id, sel) => ({
      values: {
        dom: await dom(
          page,
          sel,
          `return { alt: el.getAttribute('alt'), src: el.getAttribute('src') }`,
        ),
        ax: await axAll(cdp, sel),
      },
      files: [await shot(page, sel, v, id, vp)].filter(Boolean),
    });
    await run("CF09", () =>
      imgCheck("CF09", 'img[src*="connected-foundations"]'),
    );
    await run("CF10", () => imgCheck("CF10", 'img[src*="hero-dashboard"]'));
    await run("CF11", async () => ({
      values: {
        img: await dom(
          page,
          "header a.brand img",
          `return { alt: el.getAttribute('alt') }`,
        ),
        link: await axAll(cdp, "header a.brand"),
      },
      files: [await shot(page, "header a.brand", v, "CF11", vp)].filter(
        Boolean,
      ),
    }));
    // Headings in document order: query the elements, then read each accessibility node.
    const headings = (
      await axAll(cdp, 'h1, h2, h3, h4, h5, h6, [role="heading"]')
    )
      .filter((n) => n && !n.ignored && n.role === "heading")
      .map((n) => ({ level: n.properties.level, name: n.name }));
    await run("CF14", async () => ({
      values: {
        element: await dom(page, "#benefits .section-title", DESCRIBE),
        ax: await axAll(cdp, "#benefits .section-title"),
        headings,
      },
      files: [
        await shot(page, "#benefits .section-title", v, "CF14", vp),
      ].filter(Boolean),
    }));
    await run("CF15", async () => ({
      values: {
        elements: await dom(page, "#services .card-title", DESCRIBE),
        ax: await axAll(cdp, "#services .card-title"),
      },
      files: [await shot(page, "#services .card-title", v, "CF15", vp)].filter(
        Boolean,
      ),
    }));
    await run("CF16", async () => ({
      values: {
        elements: await dom(page, "#benefits .benefit-icon", DESCRIBE),
        ax: await axAll(cdp, "#benefits .benefit-icon"),
      },
      files: [
        await shot(page, "#benefits .benefit-icon", v, "CF16", vp),
      ].filter(Boolean),
    }));
    await run("CF17", async () => ({
      values: {
        title: await dom(
          page,
          "#packages .table-title",
          `return { tag: el.tagName.toLowerCase(), insideTable: !!el.closest('table'), text: el.textContent.trim() }`,
        ),
        headerCells: await dom(
          page,
          "#packages table .table-head",
          `return { tag: el.tagName.toLowerCase(), scope: el.getAttribute('scope'), text: el.textContent.trim() }`,
        ),
        table: await axAll(cdp, "#packages table"),
        cells: await axAll(cdp, "#packages table td, #packages table th"),
      },
      files: [
        await shot(page, "#packages .table-scroll", v, "CF17", vp),
      ].filter(Boolean),
    }));
    await run("CF18", async () => ({
      values: {
        lists: await dom(
          page,
          "#services .feature-list",
          `return { tag: el.tagName.toLowerCase(), items: [...el.children].map(c => c.tagName.toLowerCase()) }`,
        ),
        ax: await axAll(cdp, "#services .feature-list"),
        itemAx: await axAll(cdp, "#services .feature-item"),
      },
      files: [
        await shot(page, "#services .feature-list", v, "CF18", vp),
      ].filter(Boolean),
    }));
    await run("CF19", async () => {
      const steps = await dom(page, "#process .process-step", DESCRIBE);
      const visual = [...steps]
        .sort((a, b) => a.y - b.y || a.x - b.x)
        .map((s) => s.text.slice(0, 2));
      return {
        values: {
          domOrder: steps.map((s) => s.text.slice(0, 2)),
          visualOrder: visual,
          steps,
        },
        files: [await shot(page, "#process", v, "CF19", vp)].filter(Boolean),
      };
    });
    await run("CF21", async () => ({
      values: {
        links: await dom(
          page,
          "footer .social-link",
          `return { href: el.getAttribute('href'), text: el.textContent.trim(), imgAlt: el.querySelector('img') && el.querySelector('img').getAttribute('alt'), ariaLabel: el.getAttribute('aria-label') }`,
        ),
        ax: await axAll(cdp, "footer .social-link"),
      },
      files: [await shot(page, "footer .social-links", v, "CF21", vp)].filter(
        Boolean,
      ),
    }));
    await run("CF22", async () => ({
      values: {
        links: await dom(
          page,
          "#services .card-link",
          `const ctx = el.parentElement.closest('p, li, td, th'); return { href: el.getAttribute('href'), visible: el.innerText.trim(), all: el.textContent.trim(), context: ctx ? ctx.tagName.toLowerCase() : null }`,
        ),
        ax: await axAll(cdp, "#services .card-link"),
      },
      files: [await shot(page, "#services .card-link", v, "CF22", vp)].filter(
        Boolean,
      ),
    }));
    await run("CF23", async () => {
      const tree = await fullTree(cdp);
      const root = tree.find((n) => n.role && n.role.value === "RootWebArea");
      return {
        values: {
          documentTitle: await page.title(),
          htmlTitle: (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [
            null,
            null,
          ])[1],
          rootName: root && root.name ? root.name.value : "",
        },
      };
    });
    await run("CF27", async () => ({
      values: {
        link: await dom(
          page,
          "footer .footer-bottom a",
          `return { href: el.getAttribute('href'), target: el.getAttribute('target'), rel: el.getAttribute('rel'), describedby: el.getAttribute('aria-describedby') }`,
        ),
        ax: await axAll(cdp, "footer .footer-bottom a"),
      },
      files: [await shot(page, "footer .footer-bottom", v, "CF27", vp)].filter(
        Boolean,
      ),
    }));
    await run("CF29", async () => ({
      values: {
        labels: await dom(
          page,
          "#request-audit .field",
          `const l = el.querySelector('.field-label'); const f = el.querySelector('input, textarea'); return { labelTag: l && l.tagName.toLowerCase(), labelFor: l && l.getAttribute('for'), field: f && f.id }`,
        ),
        ax: await axAll(cdp, "#audit-name, #audit-email, #audit-website"),
      },
      files: [await shot(page, "#request-audit form", v, "CF29", vp)].filter(
        Boolean,
      ),
    }));
    await run("CF31", async () => ({
      values: {
        toggle: await dom(
          page,
          ".menu-toggle",
          `return { text: el.textContent.trim(), html: el.innerHTML.slice(0, 200), ariaLabel: el.getAttribute('aria-label') }`,
        ),
        ax: await axAll(cdp, ".menu-toggle"),
      },
      files: [await shot(page, ".menu-toggle", v, "CF31", vp)].filter(Boolean),
    }));
    await run("CF32", async () => ({
      values: {
        button: await dom(
          page,
          '#request-audit button[type="submit"]',
          `return { ariaLabel: el.getAttribute('aria-label'), visible: el.innerText.trim() }`,
        ),
        ax: await axAll(cdp, '#request-audit button[type="submit"]'),
      },
      files: [
        await shot(page, '#request-audit button[type="submit"]', v, "CF32", vp),
      ].filter(Boolean),
    }));
    await run("CF33", async () => ({
      values: {
        fields: await dom(
          page,
          "#audit-name, #audit-email, #audit-website",
          `return { id: el.id, autocomplete: el.getAttribute('autocomplete') }`,
        ),
      },
    }));
    await run("CF34", async () => ({
      values: {
        group: await dom(
          page,
          ".radio-group",
          `const l = el.querySelector('.group-label'); return { tag: el.tagName.toLowerCase(), labelTag: l && l.tagName.toLowerCase(), labelText: l && l.textContent.trim() }`,
        ),
        ax: await axAll(cdp, ".radio-group"),
        radios: await axAll(cdp, 'input[name="concern"]'),
      },
      files: [await shot(page, ".radio-group", v, "CF34", vp)].filter(Boolean),
    }));
    await run("CF46", async () => ({
      values: {
        domLang: await page.evaluate(() =>
          document.documentElement.getAttribute("lang"),
        ),
        htmlStartTag: (html.match(/<html[^>]*>/i) || [null])[0],
      },
    }));
    await run("CF48", async () => ({
      values: {
        quotes: await dom(
          page,
          "#testimonials blockquote p",
          `return { text: el.textContent.trim().slice(0, 60), lang: el.getAttribute('lang'), isGerman: el.matches(':lang(de)') }`,
        ),
      },
      files: [await shot(page, "#testimonials", v, "CF48", vp)].filter(Boolean),
    }));
    // SEO indicators from the HTTP response and the generated HTML.
    const robotsUrl = new URL("/robots.txt", url).href;
    const robots = await s.context.request
      .get(robotsUrl)
      .then(async (r) => ({
        url: robotsUrl,
        status: r.status(),
        body: (await r.text()).slice(0, 2000),
      }))
      .catch((e) => ({ url: robotsUrl, error: String(e) }));
    const seo = await page.evaluate((src) => {
      const d = new DOMParser().parseFromString(src, "text/html");
      const meta = (n) => {
        const m = d.querySelector(`meta[name="${n}"]`);
        return m ? m.getAttribute("content") : null;
      };
      return {
        title: d.querySelector("title")
          ? d.querySelector("title").textContent
          : null,
        images: [...d.querySelectorAll("img")].map((i) => ({
          src: i.getAttribute("src"),
          alt: i.getAttribute("alt"),
        })),
        links: [...d.querySelectorAll("a")].map((a) => ({
          href: a.getAttribute("href"),
          text: a.textContent.trim().replace(/\s+/g, " "),
          imgAlt: [...a.querySelectorAll("img")].map((i) =>
            i.getAttribute("alt"),
          ),
        })),
        roleLinksWithoutHref: [
          ...d.querySelectorAll('[role="link"]:not([href])'),
        ].map((e) => ({
          tag: e.tagName.toLowerCase(),
          text: e.textContent.trim(),
        })),
        robotsMeta: meta("robots"),
        googlebotMeta: meta("googlebot"),
        description: meta("description"),
        viewport: meta("viewport"),
        canonical: d.querySelector('link[rel="canonical"]')
          ? d.querySelector('link[rel="canonical"]').getAttribute("href")
          : null,
        headings: [...d.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
          level: h.tagName,
          text: h.textContent.trim().replace(/\s+/g, " "),
        })),
      };
    }, html);
    const headers = response.headers();
    await run("SI01", async () => ({ values: { title: seo.title } }));
    await run("SI02", async () => ({ values: { images: seo.images } }));
    await run("SI03", async () => ({ values: { links: seo.links } }));
    await run("SI04", async () => ({
      values: {
        hrefs: seo.links.map((l) => l.href),
        roleLinksWithoutHref: seo.roleLinksWithoutHref,
      },
    }));
    await run("SI05", async () => ({
      values: {
        robotsMeta: seo.robotsMeta,
        googlebotMeta: seo.googlebotMeta,
        xRobotsTag: headers["x-robots-tag"] || null,
        robots,
      },
    }));
    await run("SI06", async () => ({ values: { status: response.status() } }));
    await run("SI07", async () => ({
      values: { description: seo.description },
    }));
    await run("SI08", async () => ({ values: { canonical: seo.canonical } }));
    await run("SI11", async () => ({ values: { headings: seo.headings } }));
    await run("SI12", async () => ({ values: { viewport: seo.viewport } }));
  } finally {
    await s.context.close();
  }
}

// One keyboard walk through the whole page: used by CF38, CF39 (reach) and CF41.

module.exports = { domChecks };
