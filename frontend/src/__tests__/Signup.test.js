import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../components/SignUp';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useAuthForm from '../hooks/useAuthForm';
import useGoogleAuth from '../hooks/useGoogleAuth';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../hooks/useAuthForm', () => jest.fn());
jest.mock('../hooks/useGoogleAuth', () => jest.fn());

const mockNavigate = jest.fn();
const mockSubmitForm = jest.fn();
const mockHandleChange = jest.fn();
const mockResetForm = jest.fn();
const mockHandleGoogleLogin = jest.fn();

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('SignUp Component', () => {
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);

    useAuthForm.mockReturnValue({
      formData: {
        email: '',
        name: '',
        password: '',
        userType: 'student',
      },
      error: '',
      isLoading: false,
      handleChange: mockHandleChange,
      handleSubmit: mockSubmitForm,
      resetForm: mockResetForm,
    });

    useGoogleAuth.mockReturnValue({
      googleLoading: false,
      handleGoogleLogin: mockHandleGoogleLogin,
    });
  });

  it('renders form fields and buttons', () => {
    renderWithRouter(<SignUp />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('calls handleSubmit when signup button is clicked', () => {
    renderWithRouter(<SignUp />);

    const signUpBtn = screen.getByRole('button', { name: /signup/i });
    fireEvent.click(signUpBtn);

    expect(mockSubmitForm).toHaveBeenCalled();
  });

  it('calls handleGoogleLogin when Google button is clicked', () => {
    renderWithRouter(<SignUp />);

    const googleBtn = screen.getByRole('button', { name: /sign up with google/i });
    fireEvent.click(googleBtn);

    expect(mockHandleGoogleLogin).toHaveBeenCalled();
  });
});
