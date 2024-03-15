import { createTheme } from "@mui/material";
import { lime } from '@mui/material/colors';
import palette from './palette.module.scss'

export const theme = createTheme({
  palette: {
    primary: {
      main: palette.primary
    },
    secondary: {
      main: lime[500],
    }
  },
});