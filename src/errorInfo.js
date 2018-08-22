const {loggerStop} = require('two-log-min')
const {toS} = require('./util')
const {c,g} = require('./util')

const getErrorIdx = (t) => t.hasStart ? t.startIdx : t.endIdx

module.exports = function errorInfo(id, opts={}){
	loggerStop()
	let E = 'doc-templite Error'
	let {tag,lines,e,line} = opts

	switch(id){
		case 'tag':{
			let n = 'Need doc-templite '
			let need = tag.hasStart ? 'END':'START'
			let eidx = getErrorIdx(tag)
			let errorLine = lines.splice(eidx, 1)
			E = n+need
			E = c(E + `\nline-${(eidx+1)}:${toS(errorLine)}`)
			break;
		}
		case 'remark':{
			let eidx = getErrorIdx(tag)
			let errorLine = lines.splice(eidx, 1)
			E = `${c(toS(errorLine))}`
			break;
		}
		case 'toml':{
			E = g(line)
			E += `\n pos: line:${e.line} - column:${e.column}\n`
			E = c(E + `${toS(e.message)}`)
			break;
		}
		default:{

		}
	}

	return E
}
