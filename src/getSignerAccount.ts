import { assertEx } from '@xylabs/assert'
import { ADDRESS_INDEX, generateXyoBaseWalletFromPhrase } from '@xyo-network/xl1-sdk'

/**
 * Retrieves the signer account derived from the provided mnemonic or environment variable.
 * @param walletMnemonic The mnemonic to use for deriving the account. If not provided, it
 * will be read from the XYO_WALLET_MNEMONIC environment variable.
 * @returns The derived account
 */
export const getSignerAccount = async (walletMnemonic?: string) => {
  // Determine the account to use for the transaction
  const mnemonic = assertEx(
    walletMnemonic ?? process.env.XYO_WALLET_MNEMONIC,
    () => 'Wallet mnemonic must be supplied from either XYO_WALLET_MNEMONIC ENV VAR or argument',
  )
  const wallet = await generateXyoBaseWalletFromPhrase(mnemonic)
  const account = await wallet.derivePath(ADDRESS_INDEX.XYO)
  console.log('Using account:', account.address)

  return account
}
