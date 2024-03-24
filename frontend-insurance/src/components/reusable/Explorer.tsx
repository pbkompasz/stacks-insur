import { Component } from "react";
import type { Cover } from "../dashboard/covers/Covers";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

type ExplorerProps = {
  openCover: (cover: Cover) => void;
  error: string;
  covers: Cover[];
};

const Explorer = (props: ExplorerProps) => {
  const { covers, error, openCover } = props;

  console.log(covers);

  const createTooltip = (cover) => {
    return "expensive";
  };

  return (
    <Grid container spacing={2} padding={2}>
      {covers.map((cover) => (
        <Grid key={cover.id} item xs={4}>
          <Paper variant="outlined">
            <Stack padding={2} alignItems="start">
              {/* onclick go to stx_address */}
              <Typography
                variant="h3"
                style={{ fontSize: 20, fontWeight: "600" }}
              >
                <Link href={`cover/${cover.name}`}>
                {cover.name}
                </Link>
              </Typography>
              <Stack
                direction="row"
                style={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Typography>Token</Typography>
                <Typography style={{ fontWeight: "600" }}>
                  {cover.token ?? "N/A"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                style={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Typography>Premium</Typography>
                <Tooltip title={createTooltip(cover)}>
                  <Typography style={{ fontWeight: "600" }}>
                    {cover.premium_daily ?? "N/A"}
                  </Typography>
                </Tooltip>
              </Stack>
              <Stack
                direction="row"
                style={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Typography>Capacity</Typography>
                <Typography style={{ fontWeight: "600" }}>
                  {cover.capacity ?? "None"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                style={{ width: "100%" }}
                justifyContent="space-between"
              >
                <Typography>Rating</Typography>
                <Typography style={{ fontWeight: "600" }}>
                  {cover?.fromChain?.riskRating ?? "N/A"}
                </Typography>
              </Stack>
              <Stack direction="row-reverse" style={{ width: "100%" }}>
                <Button onClick={() => openCover(cover)}>Add to cart</Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Explorer;
