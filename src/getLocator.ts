import { isDefined } from '@xylabs/typeof'
import type {
  ProviderFactoryLocator, RpcSchemaMap, TransportFactory,
} from '@xyo-network/xl1-sdk'
import { buildJsonRpcProviderLocator, HttpRpcTransport } from '@xyo-network/xl1-sdk'

let locator: ProviderFactoryLocator

// Determine the RPC endpoint to use for the chain connection
const DefaultRpcEndpoint = process.env.XYO_CHAIN_RPC_URL ?? 'http://localhost:8080/rpc'

export const getLocator = async (rpcUrl = DefaultRpcEndpoint) => {
  // If existing locator, return it
  if (isDefined(locator)) return locator

  // Build a new locator
  console.log('Using endpoint:', rpcUrl)
  const transportFactory: TransportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  locator = await buildJsonRpcProviderLocator({ transportFactory })
  return locator
}
