import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import json from '@rollup/plugin-json'
import externalDeps from 'rollup-plugin-peer-deps-external'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'

const globals = {
  react: 'React',
  'react-query': 'ReactQuery',
  'react-json-tree': 'JSONTree',
  'match-sorter': 'matchSorter',
}

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQueryDevtools',
      file: 'dist/react-query-devtools.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [resolve(), babel(), commonJS(), externalDeps(), json()],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQueryDevtools',
      file: 'dist/react-query-devtools.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve(),
      babel(),
      commonJS(),
      json(),
      externalDeps(),
      terser(),
      size(),
    ],
  },
]
