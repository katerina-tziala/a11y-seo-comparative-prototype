"use strict";
// ax.cjs: reading Chrome's Accessibility Tree through the DevTools Protocol (P3.7). The values come from Chrome.
function props(node) {
  const p = {};
  for (const x of node.properties || []) p[x.name] = x.value && x.value.value;
  return p;
}
function axSummary(node) {
  if (!node) return null;
  return {
    role: node.role && node.role.value,
    name: node.name ? node.name.value : "",
    description: node.description ? node.description.value : "",
    ignored: !!node.ignored,
    properties: props(node),
  };
}
// Accessibility nodes of all elements that match a CSS selector, in document order.
async function axAll(cdp, selector) {
  const { root } = await cdp.send("DOM.getDocument", { depth: 0 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", {
    nodeId: root.nodeId,
    selector,
  });
  const out = [];
  for (const nodeId of nodeIds) {
    const { nodes } = await cdp.send("Accessibility.getPartialAXTree", {
      nodeId,
      fetchRelatives: false,
    });
    out.push(axSummary(nodes && nodes[0]));
  }
  return out;
}
async function axActive(cdp) {
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: "document.activeElement",
  });
  if (!result.objectId) return null;
  const { nodes } = await cdp.send("Accessibility.getPartialAXTree", {
    objectId: result.objectId,
    fetchRelatives: false,
  });
  return axSummary(nodes && nodes[0]);
}
async function fullTree(cdp) {
  const { nodes } = await cdp.send("Accessibility.getFullAXTree");
  return nodes;
}

module.exports = { props, axSummary, axAll, axActive, fullTree };
