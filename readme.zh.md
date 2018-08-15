
# doc-templite[![Build Status](https://travis-ci.org/chinanf-boy/doc-templite.svg?branch=master)](https://travis-ci.org/chinanf-boy/doc-templite) [![codecov](https://codecov.io/gh/chinanf-boy/doc-templite/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/doc-templite?branch=master)

<!-- [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/doc-templite-explain) -->

使用Multi md docs的templite

> 当我们使用 多个文件或者多项目的`readme.md`时,样式可以帮助我们说出或显示某些东西,比如 md表,但下次我想要一个md链接. 太麻烦了更改这些文件,所以`doc-templite`也许有帮助.

[中文](./readme.zh.md)\|[英语](./readme.md)

## 施工-createing🀄️

⏰2018 8.15 开始

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

> 注意在 START-END 块中,我们使用的是 toml 和 `<!-- -->`

2.  需要 templite 文件`.doc-templite.js`在命令行运行时的目录

> 注意: readme 字段匹配`1. readme.md`中的`<! -  doc-templite-id ='readme' - >`

```js
module.export = {
  readme:`name | age
---------|----------
 {{ name }} | {{ age }}`
}
```

3.  运行`doc-templite .`, 目录下要有 `.doc-templite.js` 文件喔

> 搜索所有文件,但只会修改有 **doc-templite标签** 的文件

    doc-templite .

4.  做完了,`readme.md`文件内容变成


    <!-- doc-templite START -->
    <!-- doc-templite-id = 'readme' -->

    <!-- name = 'yobrave'
    age = 18 -->

    name | age
    ---------|----------
    yobrave | 18

    <!-- doc-templite END -->

| 名称      | 年龄  |
| ------- | --- |
| yobrave | 18  |

## CLI

    npm install --global doc-templite

    $ doc-templite --help

      Usage
        $ doc-templite [folder/file name]

      Example
        $ doc-templite readme.md

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

-   [doctoc](https://github.com/thlorenz/doctoc)生成markdown文件的目录
-   [templite](https://github.com/lukeed/templite)轻量级模板,150字节
-   [toml](https://github.com/toml-lang/toml)汤姆的明显,最小的语言

## 执照

麻省理工学院©[chinanf男孩](http://llever.com)
