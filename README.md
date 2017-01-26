# rollup-plugin-unassert

[Rollup](http://www.rollupjs.org) plugin to remove assertion calls via [Unassert](https://github.com/unassert-js/unassert)

## Installation

```bash
yarn add --dev rollup-plugin-unassert
```
or
```bash
npm install --save-dev rollup-plugin-unassert
```


## Usage

As with any other Rollup plugin, just add it to the `plugins` option in your RollupJS config:

```js
// In rollup.config.js
import rollupUnassert from 'rollup-plugin-unassert'

export default {
	entry: 'src/index.js',
	dest: 'dist/my-lib.js',
	plugins: [
		unassert()
	]
};
```

### Available options

This plugin accepts the following options:
* `include`: A minimatch pattern or array of minimatch patterns, controlling which files are to be handled by this plugin. By default matches `*.js` only.
* `exclude`: A minimatch pattern or array of minimatch patterns, controlling which files are to be ignored by this plugin. By default it's empty.
* `sourcemap`: A boolean controlling whether to handle any existing sourcemaps, defaults to `true`. Setting this to `false` will hide the assert calls when debugging the generated bundle.
* `assertionPatterns`: as per [unassert options](https://github.com/unassert-js/unassert#options).
* `requirePatterns`: as per [unassert options](https://github.com/unassert-js/unassert#options).
* `importPatterns`: as per [unassert options](https://github.com/unassert-js/unassert#options).

e.g.:

```js
// In rollup.config.js
import rollupUnassert from 'rollup-plugin-unassert'

export default {
	entry: 'src/index.js',
	dest: 'dist/my-lib.js',
	plugins: [
		rollupUnassert({
			exclude: 'test/**/**.js',
			requirePatterns: [ 'assert = require("assert")' ]
		}),
	]
};
```

## License

"THE BEER-WARE LICENSE":
<ivan@sanchezortega.es> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.


Also, thanks for Takuto Wada for https://github.com/unassert-js/unassertify , from
which this project takes a lot of the code to wrap unassert.

