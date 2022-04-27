
const config = format => ({
    input: 'src/unassert.js',
    external: ['rollup-pluginutils', 'acorn', 'escodegen', 'unassert', 'convert-source-map', 'multi-stage-sourcemap'],
    output: {
        file: `dist/rollup-plugin-unassert.${format}.js`,
        format
    }
});

export default [
    config('cjs'),
    config('es')
];
