# Accessibility and SEO Comparative Prototype

This repository contains a one-page website of LucidReach Digital, a fictional digital marketing company that offers accessible web design, Technical SEO and conversion optimization. The website was created for academic research and exists in two implementations. The baseline leaves a set of common accessibility requirements unmet, while the accessibility-governed implementation is the same page built to meet them. Apart from these changes, the two implementations share the same content, design and technology. This allows a direct comparison of accessibility and Technical SEO on the same page.

## Implementations

| Implementation | Branch | Address |
| --- | --- | --- |
| Baseline | `main` | https://katerina-tziala.github.io/a11y-seo-comparative-prototype/baseline/ |
| Accessibility-governed | `accessibility-governed` | https://katerina-tziala.github.io/a11y-seo-comparative-prototype/accessibility-governed/ |

The accessibility requirements that distinguish the two implementations, and the SEO indicators that the evaluation examines, are described in [Requirements and Indicators](REQUIREMENTS_AND_INDICATORS.md).

## Technology

The site is generated as static HTML, so both implementations are built in exactly the same way.

| Tool | Version |
| --- | --- |
| Nuxt | 4.5.1 |
| Vue | 3.5.40 |
| Tailwind CSS | 4.3.3 |
| TypeScript | 5.9.3 |
| Node.js | 24 |

The code follows consistent quality and formatting standards, which are checked automatically with ESLint, Stylelint and Prettier. All package versions are locked, so every installation uses exactly the same ones.

### Assets

The LinkedIn, Instagram and YouTube icons are the official icons from the brand resources of each company. All other images are original to this prototype.

## Development

The project requires Node.js 24.

To install the project dependencies, run:

```
npm install
```

To start the development server, run:

```
npm run dev
```

By default, the site is served at `http://localhost:3000/`.

To generate the static site, as it is published, run:

```
npm run generate
```

To preview the generated site locally, run:

```
npm run preview
```

To check the code, run:

```
npm run check
```

## Deployment

Both implementations are hosted on GitHub Pages, at the addresses listed above. A GitHub Actions workflow builds and publishes them whenever one of the two branches changes, and it can also be started manually. Each publication builds both implementations with the same steps and tool versions, so the site always shows the latest version of each. A change that affects only the evaluation, the evidence or the documentation does not publish the site again.

## Evaluation

The two implementations are compared with a set of evaluation scripts. These scripts examine the structure of each page, its Accessibility Tree and the information that search engines read. The [evaluation documentation](evaluation/README.md) explains how to install and run the scripts, and how the results are organized. The results of every run, together with an overview of all runs, are kept in the [evidence documentation](evidence/README.md).

## Contributing

Each commit message starts with one of these types:

| Type | Name | Use |
| --- | --- | --- |
| `a11y(ARxx)` | Accessibility | Adds one accessibility requirement to the accessibility-governed implementation |
| `feat` | Feature | New content or a new feature, the same in both implementations |
| `fix` | Fix | A correction |
| `chore` | Chore | Workflow, settings and dependencies |
| `eval` | Evaluation | Evaluation scripts, and the evidence of a run as `eval(<run>)` |
| `docs` | Documentation | Documentation |

A hook in `.githooks/` checks the message of each commit. To turn it on, run this command once in the repository:

```
git config core.hooksPath .githooks
```

The same check also runs on GitHub for every push and pull request.
