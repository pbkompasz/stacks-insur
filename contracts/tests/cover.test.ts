import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("cover", () => {
  it("create cover", () => {
    simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();
  });

  it("update cover", () => {
    const resp = simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    console.log(resp)
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();

    const update = simnet.callPublicFn(
      "cover",
      "update-cover",
      [Cl.stringAscii("new_name"), Cl.uint(100)],
      address1
    );
    console.log(update)
    let updatedCover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );

    console.log(updatedCover.result.value.value)
    expect(updatedCover.result.value.value.data.amount.value).toBe(100n);
  });

  it("stake tokens on cover", () => {
    simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();

    simnet.callPublicFn("amm", "mint", [Cl.uint(10000)], address1);

    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);

    let resp = simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );

    simnet.callPublicFn(
      "cover",
      "stake-tokens",
      [Cl.stringAscii("new_name"), Cl.uint(1000), Cl.uint(0)],
      address1
    );
    simnet.callPublicFn(
      "cover",
      "stake-tokens",
      [Cl.stringAscii("new_name"), Cl.uint(1000), Cl.uint(0)],
      address1
    );

    resp = simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );

    cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover.result.value.value.data.amount.value).toBe(2000n);
  });

  it("get cover estimate", () => {
    simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    const estimate = simnet.callPublicFn(
      "cover",
      "get-cover-estimate",
      [Cl.stringAscii("new_name"), Cl.uint(10000)],
      address1
    );
    expect(estimate.result.value.value).toBe(1000n);
  });

  it("buy cover", () => {
    simnet.callPublicFn("amm", "mint", [Cl.uint(20000)], address1);
    simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let resp = simnet.callPublicFn(
      "cover",
      "buy-cover",
      [Cl.stringAscii("new_name"), Cl.uint(10000), Cl.uint(30)],
      address1
    );
    console.log(resp)

    resp = simnet.callReadOnlyFn(
      "cover",
      "get-cover-bought",
      [Cl.stringAscii("new_name")],
      address1
    );

    expect(resp.result.value.value.data.amount.value).toBe(10000n);
    expect(resp.result.value.value.data.duration_days.value).toBe(30n);
  });

  it("stake", () => {
    simnet.callPublicFn(
      "cover",
      "create-cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );

    simnet.callPublicFn("amm", "mint", [Cl.uint(20000)], address1);

    simnet.callPublicFn(
      "cover",
      "stake-tokens",
      [Cl.stringAscii("new_name"), Cl.uint(1000), Cl.uint(0)],
      address1
    );

    let cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    console.log(cover.result.value.value)

    simnet.callPublicFn(
      "cover",
      "vote-start-vote",
      [Cl.stringAscii('new_name')],
      address1
    );

    cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    console.log(cover.result.value.value)

    simnet.callPublicFn(
      "cover",
      "vote-claim",
      [Cl.stringAscii('new_name'), Cl.uint(1)],
      address1
    );

    cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    console.log(cover.result.value.value)




  });


  it("test default cover", () => {
    simnet.callPublicFn("amm", "mint", [Cl.uint(20000)], address1);
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get-cover",
      [Cl.stringAscii("USDT - Tether USDt")],
      address1
    );
    console.log(cover.result.value.value.data)

    let resp = simnet.callPublicFn(
      "cover",
      "buy-cover",
      [Cl.stringAscii("USDT - Tether USDt"), Cl.uint(10000), Cl.uint(30)],
      address1
    );
    console.log(resp)

    resp = simnet.callReadOnlyFn(
      "cover",
      "get-cover-bought",
      [Cl.stringAscii("USDT - Tether USDt")],
      address1
    );
    console.log(resp.result)


    expect(resp.result.value.value.data.amount.value).toBe(10000n);
    expect(resp.result.value.value.data.duration_days.value).toBe(30n);
  });
});
