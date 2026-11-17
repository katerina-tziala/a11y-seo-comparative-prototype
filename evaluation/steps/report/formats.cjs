'use strict'
// formats.cjs: one short line of the observed values of each check, for the observations report.
// The full values stay in the checks log.
// Each name with the source that Chrome used, for example "Learn more about Technical SEO" [contents].
const names = (a) =>
  (a || [])
    .map((x) => (x ? JSON.stringify(x.name) + (x.nameSource ? ` [${x.nameSource}]` : '') : 'null'))
    .join(', ')
// Each description with the source that Chrome used, for example "Opens in a new tab" [relatedElement:aria-describedby].
const desc = (x) =>
  x
    ? JSON.stringify(x.description) + (x.descriptionSource ? ` [${x.descriptionSource}]` : '')
    : 'null'
const roles = (a) => [...new Set((a || []).map((x) => x && x.role))].join('/')
const short = (s, n = 70) => String(s == null ? 'null' : s).slice(0, n)
const F = {
  AR09: (v) => `alt=${JSON.stringify(v.dom[0] && v.dom[0].alt)}; name=${names(v.ax)}`,
  AR10: (v) => `alt=${JSON.stringify(v.dom[0] && v.dom[0].alt)}; name=${names(v.ax)}`,
  AR11: (v) => `img alt=${JSON.stringify(v.img[0] && v.img[0].alt)}; link name=${names(v.link)}`,
  AR14: (v) =>
    `element=${v.element.map((e) => e.tag)}; role=${roles(v.ax)}; heading levels=${v.headings.map((h) => h.level).join('')}`,
  AR15: (v) => {
    const describe = (group, label) => {
      const tags = group.targets.map((t) => (t.element ? t.element.tag : 'missing')).join(',')
      const levels = group.targets.map((t) => t.issue || t.level).join(',')
      return `${label}=${tags}, ${label === 'section' ? 'level' : 'levels'}=${levels}`
    }
    return `Services: ${describe(v.services.section, 'section')}; ${describe(v.services.cards, 'cards')}; Process: ${describe(v.process.section, 'section')}; ${describe(v.process.steps, 'steps')}`
  },
  AR16: (v) =>
    `elements=${v.elements.map((e) => e.tag)}; roles=${roles(v.ax)}; names=${names(v.ax)}`,
  AR17: (v) =>
    `title=${v.title.map((t) => t.tag + (t.insideTable ? ' in table' : ''))}; header cells=${[...new Set(v.headerCells.map((h) => h.tag + (h.scope ? '[scope=' + h.scope + ']' : '')))]}; table name=${names(v.table)}; cell roles=${roles(v.cells)}`,
  AR18: (v) =>
    `lists=${v.lists.map((l) => l.tag + '>' + [...new Set(l.items)])}; list roles=${roles(v.ax)}; item roles=${roles(v.itemAx)}`,
  AR19: (v) => `DOM order=${v.domOrder.join(',')}; visual order=${v.visualOrder.join(',')}`,
  AR21: (v) => `names=${names(v.ax)}; img alt=${v.links.map((l) => JSON.stringify(l.imgAlt))}`,
  AR22: (v) =>
    `innerText=${v.links.map((l) => l.innerText)}; full text=${v.links.map((l) => l.all)}; context=${v.links.map((l) => l.context || 'none')}; names=${names(v.ax)}`,
  AR23: (v) =>
    `document title=${JSON.stringify(v.documentTitle)}; <title>=${JSON.stringify(v.htmlTitle)}; document name=${JSON.stringify(v.rootName)}`,
  AR27: (v) =>
    v.link
      ? `target=${v.link[0].target}; rel=${v.link[0].rel}; aria-describedby=${v.link[0].describedby}; description=${desc(v.ax[0])}`
      : `new tab=${v.newTabOpened}; new tab URL=${v.newTabUrl}`,
  AR29: (v) =>
    `labels=${v.labels.map((l) => l.labelTag + (l.labelFor ? '[for]' : ''))}; field names=${names(v.ax)}`,
  AR31: (v) => `name=${names(v.ax)}; aria-label=${v.toggle[0] && v.toggle[0].ariaLabel}`,
  AR32: (v) =>
    `aria-label=${v.button[0].ariaLabel}; innerText=${JSON.stringify(v.button[0].innerText)}; name=${names(v.ax)}`,
  AR33: (v) => `autocomplete=${v.fields.map((f) => f.autocomplete || 'none')}`,
  AR34: (v) =>
    `container=${v.group.map((g) => g.tag + '/' + g.labelTag)}; group role=${roles(v.ax)}; group name=${names(v.ax)}`,
  AR36: (v) =>
    v.states
      .map(
        (s) =>
          `${s.label}: aria-expanded=${s.expanded}, aria-controls=${s.controls}, AT expanded=${s.axExpanded}, menu open=${s.menuOpen}`,
      )
      .join('; '),
  AR38: (v) =>
    v.triggers
      ? `questions focusable=${v.triggers.map((t) => t.focusable)}`
      : `FAQ questions=${v.faqQuestions.length}; Tab stops in FAQ=${v.faqStopsInWalk.map((s) => s.tag + ' ' + short(s.text, 25)).join(' | ')}`,
  AR39: (v) =>
    `Tab presses to reach=${v.tabPresses}; element=${v.focused && v.focused.tag}; role=${v.ax && v.ax.role}; after Enter: hash=${JSON.stringify(v.after.hash)}, services top=${v.after.servicesTop}`,
  AR40: (v) => {
    const legacy = `after Enter: focus=${short(v.sequence[0].focused.text || v.sequence[0].focused.cls, 30)}; Tab: ${v.sequence
      .slice(1, 15)
      .map((s) => short(s.focused.text, 14))
      .join(' > ')}; Shift+Tab: ${v.sequence
      .slice(15, 29)
      .map((s) => short(s.focused.text, 14))
      .join(
        ' > ',
      )}; after Escape: menu open=${v.sequence[29].menuOpen}, focus=${short(v.sequence[29].focused.text, 20)}`
    const focus = (el) =>
      el.tag +
      (el.id
        ? `#${el.id}`
        : el.href
          ? `[href=${JSON.stringify(el.href)}]`
          : el.cls
            ? `.${el.cls.trim().split(/\s+/g).join('.')}`
            : '') +
      (el.text ? ` ${JSON.stringify(short(el.text, 40))}` : '')
    const state = (s, includeHash = false) =>
      s
        ? `${includeHash ? `hash=${JSON.stringify(s.hash)}, ` : ''}open=${s.menuOpen}, focus=${focus(s.focused)}, inside=${s.insideMenu}`
        : 'unavailable'
    const describeCase = (c) =>
      c.status === 'observed'
        ? `before(${state(c.before, c.key === 'Enter')}) -> after(${state(c.after, c.key === 'Enter')})`
        : `status=${c.status}${c.error ? `, error=${JSON.stringify(short(c.error, 120))}` : ''}${c.lastState ? `, last observed(${state(c.lastState)})` : ''}`
    return [
      legacy,
      ...(v.escapeCases || []).map(
        (c) => `Escape[${c.target}${c.text ? `: ${c.text}` : ''}]: ${describeCase(c)}`,
      ),
      ...(v.enterProcess
        ? [
            `supplementary Enter[Process] (not used for verdict): ${describeCase(v.enterProcess)}; next Tab=${v.enterProcess.nextTabs.map((s) => state(s, true)).join(' > ') || '(none observed)'}`,
          ]
        : []),
    ].join('; ')
  },
  AR41: (v) =>
    [
      `footer Tab order=${v.footerStopsInWalk.map((s) => short(s.text || s.axName || '(no name)', 20)).join(' > ')}`,
      `columns Tab order=${v.columns.tabOrder.join(' > ') || '(none observed)'}`,
      `columns visual order=${v.columns.visualOrder.join(' > ') || '(none visible)'}`,
      `Explore Tab order=${v.explore.tabOrder.join(' > ') || '(none observed)'}`,
      `Explore visual order=${v.explore.visualOrder.join(' > ') || '(none visible)'}`,
      ...(v.missingTargets.length ? [`missing targets=${v.missingTargets.join(', ')}`] : []),
      ...(v.unreachedTargets.length ? [`unreached targets=${v.unreachedTargets.join(', ')}`] : []),
      ...(v.hiddenTargets.length ? [`hidden targets=${v.hiddenTargets.join(', ')}`] : []),
    ].join('; '),
  AR46: (v) => `lang=${v.domLang}; <html> tag=${v.htmlStartTag}`,
  AR48: (v) =>
    v.quotes.map((q) => `${short(q.text, 20)}: lang=${q.lang}, German=${q.isGerman}`).join('; '),
  SI01: (v) => `title=${JSON.stringify(v.title)}`,
  SI02: (v) => `alt values=${v.images.map((i) => JSON.stringify(i.alt)).join(', ')}`,
  SI03: (v) =>
    `links=${v.links.length}; links without text=${v.links.filter((l) => !l.text && !l.imgAlt.some(Boolean)).length}; texts=${v.links.map((l) => l.text || l.imgAlt.filter(Boolean)[0] || '(none)').join(' | ')}`,
  SI04: (v) =>
    `<a href>=${v.hrefs.filter(Boolean).length}; role=link without href=${v.roleLinksWithoutHref.map((r) => r.tag + ' ' + short(r.text, 25)).join(' | ') || 'none'}`,
  SI05: (v) =>
    `robots meta=${v.robotsMeta}; X-Robots-Tag=${v.xRobotsTag}; robots.txt status=${v.robots && v.robots.status}`,
  SI06: (v) => `status=${v.status}`,
  SI07: (v) => `description=${v.description}`,
  SI08: (v) => `canonical=${v.canonical}`,
  SI11: (v) => `heading levels=${v.headings.map((h) => h.level.slice(1)).join('')}`,
  SI12: (v) => `viewport=${v.viewport}`,
}
module.exports = { F, short }
