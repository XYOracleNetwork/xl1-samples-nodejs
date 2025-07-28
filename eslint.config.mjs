// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import {
  typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  sonarConfig,
  importConfig,
} from '@xylabs/eslint-config-flat'

export default [
  { ignores: ['.yarn', '**/dist', '**/build', 'scripts', 'node_modules', '*.cjs', '*.mjs'] },
  { files: ['**/*.ts'] },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  typescriptConfig,
  sonarConfig,
  {
    ...importConfig,
    rules: {
      ...importConfig.rules,
      'import-x/no-internal-modules': ['warn', { allow: ['*/index.ts'] }],
      'import-x/no-unresolved': ['off'],
      'import-x/no-relative-packages': ['error'],
      'import-x/no-self-import': ['error'],
      'import-x/no-useless-path-segments': ['warn'],
      'sonarjs/prefer-single-boolean-return': ['off'],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true,
        },
      ],
    },
  },
]
