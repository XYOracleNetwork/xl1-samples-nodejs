import { isDefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-sdk'

import { getWalletMnemonic } from './getWalletMnemonic.ts'

let signerAccount: AccountInstance | undefined

/**
 * Retrieves the signer account derived from the provided mnemonic.
 * @returns The derived account
 */
export const getSignerAccount = async () => {
  // If existing signer account, return it
  if (isDefined (signerAccount)) return signerAccount

  // Create new signer account
  const walletMnemonic = getWalletMnemonic()
  const wallet = await generateXyoBaseWalletFromPhrase(walletMnemonic)
  signerAccount = await wallet.derivePath(ADDRESS_INDEX.XYO)
  console.log('Using signer account:', signerAccount.address)
  return signerAccount
}
