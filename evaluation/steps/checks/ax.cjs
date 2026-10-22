'use strict'
// ax.cjs: reading Chrome's Accessibility Tree through the DevTools Protocol (P3.7). The values come from Chrome.
function props(node) {
  const p = {}
  for (const x of node.properties || []) p[x.name] = x.value && x.value.value
  return p
}
// The source that Chrome used for a computed value (name or description): the first source with a value that is not superseded.
// Examples: attribute:aria-label, relatedElement:aria-labelledby, relatedElement:labelfor, contents, relatedElement:aria-describedby.
function sourceOf(axValue) {
  const sources = (axValue && axValue.sources) || []
  const used = sources.find(x => !x.superseded && x.value && x.value.value !== undefined && x.value.value !== '')
  if (!used) return null
  const detail = used.nativeSource || used.attribute
  return detail ? `${used.type}:${detail}` : used.type
}
const nameSource = node => sourceOf(node && node.name)
const descriptionSource = node => sourceOf(node && node.description)
function axSummary(node) {
  if (!node) return null
  return {
    role: node.role && node.role.value,
    name: node.name ? node.name.value : '',
    nameSource: nameSource(node),
    description: node.description ? node.description.value : '',
    descriptionSource: descriptionSource(node),
    ignored: !!node.ignored,
    properties: props(node),
  }
}
// Accessibility nodes of all elements that match a CSS selector, in document order.
async function axAll(cdp, selector) {
  const { root } = await cdp.send('DOM.getDocument', { depth: 0 })
  const { nodeIds } = await cdp.send('DOM.querySelectorAll', { nodeId: root.nodeId, selector })
  const out = []
  for (const nodeId of nodeIds) {
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false })
    out.push(axSummary(nodes && nodes[0]))
  }
  return out
}
async function axActive(cdp) {
  const { result } = await cdp.send('Runtime.evaluate', { expression: 'document.activeElement' })
  if (!result.objectId) return null
  const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { objectId: result.objectId, fetchRelatives: false })
  return axSummary(nodes && nodes[0])
}
async function fullTree(cdp) {
  const { nodes } = await cdp.send('Accessibility.getFullAXTree')
  return nodes
}

module.exports = { props, sourceOf, nameSource, descriptionSource, axSummary, axAll, axActive, fullTree }
