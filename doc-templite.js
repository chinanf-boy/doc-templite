'use strict';

const toml = require('toml');
const os = require('os')
const dlv = require('dlv');
const templiteParse = require('templite')
const { oneOra,loggerText } = require('two-log')
const {c,g} = require('./src/util')

const updateTemplite = require('./src/updateTemplite')
const errorInfo = require('./src/errorInfo')
const {toS} = require('./src/util')

const START = '<!-- doc-templite START generated -->'
const END   = '<!-- doc-templite END generated -->'

function matchesStart(line) {
	return line.startsWith('<!-- doc-templite START');
  }

function matchesEnd(line) {
	return line.startsWith('<!-- doc-templite END')
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

	let tags = updateTemplite.parse(lines, matchesStart, matchesEnd, true);

	tags.forEach(function(tag){
		if(tag.hasStart && tag.hasEnd){
			currentBlocks.push(lines.slice(tag.startIdx + 1, tag.endIdx))
		}else if(tag.hasStart || tag.hasEnd){
			let E = errorInfo('tag',{tag,lines})
			throw new Error(`${c(opts.path)}\n - doc-templite tag not Closed:\n${E}`)
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

			let mulitRemarkPtn = updateTemplite.parse(removeSingle, remarkStart, remarkEnd, false)
			let currentRemarks = []

			mulitRemarkPtn.forEach(function(tag){
				if(tag.hasStart && tag.hasEnd){
					currentRemarks.push(removeSingle.slice(tag.startIdx,tag.endIdx+1))
				}else if(tag.hasStart || tag.hasEnd){
					let E = errorInfo('remark',{tag,lines:removeSingle})
					throw new Error(`${c(opts.path)} - Toml not Closed:\n'${E}`)
				}
			})

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
					let E = errorInfo('toml',{e,line:ready2Toml})
					throw new Error(`${c(opts.path)} TOML Parse error:\n${E}`);
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
			loggerText(c(`templite <${ID}>:\n`+id2Templite))

			if(id2Templite){
				let templiteTransformed = templiteParse(id2Templite, mergeOpts)
				loggerText(c('Transformed:\n'+templiteTransformed))

				let update = `${START}${os.EOL}${tomlRemark.join(os.EOL)}${os.EOL}${templiteTransformed}${os.EOL}${ END}`

				data = updateTemplite(data, update, matchesStart, matchesEnd, i)

				if (data) {
					// loggerText(c(toS(data)))

					if(i == currentBlocks.length - 1){
						if(data !== content){
							transformed = true;
						}
					}
				}
			}else{
				throw new Error(`${c(opts.path)} no match doc-templite \nid:${g(mergeOpts.docTempliteId)} `)
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
