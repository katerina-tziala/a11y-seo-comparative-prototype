'use strict'
// browser.cjs: one clean browser context per check (P2.3, P4.3), page loading, and the video of a keyboard check (P6.2).
const path = require('path')
const ctx = require('./context.cjs')

async function open(vp, { video = false } = {}) {
  const opts = { ...ctx.VIEWPORTS[vp], reducedMotion: 'reduce', locale: 'en-US' }
  if (video) opts.recordVideo = { dir: ctx.OUT, size: opts.viewport }
  const context = await ctx.browser.newContext(opts)
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send('DOM.enable'); await cdp.send('Accessibility.enable')
  return { context, page, cdp }
}
async function load(page, url, vp) {
  const response = await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  if (vp === 'mobile') await page.waitForSelector('.menu-toggle', { timeout: 10000 }).catch(() => {})
  await page.waitForTimeout(300)
  return response
}
async function close({ context, page }, v, id, vp, input = null) {
  const video = page.video()
  await context.close()
  if (!video) return null
  const name = ctx.fileName(v, id, vp, 'webm', { input })
  await video.saveAs(path.join(ctx.OUT, name)).catch(() => {})
  await video.delete().catch(() => {})
  return name
}

module.exports = { open, load, close }
