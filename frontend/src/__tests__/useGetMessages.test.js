import { renderHook, act } from '@testing-library/react';
import useGetMessages from '../hooks/useGetMessages';
import useConversation from '../zustand/useConversation';
import { BACKEND_URL } from '../utils/servicesData';

global.fetch = jest.fn();

jest.mock('../zustand/useConversation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useGetMessages Hook', () => {
  const mockMessages = [
    { _id: 'msg1', conversationId: 'conv1', senderId: 'user1', message: 'Hello', createdAt: '2023-10-01' },
    { _id: 'msg2', conversationId: 'conv1', senderId: 'user2', message: 'Hi', createdAt: '2023-10-02' },
  ];
  const mockConversation = { _id: 'conv1' };
  const mockToken = 'mock-token';

  let conversationState = {
    messages: [],
    selectedConversation: mockConversation,
  };

  const mockSetMessages = jest.fn((newMessages) => {
    conversationState = { ...conversationState, messages: newMessages };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    conversationState = {
      messages: [],
      selectedConversation: mockConversation,
    };
    useConversation.mockImplementation(() => ({
      ...conversationState,
      setMessages: mockSetMessages,
    }));
  });

  test('initializes with loading false and empty messages', () => {
    useConversation.mockReturnValueOnce({
      messages: [],
      setMessages: mockSetMessages,
      selectedConversation: null,
    });

    const { result } = renderHook(() => useGetMessages());
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  test('fetches messages successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const { result } = renderHook(() => useGetMessages());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/message/getMessage/conv1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockSetMessages).toHaveBeenCalledWith(mockMessages);
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual(mockMessages);
  });

  test('handles API error response', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'Failed to fetch messages' }),
    });

    const { result } = renderHook(() => useGetMessages());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/message/getMessage/conv1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockSetMessages).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch messages');
    consoleErrorSpy.mockRestore();
  });

  test('handles fetch network error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGetMessages());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/message/getMessage/conv1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockSetMessages).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Network error');
    consoleErrorSpy.mockRestore();
  });

  test('does not fetch when selectedConversation._id is falsy', () => {
    useConversation.mockReturnValue({
      messages: [],
      setMessages: mockSetMessages,
      selectedConversation: null,
    });

    const { result } = renderHook(() => useGetMessages());
    expect(fetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  test('refetches when selectedConversation._id changes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const { result, rerender } = renderHook(() => useGetMessages());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/message/getMessage/conv1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockSetMessages).toHaveBeenCalledWith(mockMessages);

    const newMessages = [
      { _id: 'msg3', conversationId: 'conv2', senderId: 'user1', message: 'New message', createdAt: '2023-10-03' },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newMessages,
    });

    conversationState = {
      messages: [],
      selectedConversation: { _id: 'conv2' },
    };
    useConversation.mockImplementation(() => ({
      ...conversationState,
      setMessages: mockSetMessages,
    }));

    rerender();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/message/getMessage/conv2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockSetMessages).toHaveBeenCalledWith(newMessages);
    expect(result.current.loading).toBe(false);
    expect(result.current.messages).toEqual(newMessages);
  });
});