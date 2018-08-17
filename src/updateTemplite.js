'use strict';

const os = require('os')
/**
 * Copy from doctoc
 *
 *
 * Finds the start and end lines that match the given criteria.
 * Used by update-section itself.
 *
 * Use it if you need to get tagsrmation about where the matching content is located.
 *
 * @name updateSection::parse
 * @function
 * @param {Array.<string>} lines the lines in which to look for matches
 * @param {Function} matchesStart when called with a line needs to return true iff it is the section start line
 * @param {Function} matchesEnd when called with a line needs to return true iff it is the section end line
 * @return {Array.<Object>} with the following properties: hasStart, hasEnd, startIdx, endIdx
 */
function parse(lines, matchesStart, matchesEnd) {
  var startIdx = -1
    , endIdx = -1
    , hasStart = false
    , hasEnd = false
    , line;

  let tags = [];

  for (var i = 0; i < lines.length; i++) {
    line = lines[i]

    if (matchesStart(line)) {
			if(hasStart){
				break;
			}
			startIdx = i;
			hasStart = true;
    } else if (matchesEnd(line)) {
				endIdx = i;
				hasEnd = true;
				if(!hasStart){
					break;
				}
    }

    if (hasStart && hasEnd) {
        tags.push({ hasStart: hasStart, hasEnd: hasEnd, startIdx: startIdx, endIdx: endIdx })
        hasStart = false
        hasEnd = false
    };
	}

	if(hasStart || hasEnd){
		tags.push({ hasStart: hasStart, hasEnd: hasEnd, startIdx: startIdx, endIdx: endIdx })
	}



  return tags;
}

/**
 * Updates the content with the given section.
 *
 * If previous section is found it is replaced.
 * Otherwise the section is appended to the end of the content.
 *
 * @name updateSection
 * @function
 * @param {String} content that may or may not include a previously added section
 * @param {String} section the section to update
 * @param {Function} matchesStart when called with a line needs to return true iff it is the section start line
 * @param {Function} matchesEnd when called with a line needs to return true iff it is the section end line
 * @param {number} index number with Array index
 * @return {String} content with updated section
 */
exports = module.exports = function updateSection(content, section, matchesStart, matchesEnd, index) {
	if (!content) return section;

	var lines = content.split(os.EOL)
	if (!lines.length) return section;

	var tags = parse(lines, matchesStart, matchesEnd);

	let tag = tags[index]

	var sectionLines = section.split(os.EOL)
	  , dropN = tag.endIdx - tag.startIdx + 1;

	[].splice.apply(lines, [ tag.startIdx, dropN ].concat(sectionLines))

	return lines.join(os.EOL);
  }

exports.parse = parse
