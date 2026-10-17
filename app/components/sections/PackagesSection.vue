<template>
  <div class="section packages-section">
    <BaseSectionContainer>
      <BaseSectionIntro class="packages-intro">
        <template #eyebrow>Packages</template>
        <template #heading>Choose the audit that fits your needs</template>
        Each package combines accessibility and technical SEO checks, from a focused review of key
        pages to a full audit with implementation support.
      </BaseSectionIntro>
      <div
        class="table-scroll"
        tabindex="0"
      >
        <div class="table-scroll-inner">
          <p class="table-title"><span class="table-title-text">Packages at a glance</span></p>
          <table class="packages-table">
            <tbody>
              <tr>
                <td class="table-head" />
                <td class="table-head">Quick Scan</td>
                <td class="table-head">Full Audit</td>
                <td class="table-head">Audit &amp; Support</td>
              </tr>
              <tr>
                <td class="table-head">Scope</td>
                <td>Up to 5 key pages</td>
                <td>Up to 25 pages and key journeys</td>
                <td>Full site and design system</td>
              </tr>
              <tr>
                <td class="table-head">Deliverables</td>
                <td>Prioritised issue list</td>
                <td>Detailed report with fixes and examples</td>
                <td>Report, fix review and team workshop</td>
              </tr>
              <tr>
                <td class="table-head">Duration</td>
                <td>1 week</td>
                <td>3 weeks</td>
                <td>6 weeks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.packages-section {
  @apply bg-green;
}

.packages-intro {
  @apply mb-12
    [--section-intro-eyebrow-color:var(--color-white)]
    [--section-intro-heading-color:var(--color-white)]
    [--section-intro-lede-color:var(--color-cream)];
}

.table-title {
  @apply m-0
    pb-4
    text-center
    text-lg
    italic
    text-white;

  caption-side: top;
  padding-inline: 0;
  padding-top: 0;
}

.table-title-text {
  @apply sticky
    left-0
    block
    text-center;

  width: min(100%, 100cqw);
}

.table-scroll {
  @apply max-w-full
    overflow-x-auto
    rounded-md
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-mint;

  container-type: inline-size;
}

.table-scroll-inner {
  @apply w-full
    min-w-md
    max-w-5xl
    m-auto;
}

.packages-table {
  @apply w-full
    table-fixed
    border-collapse
    border-hidden
    text-sm
    text-ink-soft
    sm:text-base;
}

.packages-table tbody {
  clip-path: inset(0 round var(--radius-md));
}

.packages-table,
.table-title {
  word-break: normal;
  overflow-wrap: normal;
  hyphens: manual;
}

.packages-table tr > :first-child {
  @apply px-2 max-w-44;
}

.packages-table td,
.packages-table th {
  @apply border-0
    bg-surface
    p-2
    text-center
    align-middle
    font-normal
    sm:p-6;
}

.packages-table .table-head {
  @apply bg-mint-light
    p-2
    text-center
    font-semibold
    text-deep
    sm:p-6;
}

.packages-table tr:first-child > :first-child {
  @apply bg-green;
}

.packages-table tr:first-child > :nth-child(2),
.packages-table tr:nth-child(2) > :first-child {
  @apply rounded-tl-md;
}
</style>
