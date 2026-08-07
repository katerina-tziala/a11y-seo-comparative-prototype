# A11y–SEO Comparative Prototype

Prototype-based comparative study examining how accessibility requirements affect the semantic structure, machine readability and selected page-level Technical SEO characteristics of a digital marketing landing page.

## Research Context

The repository supports the dissertation:

**Accessibility as a Governance Requirement in Digital Marketing Information Systems: A Prototype-Based Comparative Evaluation of Accessibility–Technical SEO Synergies**

### Central Research Question

How and to what extent does the integration of accessibility requirements improve the semantic structure, machine readability and selected Technical SEO indicators of a digital marketing website?

## Prototype

The research artifact consists of one complete digital marketing landing page developed for the fictional company:

**LucidReach Digital**

**Tagline:**
_Clearer websites. Wider reach._

### Main Service

**Accessible, Search-Ready Websites**

### Supporting Services

- Accessible Web Design
- Technical SEO
- Content and Conversion Optimisation

### Primary Call to Action

**Request a Website Audit**

The form will use client-side validation and simulated submission feedback. No personal data will be stored or transmitted.

## Landing Page Sections

The current prototype structure includes:

1. Header and navigation
2. Hero section
3. Main service introduction
4. Core services
5. Accessibility and Technical SEO relationship
6. Benefits
7. Working process
8. Frequently asked questions
9. Website audit form
10. Footer

## Prototype Versions

### `main`

Contains **Version A — Baseline**.

The baseline represents a plausible visual-first implementation developed without a formal accessibility requirements process.

It must remain:

- visually complete,
- professionally presented,
- functional,
- realistic,
- consistent with common web-development practices.

### `accessibility-governed`

Contains **Version B — Accessibility-Governed**.

This branch is created from the final baseline version and applies accessibility requirements derived from standards and literature.

Potential intervention areas include:

- semantic HTML and landmarks,
- heading hierarchy,
- meaningful links and accessible names,
- image text alternatives,
- form labels and relationships,
- machine-readable states,
- content structure,
- navigation clarity.

## Controlled Variables

The following must remain equivalent between the two versions:

- written content,
- number and order of sections,
- visual design,
- typography,
- colour palette,
- images and assets,
- calls to action,
- form fields,
- functional purpose,
- framework and dependencies,
- rendering strategy,
- hosting environment.

Differences between the branches should correspond to documented accessibility interventions.

## Technology Stack

- Nuxt
- Vue
- TypeScript
- HTML
- CSS
- Static generation or prerendering
- Git and GitHub
- GitHub Pages

## Repository

Repository name:

```text
a11y-seo-comparative-prototype
```

Branch structure:

```text
main                       Version A: Baseline
accessibility-governed     Version B: Accessibility-Governed
```

Recommended baseline tag:

```text
baseline-v1.0
```

## Development Workflow

1. Develop and stabilise the baseline in `main`.
2. Freeze the page content, design and functionality.
3. Create the `baseline-v1.0` Git tag.
4. Create `accessibility-governed` from the tagged baseline commit.
5. Apply each accessibility intervention through a separate documented commit.
6. Build and deploy both versions.
7. Execute the same evaluation protocol on both versions.
8. Compare the results by intervention category.

Example branch creation:

```bash
git switch main
git tag baseline-v1.0
git push origin baseline-v1.0

git switch -c accessibility-governed
git push -u origin accessibility-governed
```

Example intervention commits:

```text
a11y: add semantic page landmarks
a11y: correct heading hierarchy
a11y: improve link purpose
a11y: add contextual image alternatives
a11y: associate labels with form controls
```

## Deployment

Both versions will be deployed through GitHub Pages under separate paths within the same Pages site.

Expected structure:

```text
/a11y-seo-comparative-prototype/baseline/
/a11y-seo-comparative-prototype/accessibility-governed/
```

Both deployments must use:

- the same build environment,
- the same Nuxt configuration,
- the same dependency versions,
- the same hosting platform.

## Evaluation Scope

The evaluation focuses on:

- page-level accessibility,
- semantic HTML structure,
- DOM structure,
- machine-readable names, roles and relationships,
- heading hierarchy,
- image alternatives,
- link semantics,
- form structure,
- selected page-level Technical SEO indicators.

The study does not evaluate:

- search-engine rankings,
- organic traffic,
- multi-page crawl architecture,
- XML sitemaps,
- redirects,
- backlinks,
- conversion performance with real users.

## Evaluation Methods

The final testing protocol will be determined through the literature review.

The expected evaluation methods include:

- automated accessibility evaluation,
- manual HTML and rendered DOM inspection,
- accessibility-tree inspection,
- page-level Technical SEO evaluation,
- comparative code and structure analysis.

Keyboard or assistive-technology checks may be included only where required by the selected accessibility interventions.

## Candidate Tools

The following tools are currently candidates and are not yet final:

- axe or axe-core
- Lighthouse
- WAVE
- W3C HTML Validator
- browser developer tools
- accessibility-tree inspection tools
- a page-level Technical SEO auditing tool

The final tools will be selected according to:

- academic literature,
- official technical documentation,
- coverage of the selected evaluation criteria,
- reproducibility,
- suitability for comparative testing.

## Comparative Analysis Model

Each intervention will be analysed using the following structure:

```text
Accessibility requirement
→ implementation change
→ accessibility outcome
→ semantic or machine-readability outcome
→ potential Technical SEO outcome
→ governance implication
```

A comparison matrix will document:

| Field                     | Description                        |
| ------------------------- | ---------------------------------- |
| Component                 | Affected landing-page component    |
| Baseline characteristic   | Implementation in `main`           |
| Governed intervention     | Change in `accessibility-governed` |
| Accessibility requirement | Relevant requirement or criterion  |
| Evaluation method         | Tool or manual inspection          |
| Accessibility result      | Observed outcome                   |
| Technical SEO result      | Observed page-level SEO outcome    |

## Research Artefacts

The repository will eventually contain:

```text
README.md
docs/
├── prototype-specification.md
├── baseline-selection-matrix.md
├── accessibility-requirements.md
├── controlled-variables.md
├── evaluation-protocol.md
└── results/
```

The complete source code and deployed prototypes will be referenced in the dissertation as research artefacts.
