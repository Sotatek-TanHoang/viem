import type { Address } from 'abitype'
import type {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
} from '../../actions/index.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { KaiaChain } from '../formatter.js'
import type { KaiaClient } from '../types/client.js'
import { getEstimateGasPayload } from '../utils.js'

export const prepareTransactionRequest = async <
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = chain,
  accountOverride extends Account | Address | undefined = account,
>(
  client: KaiaClient,
  txObj: PrepareTransactionRequestParameters<
    chain,
    account,
    chainOverride,
    accountOverride
  >,
): Promise<
  PrepareTransactionRequestReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
> => {
  const req = await client.prepareTransactionRequest(
    txObj as unknown as PrepareTransactionRequestParameters<
      KaiaChain,
      account,
      KaiaChain
    >,
  )
  if (
    typeof (
      txObj as unknown as PrepareTransactionRequestParameters<
        KaiaChain,
        account,
        KaiaChain
      >
    ).gasLimit === 'undefined'
  ) {
    req.gasPrice = await client.request({
      method: 'klay_gasPrice',
      params: [],
    })
    req.gasLimit = await getEstimateGasPayload(client, {
      from: req?.from,
      to: req?.to,
      data: req?.data,
      key: req?.key,
      type: req?.type,
    })
  }
  return req as unknown as PrepareTransactionRequestReturnType<
    chain,
    account,
    chainOverride,
    accountOverride
  >
}
