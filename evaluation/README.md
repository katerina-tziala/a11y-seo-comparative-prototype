# Evaluation

This folder contains the scripts that run the evaluation of the two implementations of the prototype: the baseline and the accessibility-governed implementation. The scripts record values. They do not judge them.

One run does four parts, in this order:

1. **Visual parity**: the position, size and computed styles of every visible element in both implementations, in each page state and viewport. It runs first, because the comparison is valid only when the two implementations look the same.
2. **Lighthouse**: four reports, Accessibility and SEO categories (baseline mobile, governed mobile, baseline desktop, governed desktop).
3. **Checks**: 36 checks, read from the DOM and from Chrome’s Accessibility Tree, with key presses and pointer actions where a check needs them.
4. **Report**: two CSV files with the results of the run.

The checks are written for this prototype. Each one examines an accessibility requirement (`AR` IDs) or an SEO indicator (`SI` IDs), as described in [Requirements and Indicators](../REQUIREMENTS_AND_INDICATORS.md).

## Requirements

- **Google Chrome.** The scripts use the Chrome that is installed on the computer that runs them. Its version is not fixed by this folder, so it can differ from one computer to another. Each run records the Chrome version at the start and at the end in the run information file (`<run>_run-info.json`).
- **Node.js** 22 or later.
- **Internet access**, because the scripts measure the published pages.

The other tools are fixed in `package-lock.json`:

| Tool | Version | Role |
| --- | --- | --- |
| Playwright | 1.62.1 | Controls the installed Google Chrome (`channel: 'chrome'`): loads each page, sets the page states, sends the key presses and pointer actions, reads the values from the DOM and from Chrome’s Accessibility Tree, and takes the screenshots and videos |
| Lighthouse | 13.5.0 | Runs the audits of the Accessibility and SEO categories on each implementation, in mobile and desktop mode, and saves each report as HTML and JSON |

## Installation

From this folder:

```
npm ci
```

## Settings

`config.json` contains the addresses of the two implementations:

```
{
  "baselineUrl": "https://katerina-tziala.github.io/a11y-seo-comparative-prototype/baseline/",
  "governedUrl": "https://katerina-tziala.github.io/a11y-seo-comparative-prototype/accessibility-governed/"
}
```

## Prototype Evaluation

```
npm run evaluate -- <run>
```

The run name has lowercase letters, numbers and hyphens, for example `pilot-01` or `final-01`. Each run needs a new name: the script stops if the run folder already exists, so that no earlier result is replaced. A run takes about ten minutes. At the end, the script prints one line. The run is valid when all four parts are `ok` and `chromeUnchanged` is `true`.

Runs whose names start with `dryrun` test the scripts and are not evidence.

## Results

All files of a run are written to `evidence/<run>/`, at the root of the repository:

```
evidence/<run>/
  <run>_report_observations.csv   one row per check, viewport and input
  <run>_report_parity.csv         one row per state and viewport of the visual-parity comparison
  <run>_run-info.json             versions, addresses, commits, start and end times
  <run>_execution-record.xlsx     the manual record of an official run, added after the run
  lighthouse/                     the Lighthouse reports (HTML and JSON)
  parity/                         the visual-parity measurements, the report and the screenshots
  checks/                         the checks log, the screenshots, the videos and the generated HTML
```

File names follow one rule:

```
<run>_<implementation>_<item>_<viewport>[-<input>][_<NN>].<extension>
```

- `implementation`: `baseline` or `governed` (accessibility-governed).
- `item`: a check ID (`AR11`, `SI03`) or a tool (`lighthouse`, `parity`, `checks`, `report`, `tab-walk`).
- `viewport`: `desktop`, `mobile` or `zoom200`.
- `input`: `keyboard` or `pointer`, only for checks that run with both.
- `NN`: only where a file can repeat in the run, for example one screenshot per key.

Examples: `final-01_baseline_AR11_desktop.png`, `final-01_governed_AR35_mobile-keyboard.webm`, `final-01_baseline_lighthouse_mobile_01.json`.

The videos of the keyboard checks are WebM files, which open in Chrome.

The folders of the official runs are committed to this repository. A new run needs a name that is not used by them. At the end of each run, the table of runs in the [evidence documentation](../evidence/README.md) is written again (`npm run index` does the same).

## Comparing two runs

```
npm run compare -- <runA> <runB>
```

The comparison shows whether two runs gave the same results: the values of the checks log, both CSV reports, the visual-parity summary and the result of every Lighthouse audit. It ignores the run names, times, durations and file sizes. It prints `"identical":true` or the list of differences, and writes `evidence/compare_<runA>_<runB>.json`.

## Reproduction

To repeat the measurement, clone the repository and follow Installation and Prototype Evaluation with a new run name. The results are written to `evidence/<run>/` of that copy of the repository. Because the Chrome version is not fixed, compare it in the run information file with the version of the official runs before you compare the results.
