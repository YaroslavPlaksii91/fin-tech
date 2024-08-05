import { createTheme } from '@mui/material/styles';

interface CustomPalette {
  gray: string;
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
  amber: string;
  sidebarBackground: string;
  sidebarItemHover: string;
}

export const customBoxShadows = {
  elevation1: '0px 8px 12px -2px rgba(0, 0, 0, 0.07)'
};

export const palette = {
  gray: '#5F6D7E',
  grayBorder: '#D1D9E2',
  dark: '#2E3646',
  primary: '#2E3646',
  primaryDark: '#1e4620',
  secondary: '#E6E9EC',
  white: '#FFF',
  whiteSmoke: '#F4F4F4',
  yellow: '#DDCD93',
  blue: '#25314C',
  successBackground: '#EBF9F1',
  successBorder: '#C4D9CD',
  errorBackground: '#FFCCCC',
  error: '#E24A4A',
  aliceBlue: '#F8F9FB',
  amber: '#FFF8E1',
  sidebarBackground: '#E7E8EB',
  sidebarItemHover: '#dedfe2'
};

declare module '@mui/material/styles' {
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

export const theme = createTheme({
  palette: {
    ...palette,
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.6)',
      disabled: 'rgba(0,0,0,0.38)'
    },
    success: { main: '#2E7D32' },
    secondary: { main: '#1B5E20', dark: '#1E4620', light: '#2E7D32' },
    primary: {
      main: '#1B5E20',
      dark: '#1E4620',
      light: '#2E7D32'
    },
    background: {
      default: '#F8F8FA',
      paper: '#FFFFFF'
    },
    error: {
      main: '#D32F2F',
      dark: '#C62828',
      light: '#EF5350'
    },
    info: {
      main: '#0288D1',
      dark: '#01579B',
      light: '#03A9F4'
    },
    action: {
      active: 'rgba(0,0,0,0.56)',
      hover: 'rgba(0,0,0,0.04)',
      selected: 'rgba(0,0,0,0.08)',
      disabledBackground: 'rgba(0,0,0,0.12)',
      focus: 'rgba(0,0,0,0.12)',
      disabled: 'rgba(0,0,0,0.38)'
    },
    divider: 'rgba(0,0,0,0.12)',
    common: {
      white: '#FFFFFF',
      black: 'rgba(0,0,0,0.87)'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#1E4620'
        }
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
          textTransform: 'none',
          borderRadius: '6px',
          boxShadow: 'none',
          minWidth: 'auto'
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px 8px 24px'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 8px 24px'
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto !important',
          paddingRight: '8px'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          minWidth: '444px',
          borderRadius: '12px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px'
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: '14px'
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        spacer: { flex: 0 },
        toolbar: {
          display: 'flex',
          alignItems: 'center',
          padding: '0 !important'
        },
        actions: {
          display: 'flex',
          justifyContent: 'flex-end',
          flexGrow: 1
        },
        input: { margin: '0 8px' },
        displayedRows: { color: 'rgba(0,0,0,0.38)', margin: 0 }
      }
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontSize: '96px',
      lineHeight: '112px',
      fontWeight: 300,
      letterSpacing: '-2.5px'
    },
    h2: {
      fontSize: '60px',
      lineHeight: '72px',
      fontWeight: 300,
      letterSpacing: '-2.5px'
    },
    h3: {
      fontSize: '48px',
      lineHeight: '56px',
      fontWeight: 400,
      letterSpacing: '-2px'
    },
    h4: {
      fontSize: '34px',
      lineHeight: '42px',
      fontWeight: 400,
      letterSpacing: '-1.5px'
    },
    h5: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 400,
      letterSpacing: '-1px'
    },
    h6: {
      fontSize: '20px',
      lineHeight: '32px',
      fontWeight: 500,
      letterSpacing: '-1px'
    },
    subtitle1: {
      fontSize: '16px',
      lineHeight: '28px',
      fontWeight: 400,
      letterSpacing: '-0.2px'
    },
    subtitle2: {
      fontSize: '14px',
      lineHeight: '22px',
      fontWeight: 500,
      letterSpacing: '-0.2px'
    },
    body1: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 400,
      letterSpacing: '-0.5px'
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: '-0.3px'
    },
    caption: {
      fontSize: '12px',
      lineHeight: '17px',
      fontWeight: 400,
      letterSpacing: '-0.2px'
    },
    overline: {
      fontSize: '12px',
      lineHeight: '32px',
      fontWeight: 400,
      letterSpacing: '0.5px'
    }
  }
});
