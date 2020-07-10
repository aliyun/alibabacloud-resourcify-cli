'use strict';

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
    mocha:true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    'linebreak-style': [
      2,
      'unix'
    ],
    semi: [2, 'always'],
    strict: [2, 'global'],
    curly: 2,
    eqeqeq: 2,
    quotes: [2, 'single', {'avoidEscape': true, 'allowTemplateLiterals': true}],
  }
};
