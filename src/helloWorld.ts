import { isError } from '@xylabs/typeof'
import type { SignedHydratedTransaction } from '@xyo-network/xl1-sdk'

import { getGateway } from './getGateway.ts'
import { getRandomTransactionData } from './getRandomTransactionData.ts'
import { getSignerAccount } from './getSignerAccount.ts'
import { captureBalances, verifyTransferBalances } from './verifyTransferBalances.ts'

// Log to console
const logger = console

/**
 * Runs a simple "Hello World" transaction on the XL1 network.
 */
export async function helloWorld(): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

    // Generate random data to send in the transaction
    const { onChainData, offChainData } = await getRandomTransactionData()

    // Get gateway to interact with the chain
    const gateway = await getGateway()

    // Determine source (fee payer) and destination (fee recipient).
    // In this single-node localhost sample the signer is also the block producer,
    // so source == destination. A multi-node deployment would use the producer's address here.
    const sourceAddress = (await getSignerAccount()).address
    const destinationAddress = sourceAddress

    // Capture balances before the transaction
    const before = await captureBalances(gateway, sourceAddress, destinationAddress)

    // Send the transaction to the network
    const [txHash] = await gateway.addPayloadsToChain(onChainData, offChainData)

    // Wait for confirmation the transaction was included in the chain
    const confirmed = await gateway.confirmSubmittedTransaction(txHash, { logger, attempts: 60 })
    logSuccess(confirmed)

    // Capture balances after the transaction and verify they reflect the transfer
    const after = await captureBalances(gateway, sourceAddress, destinationAddress)
    verifyTransferBalances(sourceAddress, destinationAddress, before, after)
  } catch (ex) {
    console.error('An error occurred:', isError(ex) ? ex.message : String(ex))
    process.exitCode = 1
  }
}

const logSuccess = (_tx: SignedHydratedTransaction) => {
  console.log('To explore your local blockchain:\n')
  console.log('1. Install the XYO Layer One Wallet from https://chromewebstore.google.com/detail/xl1-wallet/fblbagcjeigmhakkfgjpdlcapcgmcfbm')
  console.log('2. In that same browser, go to: https://explore.xyo.network/xl1/local/')
}
