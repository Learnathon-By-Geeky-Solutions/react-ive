import { render, act } from '@testing-library/react';
import useAuthForm from '../hooks/useAuthForm';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the servicesData module
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com', // Mock BACKEND_URL for test consistency
}));

// Mock fetch
global.fetch = jest.fn();

describe('useAuthForm Hook', () => {
  const initialState = { username: '', password: '' };
  const apiEndpoint = 'login';
  const onSuccess = jest.fn();
  const mockSuccessResponse = { token: 'abc123', user: { id: '1' } };
  const mockErrorResponse = { message: 'Invalid credentials' };

  // Wrapper component to test the hook
  const TestComponent = ({ initialState, apiEndpoint, onSuccess }) => {
    const { formData, error, isLoading, handleChange, handleSubmit, resetForm, setFormData } =
      useAuthForm(initialState, apiEndpoint, onSuccess);
    return (
      <div>
        <span data-testid="formData">{JSON.stringify(formData)}</span>
        <span data-testid="error">{error || 'null'}</span>
        <span data-testid="isLoading">{isLoading.toString()}</span>
        <input
          data-testid="username-input"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          data-testid="password-input"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button data-testid="submit-button" onClick={handleSubmit}>
          Submit
        </button>
        <button data-testid="reset-button" onClick={() => resetForm()}>
          Reset
        </button>
        <button
          data-testid="setFormData-button"
          onClick={() => setFormData({ username: 'test', password: 'pass' })}
        >
          Set Form Data
        </button>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with correct initial state', () => {
    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    expect(getByTestId('formData').textContent).toBe(JSON.stringify(initialState));
    expect(getByTestId('error').textContent).toBe('null');
    expect(getByTestId('isLoading').textContent).toBe('false');
  });

//   it('should update formData on handleChange', () => {
//     const { getByTestId } = render(
//       <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
//     );

//     const usernameInput = getByTestId('username-input');
//     const passwordInput = getByTestId('password-input');

//     act(() => {
//       usernameInput.value = 'newUser';
//       usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
//     });

//     act(() => {
//       passwordInput.value = 'newPass';
//       passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
//     });

//     expect(getByTestId('formData').textContent).toBe(
//       JSON.stringify({ username: 'newUser', password: 'newPass' })
//     );
//   });

  it('should handle successful form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockSuccessResponse),
    });

    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    const submitButton = getByTestId('submit-button');

    await act(async () => {
      submitButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('isLoading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe('null');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/auth/${apiEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialState),
      }
    );
    expect(onSuccess).toHaveBeenCalledWith(mockSuccessResponse);
  });

  it('should handle failed form submission with error message', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
    });

    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    const submitButton = getByTestId('submit-button');

    await act(async () => {
      submitButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('isLoading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe(mockErrorResponse.message);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/auth/${apiEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialState),
      }
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should handle network error during submission', async () => {
    const networkError = new Error('Network error');
    global.fetch.mockRejectedValueOnce(networkError);

    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    const submitButton = getByTestId('submit-button');

    await act(async () => {
      submitButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('isLoading').textContent).toBe('false');
    expect(getByTestId('error').textContent).toBe(networkError.message);
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/auth/${apiEndpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialState),
      }
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should reset form to initial state', () => {
    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    // First, change formData
    const usernameInput = getByTestId('username-input');
    act(() => {
      usernameInput.value = 'changed';
      usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Set error
    act(() => {
      const submitButton = getByTestId('submit-button');
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce(mockErrorResponse),
      });
      submitButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    // Reset form
    const resetButton = getByTestId('reset-button');
    act(() => {
      resetButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('formData').textContent).toBe(JSON.stringify(initialState));
    expect(getByTestId('error').textContent).toBe('null');
  });

  it('should set formData directly with setFormData', () => {
    const { getByTestId } = render(
      <TestComponent initialState={initialState} apiEndpoint={apiEndpoint} onSuccess={onSuccess} />
    );

    const setFormDataButton = getByTestId('setFormData-button');
    act(() => {
      setFormDataButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('formData').textContent).toBe(
      JSON.stringify({ username: 'test', password: 'pass' })
    );
  });
});