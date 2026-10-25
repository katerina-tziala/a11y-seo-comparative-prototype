'use strict'
// keyboard-checks.cjs: the checks with key presses or pointer actions (Interaction state):
// tab walk (AR38, AR41), AR38 supplementary keys, AR39, AR40, AR36, AR35 and AR27.
// Each check records the focused element after each key, a screenshot after each key and a video (P3.5, P6.2).
const ctx = require('./context.cjs')
const { open, load, close } = require('./browser.cjs')
const { axAll, axActive } = require('./ax.cjs')
const { dom, shot, viewportShot, describeActive } = require('./capture.cjs')

async function tabWalk(ver, vp) {
  const { key: v, url } = ver
  const s = await open(vp, { video: true })
  const files = []; const steps = []
  try {
    await load(s.page, url, vp)
    await s.page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); scrollTo(0, 0) })
    let bodyCount = 0
    for (let i = 1; i <= 120; i++) {
      await s.page.keyboard.press('Tab'); await s.page.waitForTimeout(150)
      const el = await describeActive(s.page)
      const ax = await axActive(s.cdp)
      steps.push({ i, ...el, axRole: ax && ax.role, axName: ax && ax.name })
      files.push(await viewportShot(s.page, v, 'tab-walk', vp))
      if (el.tag === 'body' && ++bodyCount >= 1 && i > 2) break
    }
  } finally { const video = await close(s, v, 'tab-walk', vp); if (video) files.push(video) }
  const faqTriggers = await (async () => { const t = await open(vp); await load(t.page, url, vp); const n = await t.page.$$eval('.accordion-trigger', e => e.map(x => x.textContent.trim())); await t.context.close(); return n })()
  ctx.record('AR38', v, vp, 'keyboard', { faqQuestions: faqTriggers, faqStopsInWalk: steps.filter(x => x.inFaq), tabWalk: 'see TABWALK files' }, files)
  ctx.record('AR41', v, vp, 'keyboard', { footerStopsInWalk: steps.filter(x => x.inFooter) }, files)
  ctx.log.results.push({ id: 'TABWALK', version: v, viewport: vp, input: 'keyboard', values: { steps }, files })
  return steps
}

async function cf38Supplementary(ver, vp) {
  const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []; const out = []
  try {
    await load(s.page, url, vp)
    const n = await s.page.locator('.accordion-trigger').count()
    for (let i = 0; i < n; i++) {
      const t = s.page.locator('.accordion-trigger').nth(i)
      const focusable = await t.evaluate(el => el.tabIndex >= 0)
      if (!focusable) { out.push({ i, focusable: false }); continue }
      await t.focus()
      const before = (await axActive(s.cdp))
      await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(400)
      const afterEnter = await axActive(s.cdp)
      await s.page.keyboard.press('Space'); await s.page.waitForTimeout(400)
      const afterSpace = await axActive(s.cdp)
      files.push(await viewportShot(s.page, v, 'AR38', vp))
      out.push({ i, focusable: true, before, afterEnter, afterSpace })
    }
  } finally { const video = await close(s, v, 'AR38', vp); if (video) files.push(video) }
  ctx.record('AR38', v, vp, 'keyboard (supplementary Enter and Space)', { triggers: out }, files)
}

async function tabUntil(s, predicateSource, max = 120) {
  await s.page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); scrollTo(0, 0) })
  for (let i = 1; i <= max; i++) {
    await s.page.keyboard.press('Tab'); await s.page.waitForTimeout(100)
    if (await s.page.evaluate(src => (new Function('el', src))(document.activeElement), predicateSource)) return i
  }
  return null
}

async function cf39(ver, vp) {
  const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []
  let values = {}
  try {
    await load(s.page, url, vp)
    const presses = await tabUntil(s, `return !!el && /Explore Our Services/.test(el.textContent || '')`)
    const focused = await describeActive(s.page); const ax = await axActive(s.cdp)
    files.push(await viewportShot(s.page, v, 'AR39', vp))
    const before = await s.page.evaluate(() => ({ hash: location.hash, scrollY }))
    if (presses) { await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(800) }
    const after = await s.page.evaluate(() => { const t = document.querySelector('#services'); return { hash: location.hash, scrollY, servicesTop: t ? Math.round(t.getBoundingClientRect().top) : null } })
    files.push(await viewportShot(s.page, v, 'AR39', vp))
    values = { tabPresses: presses, focused, ax, before, after }
  } finally { const video = await close(s, v, 'AR39', vp); if (video) files.push(video) }
  ctx.record('AR39', v, vp, 'keyboard', values, files)
}

