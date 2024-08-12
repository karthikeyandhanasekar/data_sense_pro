/**
 * The main App component that wraps the entire application.
 *
 * This component sets up the basic layout of the application, including
 * the sidebar, header, main content area, and footer. It also handles
 * the toggling of the sidebar on mobile devices.
 *
 * @example
 * <App />
 */
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { styled } from "@mui/system";
import Sidebar from "./components/SideBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/Main";
import { useMediaQuery } from "@mui/material";
import { DialogProvider } from "./components/alerts/DialogContent";
import AlertDialog from "./components/alerts/AlertDialog";
import { LoadingProvider } from "./components/Loading/loadingProvider";
import LoadingScreen from "./components/Loading/LoaderComponent";
/**
 * The width of the sidebar in pixels.
 *
 * @constant
 * @type {string}
 */
const drawerWidth = "150px";

/**
 * A styled main component that handles the layout of the main content area.
 *
 * This component takes an `open` prop that determines whether the sidebar
 * is open or closed. It also uses the `theme` prop to access the current
 * theme and apply styles accordingly.
 *
 * @example
 * <Main open={true}>
 *   <Header />
 *   <MainPage />
 *   <Footer />
 * </Main>
 */
const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  display:"flex",
  flexDirection:"column",
  padding: theme.spacing(0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
  },
}));

/**
 * The main App function component.
 *
 * This component sets up the application's theme, handles the toggling
 * of the sidebar, and renders the main layout components.
 *
 * @returns {React.ReactElement} The App component.
 */
function App() {
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = React.useState(!isMobile);

  /**
   * Handles the toggling of the sidebar.
   *
   * @function
   */
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <BrowserRouter>
      <LoadingProvider>
        <DialogProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ display: "flex" }}>
              {/* <Sidebar
                isMobile={isMobile}
                open={open}
                handleDrawerToggle={handleDrawerToggle}
                drawerWidth={drawerWidth}
              /> */}
              <Main open={open}>
                <Header open={open} handleDrawerToggle={handleDrawerToggle} />
                <MainPage />
                {/* <Footer /> */}
              </Main>
          
            </div>
            <AlertDialog />
          </ThemeProvider>
        </DialogProvider>
        <LoadingScreen />
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
