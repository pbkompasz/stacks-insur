import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SwitchLeftIcon from "@mui/icons-material/SwitchLeft";
import SwitchRightIcon from "@mui/icons-material/SwitchRight";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Stack from "@mui/material/Stack";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAddress,
  AddressPurpose,
  BitcoinNetworkType,
  Capability,
  type GetAddressResponse,
  getCapabilities,
} from "sats-connect";

import { useLocalStorage } from "../../util/useLocalStorage";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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

  const toggleNetwork = () => {
    setNetwork(
      network === BitcoinNetworkType.Testnet
        ? BitcoinNetworkType.Mainnet
        : BitcoinNetworkType.Testnet
    );
    onWalletDisconnect();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box padding={1} mr="auto">
            Selected network: {network}
            <Tooltip title="Switch Network">
              <Button variant="text" onClick={toggleNetwork} color="secondary">
                {network === "Mainnet" ? (
                  <SwitchLeftIcon></SwitchLeftIcon>
                ) : (
                  <SwitchRightIcon></SwitchRightIcon>
                )}
              </Button>
            </Tooltip>
          </Box>
          {!isReady ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => getAddress(getAddressOptions)}
            >
              Connect your wallet
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => onWalletDisconnect()}
              >
                Disconnect
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              name: "Covers",
              href: "/dashboard/buy",
            },
            {
              name: "Claims",
              href: "/dashboard/claim",
            },
            {
              name: "The Crew",
              external: true,
              href: import.meta.env.VITE_CREW_HREF,
              target: "_blank",
            },
          ].map((menuItem) => (
            <ListItem
              key={menuItem.name}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                href={menuItem.href}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <OpenInNewIcon fontSize="small"></OpenInNewIcon>
                </ListItemIcon>
                <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                  <Stack direction="row" alignItems="center" gap={0.25}>
                    {menuItem.name}
                    {menuItem.external && (
                      <OpenInNewIcon fontSize="small"></OpenInNewIcon>
                    )}
                  </Stack>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
