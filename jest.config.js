module.exports = {
    preset: 'ts-jest',
    'moduleFileExtensions': [
        'ts',
        'js'
    ],
    'transform': {
        '^.+\\.[tj]s$': 'ts-jest'
    },
    'globals': {
        'ts-jest': {
            'tsconfig': 'tsconfig.json'
        }
    }
}
