// biome-ignore lint/performance/noBarrelFile: entrypoint module
export {
  type KaiaWalletAction,
  kaiaWalletAction,
} from './actions/wallet-actions.js'
export { type TxType, AccountKeyType } from '@kaiachain/js-ext-core'
export type { CustomRpcSchema as KaiaRpcSchema } from './rpc-schema.js'
