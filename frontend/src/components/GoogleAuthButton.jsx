import React from 'react';
import { GoogleButton, GoogleIcon } from './AuthStyles';

const GoogleAuthButton = ({ onClick, isLoading, buttonText }) => {
  return (
    <GoogleButton
      variant="outlined"
      size="large"
      onClick={onClick}
      disabled={isLoading}
      startIcon={<GoogleIcon />}
    >
      {buttonText}
    </GoogleButton>
  );
};

export default GoogleAuthButton;