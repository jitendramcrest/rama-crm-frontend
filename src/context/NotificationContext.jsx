import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    vertical: 'top',
    horizontal: 'center',
  });

  const showNotification = useCallback(({ message, severity = 'info', position = 'top-center' }) => {
    const [vertical, horizontal] = position.split('-');
    setNotification({
      open: true,
      message,
      severity,
      vertical,
      horizontal,
    });
  }, []);

  const handleClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: notification.vertical,
          horizontal: notification.horizontal,
        }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
