
# doc-templite[![Build Status](https://travis-ci.org/chinanf-boy/doc-templite.svg?branch=master)](https://travis-ci.org/chinanf-boy/doc-templite) [![codecov](https://codecov.io/gh/chinanf-boy/doc-templite/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/doc-templite?branch=master) [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/doc-templite-explain)

为 多个md文件 准备的模版工具

> 当我们使用 多个文件或者多项目的`readme.md`时,样式可以帮助我们说出或显示某些东西,比如 md 表格,但下次我想要一个 md 网络链接. 太麻烦了! 去修改更改这些文件,所以`doc-templite`也许有帮助.

[中文](./readme.zh.md)\|[英语](./readme.md)

## 施工✅

## 安装

    npm i -g doc-templite

## 例

1.  改变`readme.md`👇必须有doc-templite标签

```html
<!-- doc-templite START -->
<!-- doc-templite-id = 'readme' -->

<!-- name = 'yobrave'
age = 18 -->

<!-- doc-templite END -->
```

> **注意:**在 START-END 块中,我们使用的是 toml 和 `<!-- -->`

> 多行注释只能**一段**, 单行注释可以**多个**

2.  需要 templite 文件`.doc-templite.js`,在命令行运行时的目录

> 注意: readme 字段匹配`1. readme.md`中的`<! -  doc-templite-id ='readme' - >`

```js
module.export = {
  readme:`name | age
---------|----------
 {{ name }} | {{ age }}`
}
```

> 注意: 默认 `docTempliteId === 'readme'`

3.  运行`doc-templite .`

> 搜索所有文件,但只会修改有 **doc-templite标签** 的文件

    doc-templite .

> 目录下要有 `.doc-templite.js` 文件喔

4.  做完了,`readme.md`文件内容变成

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

| 名称      | 年龄  |
| ------- | --- |
| yobrave | 18  |

## CLI

    npm install --global doc-templite

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

## 启发与关联

-   [doctoc](https://github.com/thlorenz/doctoc) 生成markdown文件的目录
-   [templite](https://github.com/lukeed/templite) 轻量级模板,150字节
-   [toml](https://github.com/toml-lang/toml) 列表语法,最小的语言

## 执照

麻省理工学院©[chinanf-boy](http://llever.com)
