import { describe, expect, it } from "vitest";
import { kaiaAccount } from "./index.js";
import { privateKeyToAccount } from "~viem/accounts/privateKeyToAccount.js";

describe("kaia/account", () => {
  it("test role based account", async () => {
    const account = kaiaAccount(
      "0x5bd2fb3c21564c023a4a735935a2b7a238c4ccea",
      // actual public address "0xc1bc4440c4d4010be0ba1cfb014ab8cd1d62c470"
      "0x7239c8977558ed1d5789100a4a837c7f2fa464196246569d73149648de57cbfe"
    );
    expect(
      account.address !==
        privateKeyToAccount(
          "0x7239c8977558ed1d5789100a4a837c7f2fa464196246569d73149648de57cbfe"
        ).address
    ).toBeTruthy();
  });
});
