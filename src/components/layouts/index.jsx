import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const Layout = () => {

  const routeTitles = {
    '/': 'Dashboard',
    '/employees': 'Employees',
    '/employee/add': 'Add Employee',
    '/projects': 'Projects',
    '/project/add': 'Add Project',
  };

  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] ? `${routeTitles[location.pathname]} | RAMA-CRM` : 'RAMA-CRM';

  document.title = pageTitle;

  const userData = useSelector((state) => state?.authData?.user);

  const roleName = userData?.roles?.[0]?.name;
  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'gray-50' }}>
        <CssBaseline />
                             
        <Header pageTitle={pageTitle} />

        <Sidebar role={roleName} />

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
