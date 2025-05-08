import React from 'react';
import './css/Snackbar.css';

const SnackBar = ({ message, open, onClose }) => {
  return (
    <div className={`snackbar ${open ? 'show' : ''}`}>
      <span>{message}</span>
    </div>
  );
};

export default SnackBar;
