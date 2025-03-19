import { TxType } from '@kaiachain/js-ext-core'
import { describe, expect, it } from 'vitest'
import { privateKeyToAccount } from '~viem/accounts/privateKeyToAccount.js'
import { kairos } from '~viem/chains/index.js'
import { http, createWalletClient, rpcSchema } from '~viem/index.js'
import { kaiaWalletAction } from '../actions/wallet-actions.js'
import type { CustomRpcSchema } from '../rpc-schema.js'

const senderWallet = createWalletClient({
  chain: kairos,
  transport: http(),
  rpcSchema: rpcSchema<CustomRpcSchema>(),
  account: privateKeyToAccount(
    '0x0e4ca6d38096ad99324de0dde108587e5d7c600165ae4cd6c2462c597458c2b8',
  ),
}).extend(kaiaWalletAction())

describe('kaia/prepareTransactionRequest', () => {
  it('prepare a tx', async () => {
    const txRequest = await senderWallet.prepareTransactionRequest({
      account: senderWallet.account,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: 0n,
      type: TxType.ValueTransfer,
    })

    expect(txRequest.gasLimit).toBeDefined()
    expect(txRequest.gasPrice).toBeDefined()
    expect(txRequest.nonce).toBeDefined()
  })
})
