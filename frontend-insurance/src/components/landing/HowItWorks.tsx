import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const HowItWorks = () => {
  return (
    <Stack alignItems="flex-start" padding={3}>
      <Typography variant="h2" style={{ fontSize: "32px" }}>
        Description
      </Typography>
      <Typography>
        DeIns Mutual is a decentralized mutual insurance-like product. Our aim
        is to provide permissionless discretionary cover for on-chain and
        off-chain entities.
      </Typography>
      <Typography>
        There are two ways to participate, as a coverage buyer or a risk
        assessor.
      </Typography>
      <Typography>
        Currently there are two types of coverage that you can buy:
        <ul style={{ textAlign: "left" }}>
          <li>Smart Contract Vulnerability</li>
          <li>Stablecoin De-Peg Risk</li>
        </ul>
      </Typography>
    </Stack>
  );
};

export default HowItWorks;
