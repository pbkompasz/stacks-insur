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
      "create_cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get_cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();
  });

  it("update cover", () => {
    simnet.callPublicFn(
      "cover",
      "create_cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get_cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();

    simnet.callPublicFn(
      "cover",
      "update_cover",
      [Cl.stringAscii("new_name"), Cl.uint(100)],
      address1
    );
    let updatedCover = simnet.callReadOnlyFn(
      "cover",
      "get_cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(updatedCover.result.value.value.data.amount.value).toBe(100n);
  });

  it("stake tokens on cover", () => {
    simnet.callPublicFn(
      "cover",
      "create_cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let cover = simnet.callReadOnlyFn(
      "cover",
      "get_cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover).not.toBeNull();

    simnet.callPublicFn("amm", "deposit", [Cl.uint(10000)], address1);

    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);

    let resp = simnet.callReadOnlyFn(
      "token",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    console.log(resp);

    simnet.callPublicFn(
      "cover",
      "stake_tokens",
      [Cl.stringAscii("new_name"), Cl.uint(1000)],
      address1
    );
    simnet.callPublicFn(
      "cover",
      "stake_tokens",
      [Cl.stringAscii("new_name"), Cl.uint(1000)],
      address1
    );

    resp = simnet.callReadOnlyFn(
      "token",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    console.log(resp);

    cover = simnet.callReadOnlyFn(
      "cover",
      "get_cover",
      [Cl.stringAscii("new_name")],
      address1
    );
    expect(cover.result.value.value.data.amount.value).toBe(2000n);
  });

  it("get cover estimate", () => {
    simnet.callPublicFn(
      "cover",
      "create_cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    const estimate = simnet.callPublicFn(
      "cover",
      "get_cover_estimate",
      [Cl.stringAscii("new_name"), Cl.uint(10000)],
      address1
    );
    expect(estimate.result.value.value).toBe(1000n);
  });

  it("buy cover", () => {
    simnet.callPublicFn(
      "cover",
      "create_cover",
      [Cl.stringAscii("new_name"), Cl.uint(1)],
      address1
    );
    let resp = simnet.callPublicFn(
      "cover",
      "buy_cover",
      [Cl.stringAscii("new_name"), Cl.uint(10000), Cl.uint(30)],
      address1
    );

    resp = simnet.callReadOnlyFn(
      "cover",
      "get_cover_bought",
      [Cl.stringAscii('new_name')],
      address1
    );

    expect(resp.result.value.value.data.amount.value).toBe(10000n);
    expect(resp.result.value.value.data.duration_days.value).toBe(30n);
  });
});
