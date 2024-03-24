import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState, Fragment, useEffect } from "react";
import { type Cover } from "./Covers";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider/Divider";
import Grid from "@mui/material/Grid/Grid";
import TextField from "@mui/material/TextField/TextField";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { convertPrice } from "../../../util/price";
import { useLocalStorage } from "../../../util/useLocalStorage";
import { fetchCoverEstimate } from "../../../util/hiro";

const steps = ["Details", "Quote", "Verify Identity"];

const BuySmartContractCover = ({ cover }: { cover: Cover }) => {
  console.log(cover);
  const [activeStep, setActiveStep] = useState(0);
  const [acceptanceTime, setAcceptanceTime] = useLocalStorage("acceptanceTime");
  const [cart, setCart] = useLocalStorage("cart");

  const handleNext = () => {
    if (activeStep === 0) {
      setAcceptanceTime(undefined);
      calculateCost();
      const today = new Date();
      setCalculatedCalculatedExpiryDate(
        new Date(today.setDate(today.getDate() + coveredDuration))
      );
    }
    if (activeStep === 1) {
      const twentyMinutesLater = new Date();
      twentyMinutesLater.setMinutes(twentyMinutesLater.getMinutes() + 20);
      setAcceptanceTime(String(twentyMinutesLater));
    }
    if (activeStep === steps.length - 1) {
      const newCart = cart ? JSON.parse(cart) : [];
      newCart.push({
        name: cover.name,
        type: cover.cover_type,
        acceptanceTime,
        coveredAssetId,
        coveredDuration,
        coveredAmount,
        calculatedCost,
      });
      setCart(JSON.stringify(newCart));
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [coveredAssetId, setCoveredAssetId] = useState("");
  const [coveredAmount, setCoveredAmount] = useState(0);
  const [coveredDuration, setCoveredDuration] = useState(0);
  const [completions, setCompletions] = useState([false, true, false]);

  useEffect(() => {
    setCompletions((prevCompletions) => [
      !!coveredAssetId && !!coveredAmount && !!coveredDuration,
      prevCompletions[1],
      prevCompletions[2],
    ]);
  }, [coveredAssetId, coveredAmount, coveredDuration]);

  const [calculatedCost, setCalculatedCost] = useState(0);
  const [convertedCost, setConvertedCost] = useState(0);
  const [calculatedExpiryDate, setCalculatedCalculatedExpiryDate] = useState(
    new Date()
  );

  const calculateCost = () => {
    // get-cover-estimate_
    fetchCoverEstimate(cover.name, coveredAmount).then((amount) => {
      setCalculatedCost(amount);
    });
  };

  useEffect(() => {
    const convert = async () => {
      try {
        const valueInUsd = await convertPrice(+calculatedCost, "STX", "USD");
        setConvertedCost(+valueInUsd.toFixed(2));
      } catch (error) {
        console.log("Error fetching value");
        return 0;
      }
    };
    convert().catch(console.error);
  }, [calculatedCost]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  useEffect(() => {
    setCompletions((prevCompletions) => [
      prevCompletions[0],
      prevCompletions[1],
      !!firstName && !!lastName && !!city && !!street,
    ]);
  }, [firstName, lastName, city, street]);

  return (
    <Stack sx={{ minHeight: "500px" }} justifyContent="space-between">
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Stack padding={2}>
        {activeStep === 0 && (
          <>
            <Grid container>
              <Grid item sm={12}>
                <Typography variant="h4" style={{ fontSize: "22px" }}>
                  Address To Cover
                </Typography>
              </Grid>
              <Grid item paddingY={2} sm={6}>
                <Typography>
                  Enter the asset indentifier that you would like to cover.
                </Typography>
              </Grid>
              <Grid item padding={2} sm={6}>
                <TextField
                  required
                  id="outlined-required"
                  label="Covered address"
                  size="small"
                  value={coveredAssetId}
                  onChange={(e) => setCoveredAssetId(e.target.value)}
                />
              </Grid>
            </Grid>
            <Divider></Divider>
            <Grid container>
              <Grid item sm={12}>
                <Typography variant="h4" style={{ fontSize: "22px" }}>
                  Coverage Amount
                </Typography>
              </Grid>
              <Grid item paddingY={2} sm={6}>
                <Typography>
                  Enter the asset indentifier that you would like to cover.
                </Typography>
              </Grid>
              <Grid item padding={2} sm={6}>
                <TextField
                  required
                  id="outlined-required"
                  label="Amount"
                  size="small"
                  value={coveredAmount}
                  onChange={(e) => setCoveredAmount(+e.target.value)}
                />
              </Grid>
            </Grid>
            <Divider></Divider>
            <Grid container>
              <Grid item sm={12}>
                <Typography variant="h4" style={{ fontSize: "22px" }}>
                  Duration
                </Typography>
              </Grid>
              <Grid item paddingY={2} sm={6}>
                <Typography>
                  Represents number of days your coverage will last.
                </Typography>
              </Grid>
              <Grid item padding={2} sm={6}>
                <TextField
                  required
                  id="outlined-required"
                  label="Duration"
                  size="small"
                  value={coveredDuration}
                  onChange={(e) => setCoveredDuration(+e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        )}
        {activeStep === 1 && (
          <Stack gap={2}>
            <Paper style={{ padding: "1rem" }} variant="outlined">
              <Typography variant="h4" style={{ fontSize: "20px" }}>
                Cost of Cover
              </Typography>
              <Stack direction="row">
                <Typography style={{ fontWeight: "600" }}>
                  {calculatedCost} STX
                </Typography>
                <Typography style={{ fontWeight: "600" }}>
                  ($ {convertedCost})
                </Typography>
              </Stack>
            </Paper>
            <Paper style={{ padding: "1rem" }} variant="outlined">
              <Typography variant="h4" style={{ fontSize: "20px" }}>
                Smart Contract Address
              </Typography>
              <Typography>{coveredAssetId}</Typography>
            </Paper>
            <Paper style={{ padding: "1rem" }} variant="outlined">
              <Typography variant="h4" style={{ fontSize: "20px" }}>
                Payout amount
              </Typography>
              <Typography style={{ fontWeight: "600" }}>
                {coveredAmount} STX
              </Typography>
            </Paper>
            <Paper style={{ padding: "1rem" }} variant="outlined">
              <Typography variant="h4" style={{ fontSize: "20px" }}>
                Coverage duration
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography style={{ fontWeight: "600" }}>
                  {coveredDuration} days
                </Typography>
                <Typography color="grey" style={{ fontWeight: "200" }}>
                  ({calculatedExpiryDate.toDateString()})
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        )}
        {activeStep === 2 && (
          <Stack>
            <Grid container>
              <Grid item sm={12}>
                <Typography variant="h4" style={{ fontSize: "22px" }}>
                  To purchase the cover you have to verify your identity
                </Typography>
              </Grid>
              <Grid item paddingY={2} sm={6}>
                <Typography>
                  <TextField
                    required
                    id="outlined-required"
                    label="First name"
                    size="small"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Typography>
              </Grid>
              <Grid item paddingY={2} sm={6}>
                <TextField
                  required
                  id="outlined-required"
                  label="Last name"
                  size="small"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item mr={3} paddingY={2} sm={12}>
                <TextField
                  style={{ width: "100%" }}
                  required
                  id="outlined-required"
                  label="City"
                  size="small"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid item mr={3} paddingY={2} sm={12}>
                <TextField
                  style={{ width: "100%" }}
                  required
                  id="outlined-required"
                  label="Street"
                  size="small"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </Grid>
            </Grid>
          </Stack>
        )}
      </Stack>

      {activeStep === steps.length && (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed, the coverage with accepted quote has been
            placed into your basket.
            <br />
            You have 20 minutes to make the payment.
            <br />
            Click <Link href="/dashboard/checkout">here</Link> to go to the
            checkout page.
          </Typography>
        </Fragment>
      )}

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }} mt="auto">
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          variant={activeStep === 1 ? "contained" : "outlined"}
          disabled={!completions[activeStep]}
          onClick={handleNext}
        >
          {activeStep === 1
            ? "Accept Quote"
            : activeStep === steps.length - 1
            ? "Finish"
            : "Next"}
        </Button>
      </Box>
    </Stack>
  );
};

export default BuySmartContractCover;
