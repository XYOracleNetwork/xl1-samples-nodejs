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
  {
    ...unicornConfig,
    rules: {
      ...unicornConfig.rules,
      'unicorn/text-encoding-identifier-case': ['off'],
    },
  },
  workspacesConfig,
  rulesConfig,
  ...typescriptConfig,
  sonarConfig,
  ...importConfig,
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
