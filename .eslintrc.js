module.exports = {
  extends: ['expo'],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  globals: {
    AbortController: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    Intl: 'readonly',
    google: 'readonly',
  },
  rules: {
    // Add custom rules here
  },
};
