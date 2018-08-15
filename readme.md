# doc-templite [![Build Status](https://travis-ci.org/chinanf-boy/doc-templite.svg?branch=master)](https://travis-ci.org/chinanf-boy/doc-templite) [![codecov](https://codecov.io/gh/chinanf-boy/doc-templite/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/doc-templite?branch=master)

<!-- [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/doc-templite-explain) -->

templite with Multi md docs

> while we work with Multi-file/repos-readme.md, some style help us to say or show something ,like a md table , but next time i want a md link. too busy to change those files, So `doc-templite` maybe help.

[中文](./readme.zh.md) | [english](./readme.md)

## 施工-createing🀄️

⏰ 2018 8.15 开始

## Install

```
npm i -g doc-templite
```

## Example

1. change file `readme.md` 👇 must got doc-templite tag

``` html
<!-- doc-templite START -->
<!-- doc-templite-id = 'readme' -->

<!-- name = 'yobrave'
age = 18 -->

<!-- doc-templite END -->
```

> Note in START-END block, we use toml and with `<!-- -->`

2. need templite file `.doc-templite.js` in cli pwd

> Note: readme field match `<!-- doc-templite-id = 'readme' -->` of `1. readme.md`

``` js
module.export = {
  readme:`name | age
---------|----------
 {{ name }} | {{ age }}`
}
```

3. run cli `doc-templite .` with `.doc-templite.js` dir

> search all file , but only work with **doc-templite tag**

```
doc-templite .
```

4. done , and the `readme.md` file content change

```
<!-- doc-templite START -->
<!-- doc-templite-id = 'readme' -->

<!-- name = 'yobrave'
age = 18 -->

name | age
---------|----------
yobrave | 18

<!-- doc-templite END -->
```

name | age
---------|----------
yobrave | 18




## CLI

```
npm install --global doc-templite
```

```
$ doc-templite --help

  Usage
    $ doc-templite [folder/file name]

  Example
    $ doc-templite readme.md

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

- [doctoc](https://github.com/thlorenz/doctoc) Generates table of contents for markdown files
- [templite](https://github.com/lukeed/templite) Lightweight templating in 150 bytes
- [toml](https://github.com/toml-lang/toml) Tom's Obvious, Minimal Language


## License

MIT © [chinanf-boy](http://llever.com)
