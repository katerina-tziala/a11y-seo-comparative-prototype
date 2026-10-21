// index-runs.cjs: writes the table of runs in evidence/README.md, from the run information file of each run folder.
// Started by evaluate.cjs at the end of each run. Alone, from the evaluation folder: npm run index
// Runs whose names start with dryrun are not listed, unless --all is given (for a test of this script).
// The rows are in the order of the runs (start time).
'use strict'
const fs = require('fs')
const path = require('path')

const ALL = process.argv.includes('--all')
const EVIDENCE = path.resolve(__dirname, '..', '..', 'evidence')
const README = path.join(EVIDENCE, 'README.md')
const START = '<!-- runs:start -->', END = '<!-- runs:end -->'
const HEADER = '| Run | Type | Date | Baseline | Accessibility-governed | Chrome | Valid |\n| --- | --- | --- | --- | --- | --- | --- |'

const type = run => /^pilot-/.test(run) ? 'Pilot' : /^final-/.test(run) ? 'Final' : /^dryrun/.test(run) ? 'Dry run' : 'Other'
const date = iso => { const d = new Date(iso); return isNaN(d) ? '' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` }
const ref = t => t && t.name ? `${t.name} (${String(t.commit || '').slice(0, 7)})` : 'no tag'

const rows = []
for (const run of fs.existsSync(EVIDENCE) ? fs.readdirSync(EVIDENCE).sort() : []) {
  const file = path.join(EVIDENCE, run, `${run}_run-info.json`)
  if (!fs.existsSync(file)) continue
  if (!ALL && /^dryrun/.test(run)) continue
  let info
  try { info = JSON.parse(fs.readFileSync(file, 'utf8')) } catch { continue }
  const tags = (info.repository && info.repository.latestTags) || {}
  const valid = Array.isArray(info.parts) && info.parts.length === 4 && info.parts.every(p => p.exitCode === 0) && info.chromeUnchanged === true
  const chrome = info.versions ? (info.versions.chromeAtStart === info.versions.chromeAtEnd ? info.versions.chromeAtStart : `${info.versions.chromeAtStart} → ${info.versions.chromeAtEnd}`) : ''
  rows.push({ at: info.startedAt || '', line: `| ${run} | ${type(run)} | ${date(info.startedAt)} | ${ref(tags.baseline)} | ${ref(tags.governed)} | ${chrome} | ${valid ? 'Yes' : 'No'} |` })
}

rows.sort((a, b) => a.at.localeCompare(b.at)) // in the order of the runs
const table = [START, HEADER, ...rows.map(r => r.line), END].join('\n')
let text = fs.existsSync(README) ? fs.readFileSync(README, 'utf8') : `# Evidence\n\n${START}\n${END}\n`
if (!text.includes(START) || !text.includes(END)) text = `${text.trimEnd()}\n\n${START}\n${END}\n`
text = text.slice(0, text.indexOf(START)) + table + text.slice(text.indexOf(END) + END.length)
fs.writeFileSync(README, text)
console.log(JSON.stringify({ index: README, runs: rows.length }))
