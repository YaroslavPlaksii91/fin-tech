import { createTheme } from '@mui/material/styles';

interface CustomPalette {
  lightGray: string;
  grayLine: string;
  gray: string;
  pink: string;
  lightGreen: string;
  white: string;
  whiteSmoke: string;
  dark: string;
  yellow: string;
  secondary: string;
  grayBorder: string;
  successBackground: string;
  successBorder: string;
  errorBackground: string;
  blue: string;
  aliceBlue: string;
}

export const palette = {
  lightGray: '#F8F9FB',
  gray: '#5F6D7E',
  grayLine: '#8FA5BE',
  grayBorder: '#D1D9E2',
  pink: '#FFB4B4',
  dark: '#2E3646',
  primary: '#2E3646',
  secondary: '#E6E9EC',
  lightGreen: '#ABDCB9',
  white: '#FFF',
  whiteSmoke: '#F4F4F4',
  yellow: '#DDCD93',
  blue: '#25314C',
  successBackground: '#EBF9F1',
  successBorder: '#C4D9CD',
  errorBackground: '#FFCCCC',
  error: '#E24A4A',
  aliceBlue: '#F8F9FB'
};

declare module '@mui/material/styles' {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

export const theme = createTheme({
  palette: {
    ...palette,
    text: {
      primary: palette.gray
    },
    primary: {
      main: palette.primary
    },
    secondary: {
      main: palette.secondary,
      contrastText: palette.gray
    },
    background: {
      paper: palette.lightGray,
      default: palette.white
    },
    error: {
      main: palette.error
    },
    divider: '#E8ECF1'
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: '500'
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {}
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          textTransform: 'none',
          borderRadius: '8px',
          boxShadow: 'none',
          minWidth: 'auto'
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
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          minWidth: '464px',
          boxShadow: 'none',
          borderRadius: '12px'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px 24px',
          color: palette.dark,
          fontWeight: '600',
          fontSize: '28px',
          lineHeight: '38px'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 24px 24px'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '0px 24px 24px 24px'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          lineHeight: '18px',
          padding: '12px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          border: `1px solid ${palette.grayBorder}`
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '14px'
        }
      }
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '28px',
      lineHeight: '24px',
      fontWeight: 600,
      color: palette.dark
    },
    h2: {
      fontSize: '24px',
      lineHeight: '38px',
      fontWeight: 600,
      color: palette.dark
    },
    h3: {
      fontSize: '22px',
      lineHeight: '38px',
      fontWeight: 600,
      color: palette.dark
    },
    h4: {
      fontSize: '20px',
      lineHeight: '30px',
      fontWeight: 500,
      color: palette.dark
    },
    h5: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 600,
      color: palette.dark
    },
    h6: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600,
      color: palette.dark
    },
    subtitle1: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 500
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400
    },
    body2: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: 400
    },
    caption: {
      fontSize: '12px',
      lineHeight: '20px',
      fontWeight: 400
    }
  }
});
