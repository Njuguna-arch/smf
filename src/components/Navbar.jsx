import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Topbar = ({ handleDrawerToggle }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }} // Hide on large screens
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Student Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;