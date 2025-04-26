import { useState } from 'react';
import { BACKEND_URL } from '../utils/servicesData';

const useGoogleAuth = () => {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    console.log('GoogleLogin triggered');
    setGoogleLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return {
    googleLoading,
    handleGoogleLogin
  };
};

export default useGoogleAuth;