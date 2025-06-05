import React, { useState } from 'react';
import { Dashboard, People, Settings, Logout, Castle, FormatListBulleted, Grain} from '@mui/icons-material';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from "../../services/auth";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../redux/reducers/authDataSlice";
import { useNotification } from '../../context/NotificationContext';
import { messages } from "../../utils/messages";
import { useLoader } from '../../context/LoaderContext';

const Sidebar = ({ role }) => {

    const { showLoader, hideLoader } = useLoader();
    const { showNotification } = useNotification();
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const drawerWidth = 240;

    const roleMenus = {
        admin: [
            { label: 'Dashboard', icon: <Dashboard />, path: '/' },
            { label: 'Employee', icon: <People />, path: '/employees' },
            { label: 'Logout', icon: <Logout />, path: '/logout' },
        ],
        tl: [
            { label: 'Dashboard', icon: <Dashboard />, path: '/' },
            { label: 'Project', icon: <Castle />, path: '/projects' },
            { label: 'Logout', icon: <Logout />, path: '/logout' },
        ],
        senior: [
            { label: 'Dashboard', icon: <Dashboard />, path: '/' },
            { label: 'Task', icon: <FormatListBulleted />, path: '/tasks' },
            { label: 'Logout', icon: <Logout />, path: '/logout' },
        ],
        junior: [
            { label: 'Dashboard', icon: <Dashboard />, path: '/' },
            { label: 'Task List', icon: <Grain />, path: '/task-list' },
            { label: 'Logout', icon: <Logout />, path: '/logout' },
        ]
    };

    const menuItems = roleMenus[role] || [];

    const handleNavigation = (path) => {
        if (path === '/logout') {
            handleLogout();
        } else {
          navigate(path);
        }
    };

    const handleLogout = async (e) => {
        showLoader();
    
        const res = await authService.logout();
    
        if (res?.success) {
            hideLoader();
            dispatch(setUser(null));
            dispatch(setToken(""));
            showNotification({
                message: 'Logged out successfully!',
                severity: 'success',
                position: 'top-center',
            });
            navigate("/login");
    
            return;
        }
        hideLoader();
        const errorMsg = messages.resError(res?.message);

        showNotification({
            message: errorMsg,
            severity: 'error',
            position: 'top-center',
        });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                background: 'linear-gradient(180deg, #764ba2, #667eea)',
                color: 'white',
            },
            }}
        >
            <Toolbar />
            <List>
            {menuItems.map((item, index) => (
                <ListItem 
                    button 
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    className="hover:bg-purple-700/40 transition-all">
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                </ListItem>
            ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
