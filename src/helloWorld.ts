import { isError } from '@xylabs/typeof'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { HashPayload, SignedHydratedTransaction } from '@xyo-network/xl1-protocol'
import { config } from 'dotenv'

import { getGateway } from './getGateway.ts'

// Load environment variables from .env file
config({ quiet: true })

const logger = console

export async function helloWorld(mnemonic: string, rpcUrl: string): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

    // Generate random data to send in the transaction
    const { onChainData, offChainData } = await getRandomTransactionData()

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

/**
 * Generates random data for a transaction.
 * @returns An object containing off-chain and on-chain data for the transaction.
 */
const getRandomTransactionData = async () => {
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
