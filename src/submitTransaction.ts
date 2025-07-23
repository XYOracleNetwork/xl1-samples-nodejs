import { assertEx } from '@xylabs/assert'
import type { Signed } from '@xyo-network/boundwitness-model'
import type { Payload } from '@xyo-network/payload-model'
import type { AllowedBlockPayload, TransactionBoundWitness } from '@xyo-network/xl1-model'
import type { XyoConnectionProvider } from '@xyo-network/xl1-protocol'

export const submitTransaction = async (
  elevatedPayloads: AllowedBlockPayload[],
  additionalPayloads: Payload[],
  provider: XyoConnectionProvider,
): Promise<Signed<TransactionBoundWitness>> => {
  console.log('\n', '🚀 Sending transaction with payloads:', elevatedPayloads, additionalPayloads, '\n')
  console.log('👤 Using Account:', provider.signer?.address(), '\n')

  const [txBW] = await provider.submitTransaction?.(
    elevatedPayloads,
    additionalPayloads,
  ) ?? []

  const resolvedTxBW = assertEx(txBW, () => 'Transaction Bound Witness is undefined')

  return resolvedTxBW
}
