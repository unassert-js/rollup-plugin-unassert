'use strict';

const rollup = require('rollup');
const rollupUnassert = require('../dist/rollup-plugin-unassert.cjs.js');
const fs = require('fs');
const test = require('tape').test;

test('removes assert code', (t) => {
    // This is the example from https://github.com/unassert-js/unassert#example
    rollup.rollup({
        input: 'test/original.js',
        plugins: [
            rollupUnassert()
        ]
    }).then((bundle) => {
        bundle.generate({
            format: 'es',
            sourcemap: 'inline'
        }).then((result) => {
            const expected = fs.readFileSync('test/expected.js', 'utf8');
            t.equal(result.output[0].code, expected);
            t.end();
        });
    }).catch((e) => {
        console.error(e);
        process.exit(-1);
    });
});
