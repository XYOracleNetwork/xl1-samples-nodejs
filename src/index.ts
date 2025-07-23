import { assertEx } from '@xylabs/assert'
import { HDWallet } from '@xyo-network/wallet'
import type { HashPayload } from '@xyo-network/xl1-model'
import { RpcXyoProvider } from '@xyo-network/xl1-rpc'
import { config } from 'dotenv'

import { submitTransaction } from './submitTransaction.ts'

// Load environment variables from .env file
config()

// Create a HashPayload to send in the transaction
const payload: HashPayload = {
  schema: 'network.xyo.hash',
  hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
}

// Load the account to use for the transaction
const walletMnemonic = assertEx(process.env.XYO_WALLET_MNEMONIC, () => 'Missing environment variable: XYO_WALLET_MNEMONIC')
const account = await HDWallet.fromPhrase(walletMnemonic)

// Load the RPC transport using the URL from the environment variable
const endpoint = assertEx(process.env.XYO_CHAIN_RPC_URL, () => 'Missing environment variable: XYO_CHAIN_RPC_URL')
const provider = new RpcXyoProvider({ account, endpoint })

// Send the transaction with the payload to the network via the provider
const txBW = await submitTransaction([payload], [], provider)

// Confirm the transaction is added to the chain
const onConfirm = (txBWHash: string) => {
  console.log('See your transaction on our Blockchain Explorer:', `https://beta.explore.xyo.network/xl1/sequence/transaction/${txBWHash}`)
}
await provider.confirm(txBW, onConfirm)
