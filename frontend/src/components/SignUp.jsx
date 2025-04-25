import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal';
import AuthLayout from '../components/AuthLayout';
import AuthForm from '../components/AuthForm';
import useAuthForm from '../hooks/useAuthForm';
import useGoogleAuth from '../hooks/useGoogleAuth';

const SignUp = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [userType, setUserType] = useState('student');
  
  const initialState = {
    email: '',
    name: '',
    password: '',
    userType: 'student',
  };
  
  const { 
    formData, 
    error, 
    isLoading, 
    handleChange, 
    handleSubmit: submitForm, 
    resetForm 
  } = useAuthForm(
    initialState, 
    'register', 
    () => {
      setOpenModal(true);
      resetForm();
    }
  );
  
  const { googleLoading, handleGoogleLogin } = useGoogleAuth();

  const handleSubmit = (e) => {
    submitForm(e);
    setUserType(formData.userType);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/login');
  };

  const formFields = [
    { name: 'email', label: 'Email', type: 'email', value: formData.email },
    { name: 'name', label: 'Username', type: 'text', value: formData.name },
    { name: 'password', label: 'Password', type: 'password', value: formData.password },
  ];

  const additionalContent = (
    <p className="text-sm text-center mt-4">
      Already have an account?{' '}
      <Link to="/login" className="text-blue-500 hover:underline">
        Login
      </Link>
    </p>
  );

  return (
    <AuthLayout 
      title="Join DU Tutors Today!" 
      subtitle="Your Trusted Platform to Find DU Tutors & Tuitions"
    >
      <AuthForm
        title="SignUp"
        formFields={formFields}
        buttonText="SignUp"
        googleButtonText="Sign up with Google"
        isLoading={isLoading}
        googleLoading={googleLoading}
        error={error}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleGoogleLogin={handleGoogleLogin}
        additionalContent={additionalContent}
      />

      <RegistrationModal open={openModal} onClose={handleCloseModal} userType={userType} />
    </AuthLayout>
  );
};

export default SignUp;