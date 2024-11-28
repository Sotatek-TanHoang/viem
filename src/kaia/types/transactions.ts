import type { AccountKeyType, TxType } from '@kaiachain/js-ext-core'
import type {
  TransactionRequest as EthersTransactionRequest,
  TransactionResponse,
} from 'ethers'
import type { TransactionSerializable } from '../../types/transaction.js'
import type { OneOf } from '../../types/utils.js'

export interface KaiaTransactionResponse extends TransactionResponse {}

export interface KaiaTransactionRequest
  extends Omit<EthersTransactionRequest, 'kzg'> {
  txSignatures?: string[]
  feePayer?: string
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
