import { assertEx } from '@xylabs/assert'
import { isDefined } from '@xylabs/typeof'
import type { AccountInstance } from '@xyo-network/account-model'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-sdk'

let signerAccount: AccountInstance | undefined

/**
 * Retrieves the signer account derived from the provided mnemonic or environment variable.
 * @param walletMnemonic The mnemonic to use for deriving the account. If not provided, it
 * will be read from the XYO_WALLET_MNEMONIC environment variable.
 * @returns The derived account
 */
export const getSignerAccount = async (walletMnemonic?: string) => {
  // If existing signer account, return it
  if (isDefined (signerAccount)) return signerAccount

  // Determine the mnemonic for the wallet to use for transactions
  const mnemonic = assertEx(
    walletMnemonic ?? process.env.XYO_WALLET_MNEMONIC,
    () => 'Wallet mnemonic must be supplied from either XYO_WALLET_MNEMONIC ENV VAR or argument',
  )
  const wallet = await generateXyoBaseWalletFromPhrase(mnemonic)
  signerAccount = await wallet.derivePath(ADDRESS_INDEX.XYO)
  console.log('Using signer account:', signerAccount.address)
  return signerAccount
}
