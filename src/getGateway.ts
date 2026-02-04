import { isDefined } from '@xylabs/typeof'
import { SimpleXyoGatewayRunner } from '@xyo-network/xl1-sdk'

import { getLocator } from './getLocator.ts'

let gateway: SimpleXyoGatewayRunner | undefined

export const getGateway = async () => {
  // If existing gateway, return it
  if (isDefined(gateway)) return gateway

  // Otherwise, build a new gateway

  // Get locator
  const locator = await getLocator()

  // Create gateway from connection and signer
  gateway = await locator.getInstance<SimpleXyoGatewayRunner>(SimpleXyoGatewayRunner.defaultMoniker)
  return gateway
}
