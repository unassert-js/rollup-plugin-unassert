
import {createFilter} from 'rollup-pluginutils';
import acorn from 'acorn';
import escodegen from 'escodegen';
import unassertjs from 'unassert';
import convert from 'convert-source-map';
import {transfer} from 'multi-stage-sourcemap';

// The following utility functions are adapted from
// https://github.com/unassert-js/unassertify/blob/master/index.js
// by Takuto Wada (which is under MIT license)

function handleIncomingSourceMap(originalCode) {
    const commented = convert.fromSource(originalCode);
    if (commented) {
        return commented.toObject();
    }
    return null;
}

function overwritePropertyIfExists(name, from, to) {
    if (from.hasOwnProperty(name)) {
        to.setProperty(name, from[name]);
    }
}
function reconnectSourceMap(inMap, outMap) {
    const mergedRawMap = mergeSourceMap(inMap, outMap.toObject());
    const reMap = convert.fromObject(mergedRawMap);
    overwritePropertyIfExists('sources', inMap, reMap);
    overwritePropertyIfExists('sourceRoot', inMap, reMap);
    overwritePropertyIfExists('sourcesContent', inMap, reMap);
    return reMap;
}

function mergeSourceMap(incomingSourceMap, outgoingSourceMap) {
    if (typeof outgoingSourceMap === 'string' || outgoingSourceMap instanceof String) {
        outgoingSourceMap = JSON.parse(outgoingSourceMap);
    }
    if (!incomingSourceMap) {
        return outgoingSourceMap;
    }
    return JSON.parse(transfer({fromSourceMap: outgoingSourceMap, toSourceMap: incomingSourceMap}));
}

export default function unassert(options = {}) {

    if (options.sourcemap === undefined) {
        options.sourcemap = true;
    }

    const filter = createFilter(
        options.include || ['*.js', '**/*.js'],
        options.exclude
    );

    return {
        transform(code, id) {
            if (!filter(id)) { return null; }

            return new Promise((resolve) => {

                // The following piece of code is adapted from
                // https://github.com/unassert-js/unassertify/blob/master/index.js
                // by Takuto Wada (which is under MIT license)
                const ast = acorn.parse(code, {sourceType: 'module', locations: true});

                const inMap = options.sourcemap && handleIncomingSourceMap(code);
                const unassertedAst = escodegen.generate(unassertjs(ast), {
                    sourceMap: id,
                    sourceContent: code,
                    sourceMapWithCode: true
                });
                const outMap = convert.fromJSON(unassertedAst.map.toString());

                if (inMap) {
                    const reMap = reconnectSourceMap(inMap, outMap);
                    resolve({
                        code: unassertedAst.code,
                        map: reMap.toObject()
                    });
                } else {
                    resolve({
                        code: unassertedAst.code,
                        map: outMap.toObject()
                    });
                }

            });

        }
    };
}
