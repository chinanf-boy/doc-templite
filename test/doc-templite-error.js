import test from 'ava';
import fs from 'fs'
import path from 'path'
import templite from '../.doc-templite'
import doc from '../doc-templite';
const testDir = __dirname
const Regex = /yobrave \| 18/

test.todo('doc-templite(content,opts) Error')


test.serial.failing('args::content Error', t =>{
    doc([],{})
})

test.serial.failing('toml parse Error', t => {
    const p = path.resolve(testDir,'./features/toml-error.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

    // t.is(Object.keys(toml).length,3);
    // t.true(transformed);
    // t.regex(data,Regex)
});

test.serial.failing('.doc-templite.js id no match, can not transform Error', t => {
    const p = path.resolve(testDir,'./features/idTemplite-error.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result
    // t.is(Object.keys(toml).length,3);
    // t.true(transformed);
    // t.regex(data,Regex)
});

test.serial.failing('tags with no Closed Error: more START', t => {
    const p = path.resolve(testDir,'./features/more-START-tags-Error.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
	}

    let result = doc(f,opts)
    let {transformed,data,toml} = result
    // t.is(Object.keys(toml).length,3);
    // t.true(transformed);
    // t.regex(data,Regex)
});

test.serial.failing('tags with no Closed Error: more END', t => {
    const p = path.resolve(testDir,'./features/more-END-tags-Error.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
	}

    let result = doc(f,opts)
    let {transformed,data,toml} = result
    // t.is(Object.keys(toml).length,3);
    // t.true(transformed);
    // t.regex(data,Regex)
});

test.serial.failing('more tags with no Closed Remark Error', t => {
    const p = path.resolve(testDir,'./features/no-Closed-Remark-Error.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
	}
    let result = doc(f,opts)
    let {transformed,data,toml} = result
    // t.is(Object.keys(toml).length,3);
    // t.true(transformed);
    // t.regex(data,Regex)
});
