import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff"
    },
    text: {
      primary: "#000000"
    }
  },
  typography: {
    h5: {
      fontWeight: "bold",
      "@media (max-width:600px)": {
        fontSize: "1.2rem"
      },
      "@media (min-width:600px)": {
        fontSize: "1.5rem"
      },
      "@media (min-width:900px)": {
        fontSize: "1.8rem"
      }
    },
    button: {
      textTransform: "none",
      fontWeight: "bold"
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "black",
            backgroundColor: "transparent"
          },
          "& .MuiInputLabel-root": {
            color: "black"
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          "@media (max-width:600px)": {
            fontSize: "0.9rem"
          },
          "@media (min-width:900px)": {
            fontSize: "1.1rem"
          }
        }
      }
    }
  }
});

export default theme;