import { isDefined } from '@xylabs/typeof'
import type { XyoConnection } from '@xyo-network/xl1-sdk'
import {
  buildSimpleXyoSigner, SimpleXyoGatewayRunner, XyoConnectionMoniker,
} from '@xyo-network/xl1-sdk'

import { getLocator } from './getLocator.ts'
import { getSignerAccount } from './getSignerAccount.ts'

let gateway: SimpleXyoGatewayRunner | undefined

export const getGateway = async (mnemonic?: string, rpcEndpoint = 'http://localhost:8080/rpc') => {
  // If existing gateway, return it
  if (isDefined(gateway)) return gateway

  const account = await getSignerAccount(mnemonic)
  console.log('Using account:', account.address)

  // Build the signer
  const signer = await buildSimpleXyoSigner({ account })

  // Get the provider locator
  const locator = await getLocator(rpcEndpoint)

  // Get the XyoConnection instance
  const connection = await locator.getInstance<XyoConnection>(XyoConnectionMoniker)

  // Return a new SimpleXyoGatewayRunner instance
  gateway = new SimpleXyoGatewayRunner(connection, signer)
  return gateway
}
