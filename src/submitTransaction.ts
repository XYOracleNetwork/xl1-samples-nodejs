import { assertEx } from '@xylabs/assert'
import type { Payload } from '@xyo-network/payload-model'
import type {
  AllowedBlockPayload, TransactionBoundWitness, XyoConnectionProvider,
} from '@xyo-network/xl1-protocol'

export const submitTransaction = async (
  onChainPayloads: AllowedBlockPayload[],
  offChainPayloads: Payload[],
  provider: XyoConnectionProvider,
): Promise<TransactionBoundWitness> => {
  console.log('\n', '🚀 Sending transaction with payloads:', onChainPayloads, offChainPayloads, '\n')

  const [txBW] = await provider.submitTransaction?.(
    onChainPayloads,
    offChainPayloads,
  ) ?? []

  const resolvedTxBW = assertEx(txBW, () => 'Transaction Bound Witness is undefined')
  return resolvedTxBW
}
