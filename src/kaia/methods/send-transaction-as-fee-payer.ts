import type { KaiaClient } from '../types/client.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { signTransactionAsFeePayer } from './sign-transaction-as-fee-payer.js'
export const sendTransactionAsFeePayer = async (
  client: KaiaClient,
  tx: KaiaTransactionRequest | string,
): Promise<`0x${string}`> => {
  const signedTx = await signTransactionAsFeePayer(client, tx)

  return (await client.request({
    method: 'klay_sendRawTransaction',
    params: [signedTx],
  })) as `0x${string}`
}
