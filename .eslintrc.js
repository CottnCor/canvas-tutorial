module.exports = {
    extends: ['alloy', 'alloy/typescript'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            modules: true
        }
    },
    rules: {
        'no-var': 2,
        'no-empty': 1,
        'complexity': 0,
        'no-debugger': 1,
        'max-depth': 0,
        'spaced-comment': 1,
        'max-params': [0, 7],
        'no-return-assign': 1,
        'no-param-reassign': 1,
        'array-callback-return': 1,
        'no-implicit-coercion': 1,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-assertions': 0,
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/no-require-imports': 1,
        '@typescript-eslint/triple-slash-reference': 0,
        '@typescript-eslint/member-ordering': 0,
        'no-unused-expressions': 0,
        '@typescript-eslint/prefer-for-of': 0,
        '@typescript-eslint/no-unused-expressions': 0
    }
};
