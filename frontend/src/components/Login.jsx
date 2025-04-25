import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import useAuthForm from '../hooks/useAuthForm';
import useGoogleAuth from '../hooks/useGoogleAuth';

const Login = () => {
  const { login } = useAuth();
  
  const initialState = {
    email: '',
    password: '',
  };
  
  const { 
    formData, 
    error, 
    isLoading, 
    handleChange, 
    handleSubmit 
  } = useAuthForm(
    initialState, 
    'login', 
    (responseData) => {
      const { token, user } = responseData;
      login(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        },
        token
      );
    }
  );
  
  const { googleLoading, handleGoogleLogin } = useGoogleAuth();

  const formFields = [
    { name: 'email', label: 'Email', type: 'email', value: formData.email },
    { name: 'password', label: 'Password', type: 'password', value: formData.password },
  ];

  const additionalLink = {
    to: '/forgot-password',
    text: 'Forgot Password?'
  };

  const additionalContent = (
    <p className="text-sm text-center mt-4">
      Don't have an account?{' '}
      <Link to="/signup" className="text-blue-500 hover:underline">
        Register
      </Link>
    </p>
  );

  return (
    <AuthLayout 
      title="Welcome to DU Tutors" 
      subtitle="Your Trusted Platform to Find DU Tutors & Tuitions"
    >
      <AuthForm
        title="Login"
        formFields={formFields}
        buttonText="Login"
        googleButtonText="Sign in with Google"
        isLoading={isLoading}
        googleLoading={googleLoading}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleGoogleLogin={handleGoogleLogin}
        additionalLink={additionalLink}
        additionalContent={additionalContent}
      />
    </AuthLayout>
  );
};


export default Login;