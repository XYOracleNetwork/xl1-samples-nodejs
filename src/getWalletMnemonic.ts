import { HDWallet } from '@xyo-network/wallet'
import { config } from 'dotenv'

// Load environment variables from .env file
config({ quiet: true })

// Parse the relevant ENV VARs or use defaults
const mnemonic = process.env.XYO_WALLET_MNEMONIC ?? HDWallet.generateMnemonic()

/**
 * Gets the mnemonic to use for the signer
 * @returns The mnemonic to use for the signer
 */
export const getWalletMnemonic = (): string => mnemonic
