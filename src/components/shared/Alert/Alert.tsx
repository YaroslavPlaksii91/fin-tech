import React from 'react';
import MuiAlert from '@mui/material/Alert';
import MuiAlertTitle from '@mui/material/AlertTitle';

interface AlertProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title?: string;
}

const Alert: React.FC<AlertProps> = ({ type, title, message }) => (
  <MuiAlert severity={type} sx={{ marginTop: 1, marginBottom: 1 }}>
    {title && <MuiAlertTitle>{title}</MuiAlertTitle>}
    {message}
  </MuiAlert>
);

export default Alert;
