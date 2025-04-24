import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    userType: 'student',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // Handle Google redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');
    const error = params.get('error');

    if (error) {
      setError(error);
    } else if (token && user) {
      const userData = JSON.parse(decodeURIComponent(user));
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setOpenModal(true); // Show success modal
    }
  }, [location]);

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

  const handleGoogleSuccess = async (credentialResponse) => {
    // Redirect to backend Google OAuth route
    window.location.href = 'http://localhost:3500/auth/google';
  };

  const handleGoogleError = () => {
    setError('Google Sign-In failed');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/login');
  };

  const ColorButton = styled(Button)(() => ({
    color: '#FFFFFF',
    backgroundColor: '#8D538D',
    '&:hover': {
      backgroundColor: '#514ACD',
    },
    borderRadius: '8px',
  }));

  return (
    <GoogleOAuthProvider clientId={"544875149208-e78n9ophsru88eaasm1ljh173224p9n7.apps.googleusercontent.com"}>
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signup_with"
              width="100%"
            />
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
    </GoogleOAuthProvider>
  );
};

export default SignUp;