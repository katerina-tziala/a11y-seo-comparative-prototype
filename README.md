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

- `setup/visual-scaffold`: current project setup and shared visual scaffold
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

The Pages workflow runs on pushes to `setup/visual-scaffold` or by manual dispatch. It installs with `npm ci`, generates the site with the GitHub Pages Nitro preset and deploys `.output/public` using the official artifact workflow. The base path comes from GitHub Pages configuration, allowing the site to run at `/a11y-seo-comparative-prototype/` without hardcoding an account name.

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
