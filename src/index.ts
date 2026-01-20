import { HDWallet } from '@xyo-network/wallet'
import { config } from 'dotenv'

import { helloWorld } from './helloWorld.js'

// Load environment variables from .env file
config({ quiet: true })

// Parse the relevant ENV VARs or use defaults
const mnemonic = process.env.XYO_WALLET_MNEMONIC ?? HDWallet.generateMnemonic()
const rpcUrl = process.env.XYO_CHAIN_RPC_URL ?? 'http://localhost:8080/rpc'

await helloWorld(mnemonic, rpcUrl)
