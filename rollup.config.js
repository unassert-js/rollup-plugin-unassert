
const config = format => ({
    input: 'src/unassert.js',
    external: ['@rollup/pluginutils', 'unassert'],
    output: {
        file: `dist/rollup-plugin-unassert.${format}.js`,
        format
    }
});

export default [
    config('cjs'),
    config('es')
];