async function cf40(ver) {
  const vp = 'mobile'; const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []; const seq = []
  try {
    await load(s.page, url, vp)
    await tabUntil(s, `return !!el && el.classList.contains('menu-toggle')`)
    const keys = ['Enter', ...Array(14).fill('Tab'), ...Array(14).fill('Shift+Tab'), 'Escape']
    for (const k of keys) {
      await s.page.keyboard.press(k); await s.page.waitForTimeout(250)
      const el = await describeActive(s.page); const ax = await axActive(s.cdp)
      const open = await s.page.evaluate(() => { const n = document.querySelector('#site-nav'); return !!n && getComputedStyle(n).display !== 'none' })
      seq.push({ key: k, focused: el, axName: ax && ax.name, menuOpen: open })
      files.push(await viewportShot(s.page, v, 'AR40', vp))
    }
  } finally { const video = await close(s, v, 'AR40', vp); if (video) files.push(video) }
  ctx.record('AR40', v, vp, 'keyboard', { sequence: seq }, files)
}

async function cf36(ver, input) {
  const vp = 'mobile'; const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []; const states = []
  try {
    await load(s.page, url, vp)
    const read = async label => {
      const d = await s.page.$eval('.menu-toggle', el => ({ expanded: el.getAttribute('aria-expanded'), controls: el.getAttribute('aria-controls') }))
      const ax = (await axAll(s.cdp, '.menu-toggle'))[0]
      const open = await s.page.evaluate(() => { const n = document.querySelector('#site-nav'); return !!n && getComputedStyle(n).display !== 'none' })
      states.push({ label, ...d, axExpanded: ax && ax.properties.expanded, menuOpen: open })
      files.push(await viewportShot(s.page, v, 'AR36', vp, input))
    }
    await read('closed')
    if (input === 'keyboard') {
      await tabUntil(s, `return !!el && el.classList.contains('menu-toggle')`)
      await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(300); await read('after first Enter')
      await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(300); await read('after second Enter')
    } else {
      await s.page.click('.menu-toggle'); await s.page.waitForTimeout(300); await read('after first click')
      await s.page.click('.menu-toggle'); await s.page.waitForTimeout(300); await read('after second click')
    }
  } finally { const video = await close(s, v, 'AR36', vp, input); if (video) files.push(video) }
  ctx.record('AR36', v, vp, input, { states }, files)
}

async function cf35(ver, vp, input) {
  const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []
  let values = {}
  try {
    await load(s.page, url, vp)
    if (input === 'keyboard') {
      await tabUntil(s, `return !!el && el.matches('#request-audit button[type="submit"]')`)
      await s.page.keyboard.press('Enter')
    } else {
      await s.page.click('#request-audit button[type="submit"]')
    }
    await s.page.waitForTimeout(600)
    values = {
      focusedAfterSubmit: await describeActive(s.page),
      messages: await dom(s.page, '#request-audit .field-message', `return { id: el.id, text: el.textContent.trim(), cls: el.getAttribute('class') }`),
      fields: await dom(s.page, '#audit-name, #audit-email, #audit-website, input[name="concern"]', `return { id: el.id, ariaInvalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') }`),
      group: await dom(s.page, '.radio-group', `return { tag: el.tagName.toLowerCase(), ariaInvalid: el.getAttribute('aria-invalid'), describedby: el.getAttribute('aria-describedby') }`),
      ax: await axAll(s.cdp, '#audit-name, #audit-email, #audit-website, input[name="concern"]'),
      groupAx: await axAll(s.cdp, '.radio-group'),
    }
    files.push(await shot(s.page, '#request-audit form', v, 'AR35', vp, input))
  } finally { const video = await close(s, v, 'AR35', vp, input); if (video) files.push(video) }
  ctx.record('AR35', v, vp, input, values, files.filter(Boolean))
}

async function cf27(ver, vp, input) {
  const { key: v, url } = ver
  const s = await open(vp, { video: true }); const files = []
  let values = {}
  try {
    await load(s.page, url, vp)
    const popup = s.context.waitForEvent('page', { timeout: 8000 }).catch(() => null)
    if (input === 'keyboard') {
      await tabUntil(s, `return !!el && el.matches('footer .footer-bottom a')`)
      files.push(await viewportShot(s.page, v, 'AR27', vp, input))
      await s.page.keyboard.press('Enter')
    } else {
      await s.page.click('footer .footer-bottom a')
    }
    const p = await popup
    if (p) await p.waitForURL(u => /^https?:/.test(String(u)), { timeout: 20000 }).catch(() => {})
    values = { newTabOpened: !!p, newTabUrl: p ? p.url() : null, sameTabUrl: s.page.url() }
    if (p) await p.close()
  } finally { const video = await close(s, v, 'AR27', vp, input); if (video) files.push(video) }
  ctx.record('AR27', v, vp, input, values, files.filter(Boolean))
}

// ---------- summary ----------

module.exports = { tabWalk, cf38Supplementary, tabUntil, cf39, cf40, cf36, cf35, cf27 }
