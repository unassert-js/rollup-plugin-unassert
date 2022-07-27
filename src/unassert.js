
import {createFilter} from '@rollup/pluginutils';
import {Parser} from 'acorn';
import {importAssertions} from 'acorn-import-assertions';
import escodegen from 'escodegen';
import unassertjs from 'unassert';
import convert from 'convert-source-map';
import {transfer} from 'multi-stage-sourcemap';

// Adapted from https://github.com/unassert-js/unassertify/blob/master/index.js
// by Takuto Wada (MIT-licensed)

function handleIncomingSourceMap(originalCode) {
    const commented = convert.fromSource(originalCode);
    if (commented) {
        return commented.toObject();
    }
    return null;
}

function overwritePropertyIfExists(name, from, to) {
    // eslint-disable-next-line no-prototype-builtins
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
        name: 'unassert',
        transform(code, id) {
            if (!filter(id)) { return null; }

            return new Promise((resolve) => {
                const comments = [];
                const tokens = [];

                const ast = Parser.extend(importAssertions).parse(code, {
                    sourceType: 'module',
                    ecmaVersion: 'latest',
                    locations: true,
                    ranges: true,
                    onComment: comments,
                    onToken: tokens,
                });

                escodegen.attachComments(ast, comments, tokens);
                const unassertedAst = escodegen.generate(unassertjs(ast), {
                    sourceMap: id,
                    sourceContent: code,
                    sourceMapWithCode: true,
                    comment: true,
                });

                const inMap = options.sourcemap && handleIncomingSourceMap(code);
                let outMap = convert.fromJSON(unassertedAst.map.toString());
                if (inMap) {
                    outMap = reconnectSourceMap(inMap, outMap);
                }

                resolve({
                    code: unassertedAst.code,
                    map: outMap.toObject()
                });
            });
        }
    };
}
