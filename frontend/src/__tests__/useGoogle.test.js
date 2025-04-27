import { render, act } from '@testing-library/react';
import useGoogleAuth from '../hooks/useGoogleAuth';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the servicesData module
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com', // Mock BACKEND_URL for test consistency
}));

describe('useGoogleAuth Hook', () => {
  // Mock window.location.href
  let originalLocation;
  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  // Mock console.log
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

  // Wrapper component to test the hook
  const TestComponent = () => {
    const { googleLoading, handleGoogleLogin } = useGoogleAuth();
    return (
      <div>
        <span data-testid="googleLoading">{googleLoading.toString()}</span>
        <button data-testid="googleLogin-button" onClick={handleGoogleLogin}>
          Google Login
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = ''; // Reset mock href
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with googleLoading false', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('googleLoading').textContent).toBe('false');
  });

  it('should trigger Google login and set googleLoading to true', () => {
    const { getByTestId } = render(<TestComponent />);
    const googleLoginButton = getByTestId('googleLogin-button');

    act(() => {
      googleLoginButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('googleLoading').textContent).toBe('true');
    expect(window.location.href).toBe(`${BACKEND_URL}/auth/google`);
    expect(consoleLogSpy).toHaveBeenCalledWith('GoogleLogin triggered');
  });

  it('should not trigger Google login if googleLoading is true', () => {
    const { getByTestId } = render(<TestComponent />);
    const googleLoginButton = getByTestId('googleLogin-button');

    // First click to set googleLoading to true
    act(() => {
      googleLoginButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    // Reset console.log mock to track subsequent calls
    consoleLogSpy.mockClear();
    window.location.href = ''; // Reset href to test no change

    // Second click while googleLoading is true
    act(() => {
      googleLoginButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('googleLoading').textContent).toBe('true');
    expect(window.location.href).toBe(''); // No redirect
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});