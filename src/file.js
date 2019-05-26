const fFiles = require('find-files-rust');

const markdownExts = ['.md', '.markdown'];
function fd(s) {
	let container = [];

	fFiles.find(s).forEach(f => {
		if (markdownExts.some(ext => f.endsWith(ext))) {
			container.push({path: f});
		}
	});

	return container;
}
module.exports = {findMarkdownFiles: fd};
