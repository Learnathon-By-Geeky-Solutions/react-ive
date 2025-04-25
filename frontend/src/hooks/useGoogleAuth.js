import { useState } from 'react';

const useGoogleAuth = () => {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    console.log('GoogleLogin triggered');
    setGoogleLoading(true);
    window.location.href = 'http://localhost:3500/auth/google';
  };

  return {
    googleLoading,
    handleGoogleLogin
  };
};

export default useGoogleAuth;