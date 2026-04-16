import { config } from 'dotenv'

// Load environment variables from .env file
config({ quiet: true })

// Default to the XL1 CLI's built-in genesis-reward mnemonic so the signer
// matches the address that receives the genesis reward on a fresh local chain.
const INSECURE_GENESIS_REWARD_MNEMONIC = 'test test test test test test test test test test test junk'

// Parse the relevant ENV VARs or use defaults
const mnemonic = process.env.XYO_WALLET_MNEMONIC ?? INSECURE_GENESIS_REWARD_MNEMONIC

/**
 * Gets the mnemonic to use for the wallet
 * @returns The mnemonic to use for the wallet
 */
export const getWalletMnemonic = (): string => mnemonic
