import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/unassert.js',
	plugins: [ buble() ]
};
