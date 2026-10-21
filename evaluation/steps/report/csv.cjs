'use strict'
// csv.cjs: CSV with a byte-order mark, so that Excel opens it as UTF-8.
const csvCell = x => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`
const csv = rows => '\ufeff' + rows.map(r => r.map(csvCell).join(',')).join('\r\n') + '\r\n'

module.exports = { csvCell, csv }
