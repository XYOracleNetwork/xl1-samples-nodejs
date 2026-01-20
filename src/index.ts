import { HDWallet } from '@xyo-network/wallet'

import { helloWorld } from './helloWorld.js'

const mnemonic = process.env.XYO_WALLET_MNEMONIC ?? HDWallet.generateMnemonic()
const rpcUrl = process.env.XYO_CHAIN_RPC_URL ?? 'http://localhost:8080/rpc'

await helloWorld(mnemonic, rpcUrl)
