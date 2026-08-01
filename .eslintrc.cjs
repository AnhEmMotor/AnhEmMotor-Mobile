module.exports = {
  root: true,
  extends: ['expo'],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-undef': 'off',
    'no-var': 'off',
    'no-unused-expressions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'import/namespace': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
