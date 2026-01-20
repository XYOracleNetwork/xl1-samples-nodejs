import type { RpcSchemaMap, XyoConnection } from '@xyo-network/xl1-sdk'
import {
  ADDRESS_INDEX, buildJsonRpcProviderLocator, generateXyoBaseWalletFromPhrase, HttpRpcTransport, SimpleXyoGatewayRunner, SimpleXyoSigner, XyoConnectionMoniker,
  XyoSignerMoniker,
} from '@xyo-network/xl1-sdk'

export const getGateway = async (walletMnemonic: string, rpcUrl: string) => {
  // Get the provider locator
  const transportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(rpcUrl, schemas)
  const locator = await buildJsonRpcProviderLocator({ transportFactory })

  // Create new signer account
  const wallet = await generateXyoBaseWalletFromPhrase(walletMnemonic)
  const account = await wallet.derivePath(ADDRESS_INDEX.XYO)

  // Register the signer with the locator
  locator.register(SimpleXyoSigner.factory<SimpleXyoSigner>(SimpleXyoSigner.dependencies, { account }))

  // Use locator to get connection and signer
  const connection = await locator.getInstance<XyoConnection>(XyoConnectionMoniker)
  const signer = await locator.getInstance<SimpleXyoSigner>(XyoSignerMoniker)

  // Create gateway from connection and signer
  return new SimpleXyoGatewayRunner(connection, signer)
}
