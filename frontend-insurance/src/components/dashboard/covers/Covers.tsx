import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import GavelIcon from '@mui/icons-material/Gavel';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { useState } from "react";

import SmartContractExplorer from "./SmartContractExplorer";
import DePegExplorer from "./DePegExplorer";

type CoverOption = "smart-contract" | "de-peg";

const Covers = () => {
  const [value, setValue] = useState(0);

  return (
    <>
      <Box>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          style={{ backgroundColor: "inherit" }}
        >
          <BottomNavigationAction
            label="Smart Contract Vulnerability"
            icon={<GavelIcon />}
          />
          <BottomNavigationAction
            label="Stablecoin de-peg"
            icon={<PriceChangeIcon />}
          />
        </BottomNavigation>
      </Box>
      {value === 0 ? (
        <SmartContractExplorer></SmartContractExplorer>
      ) : (
        <DePegExplorer></DePegExplorer>
      )}
    </>
  );
};

export default Covers;
