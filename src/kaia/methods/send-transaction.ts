import { isKlaytnTxType } from '@kaiachain/js-ext-core'
import type { SendTransactionParameters } from '../../actions/index.js'
import type { SendTransactionRequest } from '../../actions/wallet/sendTransaction.js'
import type { Chain } from '../../types/chain.js'
import type { KaiaClient } from '../types/client.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { signTransaction } from './sign-transaction.js'
export const sendTransaction = async (
  client: KaiaClient,
  tx: SendTransactionParameters<
    Chain,
    undefined,
    Chain,
    SendTransactionRequest<Chain, Chain>
  >,
): Promise<`0x${string}`> => {
  if (!isKlaytnTxType((tx as unknown as KaiaTransactionRequest).type)) {
    return client.sendTransaction(tx)
  }
  const signedTx = await signTransaction(
    client,
    tx as unknown as KaiaTransactionRequest,
  )

  return (await client.request({
    method: 'kaia_sendRawTransaction',
    params: [signedTx],
  })) as `0x${string}`
}
