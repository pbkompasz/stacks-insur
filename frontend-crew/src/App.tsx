import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Grid from "@mui/material/Grid";
import { pink, orange, } from "@mui/material/colors";

import "./App.scss";
import { useState } from "react";

function App() {
  const [funds, setFunds] = useState(0);
  const [agents, setAgents] = useState({
    total: 0,
    active: 0,
    topAgents: [],
  });
  const [jobs, setJobs] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    latestJobs: [],
  });
  const [block] = useState(123);

  return (
    <Stack direction="column" padding={2} spacing={2} className="dashboard">
      <Grid container alignItems="stretch">
        <Grid item xs={6} md={3} className="dashboard__card">
          <Card variant="outlined">
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
                className="dashboard__card__title"
              >
                Available funds
              </Typography>

              <Stack direction="row" alignItems="center" gap={0.25}>
                <Typography
                  sx={{ fontSize: 26 }}
                  color="black"
                  className="dashboard__card__text"
                >
                  {funds}
                </Typography>
                <img width={20} src="stx.png" alt="stx" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3} className="dashboard__card">
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
                className="dashboard__card__title"
              >
                Agents
              </Typography>
              <Typography className="dashboard__card__text">
                {agents.total} total agents
              </Typography>
              <Typography className="dashboard__card__text">
                {agents.active} active agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3} className="dashboard__card">
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
                className="dashboard__card__title"
              >
                Jobs
              </Typography>
              <Typography className="dashboard__card__text">
                {jobs.total} total jobs
              </Typography>
              <Typography className="dashboard__card__text">
                {jobs.active} active jobs
              </Typography>
              <Typography className="dashboard__card__text">
                {jobs.scheduled} scheduled jobs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3} className="dashboard__card">
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
                className="dashboard__card__title"
              >
                Current Block
              </Typography>
              <Typography className="dashboard__card__text">
                {block.number}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-around">
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Verification Jobs
                </Typography>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Scraping Jobs
                </Typography>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Cost per Job
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          className="dashboard__card dashboard__card--long"
        >
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Agents
              </Typography>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Role</TableCell>
                    <TableCell align="right">Model ID</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.topAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {agent.id}
                      </TableCell>
                      <TableCell align="right">{agent.name}</TableCell>
                      <TableCell align="right">{agent.role}</TableCell>
                      <TableCell align="right">{agent.model}</TableCell>
                      <TableCell align="right">
                        <CheckCircleOutlineIcon
                          sx={{ color: agent?.status ? "success" : pink[500] }}
                        ></CheckCircleOutlineIcon>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          className="dashboard__card dashboard__card--long"
        >
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Jobs
              </Typography>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Request ID</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs.latestJobs.map((job) => (
                    <TableRow
                      key={job.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {job.id}
                      </TableCell>
                      <TableCell align="right">{job.requestId}</TableCell>
                      <TableCell align="right">{job.type}</TableCell>
                      <TableCell align="right">
                        <CheckCircleOutlineIcon
                          sx={{ color: job?.status === 'done' ? "success" : (job?.status === 'active' ? orange[500] : pink[500] ) }}
                        ></CheckCircleOutlineIcon>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default App;
