import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { HashPayload } from '@xyo-network/xl1-sdk'

/**
 * Generates random data for a transaction.
 * @returns An object containing off-chain and on-chain data for the transaction.
 */
export const getRandomTransactionData = async () => {
  // Data to store off-chain
  const salt = `Hello from Sample - ${new Date().toISOString()}`
  const idPayload: Payload<{ salt: string }> = { schema: 'network.xyo.id', salt }

  // Data to store on-chain (can reference the off-chain data)
  const hash = await PayloadBuilder.hash(idPayload)
  const hashPayload: HashPayload = { schema: 'network.xyo.hash', hash }

  return {
    offChainData: [idPayload],
    onChainData: [hashPayload],
  }
}
