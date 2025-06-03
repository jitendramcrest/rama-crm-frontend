import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {

  const routeTitles = {
    '/': 'Dashboard',
    '/employees': 'Employees',
    '/employee/add': 'Add Employee',
  };

  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] ? `${routeTitles[location.pathname]} | RAMA-CRM` : 'RAMA-CRM';

  document.title = pageTitle;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'gray-50' }}>
        <CssBaseline />
                             
        <Header pageTitle={pageTitle} />

        <Sidebar role="admin" />

        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: '#f4f7ff', p: 3 }}
            >
            <Toolbar />
            <Outlet />
        </Box>
    </Box>
  );
};

export default Layout;
