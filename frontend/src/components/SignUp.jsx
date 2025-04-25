import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';
import AuthLayout from '../components/AuthLayout';
import { ColorButton } from '../components/AuthStyles';
import GoogleAuthButton from '../components/GoogleAuthButton';
import FormDivider from '../components/FormDivider';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    userType: 'student',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
      const response = await fetch('http://localhost:3500/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Registration failed');
      }

      setOpenModal(true);
      setFormData({
        email: '',
        name: '',
        password: '',
        userType: 'student',
      });
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/login');
  };

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    console.log('GoogleLogin triggered for SignUp');
    setGoogleLoading(true);
    window.location.href = 'http://localhost:3500/auth/google';
  };

  return (
    <AuthLayout 
      title="Join DU Tutors Today!" 
      subtitle="Your Trusted Platform to Find DU Tutors & Tuitions"
    >
      <form className="flex flex-col gap-4 w-1/2 p-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">SignUp</h1>
        <TextField
          id="signup-email"
          label="Email"
          variant="outlined"
          onChange={handleChange}
          type="email"
          name="email"
          value={formData.email}
        />
        <TextField
          id="signup-username"
          label="Username"
          variant="outlined"
          onChange={handleChange}
          type="text"
          name="name"
          value={formData.name}
        />
        <TextField
          id="signup-password"
          label="Password"
          variant="outlined"
          onChange={handleChange}
          type="password"
          name="password"
          value={formData.password}
        />
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ColorButton variant="contained" size="large" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'SignUp'}
        </ColorButton>
        
        <FormDivider />
        
        <GoogleAuthButton 
          onClick={handleGoogleLogin}
          isLoading={googleLoading}
          buttonText="Sign up with Google"
        />
        
        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>

      <RegistrationModal open={openModal} onClose={handleCloseModal} userType={formData.userType} />
    </AuthLayout>
  );
};

export default SignUp;
