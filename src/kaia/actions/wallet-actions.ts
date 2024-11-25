import type { Address } from 'abitype'
import type {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
} from '../../actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { WalletActions } from '../../clients/decorators/wallet.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { KaiaChain } from '../formatter.js'
import { prepareTransactionRequest } from '../methods/prepareTransactionRequest.js'
import { signTransactionAsFeePayer } from '../methods/sign-transaction-as-fee-payer.js'
import { signTransaction } from '../methods/sign-transaction.js'
import type { CustomRpcSchema } from '../rpc-schema.js'
import type { KaiaClient } from '../types/client.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'

export type KaiaWalletAction<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = {
  signTransactionAsFeePayer: (
    parameters: string | KaiaTransactionRequest,
  ) => Promise<string>
  signTransaction: (
    parameters: string | KaiaTransactionRequest,
  ) => Promise<string>
  // arccording to `viem/clients/createClient.ts` prepareTransactionRequest is protected and we must copy its function params and returned types.
  prepareTransactionRequest: <
    chainOverride extends Chain | undefined = chain,
    accountOverride extends Account | Address | undefined = account,
  >(
    args: PrepareTransactionRequestParameters<
      chain,
      account,
      chainOverride,
      accountOverride
    >,
  ) => Promise<
    PrepareTransactionRequestReturnType<
      chain,
      account,
      chainOverride,
      accountOverride
    >
  >
}

export function kaiaWalletAction() {
  return <
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain,
    account extends Account | undefined = Account | undefined,
    rpcSchema extends CustomRpcSchema | undefined = undefined,
    extended extends WalletActions | undefined = WalletActions | undefined,
  >(
    client: Client<transport, chain, account, rpcSchema, extended>,
  ): KaiaWalletAction<chain, account> => {
    return {
      signTransactionAsFeePayer: (senderSignedTransaction) =>
        signTransactionAsFeePayer(client, senderSignedTransaction),
      signTransaction: (senderSignedTransaction) =>
        signTransaction(client, senderSignedTransaction),
      prepareTransactionRequest: (tx) =>
        prepareTransactionRequest(
          client as unknown as KaiaClient,
          tx as unknown as PrepareTransactionRequestParameters<
            KaiaChain,
            account,
            KaiaChain
          >,
        ) as any,
    }
  }
}
