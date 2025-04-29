import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Mock react-router-dom's Navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(() => null), // Mock Navigate to render null and capture props
}));

const { Navigate } = require('react-router-dom');

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  test('redirects to login when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Check that Navigate was called with the correct props
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/login',
        replace: true,
      }),
      expect.anything()
    );
  });

  test('renders children when authenticated', () => {
    localStorage.setItem('token', 'fake-token');

    const { getByText } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
    expect(Navigate).not.toHaveBeenCalled(); // Ensure Navigate isn't called when authenticated
  });
});