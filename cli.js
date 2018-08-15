#!/usr/bin/env node
'use strict';
const meow = require('meow');
const docTemplite = require('.');

const cli = meow(`
  Usage
  	$ doc-templite [folder/file name]

	Example
		$ doc-templite readme.md
`);

console.log(docTemplite(cli.input[0] || 'unicorns'));
