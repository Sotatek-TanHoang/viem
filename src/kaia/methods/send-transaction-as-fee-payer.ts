import type { KaiaClient } from '../types/client.js'
import { signTransactionAsFeePayer } from './sign-transaction-as-fee-payer.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
export const sendTransactionAsFeePayer = async (
  client: KaiaClient,
  tx: KaiaTransactionRequest | string,
): Promise<`0x${string}`> => {
  const signedTx = await signTransactionAsFeePayer(client, tx)

  return (await client.request({
    method: 'kaia_sendRawTransaction',
    params: [signedTx],
  })) as `0x${string}`
}
