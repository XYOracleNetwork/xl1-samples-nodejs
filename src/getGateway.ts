import { isDefined } from '@xylabs/typeof'
import type { SimpleXyoSigner, XyoConnection } from '@xyo-network/xl1-sdk'
import {
  SimpleXyoGatewayRunner, XyoConnectionMoniker, XyoSignerMoniker,
} from '@xyo-network/xl1-sdk'

import { getLocator } from './getLocator.ts'

let gateway: SimpleXyoGatewayRunner | undefined

export const getGateway = async (walletMnemonic: string, rpcUrl: string) => {
  // If existing gateway, return it
  if (isDefined(gateway)) return gateway

  // Get the provider locator
  const locator = await getLocator(walletMnemonic, rpcUrl)

  // Use locator to get connection and signer
  const connection = await locator.getInstance<XyoConnection>(XyoConnectionMoniker)
  const signer = await locator.getInstance<SimpleXyoSigner>(XyoSignerMoniker)

  // Create gateway from connection and signer
  gateway = new SimpleXyoGatewayRunner(connection, signer)
  return gateway
}
