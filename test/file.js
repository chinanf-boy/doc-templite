const assert = require('assert');
const fmds = require('../src/file.js');
const markdownExts = ['.md', '.markdown'];

// opts : {path:string}
fmds.findMarkdownFiles().forEach(opts => {
	let ok = markdownExts.some(ext => opts.path.endsWith(ext));
	assert.ok(ok);
});
