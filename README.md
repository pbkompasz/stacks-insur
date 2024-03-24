# NAME

## Description

DeIns Mutual is a decentralized mutual insurance-like product. Our aim is to provide permissionless discretionary cover for on-chain and off-chain(maybe) entities.  
Given that Bitcoin is becoming the standard for settlements it becomes a great platform to manage insurance.  

## How it works

Steps:
1. A user buys a coverage from a range of risks e.g. Asset loss through Smart Contract vulnerabilities 
2. A risk assessor gives a fair assessment by staking DIM. If they gave a fair assessment and at least 70% of the assessors came to the same conclusion, they will receive a small part of the cover fee along with their DIM tokens.
3. To provide liquidity a member can stack DIM. For this action they will receive a small return.
4. The underlying pool gets put into safe investments while maintaining a pool to cover 90% of the claims bought.

## Coverage

This platforms allows for a user to buy coverage against Smart Contract Vulnerabilities and Stablecoin De-Peg Scenarios.

### Smart Contract Vulnerability

#### Claimable Risk Event

Malfunction or programming flaw.  
Unauthorized, malicious, criminal attacks, hacks or exploits of any malfunction or programming flaw.

#### Confirmation

Protocol publicly confirms the Claimable Risk Event through its social media accounts and/or channels as set out on the Protocol’s platform.  
An AI agent verifies the authencity of this claim.

#### Supported Smart Contracts:

- Uniswap V2
- 1inch
- Yearn Finance
- Aave v2

### Stablecoin De-Peg Risk

#### Claimable Risk Event

Based on token’s Daily Average Market Price, the Protocol may compensate for 70% of the loss realized by the Cover Purchaser in selling any of the said token below the US$1.00 per token peg between the Claimable Risk Event and the Claim Deadline and excluding any losses that resulted from token’s devaluation below US$0.50 per token.

#### Confirmation

This is an automated process and payout happens without user input.  
Prices are fetched from a thrusted price feed oracle.

#### Supported Stablecoins

- [USDA Arkadiko](https://arkadiko.finance/)
- [UWU](https://uwu.cash/)
- DoC - Dollar on Chain
- USDC
- USDT

### Pricing Model

To calculated coverage fee is based on the following criterions:
- type of coverage
- likelihood of occurence
- expected number of claims

### Liquidity Pool

When a user buys DIM they deposit STX. This goes into the liquidity pool which is kept in a range where it can cover 90% of the claims and being invesetd efficiently to increase the value of the pool. 

### Risk Assessment

#### Methodology

The Security Rating will be calculated based on 5 factors with weights stated below:

1. Project Implementation (10%)
- Project nature & technical difficulties
- Roadmap and future changes
2. Project Operation (10%)
- Project age
- Operation history
- TVL
- Existing coverage on funds
3. Audit (40%)
- Transparency and scope
- Findings and vulnerabilities
- Trust score
- Frequency and updates
4. Code (40%)
- Open-sourced
- Bug bounty program
- Issues raised on Github or by community
- Documentation
- Readability

## DIM

When contributing STX to the capital pool DIM token is minted and transferred to the wallet of the individual.  
This token grants the priviliege to the user to perform the following tasks: risk assessment, claims assessment and governance tasks.
Through this model we can open up the insurance marketplace for individuals with domain expertise.   

### Price

The price should reflect the demand for the service while generating favourable returns for investors.
Every time DIM is minted the price goes up, every time it is redeemed the price goes down.  
The price should move based on the following values:
- MCR (Minimal Capital Requirement)
- Book Value  

Furthermore the liquidity pool should stay at an optimal state

- [Inspiration](https://docs.nexusmutual.io/assets/files/nexus-mutual-ramm-whitepaper-v1-2023-80163504ce80b4c5342f4ee0a073656e.pdf)
x*y=k market maker
- Also: [see](https://ethresear.ch/t/improving-front-running-resistance-of-x-y-k-market-makers/1281?source=post_page-----a4f0cdfd3388--------------------------------)

### Governance

Community Voting on proposals.

## The Crew

The Crew is a group of AI agents that perform two important tasks, collect data for accurate risk assessment and arbitration.
Given a claim each claim assessor first has to agree in an agent that is "well aligned" i.e. a majority of the users agree that the response to a questionare is acceptable.
This agent can be viewed as another source of fairness and protection against individuals who try to game the system.

## Installation

Make user to create `.env` similar to `.env.dev` file with the correct api keys.  
Requirements: docker.

```cli
docker-compose up
```

This commands opens the insurance frontend(port 3000 ), crew dashboard(port 4000), the crew oracle with two running agents.

## Roadmap

1. Create a decentralize oracle to interact with off-chain entity e.g. for life insurance an oracle to generate proof that a person has passed away, etc.
2. Generate a more robust AMM system to provide liquidity.
3. Use Ordinals to cement the financial transaction and make it transferrable e.g. property insurance.
4. Implement agents into the workflow.
