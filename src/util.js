const tc = require('turbocolor');

const g = tc.green;
const c = tc.cyan;
const y = tc.yellow;
const b = tc.blue;
const m = tc.magenta;
const r = tc.red;
// Color log

// good look show
const toS = str => JSON.stringify(str, null, 2);

module.exports = {
	toS, g, c, y, b, m, r
};
