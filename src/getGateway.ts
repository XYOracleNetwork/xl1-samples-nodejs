import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
import type {
  CreatableProviderContext,
  ProviderFactoryLocator,
  RpcSchemaMap, TransportFactory, XyoConnection,
} from '@xyo-network/xl1-sdk'
import {
  ADDRESS_INDEX, buildJsonRpcProviderLocator, buildSimpleXyoSigner, generateXyoBaseWalletFromPhrase,
  HttpRpcTransport, SimpleXyoGatewayRunner, XyoConnectionMoniker,
} from '@xyo-network/xl1-sdk'

let locator: ProviderFactoryLocator<CreatableProviderContext, string[]>

export const getGateway = async (mnemonic?: string, rpcEndpoint = 'http://localhost:8080/rpc') => {
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
  return new SimpleXyoGatewayRunner(connection, signer)
}

export const getLocator = async (rpcEndpoint = 'http://localhost:8080/rpc') => {
  if (isDefined(locator)) return locator
  // Determine the RPC endpoint to use for the chain connection
  const endpoint = process.env.XYO_CHAIN_RPC_URL ?? rpcEndpoint
  console.log('Using endpoint:', endpoint)

  const transportFactory: TransportFactory = (schemas: RpcSchemaMap) => new HttpRpcTransport(endpoint, schemas)
  locator = await buildJsonRpcProviderLocator({ transportFactory })
  return locator
}
