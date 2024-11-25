import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import type { PrivateKeyAccount } from '../../accounts/types.js'

export function kaiaAccount(
  address: `0x${string}`,
  privateKey: `0x${string}`,
): PrivateKeyAccount {
  const defaultAccount = privateKeyToAccount(privateKey)
  defaultAccount.address = address

  return defaultAccount
}
