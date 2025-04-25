import React from 'react';
import PropTypes from 'prop-types';
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

GoogleAuthButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  buttonText: PropTypes.string.isRequired
};

GoogleAuthButton.defaultProps = {
  isLoading: false
};

export default GoogleAuthButton;