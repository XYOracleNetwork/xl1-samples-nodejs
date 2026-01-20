import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
import type { XyoConnection } from '@xyo-network/xl1-sdk'
import {
  ADDRESS_INDEX,
  buildSimpleXyoSigner, generateXyoBaseWalletFromPhrase,
  SimpleXyoGatewayRunner, XyoConnectionMoniker,
} from '@xyo-network/xl1-sdk'

import { getLocator } from './getLocator.ts'

let gateway: SimpleXyoGatewayRunner | undefined

export const getGateway = async (mnemonic?: string, rpcEndpoint = 'http://localhost:8080/rpc') => {
  if (isDefined(gateway)) return gateway

  // Load the account to use for the transaction
  const walletMnemonic = assertEx(process.env.XYO_WALLET_MNEMONIC ?? mnemonic, () => 'Unable to resolve mnemonic from environment variable or argument')
  const account = await (await generateXyoBaseWalletFromPhrase(walletMnemonic)).derivePath(ADDRESS_INDEX.XYO)
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
