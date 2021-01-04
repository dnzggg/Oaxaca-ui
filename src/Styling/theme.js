import { createMuiTheme } from "@material-ui/core/styles";

// Global theme used to provide colours for this web application.

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#87D333"
    },
    secondary: {
      main: "#fbc531"
    },
    error: {
      main: "#e84118"
    },
    background: {
      default: "#f5f6fa"
    },
  }
});

export default theme;
