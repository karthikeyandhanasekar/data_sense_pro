import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/images/logo.svg";
import { getCookie } from "../services/cookieServices";
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = useLocation().pathname;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isLoginedCookie = getCookie("islogined");
  const isLogined = false;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" style={{ boxShadow: "none" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <img
            src={logo}
            alt="Logo"
            loading="lazy"
            style={{ height: "40px", marginRight: "16px" }}
          />
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {!isLogined && (
                <>
                  <MenuItem
                    disabled={"/" === pathname}
                    onClick={handleMenuClose}
                    component={Link}
                    to="/"
                  >
                    Home
                  </MenuItem>
                  <MenuItem
                    disabled={"/aboutUs" === pathname}
                    onClick={handleMenuClose}
                    component={Link}
                    to="/aboutUs"
                  >
                    About
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    disabled={"/contactUs" === pathname}
                    to="/contactUs"
                  >
                    Contact
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    disabled={"/pricing" === pathname}
                    to="/pricing"
                  >
                    Pricing
                  </MenuItem>
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    disabled={"/upload" === pathname}
                    to="/upload"
                  >
                    Profiler
                  </MenuItem>
                </>
              )}
              <MenuItem
                onClick={handleMenuClose}
                disabled={"/login" === pathname}
                component={Link}
                to="/login"
              >
                {isLoginedCookie ? "Logout" : "Login"}
              </MenuItem>
              {/* <MenuItem onClick={handleMenuClose} component={Link} to="/signup">
                Sign Up
              </MenuItem> */}
            </Menu>
          </>
        ) : (
          <>
            {!isLogined && (
              <>
                <Button
                  disabled={"/" === pathname}
                  color="inherit"
                  component={Link}
                  to="/"
                >
                  Home
                </Button>
                <Button
                  disabled={"/aboutUs" === pathname}
                  color="inherit"
                  component={Link}
                  to="/aboutUs"
                >
                  About
                </Button>
                <Button
                  disabled={"/contactUs" === pathname}
                  color="inherit"
                  component={Link}
                  to="/contactUs"
                >
                  Contact
                </Button>
                <Button
                  disabled={"/pricing" === pathname}
                  color="inherit"
                  component={Link}
                  to="/pricing"
                >
                  Pricing
                </Button>
                <Button
                  disabled={"/upload" === pathname}
                  color="inherit"
                  component={Link}
                  to="/upload"
                >
                  Profiler
                </Button>
              </>
            )}

            <Button
              sx={{ background: "#ff5500" }}
              color="inherit"
              component={Link}
              to="/login"
              disabled={"/login" === pathname}
            >
              {isLoginedCookie ? "Logout" : "Login"}
            </Button>
            {/* <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/signup"
              style={{ marginLeft: "10px" }}
            >
              Sign Up
            </Button> */}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
