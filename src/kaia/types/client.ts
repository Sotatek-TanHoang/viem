import type { Client } from '../../clients/createClient.js'
import type { PublicClient } from '../../clients/createPublicClient.js'
import type { WalletActions } from '../../clients/decorators/wallet.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { RpcSchema } from '../../types/eip1193.js'
import type { Prettify } from '../../types/utils.js'
import type { CustomRpcSchema } from '../rpc-schema.js'

export type KaiaClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain,
  account extends Account | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
> = Prettify<
  PublicClient &
    Client<
      transport,
      chain,
      account,
      rpcSchema extends RpcSchema
        ? [...CustomRpcSchema, ...rpcSchema]
        : CustomRpcSchema,
      WalletActions<chain, account>
    >
>
