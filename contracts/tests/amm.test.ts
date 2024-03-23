import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

describe("text fund init", () => {
  it("init", () => {
    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(0);

    const totalCover = simnet.getDataVar("amm", "total_cover");
    expect(totalCover).toBeUint(0);

    const price = simnet.getDataVar("amm", "price");
    expect(price).toBeUint(4);
  });

  it("deposit", () => {
    simnet.callPublicFn("amm", "deposit", [Cl.uint(10000)], address1);

    const liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);
  });

  it("redeem", () => {
    simnet.callPublicFn("amm", "deposit", [Cl.uint(20000)], address1);
    let liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(20000);

    simnet.callPublicFn("amm", "redeem", [Cl.uint(10000)], address1);

    liquidity = simnet.getDataVar("amm", "liquidity");
    expect(liquidity).toBeUint(10000);
  });

  // it("shows an example", () => {
  //   const { result } = simnet.callReadOnlyFn("counter", "get-counter", [], address1);
  //   expect(result).toBeUint(0);
  // });
});
