import copy from 'rollup-plugin-copy';
import cleanup from 'rollup-plugin-cleanup';

export default {
    input: 'src/unassert.js',
    external: ['@rollup/pluginutils', 'unassert'],
    output: [
        {
            file: 'dist/rollup-plugin-unassert.cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/rollup-plugin-unassert.esm.js',
            format: 'esm',
        },
    ],
    plugins: [
        cleanup(),
        copy({
            targets: [
                {src: 'src/index.d.ts', dest: 'dist', rename: 'rollup-plugin-unassert.cjs.d.ts'},
                {src: 'src/index.d.ts', dest: 'dist', rename: 'rollup-plugin-unassert.esm.d.ts'},
            ],
        }),
    ],
};
