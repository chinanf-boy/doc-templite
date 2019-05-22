const assert = require('assert');
const fmds = require('../src/file.js');
const markdownExts = ['.md', '.markdown'];

import test from 'ava';

test('find all file with find-files-rust', t => {
	fmds.findMarkdownFiles().forEach(opts => {
		let ok = markdownExts.some(ext => opts.path.endsWith(ext));
		t.true(ok);
	});
});
// opts : {path:string}
