import {
  getKaikasTxType,
  getRpcTxObject,
  isKlaytnTxType,
} from '@kaiachain/js-ext-core'
import type { SendTransactionParameters } from '../../actions/index.js'
import type { SendTransactionRequest } from '../../actions/wallet/sendTransaction.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { parseAccount } from '../../utils/index.js'
import type { KaiaClient } from '../types/client.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { getValidRawRpcObj } from '../utils.js'
import { signTransaction } from './sign-transaction.js'
// import { getValidRawRpcObj } from "../utils.js";
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
  if (!tx.account && !client.account) {
    throw new Error('Parameters for account missing!')
  }
  const thisAccount = parseAccount(
    (tx.account ?? client.account) as unknown as `0x${string}` | Account,
  )
  // json-rpc account
  if (thisAccount.type === 'json-rpc') {
    return (await client.request(
      {
        method: 'klay_sendTransaction',
        params: [
          {
            ...getRpcTxObject(
              getValidRawRpcObj(tx as unknown as KaiaTransactionRequest),
            ),
            type: getKaikasTxType(tx.type),
          },
        ],
      } as any,
      { retryCount: 0 },
    )) as `0x${string}`
  }
  // local account
  const signedTx = await signTransaction(
    client,
    tx as unknown as KaiaTransactionRequest,
  )

  return (await client.request({
    method: 'klay_sendRawTransaction',
    params: [signedTx],
  })) as `0x${string}`
}
