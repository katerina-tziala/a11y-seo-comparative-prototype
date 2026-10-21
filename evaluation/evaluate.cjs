// evaluate.cjs: one run of the evaluation: visual parity, Lighthouse, checks, report.
// Usage, from this folder:  npm run evaluate -- <run>      for example: npm run evaluate -- final01
// The run name is lowercase letters, numbers and hyphens. All files go to ../evidence/<run>/ (P6.4, P6.5).
// Structure: steps/lighthouse.cjs, steps/parity.cjs, steps/checks/ (the Evaluation Check Plan), steps/report/ (the CSV reports).
// The run information file (<run>_run-info.json) records the versions, the URLs, the commits and the time of each part (P1.2, P2.2).
'use strict'
const { spawnSync, execSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { chromium } = require('playwright')

const RUN = process.argv[2]
if (!RUN || !/^[a-z0-9-]+$/.test(RUN)) { console.error('Usage: npm run evaluate -- <run>   (lowercase, for example pilot01 or final01)'); process.exit(1) }
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
const RUNDIR = path.resolve(__dirname, '..', 'evidence', RUN)
if (fs.existsSync(RUNDIR)) { console.error(`${RUNDIR} exists. A new run needs a new name, so that no earlier file is replaced.`); process.exit(1) }
const DIRS = { lighthouse: path.join(RUNDIR, 'lighthouse'), parity: path.join(RUNDIR, 'parity'), checks: path.join(RUNDIR, 'checks') }
for (const d of Object.values(DIRS)) fs.mkdirSync(d, { recursive: true })

const sh = cmd => { try { return execSync(cmd, { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return null } }
// The newest tag of an implementation (for example baseline-v2 before baseline-v1) and its commit, at the time of the run.
function latestTag(prefix) {
  const name = (sh(`git tag --list '${prefix}*' --sort=-v:refname`) || '').split('\n')[0] || null
  return name ? { name, commit: sh(`git rev-list -n 1 ${name}`) } : null
}
async function chromeVersion() {
  const b = await chromium.launch({ channel: 'chrome', headless: true })
  const v = b.version(); await b.close(); return v
}
function part(name, script, args, extraEnv) {
  const started = new Date().toISOString()
  console.log(`\n=== ${name} ===`)
  const p = spawnSync(process.execPath, [path.join(__dirname, script), ...args], {
    stdio: 'inherit', cwd: __dirname,
    env: { ...process.env, RUN, BASELINE_URL: config.baselineUrl, GOVERNED_URL: config.governedUrl, URL_A: config.baselineUrl, URL_B: config.governedUrl, ...extraEnv },
  })
  return { part: name, script, started, finished: new Date().toISOString(), exitCode: p.status }
}

;(async () => {
  const info = {
    run: RUN, dryRun: /^dryrun/.test(RUN), protocol: 'evaluation protocol (Master Thesis 3 Evaluation)',
    startedAt: new Date().toISOString(),
    computer: { platform: os.platform(), release: os.release(), macOS: sh('sw_vers -productVersion') },
    versions: { node: process.version, playwright: require('playwright/package.json').version, lighthouse: require('lighthouse/package.json').version, chromeAtStart: await chromeVersion() },
    urls: { baseline: config.baselineUrl, governed: config.governedUrl },
    repository: { commit: sh('git rev-parse HEAD'), latestTags: { baseline: latestTag('baseline-v'), governed: latestTag('governed-v') } },
    parts: [],
  }
  // Visual parity first: it is the gate before any verdict, so a failure is known at the start of the run.
  info.parts.push(part('Visual parity', 'steps/parity.cjs', ['--mode=normal'], { OUT: DIRS.parity }))
  info.parts.push(part('Lighthouse', 'steps/lighthouse.cjs', [], { OUT: DIRS.lighthouse }))
  info.parts.push(part('Checks', 'steps/checks/index.cjs', [], { OUT: DIRS.checks }))
  info.parts.push(part('Report', 'steps/report/index.cjs', ['--run', RUN, '--dir', RUNDIR], {}))
  info.versions.chromeAtEnd = await chromeVersion()
  info.chromeUnchanged = info.versions.chromeAtStart === info.versions.chromeAtEnd // if false, repeat the run (P2.2)
  info.finishedAt = new Date().toISOString()
  fs.writeFileSync(path.join(RUNDIR, `${RUN}_run-info.json`), JSON.stringify(info, null, 1))
  // The table of runs in evidence/README.md (not part of the measurement).
  spawnSync(process.execPath, [path.join(__dirname, 'tools', 'index-runs.cjs')], { stdio: 'inherit', cwd: __dirname })
  const failed = info.parts.filter(p => p.exitCode !== 0)
  console.log('\n' + JSON.stringify({ run: RUN, folder: RUNDIR, chromeUnchanged: info.chromeUnchanged, parts: info.parts.map(p => `${p.part}: ${p.exitCode === 0 ? 'ok' : 'exit ' + p.exitCode}`) }))
  if (failed.length || !info.chromeUnchanged) process.exitCode = 1
})().catch(e => { console.error(e); process.exit(1) })
