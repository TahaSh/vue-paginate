import rollupTypescript from '@rollup/plugin-typescript'

export default {
    input: 'src/index.ts',
    plugins: [
        rollupTypescript()
    ],
    output: {
        file: 'dist/index.js',
        format: 'esm'
    },
    external: [ 'vue' ],
}
