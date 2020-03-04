import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import postcss from 'rollup-plugin-postcss'

const external = [
  'react',
  'react-query',
  'react-json-tree',
  'react-codemirror',
  'codemirror/lib/codemirror.css',
  'codemirror/mode/javascript/javascript.js',
  'codemirror/theme/material.css',
]

const globals = {
  react: 'React',
  'react-query': 'ReactQuery',
  'react-json-tree': 'JSONTree',
  'react-codemirror': 'CodeMirror',
}

export default [
  // {
  //   input: 'src/index.js',
  //   output: {
  //     file: 'dist/react-query-devtools.es.js',
  //     format: 'esm',
  //     sourcemap: true,
  //   },
  //   external,
  //   plugins: [babel(), postcss()],
  // },
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQuery',
      file: 'dist/react-query-devtools.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [babel(), postcss()],
  },
  {
    input: 'src/index.js',
    output: {
      name: 'ReactQuery',
      file: 'dist/react-query-devtools.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    external,
    plugins: [
      babel(),
      terser(),
      size({
        writeFile: false,
      }),
    ],
  },
]
