import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  useEffect(() => {
    // Handle Google OAuth callback
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      localStorage.setItem('token', token);
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
        navigate('/');
      } else {
        localStorage.removeItem('token');
      }
    }

    // Check for existing token
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser) {
        setUser(decodedUser);
      } else {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, [location, navigate]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false);
    navigate('/login');
  };

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);