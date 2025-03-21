import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const navigate = useNavigate();

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
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = decodeToken(token); 
      if (decodedUser) {
        setUser(decodedUser); 
      } else {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false); 
  }, [localStorage.getItem("token")]);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoading(false); 
    navigate('/login'); 
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
