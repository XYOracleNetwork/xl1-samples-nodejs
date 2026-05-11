import type { Address } from '@xylabs/sdk-js'
import { assertEx } from '@xylabs/sdk-js'
import type { AttoXL1, SimpleXyoGatewayRunner } from '@xyo-network/xl1-sdk'

export interface BalanceSnapshot {
  destination: AttoXL1
  source: AttoXL1
}

/**
 * Captures the source and destination balances at the current chain head.
 * @param gateway The gateway used to access the chain viewer.
 * @param source The address paying the transaction fee.
 * @param destination The address that receives the fee (block producer / fee recipient).
 * @returns A snapshot containing both balances.
 */
export const captureBalances = async (
  gateway: SimpleXyoGatewayRunner,
  source: Address,
  destination: Address,
): Promise<BalanceSnapshot> => {
  const viewer = assertEx(gateway.connection.viewer, () => 'No viewer available on gateway connection')
  const [src, dst] = await Promise.all([
    viewer.accountBalance(source),
    viewer.accountBalance(destination),
  ])
  return { source: src, destination: dst }
}

/**
 * Logs the source and destination balance deltas and prints whether they reflect a transfer.
 * @param source The fee-payer address.
 * @param destination The fee-recipient address.
 * @param before Snapshot captured before the transaction was submitted.
 * @param after Snapshot captured after the transaction was confirmed.
 */
export const verifyTransferBalances = (
  source: Address,
  destination: Address,
  before: BalanceSnapshot,
  after: BalanceSnapshot,
): void => {
  const sourceDelta = after.source - before.source
  const destinationDelta = after.destination - before.destination

  console.log('\n**** Balance verification ****')
  console.log(`Source      (${source}): ${before.source} → ${after.source}  (Δ ${sourceDelta})`)
  console.log(`Destination (${destination}): ${before.destination} → ${after.destination}  (Δ ${destinationDelta})`)

  if (source === destination) {
    console.log('Note: source and destination are the same address (single-node localhost: signer == block producer).')
  }

  if (sourceDelta === 0n && destinationDelta === 0n) {
    console.log('⚠️  No balance change detected. Balances update only when a Transfer payload (network.xyo.transfer) is included in the block.')
  } else {
    console.log('✓ Balance changes reflect on-chain Transfer activity for this transaction.')
  }
}
