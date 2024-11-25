import type {
  PrepareTransactionRequestParameters,
  PrepareTransactionRequestReturnType,
} from '../../actions/index.js'
import type { Account } from '../../types/account.js'
import type { ExactPartial } from '../../types/utils.js'
import { toHex } from '../../utils/index.js'
import type { KaiaChain } from '../formatter.js'
import type { KaiaClient } from '../types/client.js'
import type { KaiaTransactionRequest } from '../types/transactions.js'

export const prepareTransactionRequest = async <
  account extends Account | undefined = Account | undefined,
>(
  client: KaiaClient,
  txObj: PrepareTransactionRequestParameters<KaiaChain, account, KaiaChain>,
): Promise<
  PrepareTransactionRequestReturnType<KaiaChain, account, KaiaChain>
> => {
  const req = await client.prepareTransactionRequest(txObj)
  if (typeof txObj.gasLimit === 'undefined') {
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
  return req
}
const getEstimateGasPayload = async (
  client: KaiaClient,
  txObj: ExactPartial<
    Pick<
      KaiaTransactionRequest,
      'key' | 'from' | 'to' | 'value' | 'data' | 'type'
    >
  >,
) => {
  const result: Partial<KaiaTransactionRequest> = {}
  if (txObj.from) {
    result.from = txObj.from
  }
  if (txObj.to) {
    result.to = txObj.to
  }
  if (txObj.value) {
    result.value = toHex(txObj.value)
  }
  if (txObj.data) {
    result.data = txObj.data
  }
  if (txObj.type) {
    result.type = txObj.type
  }
  if (txObj.key) {
    result.key = txObj.key
  }

  const estimatedGas = (await client.request({
    method: 'klay_estimateGas',
    params: [result],
  })) as `0x${string}`
  return Math.floor(Number.parseInt(estimatedGas, 16) * 2.5)
}
