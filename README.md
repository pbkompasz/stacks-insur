# NAME

## Description

Bitcoin is becoming the standard for settlements.  
NAME is a decentralized mutual insurance-like product. Our aim is to provide discretionary cover for on-chain and off-chain(maybe) entities.

## How it works

Steps:
1. A user buys a coverate i.e. to insurance X it pays a small % of X as cover fee
2. A risk assessor gives a fair assessment by staking TOKEN_NAME. For this they receive a part of the cover fee and their TOKEN_NAME get returned.
3. In case loss event a stake assessor stakes TOKEN_NAME which will constitute the capital pool from which the coverage would be payed. For this they receive their TOKEN_NAME and a bonus.



## Coverage

This platforms allows for a user to buy coverage against a Smart Contract Vulnerability and a Stablecoin De-Peg Scenario.

### Smart Contract Vulnerability

#### Claimable Risk Event

Malfunction or programming flaw.  
Unauthorized, malicious, criminal attacks, hacks or exploits of any malfunction or programming flaw.

#### Confirmation

Protocol publicly confirms the Claimable Risk Event through its social media accounts and/or channels as set out on the Protocol’s platform.  
An AI agent verifies the authencity of this claim.

#### Supported Smart Contracts:

TBD

### Stablecoin De-Peg Scenario

#### Claimable Risk Event

Based on token’s Daily Average Market Price, the Protocol may compensate Cover Purchasers for “Claimable Loss”, which is 70% of the loss realized by the Cover Purchaser in selling any of the said token below the US$1.00 per token peg between the Claimable Risk Event and the Claim Deadline and excluding any losses that resulted from token’s devaluation below US$0.50 per token.

#### Confirmation

Chainlink Oracle

#### Supported stablecoins:

- [USDA Arkadiko](https://arkadiko.finance/)
- [UWU](https://uwu.cash/)

### TOKEN_NAME

When contributing STX to the capital pool a TOKEN_NAME is minted and transferred to the wallet of the individual.  
This token grants the privilige to the user to perform the following tasks: risk assessment, claims assessment, underwriting, actuary, resolver and other governance tasks.

#### Token model

The capital pool is broken down into two parts:
- The Stable Capital Pool which has a minimum threshold base on the Total Cover Amount.
- A Liquidity Pool to manage deposits, withdraws and sets the price of the token.

### Governance

### The Crew

The Crew is a group of AI agents that perform two important tasks, collect data for accurate risk assessment and arbitration.
Given a claim each claim assessor first has to agree in an agent that is "well alaigned" i.e. a majority of the users agree that the response to a questionare is acceptable.
This agent can be viewes as another source of fairness and protection against individuals who try to game the system.

## Installation

Make user to create `.env` similar to `.env.dev` file with the correct Open AI api key.

```cli
docker-compose up
```

This commands opens the insurance frontend(port 3000 ), crew dashboard(port 4000), the crew oracle with two running agents.
