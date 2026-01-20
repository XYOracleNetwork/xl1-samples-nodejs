import { isDefined } from '@xylabs/typeof'
import type { ProviderFactoryLocator } from '@xyo-network/xl1-sdk'
import { buildJsonRpcProviderLocator, SimpleXyoSigner } from '@xyo-network/xl1-sdk'

import { getSignerAccount } from './getSignerAccount.ts'
import { getTransportFactory } from './getTransportFactory.ts'

let locator: ProviderFactoryLocator

export const getLocator = async (walletMnemonic: string, rpcUrl: string) => {
  // If existing locator, return it
  if (isDefined(locator)) return locator

  // Build a new locator
  const transportFactory = getTransportFactory(rpcUrl)
  locator = await buildJsonRpcProviderLocator({ transportFactory })

  // Register the signer with the locator
  const account = await getSignerAccount(walletMnemonic)
  locator.register(SimpleXyoSigner.factory<SimpleXyoSigner>(SimpleXyoSigner.dependencies, { account }))

  // Return the locator
  return locator
}
