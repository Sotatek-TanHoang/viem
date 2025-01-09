import type { Client } from '../../clients/createClient.js'
import type { WalletActions } from '../../clients/decorators/wallet.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { RpcSchema } from '../../types/eip1193.js'
import { serializeTransactionForFeePayerKaia } from '../serializer.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'
import { getTransactionRequestForSigning } from '../utils.js'

export const signTransactionAsFeePayer = async <
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
  if (client?.account?.signTransaction) {
    return client.account.signTransaction(txObj, {
      serializer: serializeTransactionForFeePayerKaia(client.account.address),
    })
  }
  return (await client.request({
    method: 'klay_signTransactionAsFeePayer',
    params: [txObj],
  } as any)) as string
}
