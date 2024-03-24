import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("fund tests", () => {
  it("test preotected token mint", () => {
    expect(simnet.blockHeight).toBeDefined();
    const mintForMyself = simnet.callPublicFn(
      "amm",
      "mint",
      [Cl.uint(1001)],
      address1
    );
    expect(mintForMyself.result).not.toBeErr(Cl.uint(102));
    const mintForOther = simnet.callPublicFn(
      "amm",
      "mint",
      [Cl.uint(1000)],
      address1
    );
    expect(mintForOther.result).toBeErr(Cl.uint(102));
  });

  it("check init", () => {
    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(0);

    const totalCover = simnet.getDataVar("amm", "total_cover");
    expect(totalCover).toBeUint(0);

    const price = simnet.getDataVar("amm", "price");
    expect(price).toBeUint(400n);
  });

  it("deposit", () => {
    const deposit = simnet.callPublicFn(
      "amm",
      "mint",
      [Cl.uint(10000)],
      address1
    );
    expect(deposit.result).not.toBeErr(Cl.uint(102));

    const balance = simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );
    // FIX ME
    // expect(balance.result).toBe(Cl.uint(4000000));
    expect(balance.result.value.value).toBe(4000000n);

    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);
  });

  it("redeem", () => {
    simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );

    simnet.callPublicFn("amm", "mint", [Cl.uint(10000)], address1);
    let liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);

    simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );

    // In microSTX
    simnet.callPublicFn("amm", "burn", [Cl.uint(1000)], address1);

    simnet.callPublicFn(
      "amm",
      "redeem",
      [Cl.uint(1000), Cl.principal(address1)],
      deployer
    );

    liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(9000);

    simnet.callReadOnlyFn(
      "amm",
      "get-balance",
      [Cl.principal(address1)],
      address1
    );

    expect(simnet.getDataVar("amm", "liquidity")).toBeUint(9000);
  });

  it("test internals", () => {
    simnet.getDataVar("amm", "price");

    simnet.callPublicFn("amm", "mint", [Cl.uint(20000)], address1);
    let liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(20000);

    simnet.callPublicFn("amm", "burn", [Cl.uint(10000)], address1);
    simnet.callPublicFn(
      "amm",
      "redeem",
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );

    liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);
  });

  it("check price movement", () => {
    let price = simnet.getDataVar("amm", "price");

    simnet.callPublicFn("amm", "mint", [Cl.uint(20000)], address1);

    let newPrice = simnet.getDataVar("amm", "price");
    expect(newPrice.value).toBeLessThan(price.value);

    simnet.callPublicFn("amm", "burn", [Cl.uint(10000)], address1);
    simnet.callPublicFn(
      "amm",
      "redeem",
      [Cl.uint(10000), Cl.principal(address1)],
      deployer
    );

    let newNewPrice = simnet.getDataVar("amm", "price");
    expect(newNewPrice.value).toBeGreaterThan(newPrice.value);

    simnet.callPublicFn("amm", "burn", [Cl.uint(10000)], address1);
  });
});
