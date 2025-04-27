import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPassword from '../pages/ForgotPassword';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the BACKEND_URL so fetch works
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com',
}));

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input and submit button', () => {
    render(<ForgotPassword />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument();
  });

  it('allows user to type email', () => {
    render(<ForgotPassword />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('shows success message on successful form submission', async () => {
    // Mock fetch success
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Reset link sent!' }),
      })
    );

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset email/i }));

    await waitFor(() => {
      expect(screen.getByText(/reset link sent!/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/auth/sendResetMail`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      })
    );
  });

  it('shows error message if server responds with error', async () => {
    // Mock fetch error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'User not found' }),
      })
    );

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset email/i }));

    await waitFor(() => {
      expect(screen.getByText(/user not found/i)).toBeInTheDocument();
    });
  });

  it('shows general error if fetch throws an exception', async () => {
    // Mock fetch throwing error
    global.fetch = jest.fn(() => Promise.reject(new Error('Network Error')));

    render(<ForgotPassword />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'fail@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /send reset email/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong\. please try again later\./i)).toBeInTheDocument();
    });
  });
});
