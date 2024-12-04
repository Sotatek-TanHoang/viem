import { privateKeyToAccount } from "../../accounts/privateKeyToAccount.js";
import type { PrivateKeyAccount } from "../../accounts/types.js";

export function kaiaAccount(
  address: `0x${string}`,
  privateKey: `0x${string}`
): PrivateKeyAccount {
  const defaultAccount = privateKeyToAccount(privateKey);
  // in role-based, multi-sig account, the from address and the signer address can be different.
  defaultAccount.address = address;

  return defaultAccount;
}
