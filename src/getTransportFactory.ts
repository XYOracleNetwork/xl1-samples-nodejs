import { isDefined } from '@xylabs/typeof'
import type { RpcSchemaMap, TransportFactory } from '@xyo-network/xl1-sdk'
import { HttpRpcTransport } from '@xyo-network/xl1-sdk'

let transportFactory: TransportFactory | undefined

/**
 * Retrieves a transport factory for the given RPC URL.
 * @param rpcUrl The RPC endpoint to use for interacting with the chain
 * @returns A transport factory for the given RPC URL
 */
export const getTransportFactory = (rpcUrl: string) => {
  // If existing transport factory, return it
  if (isDefined(transportFactory)) return transportFactory

  // Build a new transport factory
  console.log('Using rpcUrl:', rpcUrl)
  transportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  return transportFactory
}
