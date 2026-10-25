'use strict'
// catalog.cjs: the name of each check, and the Lighthouse audits that correspond to it (Evaluation Check Plan).
const ITEMS = {
  AR09: 'Diagram image without a text alternative', AR10: 'Hero image alt is the file name', AR11: 'Logo link without a name',
  AR14: 'Business value title not a heading', AR15: 'Card titles skip a heading level', AR16: 'Empty headings around icons',
  AR17: 'Table header cells not exposed', AR18: 'Feature lists not marked up as lists', AR19: 'Process steps: DOM order differs from visual order',
  AR21: 'Social links without names', AR22: '"Learn more" links without a described purpose', AR23: 'Missing page title',
  AR27: 'Link opens a new tab without warning', AR29: 'Visible labels not associated with their fields', AR31: 'Menu toggle without a name',
  AR32: 'Submit name does not contain the visible label', AR33: 'Input purpose not identified', AR34: 'Radio buttons not grouped',
  AR35: 'Error messages not associated with their fields', AR36: 'Menu toggle state not exposed', AR38: 'FAQ questions not focusable',
  AR39: '"Explore Our Services" not operable with the keyboard', AR40: 'Keyboard trap in the open menu', AR41: 'Footer focus order does not follow the visual order',
  AR46: 'Page language not declared', AR48: 'German quotation without lang',
  SI01: 'Page title', SI02: 'Image alternative text', SI03: 'Link text', SI04: 'Crawlable links', SI05: 'Indexability directives',
  SI06: 'HTTP status', SI07: 'Meta description', SI08: 'Canonical URL', SI11: 'Heading elements', SI12: 'Viewport meta element',
}
const AUDITS = {
  AR09: ['image-alt'], AR10: ['image-alt'], AR11: ['image-alt', 'link-name'], AR14: [], AR15: ['heading-order'], AR16: ['empty-heading'],
  AR17: ['td-has-header', 'th-has-data-cells'], AR18: ['list', 'listitem'], AR19: ['visual-order-follows-dom'], AR21: ['link-name'],
  AR22: ['identical-links-same-purpose'], AR23: ['document-title'], AR27: [], AR29: ['label'], AR31: ['button-name'],
  AR32: ['label-content-name-mismatch'], AR33: ['autocomplete-valid'], AR34: [], AR35: [], AR36: [], AR38: ['focusable-controls'],
  AR39: [], AR40: ['focus-traps'], AR41: ['logical-tab-order'], AR46: ['html-has-lang'], AR48: ['valid-lang'],
  SI01: ['document-title'], SI02: ['image-alt'], SI03: ['link-text'], SI04: ['crawlable-anchors'], SI05: ['is-crawlable', 'robots-txt'],
  SI06: ['http-status-code'], SI07: ['meta-description'], SI08: ['canonical'], SI11: [], SI12: [],
}
module.exports = { ITEMS, AUDITS }
