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
import GavelIcon from "@mui/icons-material/Gavel";
import GroupsIcon from "@mui/icons-material/Groups";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { showConnect } from "@stacks/connect";

import { userSession } from "../../util/stacksInit.ts";
import "../../App.scss";

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
  const [open, setOpen] = useState(false);
  const [network, setNetwork] = useState("Testnet");
  const [userData, setUserData] = useState({});

  const toggleNetwork = () => {
    setNetwork(network === "Testnet" ? "Mainnet" : "Testnet");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
      console.log(userSession.loadUserData());
    }
  }, []);

  const myAppName = "My Stacks Web-App";
  const myAppIcon = window.location.origin + "/my_logo.png";

  const connect = () => {
    showConnect({
      userSession,
      appDetails: {
        name: myAppName,
        icon: myAppIcon,
      },
      onFinish: (resp) => {
        console.log(resp);
      },
      onCancel: () => {
        console.log("cancelled");
      },
    });
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
          <ShoppingCartIcon
            style={{ marginLeft: "auto", marginRight: "1rem" }}
          ></ShoppingCartIcon>
          {!userSession.isUserSignedIn() ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => connect()}
            >
              Connect your wallet
            </Button>
          ) : (
            <>
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => userSession.signUserOut()}
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
              name: "Exchange",
              href: "/dashboard/exchange",
              icon: (
                <CurrencyExchangeIcon fontSize="small"></CurrencyExchangeIcon>
              ),
            },
            {
              name: "Covers",
              href: "/dashboard/buy",
              icon: <GavelIcon fontSize="small"></GavelIcon>,
            },
            {
              name: "Claims",
              href: "/dashboard/claim",
              icon: <ReceiptIcon fontSize="small"></ReceiptIcon>,
            },
            {
              name: "The Crew",
              external: true,
              href: import.meta.env.VITE_CREW_HREF,
              icon: <GroupsIcon fontSize="small"></GroupsIcon>,
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
                target={menuItem.external ? "_blank" : ""}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {menuItem.icon}
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
        {/* TODO */}
        {open && (
          <Box paddingX={1} mt="auto">
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
        )}
        {userSession.isUserSignedIn() && open && (
          <div
            style={{
              padding: "1rem",
            }}
          >
            <div
              style={{
                maxWidth: "240px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Identity Address:
              <Tooltip
                placement="top-start"
                title={userData.identityAddress}
                style={{ textDecoration: "underline" }}
              >
                {userData.identityAddress}
              </Tooltip>
            </div>
            <div>
              <div>STX/BTC Address:</div>
              <Stack direction="row" gap={0.25}>
                <div style={{ maxWidth: "100px", overflow: "hidden" }}>
                  <Tooltip
                    placement="top-start"
                    title={userData.profile?.stxAddress?.testnet}
                    style={{ textDecoration: "underline" }}
                  >
                    {userData.profile?.stxAddress.testnet}
                  </Tooltip>
                </div>
                /
                <div style={{ maxWidth: "100px", overflow: "hidden" }}>
                  <Tooltip
                    placement="top-start"
                    title={userData.profile?.btcAddress}
                    style={{ textDecoration: "underline" }}
                  >
                    {userData.profile?.btcAddress}
                  </Tooltip>
                </div>
              </Stack>
            </div>
          </div>
        )}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
