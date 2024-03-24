import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Claim from "./Claim";

const Claims = () => {
  const [prompts, setPrompts] = useState([]);
  const [value, setValue] = useState(0);
  const [myClaims, setMyClaims] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const init = async () => {
      const res = await fetch("/claims.json");
      const data = await res.json();
      console.log(data.prompts);
      setPrompts(data.prompts);
    };
    init().catch(console.error);
  }, []);

  return (
    <>
      <Typography variant="h1" style={{ textAlign: "left", fontSize: "24px" }}>
        Claims
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
          <BottomNavigationAction label="Claims" />
          <BottomNavigationAction label="My claims" />
        </BottomNavigation>
      </Box>
      {value === 0 ? (
        <>
          {claims.map((claim) => (
            <Claim claim={claim}></Claim>
          ))}
        </>
      ) : (
        <>
          {myClaims.map((claim) => (
            <Claim claim={claim}></Claim>
          ))}
        </>
      )}
      {/* Claim me Process: Official social platform: Events: Risk factor: if cover:
      startDate, endDate, amount, */}
    </>
  );
};

export default Claims;
