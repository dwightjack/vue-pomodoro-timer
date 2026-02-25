import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...ts.configs.stylistic,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
      },
    },
    plugins: {
      vue,
    },
    rules: {
      'vue/valid-define-props': 'warn',
      'vue/block-order': [
        'error',
        {
          order: ['script[setup]', 'template', 'style'],
        },
      ],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-indent': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    files: ['*.js', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-undef': 'off',
    },
  },
  { ignores: ['**/src/assets/**'] },
);
