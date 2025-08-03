import React, { createContext, useContext, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export const NotificationProvider = ({ children }) => {
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'success' });

  const showNotification = (message, severity = 'success') => {
    setNotif({ open: true, message, severity });
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setNotif(prev => ({ ...prev, open: false }));
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar
        open={notif.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={notif.severity} sx={{ width: '100%' }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
