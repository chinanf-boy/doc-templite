'use strict';

const toml = require('toml');
const os = require('os')
const dlv = require('dlv');
const templiteParse = require('templite')
const { oneOra,loggerText,loggerStart } = require('two-log-min')
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
	let why = null

	const mainLog = loggerStart(c(`${opts.path} searching doc-templite <-tags->`),{log:'main'})

	// must had doc-templite tag
	let lines = content.split(os.EOL)

	mainLog(g('all:'+lines.length+'lines'))
	let tags;

	try{

		tags = updateTemplite.parse(lines, matchesStart, matchesEnd, true);

		tags.forEach(function(tag){
			if(tag.hasStart && tag.hasEnd){
				currentBlocks.push(lines.slice(tag.startIdx + 1, tag.endIdx))
			}
		})

	}catch(err){
		throw new Error(`${c(opts.path)}\n - doc-templite tag:\n${err.message}`)
	}
	// currentBlock : [[],[]] || []
	if (currentBlocks.length) {
		mainLog(c(`${opts.path} had <-tags->`))

		// Support md more tags with templite
		for(let i = 0; i < currentBlocks.length; i ++){
			let indexBlock = currentBlocks[i]
			mainLog(`<-tag-${i}->: ${toS(tags[i])}`)

			mainLog(g(`block-${i}:${toS(indexBlock)}`))

			let singleRemark = indexBlock.filter(function(line){
				line = line.trim()
				return isRemark(line)
			})
			let removeSingle = indexBlock.filter(function(line){
				line = line.trim()
				return !isRemark(line)
			})
			let mulitRemarkPtn
			let currentRemarks = []
			try{

				mulitRemarkPtn = updateTemplite.parse(removeSingle, remarkStart, remarkEnd, false)
				mulitRemarkPtn.forEach(function(tag){
					if(tag.hasStart && tag.hasEnd){
						currentRemarks.push(removeSingle.slice(tag.startIdx,tag.endIdx+1))
					}
				})
			}catch(err){
					throw new Error(`${c(opts.path)} - Toml:\n'${err.message}`)
			}

			let mulitRemark = []
			if(currentRemarks.length){

				for(let remarkIdx = 0; remarkIdx < currentRemarks.length; remarkIdx++){
					let indexRemark = currentRemarks[remarkIdx]
					mulitRemark.push(indexRemark.join(os.EOL))
					mainLog(`tomls-${remarkIdx}: ${toS(indexRemark)}`)
				}
			}


			let tomlRemark = singleRemark.concat(mulitRemark)

			let userTomls = tomlRemark.map(function(line){
				line = line.trim()
				let ready2Toml = removeTag(line)

				mainLog(c('toml:'+ready2Toml))
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

			mainLog(c('toml -> object:\n'+toS(mergeOpts)))

			let ID = mergeOpts.docTempliteId || 'readme';
			let id2Templite = dlv(opts.templite, ID)
			mainLog(c(`templite <${ID}>:\n`+id2Templite))

			if(id2Templite){
				let templiteTransformed = templiteParse(id2Templite, mergeOpts)
				mainLog(c('Transformed:\n'+templiteTransformed))

				let update = `${START}${os.EOL}${tomlRemark.join(os.EOL)}${os.EOL}${templiteTransformed}${os.EOL}${ END}`

				data = updateTemplite(data, update, matchesStart, matchesEnd, i)

				if (data) {
					// mainLog(c(toS(data)))

					if(i == currentBlocks.length - 1){
						let cTs = content.split('\n')
						// Fix in windows
						if(data.split('\n').some((d,index) => d.trimRight() !== cTs[index].trimRight())){
							transformed = true;
						}else{
							why = 'some content'
						}
					}
				}
			}else{
				throw new Error(`${c(opts.path)} no match doc-templite \nid:${g(mergeOpts.docTempliteId)} `)
			}
		}
	}else{
		mainLog(c(`${opts.path} no <-tags->`))
	}

	let result = {
		path: opts.path,
		toml: blocksTomls,
		transformed: transformed,
		data: data,
		why
	}

	return result;
};
