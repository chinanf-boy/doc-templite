import test from 'ava';
import fs from 'fs'
import path from 'path'
import templite from '../.doc-templite'
import doc from '../doc-templite';
const testDir = __dirname
const Regex = /yobrave \| 18/

test.todo('doc-templite')

test('file: no doc-templite tag', t => {
    const p = path.resolve(testDir,'./features/no-doc-templite.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

    t.is(Object.keys(toml).length,0);
    t.false(transformed);
    t.is(data,f)
});
test('each toml with single remark', t => {
    const p = path.resolve(testDir,'./features/first-test.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

    t.is(Object.keys(toml).length,3);
    t.true(transformed);
    t.regex(data,Regex)
});

test('one remark with tomls ', t => {
    const p = path.resolve(testDir,'./features/one-remark-tomls.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

    t.is(Object.keys(toml).length,3);
    t.true(transformed);
    t.regex(data,Regex)
});

test('more doc-templite tag', t => {
    const p = path.resolve(testDir,'./features/more-doc-templite-tag.md')
    const f = fs.readFileSync(p,'utf8');
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

    t.is(Object.keys(toml).length,3);
    t.true(transformed);
    t.regex(data,Regex)
});
