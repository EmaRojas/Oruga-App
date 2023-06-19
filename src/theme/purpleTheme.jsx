import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import PoppinsRegular from '../fonts/Poppins-Regular.ttf';

const raleway = {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    src: `
      local('Poppins'),
      local('Poppins-Regular'),
      url(${PoppinsRegular}) format('ttf')
    `,
    unicodeRange:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
  };

export const purpleTheme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',
      },
      overrides: {
        MuiCssBaseline: {
          '@global': {
            '@font-face': [raleway],
          },
        },
      },
    palette:{
        primary:{
            main:'#003b5d'
        },
        secondary:{
            main: '#d5ec8b'
        },
        error:{
            main: red.A400
        }
    }
})