import { renderHook, act } from '@testing-library/react';
import useGetUser from '../hooks/useGetUser';

// Mock fetch
global.fetch = jest.fn();

describe('useGetUser Hook', () => {
  const mockUser = {
    _id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('initializes with loading true and data null', () => {
    const { result } = renderHook(() => useGetUser('123'));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
  });

  test('fetches user data successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { result } = renderHook(() => useGetUser('123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for useEffect
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3500/auth/getUserById/123');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockUser);
  });

  test('handles fetch error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useGetUser('123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3500/auth/getUserById/123');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch user');
    consoleErrorSpy.mockRestore();
  });

  test('does not fetch when userId is falsy', () => {
    const { result } = renderHook(() => useGetUser(null));
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
  });

  test('refetches when userId changes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { result, rerender } = renderHook(
      ({ userId }) => useGetUser(userId),
      { initialProps: { userId: '123' } }
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3500/auth/getUserById/123');
    expect(result.current.data).toEqual(mockUser);

    const newUser = { _id: '456', name: 'Jane Doe', email: 'jane@example.com' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newUser,
    });

    rerender({ userId: '456' });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3500/auth/getUserById/456');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(newUser);
  });

  test('handles fetch network error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetUser('123'));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith('http://localhost:3500/auth/getUserById/123');
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Network error');
    consoleErrorSpy.mockRestore();
  });
});