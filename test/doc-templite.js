import test from 'ava';
import fs from 'fs'
import path from 'path'
import templite from '../.doc-templite'
import doc from '../doc-templite';
const testDir = __dirname
const Regex = /yobrave \| 18/

test.todo('doc-templite')

const getPath = (p) => path.resolve(testDir,p)
const getF = (p) => fs.readFileSync(p,'utf8')

test('file: no doc-templite tag', t => {
    const p = getPath('./features/no-doc-templite.md')
    const f = getF(p)
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

	t.is(toml.length,0);
    t.false(transformed);
    t.is(data,f)
});
test('each toml with single remark', t => {
    const p = getPath('./features/first-test.md')
    const f = getF(p)
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

	t.is(toml.length,1);
	t.is(toml[0].age,18);
    t.true(transformed);
    t.regex(data,Regex)
});

test('one remark with tomls ', t => {
    const p = getPath('./features/one-remark-tomls.md')
    const f = getF(p)
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

	t.is(toml.length,1);
	t.is(toml[0].age,18);
    t.true(transformed);
    t.regex(data,Regex)
});

test('one tag with one mulit remark tomls ', t => {
    const p = getPath('./features/one-tag-one-mulit-remark.md')
    const f = getF(p)
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result
	t.is(toml.length,1);
	t.is(toml[0].age,18);

    t.true(transformed);
    t.regex(data,Regex)
});

test('more doc-templite tag Same content', t => {
    const p = getPath('./features/gen-more-doc-templite-tag.md')
    const f = getF(p)
    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

	t.is(toml.length,2);
	t.is(toml[0].age,18);
    t.false(transformed);
    t.is(data,f)
});

test('more doc-templite tag', t => {
	const p = getPath('./features/more-doc-templite-tag.md')
    const genPath = getPath('./features/gen-more-doc-templite-tag.md')

	const f = getF(p)
    const gen = getF(genPath)

    let opts = {
        path:p,
        templite,
    }
    let result = doc(f,opts)
    let {transformed,data,toml} = result

	t.is(toml.length,2);
	t.is(toml[0].age,18);
    t.true(transformed);
    t.is(data,gen)
});
