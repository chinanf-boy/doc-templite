'use strict';

const os = require('os');
const toml = require('toml');
const dlv = require('dlv');
const templiteParse = require('templite');
const {loggerStart} = require('two-log-min');
const {c, g, r} = require('./src/util');

const updateTemplite = require('./src/updateTemplite');
const errorInfo = require('./src/errorInfo');
const {toS} = require('./src/util');

const START = '<!-- doc-templite START generated -->';
const END = '<!-- doc-templite END generated -->';

function matchesStart(line) {
	return line.startsWith('<!-- doc-templite START');
}

function matchesEnd(line) {
	return line.startsWith('<!-- doc-templite END');
}

function remarkStart(line) {
	return /<!--/.test(line);
}

function remarkEnd(line) {
	return /-->/.test(line);
}

function isRemark(line) {
	return line.startsWith('<!--') && line.endsWith('-->');
}

function removeTag(line) {
	if (isRemark(line)) {
		line = line.slice(4, -3);
	}
	return line;
}

module.exports = function docTemplite(content, opts) {
	if (typeof content !== 'string') {
		throw new TypeError(`Expected a string, got ${c(typeof content)}`);
	}
	const blocksTomls = [];
	let transformed = false;
	let data = content;
	const currentBlocks = [];
	let why = null;

	const mainLog = loggerStart(
		c(`${g(opts.path)} searching doc-templite <-tags->`),
		{log: 'main'}
	);

	// Must had doc-templite tag
	const lines = content.split('\n');

	mainLog(g('all:' + lines.length + ' lines'), {only: 'log'});
	let tags;

	try {
		tags = updateTemplite.parse(lines, matchesStart, matchesEnd, true);

		tags.forEach(tag => {
			if (tag.hasStart && tag.hasEnd) {
				currentBlocks.push(lines.slice(tag.startIdx + 1, tag.endIdx));
			}
		});
	} catch (err) {
		throw new Error(`${c(opts.path)}\n - doc-templite tag:\n${err.message}`);
	}
	// CurrentBlock : [[],[]] || []
	if (currentBlocks.length) {
		mainLog(c(`${opts.path} had <-tags->`));

		// Support md more tags with templite
		for (let i = 0; i < currentBlocks.length; i++) {
			const indexBlock = currentBlocks[i];
			mainLog(`<-tag-${i}->: ${toS(tags[i])}`, {only: 'log'});

			mainLog(g(`block-${i}:${toS(indexBlock)}`), {only: 'log'});

			const singleRemark = indexBlock.filter(line => {
				line = line.trim();
				return isRemark(line);
			});
			const removeSingle = indexBlock.filter(line => {
				line = line.trim();
				return !isRemark(line);
			});
			let mulitRemarkPtn;
			const currentRemarks = [];
			try {
				mulitRemarkPtn = updateTemplite.parse(
					removeSingle,
					remarkStart,
					remarkEnd,
					false
				);
				mulitRemarkPtn.forEach(tag => {
					if (tag.hasStart && tag.hasEnd) {
						currentRemarks.push(
							removeSingle.slice(tag.startIdx, tag.endIdx + 1)
						);
					}
				});
			} catch (err) {
				throw new Error(`${c(opts.path)} - Toml:\n'${err.message}`);
			}

			const mulitRemark = [];
			if (currentRemarks.length) {
				for (
					let remarkIdx = 0;
					remarkIdx < currentRemarks.length;
					remarkIdx++
				) {
					const indexRemark = currentRemarks[remarkIdx];
					mulitRemark.push(indexRemark.join('\n'));
					mainLog(`tomls-${remarkIdx}: ${toS(indexRemark)}`, {only: 'log'});
				}
			}

			const tomlRemark = singleRemark.concat(mulitRemark);

			const userTomls = tomlRemark.map(line => {
				line = line.trim();
				const ready2Toml = removeTag(line);

				mainLog(c('toml:' + ready2Toml), {only: 'log'});
				let userToml = {};
				try {
					userToml = toml.parse(ready2Toml);
				} catch (e) {
					const E = errorInfo('toml', {e, line: ready2Toml});
					throw new Error(`${c(opts.path)} TOML Parse error:\n${E}`);
				}
				return userToml;
			});
			let mergeOpts = {};
			userTomls.forEach(singleTomlOpt => {
				Boolean(Object.keys(singleTomlOpt).length) &&
					(mergeOpts = Object.assign(mergeOpts, singleTomlOpt));
			});
			blocksTomls.push(mergeOpts);

			mainLog(c('toml -> object:\n' + toS(mergeOpts)), {only: 'log'});

			const ID = mergeOpts.docTempliteId || 'readme';
			const id2Templite = dlv(opts.templite, ID);
			mainLog(c(`templite <${ID}>:\n` + id2Templite), {only: 'log'});

			if (id2Templite) {
				const templiteTransformed = templiteParse(id2Templite, mergeOpts);
				mainLog(c('Transformed:\n' + templiteTransformed), {only: 'log'});

				const update = `${START}\n${tomlRemark.join(
					'\n'
				)}\n${templiteTransformed}\n${END}`;

				data = updateTemplite.updateSection(
					data,
					update,
					matchesStart,
					matchesEnd,
					i
				);

				if (data) {
					// MainLog(c(toS(data)))

					if (i == currentBlocks.length - 1) {
						const cTs = content.split('\n');
						// Fix CRLF/LF, each line equal trim right , just string equal
						if (
							data.split('\n').some((d, index) => {
								if (cTs[index]) {
									return d.trimRight() !== cTs[index].trimRight();
								}
								return cTs[index] !== d;
							})
						) {
							transformed = true;
						} else {
							why = 'some content';
						}
					}
				}
			} else {
				throw new Error(
					`${c(opts.path)} no match doc-templite \nid:${g(
						mergeOpts.docTempliteId
					)} `
				);
			}
		}
	} else {
		mainLog(c(`${opts.path} no <-tags->`));
	}

	const result = {
		path: opts.path,
		toml: blocksTomls,
		transformed,
		data,
		why
	};

	return result;
};
