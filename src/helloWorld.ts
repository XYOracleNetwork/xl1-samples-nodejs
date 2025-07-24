import { assertEx } from '@xylabs/assert'
import { isError } from '@xylabs/typeof'
import type { HashPayload } from '@xyo-network/xl1-model'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-protocol-sdk'
import { RpcXyoConnection } from '@xyo-network/xl1-rpc'
import { config } from 'dotenv'

import { submitTransaction } from './submitTransaction.ts'

export async function helloWorld(mnemonic?: string, endpoint = 'http://localhost:8080/rpc'): Promise<void> {
  try {
    console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')
    // console.log(`\n**** With mnemonic:\n${mnemonic} ****\n`)

    // Load environment variables from .env file
    config({ quiet: true })

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
    const rpcEndpoint = assertEx(process.env.XYO_CHAIN_RPC_URL ?? endpoint, () => 'Unable to resolve RPC endpoint from environment variable or argument')

    console.log('Using endpoint:', rpcEndpoint)

    const connection = new RpcXyoConnection({ account, endpoint: rpcEndpoint })

    // Send the transaction with the payload to the network via the provider
    const txBW = await submitTransaction([payload], [], connection)

    // Confirm the transaction is added to the chain
    const onConfirm = (txBWHash: string) => {
      console.log('To see your transaction on our Blockchain Explorer:\n')
      console.log('1. Install the XYO Layer One Wallet from https://chromewebstore.google.com/detail/xl1-wallet/fblbagcjeigmhakkfgjpdlcapcgmcfbm')
      console.log(`2. In that same browser, go to: https://explore.xyo.network/transaction/${txBWHash}`)
    }
    await connection.confirm(txBW, onConfirm)
  } catch (ex) {
    console.error('An error occurred:', isError(ex) ? ex.message : String(ex))
    process.exitCode = 1
  }
}
