const fFiles = require('find-files-rust');

const markdownExts = ['.md', '.markdown'];
function f() {
	let container = [];

	fFiles.mds.forEach(f => {
		if (markdownExts.some(ext => f.endsWith(ext))) {
			container.push({path: f});
		}
	});

	return container;
}
module.exports = {findMarkdownFiles: f};
