import { isError } from '@xylabs/typeof'
import type { SignedHydratedTransaction } from '@xyo-network/xl1-protocol'
import { config } from 'dotenv'

import { getGateway } from './getGateway.ts'
import { getRandomTransactionData } from './getRandomTransactionData.ts'

// Load environment variables from .env file
config({ quiet: true })

// Log to console
const logger = console

/**
 * Runs a simple "Hello World" transaction on the XL1 network.
 * @param mnemonic The mnemonic to use for signing transactions
 * @param rpcUrl The RPC URL to connect to the XL1 network
 */
export async function helloWorld(mnemonic: string, rpcUrl: string): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

    // Generate random data to send in the transaction
    const { onChainData, offChainData } = await getRandomTransactionData()

    // Get gateway to interact with the chain
    const gateway = await getGateway(mnemonic, rpcUrl)

    // Send the transaction to the network
    const [txHash] = await gateway.addPayloadsToChain(onChainData, offChainData)

    // Wait for confirmation the transaction was included in the chain
    const confirmed = await gateway.confirmSubmittedTransaction(txHash, { logger })
    logSuccess(confirmed)
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
