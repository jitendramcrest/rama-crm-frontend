import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';

const drawerWidth = 240;


function Header({ pageTitle }) {
  return (
    <AppBar position="fixed"
        sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: 'linear-gradient(90deg, #667eea, #764ba2)',
        }}
    >
        <Toolbar>
            <Typography variant="h6" noWrap component="div" className="text-white font-bold">
            {pageTitle}
            </Typography>
        </Toolbar>
    </AppBar>
  );
}

export default Header;