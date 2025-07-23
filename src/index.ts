import { assertEx } from '@xylabs/assert'
import { isError } from '@xylabs/typeof'
import { HDWallet } from '@xyo-network/wallet'
import type { HashPayload } from '@xyo-network/xl1-model'
import { RpcXyoConnection } from '@xyo-network/xl1-rpc'
import { config } from 'dotenv'

import { submitTransaction } from './submitTransaction.ts'

try {
  console.log('\n**** Starting XL1 Hello World NodeJs Sample ****\n')

  // Load environment variables from .env file
  config({ quiet: true })

  // Create a HashPayload to send in the transaction
  const payload: HashPayload = {
    schema: 'network.xyo.hash',
    hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  }

  // Load the account to use for the transaction
  const walletMnemonic = assertEx(process.env.XYO_WALLET_MNEMONIC, () => 'Missing environment variable: XYO_WALLET_MNEMONIC')
  const account = await HDWallet.fromPhrase(walletMnemonic)

  console.log('Using account:', account.address)

  // Load the RPC transport using the URL from the environment variable
  const endpoint = assertEx(process.env.XYO_CHAIN_RPC_URL, () => 'Missing environment variable: XYO_CHAIN_RPC_URL')

  console.log('Using endpoint:', endpoint)

  const connection = new RpcXyoConnection({ account, endpoint })

  // Send the transaction with the payload to the network via the provider
  const txBW = await submitTransaction([payload], [], connection)

  // Confirm the transaction is added to the chain
  const onConfirm = (txBWHash: string) => {
    console.log('See your transaction on our Blockchain Explorer:', `https://explore.xyo.network/xl1/local/transaction/${txBWHash}`)
  }
  await connection.confirm(txBW, onConfirm)
} catch (ex) {
  console.error('An error occurred:', isError(ex) ? ex.message : String(ex))
  process.exitCode = 1
}
