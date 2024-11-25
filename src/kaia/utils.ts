import { type SignatureLike, parseTransaction } from '@kaiachain/js-ext-core'
import type { Client } from '../clients/createClient.js'
import type { Signature } from '../types/misc.js'
import type { KaiaTransactionRequest } from './types/transactions.js'
export function isKaiaTransactionRequest(
  transactionOrRLP: string | KaiaTransactionRequest,
): transactionOrRLP is KaiaTransactionRequest {
  return typeof transactionOrRLP === 'object'
}
export async function getTransactionRequestForSigning(
  client: Client,
  transactionOrRLP: KaiaTransactionRequest | string,
): Promise<KaiaTransactionRequest> {
  let txObj: KaiaTransactionRequest
  switch (typeof transactionOrRLP) {
    case 'string':
      txObj = parseTransaction(transactionOrRLP) as KaiaTransactionRequest
      break
    case 'object':
      txObj = transactionOrRLP as KaiaTransactionRequest
      break
    default:
      throw new Error('Invalid transaction')
  }

  if (typeof client?.chain?.id !== 'undefined') {
    txObj.chainId = client.chain.id
  }
  return txObj
}

export function convertSignatureToKaiaFormat(
  signature: Signature,
  chainId: number,
): SignatureLike {
  const { r, s, yParity } = signature
  const v = Number(yParity) + chainId * 2 + 35
  return {
    r,
    s,
    v,
  }
}
