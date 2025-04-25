import TextField from '@mui/material/TextField';
import { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
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

  const ColorButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: '#8D538D',
    '&:hover': {
      backgroundColor: '#514ACD',
    },
    borderRadius: '8px',
  }));

  const GoogleButton = styled(Button)(() => ({
    color: '#000000',
    backgroundColor: '#FFFFFF',
    border: '1px solid #DADCE0',
    '&:hover': {
      backgroundColor: '#F1F3F4',
    },
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: '500',
  }));

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8D538D] to-[#514ACD]">
          Join DU Tutors Today!
        </h1>
        <p className="text-xl text-gray-700 mt-2">Your Trusted Platform to Find DU Tutors & Tuitions</p>
      </div>

      <div className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden w-[40em]">
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
          <div className="flex items-center gap-2 text-sm mt-4">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <p>or</p>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>
          <GoogleButton
            variant="outlined"
            size="large"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            startIcon={
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.38 7.77 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.62 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            }
          >
            Sign up with Google
          </GoogleButton>
          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>

        <div className="w-1/2 bg-gray-200 flex items-center justify-center">
          <img src="./loginImg.jpeg" alt="Illustration" className="w-full h-auto" />
        </div>
      </div>

      <RegistrationModal open={openModal} onClose={handleCloseModal} userType={formData.userType} />
    </div>
  );
};

export default SignUp;