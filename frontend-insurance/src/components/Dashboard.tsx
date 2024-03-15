import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useEffect, useState } from "react";
import {
  getAddress,
  AddressPurpose,
  BitcoinNetworkType,
  Capability,
  type GetAddressResponse,
  getCapabilities,
} from "sats-connect";
import { Outlet } from "react-router-dom";

import { useLocalStorage } from "./useLocalStorage";

const Dashboard = () => {
  const getAddressOptions = {
    payload: {
      purposes: ["ordinals", "payment"] as AddressPurpose[],
      message: "Address for receiving Ordinals and payments",
      network: {
        type: "Mainnet" as BitcoinNetworkType,
      },
    },
    onFinish: (response: GetAddressResponse) => {
      console.log(response);
      const paymentAddressItem = response.addresses.find(
        (address) => address.purpose === AddressPurpose.Payment
      );
      setPaymentAddress(paymentAddressItem?.address);
      setPaymentPublicKey(paymentAddressItem?.publicKey);

      const ordinalsAddressItem = response.addresses.find(
        (address) => address.purpose === AddressPurpose.Ordinals
      );
      setOrdinalsAddress(ordinalsAddressItem?.address);
      setOrdinalsPublicKey(ordinalsAddressItem?.publicKey);

      const stacksAddressItem = response.addresses.find(
        (address) => address.purpose === AddressPurpose.Stacks
      );
      setStacksAddress(stacksAddressItem?.address);
      setStacksPublicKey(stacksAddressItem?.publicKey);
    },
    onCancel: () => alert("Request canceled"),
  };

  const [paymentAddress, setPaymentAddress] = useLocalStorage("paymentAddress");
  const [paymentPublicKey, setPaymentPublicKey] =
    useLocalStorage("paymentPublicKey");
  const [ordinalsAddress, setOrdinalsAddress] =
    useLocalStorage("ordinalsAddress");
  const [ordinalsPublicKey, setOrdinalsPublicKey] =
    useLocalStorage("ordinalsPublicKey");
  const [stacksAddress, setStacksAddress] = useLocalStorage("stacksAddress");
  const [stacksPublicKey, setStacksPublicKey] =
    useLocalStorage("stacksPublicKey");
  const [network, setNetwork] = useLocalStorage<BitcoinNetworkType>(
    "network",
    BitcoinNetworkType.Testnet
  );
  const [capabilityState, setCapabilityState] = useState<
    "loading" | "loaded" | "missing" | "cancelled"
  >("loading");
  const [capabilities, setCapabilities] = useState<Set<Capability>>();

  const isReady =
    !!paymentAddress &&
    !!paymentPublicKey &&
    !!ordinalsAddress &&
    // TODO
    !!ordinalsPublicKey; //&& !!stacksAddress;

  const onWalletDisconnect = () => {
    setPaymentAddress(undefined);
    setPaymentPublicKey(undefined);
    setOrdinalsAddress(undefined);
    setOrdinalsPublicKey(undefined);
    setStacksAddress(undefined);
  };

  const toggleNetwork = () => {
    setNetwork(
      network === BitcoinNetworkType.Testnet
        ? BitcoinNetworkType.Mainnet
        : BitcoinNetworkType.Testnet
    );
    onWalletDisconnect();
  };

  useEffect(() => {
    const runCapabilityCheck = async () => {
      let runs = 0;
      const MAX_RUNS = 20;
      setCapabilityState("loading");

      // the wallet's in-page script may not be loaded yet, so we'll try a few times
      while (runs < MAX_RUNS) {
        try {
          await getCapabilities({
            onFinish(response) {
              setCapabilities(new Set(response));
              setCapabilityState("loaded");
            },
            onCancel() {
              setCapabilityState("cancelled");
            },
            payload: {
              network: {
                type: network,
              },
            },
          });
        } catch (e) {
          runs++;
          if (runs === MAX_RUNS) {
            setCapabilityState("missing");
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    runCapabilityCheck();
  }, [network]);

  return (
    <div className="dashboard">
      <Stack
        className="dashboard__header"
        direction="row"
        alignItems="center"
        spacing={2}
        padding={2}
      >
        <Link href="/dashboard/buy">Covers</Link>
        <Link href="/dashboard/claims">Claims</Link>
        <Link href="https://aibtc.dev/" target="_blank">
          <Stack direction="row" alignItems="center" gap={0.25}>
            The Crew
            <OpenInNewIcon fontSize="small"></OpenInNewIcon>
          </Stack>
        </Link>
        {!isReady ? (
          <Button
            variant="outlined"
            onClick={() => getAddress(getAddressOptions)}
          >
            Connect your wallet
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={() => onWalletDisconnect()}>
              Disconnect
            </Button>
          </>
        )}
        <Box sx={{ border: "2px solid grey" }} padding={1}>
          Selected network: {network}.
          <Button variant="text" onClick={toggleNetwork}>
            Switch Network
            {network === "Mainnet" ? (
              <SwitchLeftIcon></SwitchLeftIcon>
            ) : (
              <SwitchRightIcon></SwitchRightIcon>
            )}
          </Button>
        </Box>
      </Stack>
      <Outlet />
    </div>
  );
};

export default Dashboard;
