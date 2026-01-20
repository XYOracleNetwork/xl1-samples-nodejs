import { isDefined } from '@xylabs/typeof'
import type { RpcSchemaMap, TransportFactory } from '@xyo-network/xl1-sdk'
import { HttpRpcTransport } from '@xyo-network/xl1-sdk'

let transportFactory: TransportFactory | undefined

// Determine the RPC endpoint to use for the chain connection

export const getTransportFactory = (rpcUrl: string) => {
  // If existing locator, return it
  if (isDefined(transportFactory)) return transportFactory

  // Build a new locator
  console.log('Using endpoint:', rpcUrl)
  transportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  return transportFactory
}
