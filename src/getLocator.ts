import { isDefined } from '@xylabs/typeof'
import type {
  CreatableProviderContextType, ProviderFactoryLocatorInstance, RemoteConfig,
} from '@xyo-network/xl1-sdk'
import {
  basicRemoteRunnerLocator,
  SimpleXyoSigner,
} from '@xyo-network/xl1-sdk'

import { getSignerAccount } from './getSignerAccount.ts'

let locator: ProviderFactoryLocatorInstance<CreatableProviderContextType>

export const getLocator = async () => {
  // If existing locator, return it
  if (isDefined(locator)) return locator

  // Register the signer with the locator
  const account = await getSignerAccount()
  const signerFactory = SimpleXyoSigner.factory<SimpleXyoSigner>(SimpleXyoSigner.dependencies, { account })

  // Build a new locator
  const remoteConfig: RemoteConfig = {
    rpc: {
      protocol: 'http',
      url: 'http://localhost:8080/rpc',
    },
  }

  locator = await basicRemoteRunnerLocator('node-js-sample', remoteConfig, undefined as never, undefined, { signerFactory })

  // Return the locator
  return locator
}
