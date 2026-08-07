# Visual scaffold notes

## Scope

This branch establishes the shared visual system, content placement, responsive behaviour and deployment setup for LucidReach Digital. It is not either research version and must not be evaluated as the baseline dataset.

Purely visual decisions include the restrained green/cream palette, typography stack, spacing scale, container widths, cards, button treatments, illustration style, grid proportions and responsive breakpoints. LucidReach design tokens use `--lr-*` CSS custom properties and are exposed to Tailwind CSS 4 through its CSS-first `@theme inline` configuration. Component-owned rules live in plain `<style scoped>` blocks and use `@reference` with `@apply`; the global stylesheet is limited to tokens, resets and shared document primitives.

## Temporary markup decisions

The scaffold uses reasonable, valid implementation defaults so that navigation, disclosure controls and the local form demonstration work during design review. Current landmarks, headings, link wording, image alternatives, labels, field relationships, status messaging and disclosure markup are provisional. They do not represent the study's final baseline or accessibility-governed choices and do not imply WCAG conformance.

The literature-derived baseline specification must determine which semantic patterns and machine-readable relationships belong in each final research version. No deliberate accessibility defect has been added at this stage.

## Controlled variables

When the final versions are produced, the following must remain equivalent:

- content and section order;
- visual layout, colour palette, typography and spacing;
- assets;
- form fields and calls to action;
- responsive behaviour;
- framework and dependencies;
- build environment and hosting platform.

Any later change that could affect these variables should be reviewed and applied consistently to both research versions. Only literature-informed accessibility interventions should differ.
