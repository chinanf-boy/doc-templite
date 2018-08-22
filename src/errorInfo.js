const {loggerStop} = require('two-log-min')
const {toS} = require('./util')
const {c,g} = require('./util')

module.exports = function errorInfo(id, opts={}){
	loggerStop()
	let E = 'doc-templite Error'
	let {tag,lines,e,line} = opts

	switch(id){
		case 'toml':{
			E = g(line)
			E += `\n pos: line:${e.line} - column:${e.column}\n`
			E = c(E + `${toS(e.message)}`)
			break;
		}
	}
	return E
}
