import type { XyTsupConfig } from '@xylabs/ts-scripts-yarn3'
const config: XyTsupConfig = {
  compile: {
    entryMode: 'custom',
    browser: {},
    node: { src: { entry: ['./index.ts', './helloWorldRunner.ts'] } },
    neutral: {},
  },
}

export default config
