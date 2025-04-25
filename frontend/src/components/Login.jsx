import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { ColorButton } from '../components/AuthStyles';
import GoogleAuthButton from '../components/GoogleAuthButton';
import FormDivider from '../components/FormDivider';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3500/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to login');
      }
      const { token, user } = await response.json();
      login(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
        token
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    console.log('GoogleLogin triggered for Login');
    setGoogleLoading(true);
    window.location.href = 'http://localhost:3500/auth/google';
  };

  return (
    <AuthLayout 
      title="Welcome to DU Tutors" 
      subtitle="Your Trusted Platform to Find DU Tutors & Tuitions"
    >
      <form className="flex flex-col gap-4 w-1/2 p-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Login</h1>
        <TextField
          id="login-email"
          label="Email"
          variant="outlined"
          onChange={handleChange}
          type="email"
          name="email"
          value={formData.email}
        />
        <TextField
          id="login-password"
          label="Password"
          variant="outlined"
          onChange={handleChange}
          type="password"
          name="password"
          value={formData.password}
        />
        <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline self-center">
          Forgot Password?
        </Link>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ColorButton variant="contained" size="large" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </ColorButton>
        
        <FormDivider />
        
        <GoogleAuthButton 
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
          buttonText="Sign in with Google"
        />
        
        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
