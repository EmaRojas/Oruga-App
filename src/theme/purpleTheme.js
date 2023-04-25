import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const purpleTheme = createTheme({
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