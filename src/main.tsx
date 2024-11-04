import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store/store';
import './main.css';

import { theme } from '@theme';
import { StyledSnackbar } from '@components/shared/Snackbar/styled';
import { LoadingProvider } from '@contexts/LoadingContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          autoHideDuration={3000}
          preventDuplicate
          hideIconVariant
          Components={{
            success: StyledSnackbar,
            error: StyledSnackbar
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </SnackbarProvider>
      </LoadingProvider>
    </ThemeProvider>
  </Provider>
);
