# A11y–SEO Comparative Prototype

Prototype-based comparative study examining how accessibility requirements
affect shared accessibility and Technical SEO characteristics in a digital
marketing website.

## Prototype

The eventual research artifact will compare two controlled versions of the same fictional digital agency landing page for **LucidReach Digital**. The current work establishes their shared visual and technical foundation only.

> **Current status: visual scaffold only.**
> **This branch must not be used as the final baseline dataset.**

The scaffold includes a complete responsive landing page, reusable Nuxt components, original local SVG artwork, a local-only audit form demonstration and static GitHub Pages deployment configuration.

## Versions

- `prototype-scaffold`: current project setup and shared visual scaffold
- `main`: future frozen baseline prototype
- `accessibility-governed`: future governed prototype derived from the baseline

Neither final research version is created by this scaffold work. Semantic implementation choices remain provisional until the literature-derived baseline specification is complete.

## Technology

- Nuxt 4 and Vue 3
- TypeScript, Tailwind CSS 4 and CSS custom properties
- Node.js 24 LTS and npm
- Static prerendering
- GitHub Actions and GitHub Pages

## Local development

Use Node.js 24 (the version is recorded in `.nvmrc`), then install the exact dependency tree from `package-lock.json`:

```bash
nvm use
npm ci
npm run dev
```

Useful checks and production commands:

```bash
npm run check
npm run generate
npm run preview
```

`npm run check` runs the type check, ESLint, Stylelint, Prettier and the Tailwind
`@apply` formatting check. Run `npm run format` to format Vue, TypeScript, CSS and
Tailwind classes before checking.

`npm run generate` produces the static site in `.output/public`.

## Deployment

The repository uses one GitHub Pages site with one path for each research branch:

- `prototype-scaffold` → `/scaffold/`
- `main` → `/baseline/`
- `accessibility-governed` → `/accessibility-governed/`

Whenever one of these branches changes, the workflow rebuilds every existing, initialised research branch independently. CI never merges or synchronises their source code. It combines only their generated static outputs into one Pages artifact and performs one deployment. Branches that do not exist yet, or have not yet been initialised as a Nuxt project, are skipped.

The workflow file must exist in every branch whose push should trigger deployment. It will be inherited when the frozen scaffold is transferred to `main` and when `accessibility-governed` is later created from the baseline.

In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. A successful local generation does not confirm that remote Pages deployment has succeeded.

See [scaffold notes](docs/scaffold-notes.md) for provisional decisions and controlled variables, and [asset register](docs/assets.md) for asset provenance.

## Research principle

Both versions must retain the same:

- content
- visual design
- page structure and functionality
- assets
- framework and dependencies
- rendering and hosting environment

The controlled difference is the systematic application of accessibility
requirements in the `accessibility-governed` branch.
