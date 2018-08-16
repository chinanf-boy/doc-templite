'use strict';

const updateSection = require('update-section')
const toml = require('toml');
const os = require('os')
const dlv = require('dlv');
const templiteParse = require('templite')
const { oneOra,loggerText } = require('two-log')
const tc = require('turbocolor')
const c = tc.cyan;
const g = tc.green;


const START = '<!-- doc-templite START generated -->'
const END   = '<!-- doc-templite END generated -->'

function matchesStart(line) {
	return (/<!-- doc-templite START/).test(line);
  }
  
function matchesEnd(line) {
	return (/<!-- doc-templite END/).test(line);
}

function remarkStart(line) {
	return (/<!--/).test(line);
  }
  
function remarkEnd(line) {
	return (/-->/).test(line);
}

function isRemark(line){
	return line.startsWith('<!--') && line.endsWith('-->')
}

function removeTag(line){
	if(isRemark(line)){
		line = line.slice(4,-3)
	}
	return line
}

module.exports = function docTemplite(content, opts){
	if (typeof content !== 'string') {
		throw new TypeError(`Expected a string, got ${c(typeof content)}`);
	}
	let mergeOpts = {};
	let transformed = false;
	let data = content;

	// must had doc-templite tag
	let lines = content.split(os.EOL)
	loggerText(g('all:'+lines.length))
	let info = updateSection.parse(lines, matchesStart, matchesEnd);
	loggerText(info)
	let currentBlocks = info.hasStart && lines.slice(info.startIdx + 1, info.endIdx)
	loggerText(g('block:'+currentBlocks))

	if(currentBlocks.join(os.EOL).trim()){
		let onlyRemark = currentBlocks.filter(function(line){
			line = line.trim()
			return isRemark(line)
		})
		let removeSingle = currentBlocks.filter(function(line){
			line = line.trim()
			return !isRemark(line)
		})
		let mRinfo = updateSection.parse(removeSingle, remarkStart, remarkEnd)
		let mulitRemark = mRinfo.hasStart && removeSingle.slice(mRinfo.startIdx,mRinfo.endIdx+1) || []
		loggerText(mRinfo)
		loggerText(mulitRemark)
		onlyRemark = onlyRemark.concat(mulitRemark.join(os.EOL))

		let userTomls = onlyRemark.map(function(line){
			line = line.trim()
			let ready2Toml = removeTag(line)

			loggerText(c('toml:'+ready2Toml))
			let userToml = {};
			try{
				userToml = toml.parse(ready2Toml)
			}catch(e){
				oneOra(`${c(opts.path)} TOML Parse error: ${c(e.message)}`,{end:'fail'});
			}
			return userToml
		})

		userTomls.forEach(function(singleTomlOpt){
			!!singleTomlOpt && (mergeOpts = Object.assign(mergeOpts, singleTomlOpt))
		})

		loggerText(c('toml -> object:\n'+JSON.stringify(mergeOpts,null,2)))

		let ID = mergeOpts.docTempliteId || 'readme';
		let id2Templite = dlv(opts.templite, ID)
		loggerText(c('templite:\n'+id2Templite))

		if(id2Templite){
			let templiteTransformed = templiteParse(id2Templite, mergeOpts)
			loggerText(c('Transformed:\n'+templiteTransformed))

			let update = `${START}${os.EOL}${onlyRemark.join(os.EOL)}${os.EOL}${templiteTransformed}${os.EOL}${ END}`
	
			data = updateSection(content, update, matchesStart, matchesEnd, false)
	
			if(data){
				transformed = true;
			}
		}else{
			oneOra(`${c(opts.path)} ${g(mergeOpts.docTempliteId)} no match`,{end: 'fail'})
		}
	}
	
	loggerText(c(JSON.stringify(data)))
	
	let result = {
		path: opts.path,
		toml: mergeOpts,
		transformed: transformed,
		data: data
	}

	return result;
};