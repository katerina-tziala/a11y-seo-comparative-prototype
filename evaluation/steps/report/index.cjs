// index.cjs (report): the test report of a run as two CSV files (evaluation protocol, P6.6). It records values; verdicts stay manual.
// Normally started by evaluate.cjs. Alone: node steps/report/index.cjs --run final01   (reads and writes evidence/final01/)
'use strict'
const fs = require('fs')
const path = require('path')

const args = {}
for (let i = 2; i < process.argv.length; i += 2) args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1]
const RUN = args.run
if (!RUN || !/^[a-z0-9-]+$/.test(RUN)) { console.error('Missing or invalid --run (lowercase, for example final01)'); process.exit(1) }
const DIR = path.resolve(args.dir || path.join(__dirname, '..', '..', '..', 'evidence', RUN))
const CHECKS = path.join(DIR, 'checks', `${RUN}_checks_log.json`)
const LH_DIR = path.join(DIR, 'lighthouse')
const PARITY = path.join(DIR, 'parity', `${RUN}_parity_measurements.json`)
const OUT = DIR
const readJson = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return null } }
const log = readJson(CHECKS)
if (!log) { console.error(`Cannot read the checks log: ${CHECKS}`); process.exit(1) }
// Lighthouse: the last valid report of each implementation and mode (a repeated run under P3.3 has a higher NN).
const LH = {}
const lhFiles = fs.existsSync(LH_DIR) ? fs.readdirSync(LH_DIR) : []
for (const v of ['baseline', 'governed']) for (const mode of ['mobile', 'desktop']) {
  const re = new RegExp(`^${RUN}_${v}_lighthouse_${mode}_(\\d\\d)\\.json$`)
  const candidates = lhFiles.filter(f => re.test(f)).sort().reverse()
  let pick = null
  for (const f of candidates) { const r = readJson(path.join(LH_DIR, f)); if (r && !r.runtimeError) { pick = { file: f, report: r }; break } }
  if (!pick && candidates.length) pick = { file: candidates[0], report: readJson(path.join(LH_DIR, candidates[0])) }
  LH[`${v}_${mode}`] = pick || { file: null, report: null }
}
const parity = readJson(PARITY)

// ---------- names, audits and value formats ----------
const { ITEMS, AUDITS } = require('./catalog.cjs')
const { F } = require('./formats.cjs')
const { csv } = require('./csv.cjs')

function auditResult(version, viewport, ids) {
  const r = LH[`${version}_${viewport}`]
  if (!r || !r.report) return 'no Lighthouse report'
  if (!ids.length) return 'no audit'
  const src = `lighthouse/${r.file}`
  if (!ids.length) return 'no audit'
  return ids.map(id => {
    const a = r.report.audits && r.report.audits[id]
    if (!a) return `${id}: not in report`
    const mode = a.scoreDisplayMode
    if (mode === 'notApplicable') return `${id}: not applicable`
    if (mode === 'manual') return `${id}: manual`
    if (mode === 'informative') return `${id}: informative`
    return `${id}: ${a.score === 1 ? 'pass' : a.score === 0 ? 'fail' : 'score ' + a.score}`
  }).join('; ') + ` (${src})`
}
// ---------- observations ----------
const results = log.results.filter(r => r.id !== 'TABWALK' && r.id in ITEMS)
const key = r => `${r.id}|${r.viewport}|${r.input || ''}`
const groups = new Map()
for (const r of results) {
  const k = key(r)
  if (!groups.has(k)) groups.set(k, { id: r.id, viewport: r.viewport, input: r.input || '', baseline: [], governed: [] })
  groups.get(k)[r.version].push(r)
}
const fmt = r => { if (!r) return 'not run'; if (r.error) return `ERROR: ${r.error}`; try { return F[r.id](r.values) } catch (e) { return `format error: ${e.message}` } }
const order = Object.keys(ITEMS)
const rows = [['Run', 'ID', 'Item', 'Viewport', 'Input', 'Observed in baseline', 'Observed in accessibility-governed', 'Same in both', 'Lighthouse audit', 'Baseline audit result', 'Accessibility-governed audit result', 'Evidence (baseline)', 'Evidence (accessibility-governed)']]
const sorted = [...groups.values()].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id) || a.viewport.localeCompare(b.viewport) || a.input.localeCompare(b.input))
for (const g of sorted) {
  const n = Math.max(g.baseline.length, g.governed.length)
  for (let i = 0; i < n; i++) {
    const b = g.baseline[i], gv = g.governed[i]
    const strip = r => (r ? JSON.stringify(r.values) : null)
    const audits = AUDITS[g.id] || []
    rows.push([RUN, g.id, ITEMS[g.id], g.viewport, g.input, fmt(b), fmt(gv), strip(b) === strip(gv) ? 'yes' : 'no',
      audits.join('; ') || 'none', auditResult('baseline', g.viewport, audits), auditResult('governed', g.viewport, audits),
      [...(b ? b.files : [])].map(f => 'checks/' + f).join(' '), [...(gv ? gv.files : [])].map(f => 'checks/' + f).join(' ')])
  }
}
const obsFile = path.join(OUT, `${RUN}_report_observations.csv`)
fs.writeFileSync(obsFile, csv(rows))

// ---------- visual parity ----------
let parFile = null
if (parity && Array.isArray(parity.results)) {
  const pr = [['Run', 'Viewport', 'State', 'Status', 'Geometry', 'Styles', 'Differing elements', 'Screenshot (baseline)', 'Screenshot (accessibility-governed)']]
  // in the parity JSON, A is the baseline and B the accessibility-governed implementation
  for (const r of parity.results) {
    const c = r.comparison || {}
    const shot = side => { const f = r[side] && (r[side].screenshot || r[side].file); return f ? 'parity/' + f : '' }
    pr.push([RUN, r.viewport, r.state, c.status || r.status || '', c.geometryStatus || '', c.styleStatus || '',
      Array.isArray(c.differences) ? c.differences.length : '', shot('A'), shot('B')])
  }
  parFile = path.join(OUT, `${RUN}_report_parity.csv`)
  fs.writeFileSync(parFile, csv(pr))
}

const lhFound = Object.values(LH).filter(x => x.report).length
console.log(JSON.stringify({ observations: rows.length - 1, observationsFile: obsFile, lighthouseReports: lhFound, parityFile: parFile || 'parity JSON not found' }))
