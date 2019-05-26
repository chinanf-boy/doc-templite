#!/usr/bin/env node
'use strict';
const fs = require('fs');
const meow = require('meow');
const twoLog = require('two-log-min');
const {g, c, y, b, m, r} = require('./src/util');

const file = require('./src/file');
const docTemplite = require('./doc-templite');

let files;

const cli = meow(`
  Usage
  	$ doc-templite [folder/file name] [Optioins]

	Example
		$ doc-templite readme.md

	${b(`⭐ [Options]`)}
		${g(`-D debug`)} <default:false>

	${m(`⭐ [High Options]`)}
		${g(`--OR`)} only Read, no reWrite files <default:false>
`);

// Log
const log = twoLog(cli.flags.D);

// Need path name
if (!cli.input[0]) {
	console.error(y('--> v' + cli.pkg.version), cli.help);
	process.exit(1);
}
// .doc-templite.js
let templite = {};
try {
	const path = require('path');
	const templitePath = path.join(process.cwd(), '.doc-templite.js');
	templite = require(templitePath);
} catch (error) {
	console.error(y(`.doc-templite.js IS NOT EXITE\n${error}`));
	process.exit(1);
}
// Onlyread
const onlyRead = Boolean(cli.flags.or);

function cleanPath(path) {
	const homeExpanded =
		path.indexOf('~') === 0 ? process.env.HOME + path.substr(1) : path;
	//  所有 空格 去除
	return homeExpanded.replace(/\s/g, '\\ ');
}
let howMany = 0;
const cliLog = log.start(`starting doc-templite`, {log: 'cli'});

function transformAndSave(files, opts) {
	const transformeds = files.map(x => {
		const content = fs.readFileSync(x.path, 'utf8');
		opts.path = x.path;
		const result = docTemplite(content, opts);

		// Result.path = x.path
		return result;
	});

	const changeds = transformeds.filter(x => {
		return x.transformed;
	});
	const unchangeds = transformeds.filter(x => {
		return !x.transformed && !x.why;
	});
	const sameCnt = transformeds.filter(x => {
		return x.why;
	});

	unchangeds.forEach(x => {
		// Log.text(`${c(x.path)} no transform`);
	});

	changeds.forEach(x => {
		let msg = '';
		if (onlyRead) {
			msg = `===> ${c(x.path)} need to update`;
		} else {
			msg = `${c(x.path)} ${g('updated')}`;
			fs.writeFileSync(x.path, x.data, 'utf8');
		}

		log.one(msg, {log: 'cli'});

		howMany++;
	});

	sameCnt.forEach(x => {
		cliLog(`${c(x.path)} same content`, {only: 'log'});
		howMany++;
	});
}

for (let i = 0; i < cli.input.length; i++) {
	try {
		const target = cleanPath(cli.input[i]);
		const stat = fs.statSync(target);

		cliLog(`1. files getting...`, {only: 'log'});
		if (stat.isDirectory()) {
			files = file.findMarkdownFiles('./'); // current dir
		} else {
			files = [{path: target}];
		}
		const opts = cli.flags;
		opts.templite = templite;

		cliLog('2. ready to transform');
		transformAndSave(files, opts);
	} catch (e) {
		console.error(r('\n' + e.stack));
		process.exitCode = 1;
	}
	// CliLog(`search markdown file ... ${JSON.stringify(files,null,2)}`)
}
const timeAndFile = `time:${c(process.uptime())}s,had ${c(howMany)} file`;
log.stop(
	`doc-templite done [${onlyRead ? 'onlyRead' : 'Write'} mode]\n${timeAndFile}`,
	{log: 'cli'}
);
