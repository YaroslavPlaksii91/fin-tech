import ReactDOM from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';

import App from './App.tsx';
import { store } from './store/store.ts';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import './main.css';

import { theme } from '@theme';
import { StyledSnackbar } from '@components/shared/Snackbar/styled.ts';

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
