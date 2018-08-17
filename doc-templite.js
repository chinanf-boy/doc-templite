'use strict';

const toml = require('toml');
const os = require('os')
const dlv = require('dlv');
const templiteParse = require('templite')
const { oneOra,loggerText } = require('two-log')
const tc = require('turbocolor')
const c = tc.cyan;
const g = tc.green;

const updateTemplite = require('./src/updateTemplite')

const toS = (str) => JSON.stringify(str, null, 2)

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
	let blocksTomls = [];
	let transformed = false;
	let data = content;
	let currentBlocks = []

	// must had doc-templite tag
	let lines = content.split(os.EOL)

	loggerText(c(`${opts.path} searching doc-templite <-tags->`))
	loggerText(g('all:'+lines.length))

	let tags = updateTemplite.parse(lines, matchesStart, matchesEnd);

	tags.forEach(function(tag){
		if(tag.hasStart && tag.hasEnd){
			currentBlocks.push(lines.slice(tag.startIdx + 1, tag.endIdx))
		}else if(tag.hasStart || tag.hasEnd){
			throw new Error(`${opts.path} - doc-templite tag not Closed: START:=>${tag.startIdx} END:=>${tag.endIdx}`)
		}
	})
	// currentBlock : [[],[]] || []
	if (currentBlocks.length) {
		loggerText(c(`${opts.path} had <-tags->`))

		// Support md more tags with templite
		for(let i = 0; i < currentBlocks.length; i ++){
			let indexBlock = currentBlocks[i]
			loggerText(`<-tag-${i}->: ${toS(tags[i])}`)

			loggerText(g(`block-${i}:${toS(indexBlock)}`))

			let singleRemark = indexBlock.filter(function(line){
				line = line.trim()
				return isRemark(line)
			})
			let removeSingle = indexBlock.filter(function(line){
				line = line.trim()
				return !isRemark(line)
			})

			let mulitRemarkPtn = updateTemplite.parse(removeSingle, remarkStart, remarkEnd)
			let currentRemarks = []

			mulitRemarkPtn.forEach(function(tag){
				if(tag.hasStart && tag.hasEnd){
					currentRemarks.push(removeSingle.slice(tag.startIdx,tag.endIdx+1))
				}else if(tag.hasStart || tag.hasEnd){
					throw new Error(`${opts.path} - Toml not Closed: START:=>${tag.startIdx} END:=>${tag.endIdx}`)
				}
			})

			// let mRinfo = updateSection.parse(removeSingle, remarkStart, remarkEnd)
			// let mulitRemark = mRinfo.hasStart && removeSingle.slice(mRinfo.startIdx,mRinfo.endIdx+1) || []
			let mulitRemark = []
			if(currentRemarks.length){

				for(let remarkIdx = 0; remarkIdx < currentRemarks.length; remarkIdx++){
					let indexRemark = currentRemarks[remarkIdx]
					mulitRemark.push(indexRemark.join(os.EOL))
					loggerText(`tomls-${remarkIdx}: ${toS(indexRemark)}`)
				}
			}


			let tomlRemark = singleRemark.concat(mulitRemark)

			let userTomls = tomlRemark.map(function(line){
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
			let mergeOpts = {}
			userTomls.forEach(function(singleTomlOpt){
				!!Object.keys(singleTomlOpt).length && (mergeOpts = Object.assign(mergeOpts, singleTomlOpt))
			})
			blocksTomls.push(mergeOpts)

			loggerText(c('toml -> object:\n'+toS(mergeOpts)))

			let ID = mergeOpts.docTempliteId || 'readme';
			let id2Templite = dlv(opts.templite, ID)
			loggerText(c('templite:\n'+id2Templite))

			if(id2Templite){
				let templiteTransformed = templiteParse(id2Templite, mergeOpts)
				loggerText(c('Transformed:\n'+templiteTransformed))

				let update = `${START}${os.EOL}${tomlRemark.join(os.EOL)}${os.EOL}${templiteTransformed}${os.EOL}${ END}`

				data = updateTemplite(data, update, matchesStart, matchesEnd, i)

				if (data) {
					// loggerText(c(toS(data)))
					if(i == currentBlocks.length - 1){
						transformed = true;
					}
				}
			}else{
				oneOra(`${c(opts.path)} ${g(mergeOpts.docTempliteId)} no match`,{end: 'fail'})
			}
		}
	}else{
		loggerText(c(`${opts.path} no <-tags->`))
	}

	let result = {
		path: opts.path,
		toml: blocksTomls,
		transformed: transformed,
		data: data
	}

	return result;
};
