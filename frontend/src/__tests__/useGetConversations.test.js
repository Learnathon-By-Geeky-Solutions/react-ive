import { render, waitFor } from '@testing-library/react';
import useGetConversations from '../hooks/useGetConversations';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

// Wrapper component to test the hook
const TestComponent = () => {
  const { loading, conversations } = useGetConversations();
  return (
    <div>
      <span data-testid="loading">{loading.toString()}</span>
      <span data-testid="conversations">{JSON.stringify(conversations)}</span>
    </div>
  );
};

describe('useGetConversations Hook', () => {
  const mockUser = { userId: '123' };
  const mockConversations = [
    { id: '1', name: 'User1' },
    { id: '2', name: 'User2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: null }); // Default to no user
    process.env.BACKEND_URL = 'https://react-ive.onrender.com'; // Mock BACKEND_URL
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with loading false and empty conversations when no user', () => {
    useAuth.mockReturnValue({ user: null });
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('loading').textContent).toBe('false');
    expect(getByTestId('conversations').textContent).toBe('[]');
  });

  it('should fetch conversations when userId exists', async () => {
    useAuth.mockReturnValue({ user: mockUser });
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ users: mockConversations }),
    });

    const { getByTestId } = render(<TestComponent />);

    // Initially, loading should be true due to setLoading(true) in useEffect
    expect(getByTestId('loading').textContent).toBe('true');

    // Wait for the fetch to complete and loading to become false
    await waitFor(() => {
      expect(getByTestId('loading').textContent).toBe('false');
      expect(getByTestId('conversations').textContent).toBe(
        JSON.stringify(mockConversations)
      );
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.BACKEND_URL}/conversation/getConversations/${mockUser.userId}`
    );
  });

  it('should handle fetch error', async () => {
    useAuth.mockReturnValue({ user: mockUser });
    const errorMessage = 'Failed to fetch conversations';
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
    });

    const { getByTestId } = render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(getByTestId('loading').textContent).toBe('false');
      expect(getByTestId('conversations').textContent).toBe('[]');
    });
  });

  it('should handle network error', async () => {
    useAuth.mockReturnValue({ user: mockUser });
    const errorMessage = 'Network error';
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId } = render(<TestComponent />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
      expect(getByTestId('loading').textContent).toBe('false');
      expect(getByTestId('conversations').textContent).toBe('[]');
    });
  });

  it('should not fetch if userId is undefined', () => {
    useAuth.mockReturnValue({ user: null });
    render(<TestComponent />);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});