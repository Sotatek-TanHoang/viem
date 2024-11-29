import type { KaiaClient } from '../types/client.js'
import type { SendTransactionParameters } from '../../actions/index.js'
import { signTransaction } from './sign-transaction.js'
import { isKlaytnTxType } from '@kaiachain/js-ext-core'
import type { Chain } from '../../types/chain.js'
import type { SendTransactionRequest } from '../../actions/wallet/sendTransaction.js'
export const sendTransaction = async <
  chain extends Chain | undefined = Chain | undefined,
  chainOverride extends Chain | undefined = chain,
  const request extends SendTransactionRequest<
    chain,
    chainOverride
  > = SendTransactionRequest<chain, chainOverride>,
>(
  client: KaiaClient,
  tx: SendTransactionParameters<chain, undefined, chainOverride, request>,
): Promise<`0x${string}`> => {
  if (!isKlaytnTxType((tx as unknown as any).type)) {
    return client.sendTransaction(tx as any)
  }
  const signedTx = await signTransaction(client, tx as any)

  return (await client.request({
    method: 'kaia_sendRawTransaction',
    params: [signedTx],
  })) as `0x${string}`
}
