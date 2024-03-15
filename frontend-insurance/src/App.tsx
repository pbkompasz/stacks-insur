import "./App.scss";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

function App() {
  return (

      <Stack
        spacing={2}
        direction="row"
        justifyContent="evenly"
        alignItems="center"
        className="header"
        sx={{ borderBottom: 1, borderColor: "primary.main" }}
      >
        <Link href="/products">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/how-it-works">How it works</Link>
        <Button
          variant="outlined"
          style={{ marginLeft: "auto" }}
        >
          Get covered
        </Button>
      </Stack>
  );
}

export default App;
