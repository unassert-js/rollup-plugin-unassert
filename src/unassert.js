import {createFilter} from '@rollup/pluginutils';
import {unassertCode} from 'unassert';

export default function unassert(options = {}) {
    const filter = createFilter(
        options.include ?? ['*.js', '**/*.js'],
        options.exclude
    );

    const unassertOptions = options.unassertOptions ?? {};

    return {
        name: 'unassert',
        transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            const ast = this.parse(code);
            return unassertCode(code, ast, {
                sourceMap: options.sourcemap !== false ?
                    {hires: true} :
                    false,
                ...unassertOptions
            });
        },
    };
}
