import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[500]
    },
    secondary: {
      main: '#11cb5f'
    }
  }
});
