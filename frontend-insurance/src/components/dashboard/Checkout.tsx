import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  useEffect,
  useState,
} from "react";
import { StacksTestnet } from "@stacks/network";
import { useLocalStorage } from "../../util/useLocalStorage";
import { uintCV, stringAsciiCV } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";

type CartItem = {
  type: string;
  name: string;
  coveredAssetId: string;
  coveredAmount: string | number;
  coveredDuration: string | number;
  calculatedCost: string | number;
};

const Checkout = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingTime, setRemainingTime] = useState(10 * 60);
  const [isOver, setIsOver] = useState(false);
  const [acceptanceTime] = useLocalStorage("acceptanceTime");
  const [cart, setCart] = useLocalStorage("cart");

  useEffect(() => {
    setTotalAmount(
      (cart ? JSON.parse(cart) : []).reduce(
        (acc: number, cur: { calculatedCost: number }) =>
          acc + cur.calculatedCost,
        0
      )
    );
  }, [cart]);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (acceptanceTime) {
      const t1 = new Date(acceptanceTime);
      const t2 = new Date();
      const dif = t1.getTime() - t2.getTime();

      setRemainingTime(Math.round(dif / 1000));
      setIsOver(false);
    }

    if (!isOver) {
      timerId = setInterval(() => {
        setRemainingTime((time) => {
          if (time < 0) {
            clearInterval(timerId);
            setIsOver(true);
          }
          return time - 1;
        });
      }, 1000);
    }
  }, [isOver]);

  const pay = async () => {
    let c  =(cart ? JSON.parse(cart) : [])[0];
    console.log(c)
    const functionArgs = [
      stringAsciiCV(c.name),
      uintCV(c.calculatedCost * 100000),
      uintCV(c.coveredDuration), 
    ];

    const options = {
      contractAddress: import.meta.env.VITE_AMM_CONTRACT,
      contractName: "cover",
      functionName: "buy-cover",
      functionArgs,
      network: new StacksTestnet(),
      appDetails: {
        name: "DeIns Mutual",
        icon: window.location.origin + "/my-app-logo.svg",
      },
      onFinish: (data: string) => {
        console.log(data);
        setCart(JSON.stringify([]));
      },
    };
    // @ts-expect-error Sponsored should be optional
    await openContractCall(options);
  };

  return (
    <>
      <Typography variant="h1" style={{ textAlign: "left", fontSize: "24px" }}>
        Checkout
      </Typography>
      <Grid container paddingTop={2} style={{ minHeight: "80vh" }}>
        <Grid item sm={7}>
          <Box
            style={{ border: "1px solid", borderRadius: "5px", width: "300px" }}
            padding={2}
            margin="auto"
          >
            {acceptanceTime && remainingTime > 0 && (
              <>
                Acceptance time: {new Date(acceptanceTime).toDateString()} /{" "}
                {new Date(acceptanceTime).toLocaleTimeString()}
                <Typography style={{ whiteSpace: "nowrap" }} mb={1}>
                  Remaining time: {remainingTime} seconds
                </Typography>
              </>
            )}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={isOver || (!acceptanceTime && remainingTime <= 0) || !totalAmount}
              onClick={pay}
            >
              Pay
            </Button>
          </Box>
        </Grid>
        <Grid item padding={2} sm={5} style={{ borderLeft: "1px solid" }}>
          <Stack gap={1}>
            {(cart ? JSON.parse(cart) : []).map((item: CartItem) => (
              <Stack direction="row" key={item.name} justifyContent="space-between">
                <Stack style={{ textAlign: "left" }}>
                  <Typography style={{ fontSize: "20px", fontWeight: "600" }}>
                    {item.type} {item.name ?? "Insurance"}
                  </Typography>
                  <Typography style={{ fontSize: "16px" }}>
                    {item.coveredAssetId}
                  </Typography>
                  <Typography color="grey">
                    Amount: {item.coveredAmount}
                  </Typography>
                  <Typography color="grey">
                    Duration: {item.coveredDuration} days
                  </Typography>
                </Stack>
                <Typography>{item.calculatedCost} STX</Typography>
              </Stack>
            ))}
          </Stack>
          <Divider style={{ margin: "1rem 0" }}></Divider>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Total</Typography>
            <Typography>{totalAmount} STX</Typography>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Checkout;
