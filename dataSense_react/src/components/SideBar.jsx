import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  styled,
} from "@mui/material";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

/**
 * Sidebar component renders a navigation drawer.
 * @param {boolean} isMobile - Determines if the device is mobile.
 * @param {boolean} open - Controls if the drawer is open.
 * @param {function} handleDrawerToggle - Function to toggle the drawer open/close.
 * @param {string} drawerWidth - Width of the sidebar.
 */
const Sidebar = ({ isMobile, open, handleDrawerToggle, drawerWidth }) => {
  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        border:"none",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 0,
          boxSizing: "border-box",
        },
      }}
    >
      <div>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          onClick={isMobile ? handleDrawerToggle : undefined}
        >
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
