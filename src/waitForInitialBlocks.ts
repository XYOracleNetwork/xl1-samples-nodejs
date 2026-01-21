import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { isDefined } from '@xylabs/typeof'
import type { XyoViewer } from '@xyo-network/xl1-sdk'

export const waitForInitialBlocks = async (viewer: XyoViewer, maxAttempts = 10): Promise<void> => {
  assertEx(viewer, () => 'Connection viewer is undefined')
  console.log('\n⏳ Waiting for genesis block creation...')
  let attempts = 0
  while (attempts < maxAttempts) {
    attempts++
    try {
      const [block] = (await viewer.currentBlock()) ?? []
      if (isDefined(block?.block) && block.block > 0) {
        return // Success
      }
    } catch {}
    console.log(`🔁 XL1 not ready yet, retrying in 1 second... (${attempts}/${maxAttempts})`)
    await delay(1000)
  }
  throw new Error('XL1 did not start in time, please check the logs for errors')
}
