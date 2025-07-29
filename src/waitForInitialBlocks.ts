import { delay } from '@xylabs/delay'
import { HttpRpcXyoConnection } from '@xyo-network/xl1-rpc'

export const waitForInitialBlocks = async (): Promise<void> => {
  const connection = new HttpRpcXyoConnection({ endpoint: 'http://localhost:8080/rpc' })

  console.log('\n⏳ Waiting for genesis block creation...')
  const maxAttempts = 10
  let attempts = 0

  while (attempts < maxAttempts) {
    attempts++
    try {
      const viewer = connection.viewer

      if (!viewer || typeof viewer.currentBlock !== 'function') {
        throw new Error('Viewer or currentBlock() is not available')
      }

      const blocks = await viewer.currentBlock()
      const [block] = blocks ?? []

      if (block?.block === 1) {
        return // Success
      }
    } catch {}

    console.log(`🔁 XL1 not ready yet, retrying in 1 second... (${attempts}/${maxAttempts})`)
    await delay(1000)
  }
  throw new Error('XL1 did not start in time, please check the logs for errors')
}
