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
        'spaced-comment': 1,
        'max-params': [0, 7],
        'no-return-assign': 1,
        'no-param-reassign': 1,
        'array-callback-return': 1,
        'no-implicit-coercion': 1,
        '@typescript-eslint/explicit-member-accessibility': 0,
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-assertions': 1,
        '@typescript-eslint/no-empty-interface': 1,
        '@typescript-eslint/no-require-imports': 1
    }
};
