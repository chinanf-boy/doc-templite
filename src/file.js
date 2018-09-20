const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const tc = require('turbocolor');

const g = tc.green;
const {loggerText} = require('two-log-min');

const markdownExts = ['.md', '.markdown'];
const ignoredDirs = ['.', '..', '.git', 'node_modules'];

function separateFilesAndDirs(fileInfos) {
	return {
		directories: _(fileInfos).filter(x => {
			return x.isDirectory() && !_(ignoredDirs).include(x.name);
		}),
		markdownFiles: _(fileInfos).filter(x => {
			return x.isFile() && _(markdownExts).include(path.extname(x.name));
		})
	};
}

const ignoreArr = ['.git', 'node_modules'];

function findRec(currentPath) {
	function getStat(entry) {
		const target = path.join(currentPath, entry);
		let stat;
		try {
			stat = fs.statSync(target);
			if (stat.isDirectory() && ignoreArr.some(x => x === entry)) {
				return '';
			}
		} catch (error) {
			return '';
		}

		return _(stat).extend({
			name: entry,
			path: target
		});
	}

	function process(fileInfos) {
		const res = separateFilesAndDirs(fileInfos);
		const tgts = _(res.directories).pluck('path');

		if (res.markdownFiles.length > 0) {

			// LoggerText(`1. Found ${g(_(res.markdownFiles).pluck('name').join(', '))} in ${g(currentPath)}`);
		} else {

			// LoggerText(`1. Found nothing in ${g(currentPath)}`);
		}

		return {
			markdownFiles: res.markdownFiles,
			subdirs: tgts
		};
	}

	let stats = _(fs.readdirSync(currentPath)).map(getStat).filter(x => x),
		res = process(stats),
		markdownsInSubdirs = _(res.subdirs).map(findRec),
		allMarkdownsHereAndSub = res.markdownFiles.concat(markdownsInSubdirs);

	return _(allMarkdownsHereAndSub).flatten();
}

// Finds all markdown files in given directory and its sub-directories
// @param {String  } dir - the absolute directory to search in
exports.findMarkdownFiles = function (dir) {
	return findRec(dir);
};

/* Example:
console.log('\033[2J'); // clear console

var res = findRec(path.join(__dirname, '..', 'samples'));
console.log('Result: ', res);
*/
