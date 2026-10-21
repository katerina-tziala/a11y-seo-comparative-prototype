// compare-runs.cjs: checks whether two runs of the evaluation gave the same results.
// Used to show that a change to the scripts (for example a refactor) does not change the measurement.
// Usage, from the evaluation folder: node tools/compare-runs.cjs <runA> <runB>
// It compares, with the run names removed: the values of the checks log, the two CSV reports,
// the summary of the visual-parity comparison, and the result of every Lighthouse audit.
// Environment values (times, durations, file sizes, versions) are not compared.
'use strict'
const fs = require('fs')
const path = require('path')

const [A, B] = process.argv.slice(2)
if (!A || !B) { console.error('Usage: node tools/compare-runs.cjs <runA> <runB>'); process.exit(1) }
const EVIDENCE = path.resolve(__dirname, '..', '..', 'evidence')
const dirOf = run => path.join(EVIDENCE, run)
const differences = []
const note = (part, where, a, b) => differences.push({ part, where, [A]: a, [B]: b })

// Replace the run name with <run>, so that file names and paths compare equal.
const norm = (run, value) => JSON.parse(JSON.stringify(value).split(run).join('<run>'))
const readJson = p => { try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return null } }

// 1. Checks log: the values of every check, implementation, viewport and input.
function checksLog(run) {
  const log = readJson(path.join(dirOf(run), 'checks', `${run}_checks_log.json`))
  if (!log) return null
  const map = new Map()
  for (const r of log.results) {
    const key = `${r.id}|${r.version}|${r.viewport}|${r.input || ''}`
    const list = map.get(key) || []
    list.push(norm(run, { values: r.values, error: r.error }))
    map.set(key, list)
  }
  return map
}
const la = checksLog(A), lb = checksLog(B)
if (!la || !lb) note('checks log', 'file', !!la, !!lb)
else for (const key of new Set([...la.keys(), ...lb.keys()])) {
  const a = JSON.stringify(la.get(key) || null), b = JSON.stringify(lb.get(key) || null)
  if (a !== b) note('checks log', key, (a || '').slice(0, 300), (b || '').slice(0, 300))
}

// 2. CSV reports: every row, without the Run column.
function csvRows(file, run) {
  if (!fs.existsSync(file)) return null
  const text = fs.readFileSync(file, 'utf8').replace(/^\ufeff/, '')
  const rows = []; let row = [], cell = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++ } else if (c === '"') quoted = false; else cell += c }
    else if (c === '"') quoted = true
    else if (c === ',') { row.push(cell); cell = '' }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = '' }
    else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows.map(r => r.slice(1).map(v => v.split(run).join('<run>')))
}
for (const [part, name] of [['observations report', 'report_observations.csv'], ['parity report', 'report_parity.csv']]) {
  const ra = csvRows(path.join(dirOf(A), `${A}_${name}`), A), rb = csvRows(path.join(dirOf(B), `${B}_${name}`), B)
  if (!ra || !rb) { note(part, 'file', !!ra, !!rb); continue }
  if (ra.length !== rb.length) note(part, 'number of rows', ra.length, rb.length)
  for (let i = 0; i < Math.max(ra.length, rb.length); i++) {
    const a = JSON.stringify(ra[i] || null), b = JSON.stringify(rb[i] || null)
    if (a !== b) note(part, `row ${i + 1}`, (a || '').slice(0, 300), (b || '').slice(0, 300))
  }
}

// 3. Visual parity: the summary counts.
const IGNORE = new Set(['durationMs', 'totalBytes', 'jsonFile', 'htmlFile'])
const pa = readJson(path.join(dirOf(A), 'parity', `${A}_parity_measurements.json`))
const pb = readJson(path.join(dirOf(B), 'parity', `${B}_parity_measurements.json`))
if (!pa || !pb) note('parity summary', 'file', !!pa, !!pb)
else for (const k of new Set([...Object.keys(pa.summary || {}), ...Object.keys(pb.summary || {})])) {
  if (IGNORE.has(k)) continue
  const a = JSON.stringify((pa.summary || {})[k]), b = JSON.stringify((pb.summary || {})[k])
  if (a !== b) note('parity summary', k, a, b)
}

// 4. Lighthouse: the score and the display mode of every audit, in the last valid report of each implementation and mode.
function lighthouse(run) {
  const dir = path.join(dirOf(run), 'lighthouse')
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : []
  const out = {}
  for (const v of ['baseline', 'governed']) for (const mode of ['mobile', 'desktop']) {
    const re = new RegExp(`^${run}_${v}_lighthouse_${mode}_(\\d\\d)\\.json$`)
    const pick = files.filter(f => re.test(f)).sort().reverse().map(f => readJson(path.join(dir, f))).find(r => r && !r.runtimeError)
    out[`${v} ${mode}`] = pick ? Object.fromEntries(Object.entries(pick.audits).map(([id, a]) => [id, `${a.score}|${a.scoreDisplayMode}`])) : null
  }
  return out
}
const ha = lighthouse(A), hb = lighthouse(B)
for (const key of Object.keys(ha)) {
  if (!ha[key] && !hb[key]) continue
  if (!ha[key] || !hb[key]) { note('lighthouse', key, !!ha[key], !!hb[key]); continue }
  for (const id of new Set([...Object.keys(ha[key]), ...Object.keys(hb[key])])) {
    if (ha[key][id] !== hb[key][id]) note('lighthouse', `${key} ${id}`, ha[key][id], hb[key][id])
  }
}

const out = path.join(EVIDENCE, `compare_${A}_${B}.json`)
fs.writeFileSync(out, JSON.stringify({ runs: [A, B], identical: differences.length === 0, differences }, null, 1))
console.log(JSON.stringify({ runs: [A, B], identical: differences.length === 0, differences: differences.length, file: out }))
for (const d of differences.slice(0, 20)) console.log(JSON.stringify(d))
process.exitCode = differences.length ? 1 : 0
