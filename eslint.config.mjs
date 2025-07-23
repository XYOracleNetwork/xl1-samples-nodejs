// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import {
  typescriptConfig,
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  sonarConfig,
  importConfig,
} from '@xylabs/eslint-config-flat'

export default [
  { ignores: ['.yarn', '**/dist', '**/build', '**/public', '**/storybook-static', '**/.storybook', 'scripts', '**/node_modules', '.dependency-cruiser.mjs'] },
  unicornConfig,
  workspacesConfig,
  rulesConfig,
  typescriptConfig,
  sonarConfig,
  {
    ...importConfig,
    rules: {
      ...importConfig.rules,
      'import-x/no-internal-modules': ['warn', { allow: ['vitest/config', 'ethers/utils', '*/index.ts'] }],
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
  ...storybook.configs['flat/recommended'],
]
