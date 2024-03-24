import { Outlet } from "react-router-dom";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import "./LandingLayout.scss";

const LandingLayout = () => {
  return (
    <>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="evenly"
        alignItems="center"
        className="header"
        sx={{ borderBottom: 1, borderColor: "primary.main" }}
      >
        <Link href="/">Home</Link>
        {/* <Link href="/products">Products</Link> */}
        <Link href="/how-it-works">How it works</Link>
        <Button
          variant="outlined"
          style={{ marginLeft: "auto" }}
          href="/dashboard/buy"
        >
          Dashboard
        </Button>
      </Stack>
      <Outlet />
    </>
  );
};

export default LandingLayout;
