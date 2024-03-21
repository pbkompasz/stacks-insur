import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import GavelIcon from "@mui/icons-material/Gavel";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import { useEffect, useState } from "react";

import SmartContractExplorer from "./SmartContractExplorer";
import DePegExplorer from "./DePegExplorer";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link/Link";

type CoverOption = "smart-contract" | "de-peg";

const Covers = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <Typography variant="h1" style={{ textAlign: "left", fontSize: "24px" }}>
        Covers
      </Typography>
      <Box paddingTop={2}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          style={{ backgroundColor: "inherit", justifyContent: "start" }}
        >
          <BottomNavigationAction
            label="Smart Contract Vulnerability"
            icon={<GavelIcon />}
          />
          <BottomNavigationAction
            label="Stablecoin de-peg"
            icon={<PriceChangeIcon />}
          />
          <BottomNavigationAction
            label="How it works"
            icon={<PriceChangeIcon />}
          />
        </BottomNavigation>
      </Box>
      {(value === 0 && <SmartContractExplorer></SmartContractExplorer>) ||
        (value === 1 && <DePegExplorer></DePegExplorer>) ||
        (value === 2 && (
          <Stack paddingY={2} gap={0.5} style={{ textAlign: "left" }}>
            <Paper variant="outlined" style={{ padding: "1rem" }}>
              <ol>
                <li>
                  A user buys a coverate i.e. to insurance X it pays a small %
                  of X as cover fee.
                </li>
                <li>
                  A risk assessor gives a fair assessment by staking TOKEN_NAME.
                  For this they receive a part of the cover fee and their
                  TOKEN_NAME get returned.
                </li>
                <li>
                  In case loss event a stake assessor stakes TOKEN_NAME which
                  will constitute the capital pool from which the coverage would
                  be payed. For this they receive their TOKEN_NAME and a bonus.
                </li>
              </ol>
            </Paper>
            <Typography variant="h2" style={{ fontSize: "24px" }}>
              Smart Contract Vulnerability
            </Typography>
            <Paper variant="outlined" style={{ padding: "1rem" }}>
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Claimable Risk Event
              </Typography>
              Malfunction or programming flaw. Unauthorized, malicious, criminal
              attacks, hacks or exploits of any malfunction or programming flaw.
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Confirmation Protocol
              </Typography>
              Publicly confirms the Claimable Risk Event through its social
              media accounts and/or channels as set out on the Protocol’s
              platform. An AI agent verifies the authencity of this claim.
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Supported Smart Contracts
              </Typography>
              <ul>
                <li>Uniswap V2</li>
                <li>1inch</li>
                <li>Yearn Finance</li>
                <li>Aave v2</li>
              </ul>
            </Paper>
            <Typography variant="h2" style={{ fontSize: "24px" }}>
              Stablecoin De-Peg Risk
            </Typography>
            <Paper variant="outlined" style={{ padding: "1rem" }}>
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Claimable Risk Event
              </Typography>
              Based on token’s Daily Average Market Price, the Protocol may
              compensate Cover Purchasers for “Claimable Loss”, which is 70% of
              the loss realized by the Cover Purchaser in selling any of the
              said token below the US$1.00 per token peg between the Claimable
              Risk Event and the Claim Deadline and excluding any losses that
              resulted from token’s devaluation below US$0.50 per token.
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Confirmation Protocol
              </Typography>
              This is an automated process and payout happens without user
              input. Prices are fetched from a Chainlink Oracle.
              <Typography variant="h3" style={{ fontSize: "20px" }}>
                Supported Stablecoins
              </Typography>
              <ul>
                <li>
                  <Link href="https://arkadiko.finance/">USDA Arkadiko</Link>
                </li>
                <li>
                  <Link href="https://uwu.cash/">UWU</Link>
                </li>
                <li>DoC - Dolalr on Chain</li>
                <li>BRZ</li>
              </ul>
            </Paper>
          </Stack>
        ))}
    </div>
  );
};

export default Covers;
