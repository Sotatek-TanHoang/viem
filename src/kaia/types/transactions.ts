import type { AccountKeyType, TxType } from '@kaiachain/js-ext-core'
import type {
  TransactionRequest as EthersTransactionRequest,
  TransactionResponse,
} from 'ethers'
import type { TransactionSerializable } from '../../types/transaction.js'
import type { OneOf } from '../../types/utils.js'
import type { Account } from '../../types/account.js'

export interface KaiaTransactionResponse extends TransactionResponse {}

export interface KaiaTransactionRequest
  extends Omit<EthersTransactionRequest, 'kzg' | 'account' | 'from'> {
  from?: `${string}` | undefined
  account?: Account | string | undefined

  txSignatures?: string[]
  feePayer?: `${string}`
  feePayerSignatures?: string[]
  type?: TxType
  key?: {
    type: AccountKeyType
    keys?: {
      type: AccountKeyType
      key: string
    }[]
    key?: string
  }
}
export type KaiaTransactionSerializable = OneOf<
  TransactionSerializable | KaiaTransactionRequest
>
export type KaiaTransactionSerialized = `0x${string}`
