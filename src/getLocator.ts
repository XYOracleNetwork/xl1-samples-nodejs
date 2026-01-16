import { isDefined } from '@xylabs/typeof'
import type {
  ProviderFactoryLocator, RpcSchemaMap, TransportFactory,
} from '@xyo-network/xl1-sdk'
import { buildJsonRpcProviderLocator, HttpRpcTransport } from '@xyo-network/xl1-sdk'

let locator: ProviderFactoryLocator

export const getLocator = async (rpcEndpoint = 'http://localhost:8080/rpc') => {
  if (isDefined(locator)) return locator
  // Determine the RPC endpoint to use for the chain connection
  const endpoint = process.env.XYO_CHAIN_RPC_URL ?? rpcEndpoint
  console.log('Using endpoint:', endpoint)

  const transportFactory: TransportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(endpoint, schemas)
  locator = await buildJsonRpcProviderLocator({ transportFactory })
  return locator
}
