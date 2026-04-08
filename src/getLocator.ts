import { isDefined } from '@xylabs/typeof'
import type { ProviderFactoryLocator } from '@xyo-network/xl1-sdk'
import {
  buildJsonRpcProviderLocator, SimpleXyoGatewayRunner, SimpleXyoSigner,
} from '@xyo-network/xl1-sdk'

import { getSignerAccount } from './getSignerAccount.ts'
import { getTransportFactory } from './getTransportFactory.ts'

let locator: ProviderFactoryLocator

export const getLocator = async () => {
  // If existing locator, return it
  if (isDefined(locator)) return locator

  // Build a new locator
  const transportFactory = getTransportFactory()
  locator = await buildJsonRpcProviderLocator({ transportFactory })

  // Register the signer with the locator
  const account = await getSignerAccount()
  const signer = SimpleXyoSigner.factory<SimpleXyoSigner>(SimpleXyoSigner.dependencies, { account })
  locator.register(signer)
  locator.register(SimpleXyoGatewayRunner.factory<SimpleXyoGatewayRunner>(SimpleXyoGatewayRunner.dependencies, {}))

  // Return the locator
  return locator
}
