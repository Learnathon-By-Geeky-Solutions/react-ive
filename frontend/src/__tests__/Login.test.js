import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';

// Mocks
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

jest.mock('../hooks/useAuthForm', () => () => ({
  formData: { email: '', password: '' },
  error: null,
  isLoading: false,
  handleChange: jest.fn(),
  handleSubmit: jest.fn((e) => e.preventDefault()),
}));

jest.mock('../hooks/useGoogleAuth', () => () => ({
  googleLoading: false,
  handleGoogleLogin: jest.fn(),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
  test('renders email and password fields', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('renders login button and Google login button', () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  test('renders "Forgot Password?" link', () => {
    renderWithRouter(<Login />);
    const forgotLink = screen.getByText(/forgot password\?/i);
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute('href', '/forgot-password');
  });

  test('renders "Register" link for new users', () => {
    renderWithRouter(<Login />);
    const registerLink = screen.getByText(/register/i);
    expect(registerLink.closest('a')).toHaveAttribute('href', '/signup');
  });

//   test('calls handleSubmit when login form is submitted', () => {
//     const mockHandleSubmit = jest.fn((e) => e.preventDefault());

//     jest.mock('../hooks/useAuthForm', () => () => ({
//       formData: { email: '', password: '' },
//       error: null,
//       isLoading: false,
//       handleChange: jest.fn(),
//       handleSubmit: mockHandleSubmit,
//     }));

//     renderWithRouter(<Login />);
//     const form = screen.getByRole('form'); // assuming AuthForm uses <form role="form">
//     fireEvent.submit(form);
//     expect(mockHandleSubmit).toHaveBeenCalled();
//   });
});
