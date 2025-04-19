import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import RegistrationModal from '../components/RegistrationModal'

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
  const [openModal, setOpenModal] = useState(false);  // State to manage modal visibility


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
      const response = await fetch("http://localhost:3500/auth/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Registration failed");
      }

      // Show modal on successful registration
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
    navigate("/login");
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
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8D538D] to-[#514ACD]'>
          Join DU Tutors Today!
        </h1>
        <p className='text-xl text-gray-700 mt-2'>Your Trusted Platform to Find DU Tutors & Tuitions</p>
      </div>
      
      <div className='flex items-center bg-white shadow-lg rounded-lg overflow-hidden w-[40em]'>
        <form
          className='flex flex-col gap-4 w-1/2 p-8'
          onSubmit={handleSubmit}
        >
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-4'>SignUp</h1>
          <TextField
            id='signup-email'
            label='Email'
            variant='outlined'
            onChange={handleChange}
            type='email'
            name='email'
            value={formData.email}
          />
          <TextField
            id='signup-username'
            label='Username'
            variant='outlined'
            onChange={handleChange}
            type='text'
            name='name'
            value={formData.name}
          />
          <TextField
            id='signup-password'
            label='Password'
            variant='outlined'
            onChange={handleChange}
            type='password'
            name='password'
            value={formData.password}
          />
          {/* <FormControl fullWidth>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="user-type"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="User Type"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="guardian">Guardian</MenuItem>
            </Select>
          </FormControl> */}

          {error && <p className='text-red-500 text-center'>{error}</p>}
          <ColorButton
            variant='contained'
            size='large'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'SignUp'}
          </ColorButton>
          <div className='flex items-center gap-2 text-sm mt-4'>
            <div className='w-full h-[1px] bg-gray-300'></div>
          </div>
          <p className='text-sm text-center mt-4'>
            Already have an account?{' '}
             <Link to='/login' className='text-blue-500 hover:underline'>
              Login
            </Link> 
          </p>
        </form>

        <div className='w-1/2 bg-gray-200 flex items-center justify-center'>
          <img src='./loginImg.jpeg' alt='Illustration' className='w-full h-auto' />
        </div>
      </div>

      {/* Modal for successful registration */}
      <RegistrationModal 
      open={openModal}
      onClose={handleCloseModal}
      userType={formData.userType}
      />
    </div>
  );
};

export default SignUp;