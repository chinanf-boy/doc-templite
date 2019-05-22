# doc-templite [![Build Status](https://travis-ci.org/chinanf-boy/doc-templite.svg?branch=master)](https://travis-ci.org/chinanf-boy/doc-templite) [![codecov](https://codecov.io/gh/chinanf-boy/doc-templite/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/doc-templite?branch=master) [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/doc-templite-explain)

templite tool for Multi-md files

> while we work with Multi-file/repos-readme.md, some style help us to say or show something ,like a md table , but next time i want a md link. too busy to change those files, So `doc-templite` maybe help.

[中文](./readme.zh.md) | [english](./readme.md)

## created✅

## Install

```
npm i -g doc-templite
```

## Example

### 1. change file `readme.md` 👇 must got doc-templite tag

```html
<!-- doc-templite START -->
<!-- docTempliteId = 'readme' -->

<!-- name = 'yobrave'
age = 18 -->

<!-- doc-templite END -->
```

> Note: in START-END block, we use toml and with `<!-- -->`
> Multi-line only allow **one**, Single-line can **more**

### 2. need templite file `.doc-templite.js` in cli pwd

> readme field match `<!-- docTempliteId = 'readme' -->` of `1. readme.md`

```js
module.exports = {
	readme: `name | age
---------|----------
 {{ name }} | {{ age }}`,
};
```

> NOTE: default `docTempliteId === 'readme'`

### 3. run cli `doc-templite .` with `.doc-templite.js` dir

> search all file , but only work with **doc-templite tag**

```
doc-templite .
```

### 4. done , and the `readme.md` file content change

```
<!-- doc-templite START -->
<!-- docTempliteId = 'readme' -->

<!-- name = 'yobrave'
age = 18 -->

name | age
---------|----------
yobrave | 18

<!-- doc-templite END -->
```

| name    | age |
| ------- | --- |
| yobrave | 18  |

## CLI

```
npm install --global doc-templite
```

```
  Usage
  	$ doc-templite [folder/file name] [Optioins]

	Example
		$ doc-templite readme.md

	⭐ [Options]
		-D debug <default:false>

	⭐ [High Options]
		--OR  only Read, no reWrite files <default:false>
```

<!-- ## API

### docTemplite(input, [options])

#### input

name: | input
---------|----------
Type: | `string`
Desc: | Lorem ipsum.

#### options

##### foo

 name: | foo
---------|----------
Type: | `boolean`
Default: | `false`
Desc: | Lorem ipsum. -->

## concat

- [find-files-rust](https://github.com/chinanf-boy/find-files-rust) rust crate(ignore) power for Search all file in Current Dir
- [doctoc](https://github.com/thlorenz/doctoc) Generates table of contents for markdown files
- [templite](https://github.com/lukeed/templite) Lightweight templating in 150 bytes
- [toml](https://github.com/toml-lang/toml) Tom's Obvious, Minimal Language

## License

MIT © [chinanf-boy](http://llever.com)
