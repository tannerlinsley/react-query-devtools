import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-size'
import json from '@rollup/plugin-json'
import externalDeps from 'rollup-plugin-peer-deps-external'

const external = ['react', 'react-query', 'react-json-tree']

const globals = {
  react: 'React',
  'react-query': 'ReactQuery',
  'react-json-tree': 'JSONTree',
}

export default [
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
    plugins: [babel(), externalDeps(), json()],
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
    plugins: [babel(), json(), externalDeps(), terser(), size()],
  },
]
