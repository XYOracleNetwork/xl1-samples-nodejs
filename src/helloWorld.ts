import { assertEx } from '@xylabs/assert'
import { isError } from '@xylabs/typeof'
import { PayloadBuilder } from '@xyo-network/payload-builder'
import type { Payload } from '@xyo-network/payload-model'
import type { HashPayload, HydratedTransaction } from '@xyo-network/xl1-protocol'
import {
  ADDRESS_INDEX, confirmSubmittedTransaction, generateXyoBaseWalletFromPhrase,
} from '@xyo-network/xl1-protocol-sdk'
import { HttpRpcXyoConnection } from '@xyo-network/xl1-rpc'
import { config } from 'dotenv'

import { submitTransaction } from './submitTransaction.js'

// Load environment variables from .env file
config({ quiet: true })

const logger = console

export async function helloWorld(mnemonic?: string, rpcEndpoint = 'http://localhost:8080/rpc'): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

    // Load the account to use for the transaction
    const walletMnemonic = assertEx(process.env.XYO_WALLET_MNEMONIC ?? mnemonic, () => 'Unable to resolve mnemonic from environment variable or argument')
    const account = await (await generateXyoBaseWalletFromPhrase(walletMnemonic)).derivePath(ADDRESS_INDEX.XYO)
    console.log('Using account:', account.address)

    // Determine the RPC endpoint to use for the chain connection
    const endpoint = process.env.XYO_CHAIN_RPC_URL ?? rpcEndpoint
    console.log('Using endpoint:', endpoint)

    // Create a new RPC connection
    const connection = new HttpRpcXyoConnection({ account, endpoint })

    // Generate random Payloads to send in the transaction
    const { onChainPayload, offChainPayload } = await getRandomPayloads()

    // Send the transaction to the network
    const tx = await submitTransaction([onChainPayload], [offChainPayload], connection)

    // Wait for confirmation the transaction was included in the chain
    const viewer = assertEx(connection.viewer, () => 'Connection viewer is undefined')
    const confirmed = await confirmSubmittedTransaction(viewer, tx, { logger })
    logSuccess(confirmed)
  } catch (ex) {
    console.error('An error occurred:', isError(ex) ? ex.message : String(ex))
    process.exitCode = 1
  }
}

const logSuccess = (_tx: HydratedTransaction) => {
  console.log('To explore your local blockchain:\n')
  console.log('1. Install the XYO Layer One Wallet from https://chromewebstore.google.com/detail/xl1-wallet/fblbagcjeigmhakkfgjpdlcapcgmcfbm')
  console.log('2. In that same browser, go to: https://explore.xyo.network/xl1/local/')
}

const getRandomPayloads = async () => {
  // Data to store off-chain
  const offChainPayload: Payload<{ salt: string }> = {
    schema: 'network.xyo.id',
    salt: `Hello from Sample - ${new Date().toISOString()}`,
  }
  // Create a HashPayload to send in the transaction
  const onChainPayload: HashPayload = {
    schema: 'network.xyo.hash',
    hash: await PayloadBuilder.hash(offChainPayload),
  }
  return {
    offChainPayload,
    onChainPayload,
  }
}
