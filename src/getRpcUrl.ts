import { config } from 'dotenv'

// Load environment variables from .env file
config({ quiet: true })

// Parse the relevant ENV VARs or use defaults
const rpcUrl = process.env.XYO_CHAIN_RPC_URL ?? 'http://localhost:8080/rpc'

/**
 * Gets the rpcUrl to use for interacting with the chain
 * @returns The rpcUrl to use for interacting with the chain
 */
export const getRpcUrl = (): string => rpcUrl
