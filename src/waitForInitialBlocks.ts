import { delay } from '@xylabs/delay'
import { RpcXyoConnection } from '@xyo-network/xl1-rpc'

export const waitForInitialBlocks = async (): Promise<void> => {
  const connection = new RpcXyoConnection({ endpoint: 'http://localhost:8080/rpc' })

  console.log('\n Waiting for genesis block creation')
  let ready = false
  let attempts = 0
  const maxAttempts = 10
  while (!ready && attempts < maxAttempts) {
    try {
      // Check if the connection is ready
      const [block] = await connection.viewer?.currentBlock() ?? []
      // ensure that all initial blocks are created
      if (block?.block === 1) {
        ready = true
      }
    } catch {
      console.error()
    }
    if (!ready) {
      if (attempts >= maxAttempts) {
        throw new Error('XL1 did not become ready within the expected time frame.')
      }
      attempts++
      console.log(`XL1 not ready yet, retrying in 1 second... (${attempts}/10)`)
      await delay(1000)
    }
  }
}
