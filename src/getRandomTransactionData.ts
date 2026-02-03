import { PayloadBuilder } from '@xyo-network/payload-builder'
import { asSchema, type Payload } from '@xyo-network/payload-model'
import { type HashPayload, HashSchema } from '@xyo-network/xl1-sdk'

/**
 * Generates random data for a transaction.
 * @returns An object containing off-chain and on-chain data for the transaction.
 */
export const getRandomTransactionData = async () => {
  // Data to store off-chain
  const salt = `Hello from Sample - ${new Date().toISOString()}`
  const idPayload: Payload<{ salt: string }> = { schema: asSchema('network.xyo.id', true), salt }

  // Data to store on-chain (can reference the off-chain data)
  const hash = await PayloadBuilder.hash(idPayload)
  const hashPayload: HashPayload = { schema: HashSchema, hash }

  return {
    offChainData: [idPayload],
    onChainData: [hashPayload],
  }
}
