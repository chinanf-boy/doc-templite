import fs from 'fs';
import path from 'path';
import test from 'ava';

import templite from '../.doc-templite';
import doc from '../doc-templite';

const testDir = __dirname;
const Regex = /yobrave \| 18/;

test.todo('doc-templite(content,opts) Error');

test.serial.failing('args::content Error', t => {
	doc([], {});
});

test.serial('toml parse Error', t => {
	const p = path.resolve(testDir, './errors/toml-error.md');
	const f = fs.readFileSync(p, 'utf8');
	const opts = {
		path: p,
		templite
	};
	const e = 'TOML Parse error';
	const msg = t.throws(() => doc(f, opts));
	t.true(msg.message.includes(e));
});

test.serial('.doc-templite.js id no match, can not transform Error', t => {
	const p = path.resolve(testDir, './errors/idTemplite-error.md');
	const f = fs.readFileSync(p, 'utf8');
	const opts = {
		path: p,
		templite
	};
	const e = 'no match doc-templite';
	const msg = t.throws(() => doc(f, opts));
	t.true(msg.message.includes(e));
});

test.serial('tags with no Closed Error: more START', t => {
	const p = path.resolve(testDir, './errors/more-START-tags-Error.md');
	const f = fs.readFileSync(p, 'utf8');
	const opts = {
		path: p,
		templite
	};

	const e = 'doc-templite tag';
	const details = 'not Closed';
	const msg = t.throws(() => doc(f, opts));
	t.true(msg.message.includes(e));
	t.true(msg.message.includes(details));
});
test.serial('tags with no Closed Error: more END', t => {
	const p = path.resolve(testDir, './errors/more-END-tags-Error.md');
	const f = fs.readFileSync(p, 'utf8');
	const opts = {
		path: p,
		templite
	};

	const e = 'doc-templite tag';
	const details = 'not Closed';
	const msg = t.throws(() => doc(f, opts));
	t.true(msg.message.includes(e));
	t.true(msg.message.includes(details));
});

test.serial('more tags with no Closed Remark Error', t => {
	const p = path.resolve(testDir, './errors/no-Closed-Remark-Error.md');
	const f = fs.readFileSync(p, 'utf8');
	const opts = {
		path: p,
		templite
	};
	const e = 'Toml:';
	const details = 'not Closed';
	const msg = t.throws(() => doc(f, opts));
	t.true(msg.message.includes(e));
	t.true(msg.message.includes(details));
});
