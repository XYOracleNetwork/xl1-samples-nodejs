import { config } from 'dotenv'

// Load environment variables from .env file
config({ quiet: true })

/**
 * Gets the rpcUrl to use for interacting with the chain
 * @returns The rpcUrl to use for interacting with the chain
 */
export const getRpcUrl = (): string => process.env.XYO_CHAIN_RPC_URL ?? 'http://localhost:8080/rpc'
