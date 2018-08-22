#!/usr/bin/env node
'use strict';
console.time('doc-templite')
const meow = require('meow');
const fs = require('fs')
const twoLog = require('two-log-min')
const {g,c,y,b,m,r} = require('./src/util')

const file = require('./src/file')
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

// log
const log = twoLog(cli.flags['D'])

// need path name
if(!cli.input[0]){
	return console.log(y("--> v"+cli.pkg.version),cli.help)
}
// .doc-templite.js
let templite = {};
try {
	const path = require('path')
	let templitePath = path.join(process.cwd(),'.doc-templite.js')
	templite = require(templitePath)
} catch (error) {
	return console.error(y(`.doc-templite.js IS NOT EXITE\n${error}`))
}
// onlyread
const onlyRead = !!cli.flags['or']

function cleanPath(path) {
	var homeExpanded = (path.indexOf('~') === 0) ? process.env.HOME + path.substr(1) : path;
	//  所有 空格 去除
	return homeExpanded.replace(/\s/g, '\\ ');
}
function transformAndSave(files, opts){
	log.text('2. ready to transform')

	let transformeds = files.map(function(x){
		let content = fs.readFileSync(x.path, 'utf8');
		opts.path = x.path
		let result = docTemplite(content, opts)

		// result.path = x.path
		return result
	})

	let changeds = transformeds.filter(function (x) { return x.transformed; })
    let unchangeds = transformeds.filter(function (x) { return !x.transformed; })

	unchangeds.forEach(function (x) {
		log.text(`${c(x.path)} no transform / same content`);
	  });

	changeds.forEach(function (x) {
		if (onlyRead) {
		  log.one(`===> ${c(x.path)} need to update`)
		} else {
		  log.one(`${c(x.path)} updated`);
		  fs.writeFileSync(x.path, x.data, 'utf8');
		}
	});
}

log.start(`starting doc-templite`)
for (let i = 0; i < cli.input.length; i++){
	let target = cleanPath(cli.input[i]);
	let stat = fs.statSync(target);

	log.text(`1. files getting...`)
	if (stat.isDirectory()){
		files = file.findMarkdownFiles(target)
	}else{
		files = [{ path: target}]
	}
	let opts = cli.flags
	opts.templite = templite

	try{
		transformAndSave(files, opts)
	}catch(e){
		console.log(r('\n'+e.stack))
		process.exitCode = 1
	}
	// log.text(`search markdown file ... ${JSON.stringify(files,null,2)}`)
}

log.stop(`doc-templite done [${onlyRead?"onlyRead":"Write"} mode]`,{ora:'succeed'})
console.timeEnd('doc-templite')
