import { assertEx } from '@xylabs/assert'
import { isError } from '@xylabs/typeof'
import type { HashPayload } from '@xyo-network/xl1-model'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-protocol-sdk'
import { confirmTransaction, RpcXyoConnection } from '@xyo-network/xl1-rpc'
import { config } from 'dotenv'

import { submitTransaction } from './submitTransaction.ts'

// Load environment variables from .env file
config({ quiet: true })

export async function helloWorld(mnemonic?: string, endpoint = 'http://localhost:8080/rpc'): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

    // Create a HashPayload to send in the transaction
    const payload: HashPayload = {
      schema: 'network.xyo.hash',
      hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    }

    // Load the account to use for the transaction
    const walletMnemonic = assertEx(process.env.XYO_WALLET_MNEMONIC ?? mnemonic, () => 'Unable to resolve mnemonic from environment variable or argument')
    const account = await (await generateXyoBaseWalletFromPhrase(walletMnemonic)).derivePath(ADDRESS_INDEX.XYO)
    console.log('Using account:', account.address)

    // Load the RPC transport using the URL from the environment variable
    const rpcEndpoint = process.env.XYO_CHAIN_RPC_URL ?? endpoint
    console.log('Using endpoint:', rpcEndpoint)

    // Create a new RPC connection to the XL1 API Node
    const connection = new RpcXyoConnection({ account, endpoint: rpcEndpoint })

    // Send the transaction with the payload to the network via the Provider
    const txBW = await submitTransaction([payload], [], connection)

    // Confirm the transaction is added to the chain
    confirmTransaction(connection, txBW, logSuccess)
  } catch (ex) {
    console.error('An error occurred:', isError(ex) ? ex.message : String(ex))
    process.exitCode = 1
  }
}

const logSuccess = (_hash?: string) => {
  console.log('To explore your local blockchain:\n')
  console.log('1. Install the XYO Layer One Wallet from https://chromewebstore.google.com/detail/xl1-wallet/fblbagcjeigmhakkfgjpdlcapcgmcfbm')
  console.log('2. In that same browser, go to: https://explore.xyo.network/xl1/local/')
}
