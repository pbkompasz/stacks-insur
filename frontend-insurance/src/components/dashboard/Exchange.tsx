import { openContractCall } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import { uintCV } from "@stacks/transactions";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
// import BigNum from "bn.js";

const Exchange = () => {
  const [success, setSuccess] = useState();

  const send = async () => {
    const functionArgs = [uintCV(originAmount * 1000000)];

    const options = {
      // contractAddress: import.meta.env.VITE_AMM_CONTRACT,
      contractAddress: "ST2FJ1YXQ54HQZ3TXAXM1M1W6DJKQ338XT0T893FT",
      contractName: "amm",
      functionName: originToken === "STX" ? "deposit" : "redeem",
      functionArgs,
      network: new StacksTestnet(),
      appDetails: {
        name: "DeIns Mutual",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data: string) => {
        console.log(data);
        setSuccess(true);
      },
      onCancel: () => {
        setSuccess(false);
      },
    };
    // @ts-expect-error Sponsored should be optional
    await openContractCall(options);
  };

  const [originAmount, setOriginAmount] = useState(0);
  const [originToken, setOriginToken] = useState("STX");
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetToken, setTargetToken] = useState("TOKEN_NAME");

  const updateAmount = (val: string) => {
    setOriginAmount(+val);
    setTargetAmount(1234);
  };

  const updateToken = (
    which: "origin" | "target",
    val: "STX" | "TOKEN_NAME"
  ) => {
    const otherToken = val === "STX" ? "TOKEN_NAME" : "STX";
    setOriginToken(which === "origin" ? val : otherToken);
    setTargetToken(which === "origin" ? otherToken : val);
    setOriginAmount(0);
    setTargetAmount(0);
  };

  return (
    <>
      <Typography variant="h1" style={{ textAlign: "left", fontSize: "24px" }}>
        Mint & Redeem TOKEN_NAME
      </Typography>
      <Paper
        variant="outlined"
        style={{ width: "600px", margin: "2rem auto", padding: "2rem" }}
      >
        <Stack alignItems="stretch" gap={2}>
          <Typography>1 STX = {"tokenPrice"} TOKEN_NAME</Typography>
          <Stack direction="row" justifyContent="space-between" gap={2}>
            <TextField
              id="outlined-number"
              label="Origin Amount"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={originAmount}
              onChange={(e) => updateAmount(e.target.value)}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="token-select-label">Origin</InputLabel>
              <Select
                labelId="token-select"
                id="token-select"
                value={originToken}
                label="Token"
                size="small"
                onChange={(e) =>
                  updateToken("origin", e.target.value as "STX" | "TOKEN_NAME")
                }
              >
                <MenuItem value="STX">STX</MenuItem>
                <MenuItem value="TOKEN_NAME">TOKEN_NAME</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" gap={2} justifyContent="space-between">
            <TextField
              id="outlined-number"
              label="Target Amount"
              InputLabelProps={{
                shrink: true,
              }}
              value={targetAmount}
              disabled
              onChange={(e) => setTargetAmount(+e.target.value)}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="token-select-label">Target</InputLabel>
              <Select
                labelId="token-select"
                id="token-select"
                value={targetToken}
                label="Token"
              >
                <MenuItem value="STX">STX</MenuItem>
                <MenuItem value="TOKEN_NAME">TOKEN_NAME</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Button onClick={send}>send</Button>
        </Stack>
      </Paper>
      {success === true && (
        <>
          <Typography color="green">
            Success! The tokens will appear in your account shortly.
          </Typography>
        </>
      )}
      {success === false && (
        <>
          <Typography color="red">Error! Please try again.</Typography>
        </>
      )}
    </>
  );
};

export default Exchange;
