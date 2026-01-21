import { isDefined } from '@xylabs/typeof'
import type { RpcSchemaMap, TransportFactory } from '@xyo-network/xl1-sdk'
import { HttpRpcTransport } from '@xyo-network/xl1-sdk'

import { getRpcUrl } from './getRpcUrl.ts'

let transportFactory: TransportFactory | undefined

/**
 * Retrieves a transport factory for the given RPC URL.
 * @returns A transport factory for the given RPC URL
 */
export const getTransportFactory = () => {
  // If existing transport factory, return it
  if (isDefined(transportFactory)) return transportFactory

  // Build a new transport factory
  const rpcUrl = getRpcUrl()
  console.log('Using rpcUrl:', rpcUrl)
  transportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  return transportFactory
}
