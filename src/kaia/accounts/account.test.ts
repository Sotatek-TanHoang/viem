import { describe, expect, it } from "vitest";
import { privateKeyToAccount } from "../../accounts/privateKeyToAccount.js";
import { kaiaAccount } from "./index.js";
import { toPeb, TxType } from "@kaiachain/js-ext-core";
import { kaiaWalletAction } from "../actions/wallet-actions.js";
import { rpcSchema } from "../../clients/createClient.js";
import { http } from "../../clients/transports/http.js";
import { kairos } from "../../chains/index.js";
import { createWalletClient } from "../../clients/createWalletClient.js";
import type { CustomRpcSchema } from "../rpc-schema.js";

describe("kaia/account", () => {
  it("test role based account send tx", async () => {
    const roleBasedAccount = kaiaAccount(
      "0x5bd2fb3c21564c023a4a735935a2b7a238c4ccea",
      // actual public address "0xc1bc4440c4d4010be0ba1cfb014ab8cd1d62c470"
      "0x7239c8977558ed1d5789100a4a837c7f2fa464196246569d73149648de57cbfe"
    );
    expect(
      roleBasedAccount.address !==
        privateKeyToAccount(
          "0x7239c8977558ed1d5789100a4a837c7f2fa464196246569d73149648de57cbfe"
        ).address
    ).toBeTruthy();
    const txRoleBasedWallet = createWalletClient({
      chain: kairos,
      transport: http(),
      rpcSchema: rpcSchema<CustomRpcSchema>(),
      account: roleBasedAccount,
    }).extend(kaiaWalletAction());
    const txRequest = await txRoleBasedWallet.prepareTransactionRequest({
      to: "0xb41319B12ba00e14a54CF3eE6C98c3EC9E27e0CA",
      value: toPeb("0", "kaia"),
      type: TxType.ValueTransfer,
    });
    const sentTx = await txRoleBasedWallet.sendTransaction(txRequest);
    expect(sentTx.startsWith("0x")).toBeTruthy();
  });
});
