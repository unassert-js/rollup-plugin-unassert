'use strict';

const rollup = require('rollup');
const rollupUnassert = require('../dist/rollup-plugin-unassert.cjs.js');
const fs = require('fs');

// This is the example from https://github.com/unassert-js/unassert#example

rollup.rollup({
    input: 'test/original.js',
    plugins: [
        rollupUnassert()
    ]
}).then((bundle) => {
    // Generate bundle + sourcemap
    bundle.generate({
        format: 'es',
        sourcemap: 'inline'
    }).then((result) => {
        const code = result.output[0].code;
        const expected = fs.readFileSync('test/expected.js').toString();

        if (expected === code) {
            console.log('rollup-plugin-unassert unit test passed');
            process.exit(0);
        } else {
            console.log('rollup-plugin-unassert unit test failed');
            console.log('Generated code: \n', code);
            console.log('Expected code: \n', expected);
            process.exit(-1);
        }
    });
}).catch((e) => {
    console.error(e);
    process.exit(-1);
});
