import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-plugin-prettier/recommended';

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
  prettier,
);
