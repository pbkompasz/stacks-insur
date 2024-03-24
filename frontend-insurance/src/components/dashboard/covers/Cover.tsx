import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchBalance, fetchCover, fetchCoverBought } from "../../../util/hiro";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";
import { openContractCall } from "@stacks/connect";

export interface SimpleDialogProps {
  open: boolean;
  balance: number;
  onClose: () => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { name } = useParams();
  const { onClose, balance, open } = props;
  const [balanceToStake, setBalanceToStake] = useState(0);

  const handleClose = () => {
    onClose();
  };

  const stake = async () => {
    const functionArgs = [
      stringAsciiCV(name),
      uintCV(balanceToStake),
      uintCV(0),
    ];

    const options = {
      // contractAddress: import.meta.env.VITE_AMM_CONTRACT,
      contractAddress: "ST1PCFPA63HE8WKYC13RNFB0N2XJRER8BKG4XV1MA",
      contractName: "cover",
      functionName: "stake-tokens",
      functionArgs,
      network: new StacksTestnet(),
      appDetails: {
        name: "DeIns Mutual",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data: string) => {
        console.log(data);
        handleClose();
      },
    };
    // @ts-expect-error Sponsored should be optional
    await openContractCall(options);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack padding={2} alignItems="start" gap={2}>
        <DialogTitle>Stake token</DialogTitle>
        <Typography padding={1} fontSize={18}>
          Max amount: {balance}
        </Typography>
        <TextField
          id="outlined-basic"
          label="Amount"
          value={balanceToStake}
          onChange={(e) => setBalanceToStake(+e.target.value)}
          variant="outlined"
        />
        <Button
          style={{ margin: "auto" }}
          variant="contained"
          disabled={!balanceToStake}
          onClick={stake}
        >
          Stake
        </Button>
      </Stack>
    </Dialog>
  );
}

const Cover = () => {
  const { name } = useParams();
  const [cover, setCover] = useState({});
  const [myCover, setMyCover] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchCover(name).then((cover) =>
      setCover({
        riskRating: parseInt(cover?.risk_factor?.value ?? 0),
        riskAssessors: parseInt(cover?.stakers_risk?.value ?? 0),
        buyers: parseInt(cover?.buyers?.value ?? 0),
        claimRequests: parseInt(cover?.start_vote?.value ?? 0),
      })
    );
    fetchCoverBought(name).then((cover) => {
      if (cover!=-1) setMyCover(true);
      console.log(cover);
    });
    fetchBalance("DIM").then((b) => {
      setBalance(b);
    });
  }, []);

  const requestClaim = async () => {

    const functionArgs = [
      stringAsciiCV(name),
    ];

    const options = {
      // contractAddress: import.meta.env.VITE_AMM_CONTRACT,
      contractAddress: "ST1PCFPA63HE8WKYC13RNFB0N2XJRER8BKG4XV1MA",
      contractName: "cover",
      functionName: "vote-start-vote",
      functionArgs,
      network: new StacksTestnet(),
      appDetails: {
        name: "DeIns Mutual",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data: string) => {
        console.log(data);
        handleClose();
      },
    };
    // @ts-expect-error Sponsored should be optional
    await openContractCall(options);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h1" fontSize={32} textAlign="left">
          {name}
        </Typography>
        <Stack direction="row" gap={2}>
          {myCover && (
            <>
              <Button onClick={requestClaim} variant="contained">
                Request a claim
              </Button>
            </>
          )}
          {!myCover && balance && (
            <>
              <Button onClick={handleClickOpen} variant="contained">
                Stake
              </Button>
            </>
          )}
        </Stack>
      </Stack>
      <Paper variant="outlined" style={{ padding: "1rem" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={20} fontWeight={600}>
            Risk rating (0-100)
          </Typography>
          <Typography>{cover?.riskRating}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={20} fontWeight={600}>
            Risk assessors
          </Typography>
          <Typography>{cover?.riskAssessors}</Typography>
        </Stack>
      </Paper>
      <Paper variant="outlined" style={{ padding: "1rem" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={20} fontWeight={600}>
            Buyers
          </Typography>
          <Typography>{cover?.buyers}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={20} fontWeight={600}>
            Claims requested
          </Typography>
          <Typography>{cover?.claimRequests}</Typography>
        </Stack>
      </Paper>
      <SimpleDialog open={open} cover={cover} balance={balance} onClose={handleClose} />
    </Stack>
  );
};

export default Cover;
