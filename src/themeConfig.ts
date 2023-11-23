import { createTheme } from '@mui/material/styles';

interface CustomPalette {
  lightGray: string;
  gray: string;
}

export const palette = {
  lightGray: '#F8F9FB',
  gray: '#5F6D7E'
};

declare module '@mui/material/styles' {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

export const theme = createTheme({
  palette: {
    ...palette,
    background: {
      paper: '#F8F9FB',
      default: '#fff'
    },
    divider: '#D1D9E2'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: 'none'
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '6px 20px',
          color: palette.gray,
          fontSize: '14px'
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '14px 0'
        }
      }
    }
  },

  typography: {
    fontFamily: 'Inter, sans-serif'
  }
});
