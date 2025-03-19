import {
  getKaikasTxType,
  getRpcTxObject,
  isKlaytnTxType,
} from '@kaiachain/js-ext-core'
import type { Client } from '../../clients/createClient.js'
import type { WalletActions } from '../../clients/decorators/wallet.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { RpcSchema } from '../../types/eip1193.js'
import { serializeTransactionKaia } from '../serializer.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { getTransactionRequestForSigning } from '../utils.js'

export const signTransaction = async <
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
  extended extends WalletActions | undefined = WalletActions | undefined,
>(
  client: Client<transport, chain, account, rpcSchema, extended>,
  senderTxHashRLP: string | KaiaTransactionRequest,
): Promise<string> => {
  const txObj = await getTransactionRequestForSigning(client, senderTxHashRLP)

  // is local account
  if (client?.account?.signTransaction) {
    return client.account.signTransaction(txObj, {
      serializer: serializeTransactionKaia,
    })
  }
  // kaia tx type
  if (isKlaytnTxType(txObj.type)) {
    return client.request(
      {
        method: 'klay_signTransaction',
        params: [
          { ...getRpcTxObject(txObj), type: getKaikasTxType(txObj.type) },
        ],
      } as any,
      { retryCount: 0 },
    )
  }
  // legacy tx
  return client.request(
    {
      method: 'eth_signTransaction',
      params: [txObj],
    } as any,
    {
      retryCount: 0,
    },
  )
}
