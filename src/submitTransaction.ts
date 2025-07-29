import { assertEx } from '@xylabs/assert'
import type { Payload } from '@xyo-network/payload-model'
import type {
  AllowedBlockPayload, HydratedTransaction, XyoConnectionProvider,
} from '@xyo-network/xl1-protocol'

export const submitTransaction = async (
  onChainPayloads: AllowedBlockPayload[],
  offChainPayloads: Payload[],
  provider: XyoConnectionProvider,
): Promise<HydratedTransaction> => {
  console.log('\n', '🚀 Sending transaction with payloads:', onChainPayloads, offChainPayloads, '\n')
  const tx = await provider.submitTransaction?.(onChainPayloads, offChainPayloads)
  return assertEx(tx, () => 'Transaction submission failed')
}
