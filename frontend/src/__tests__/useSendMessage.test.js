import { render, act } from '@testing-library/react';
import useSendMessage from '../hooks/useSendMessage';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/servicesData';

// Mock useConversation
jest.mock('../zustand/useConversation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

// Mock servicesData
jest.mock('../utils/servicesData', () => ({
  BACKEND_URL: 'https://react-ive.onrender.com', // Mock BACKEND_URL for test consistency
}));

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useSendMessage Hook', () => {
  const mockMessages = [
    { id: '1', text: 'Hello' },
    { id: '2', text: 'Hi' },
  ];
  const mockSetMessages = jest.fn();
  const mockSelectedConversation = { _id: 'conv123' };
  const mockToken = 'mockToken';
  const mockMessage = 'New message';
  const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
  const mockResponseData = { id: '3', text: mockMessage };

  beforeEach(() => {
    jest.clearAllMocks();
    useConversation.mockReturnValue({
      messages: mockMessages,
      setMessages: mockSetMessages,
      selectedConversation: mockSelectedConversation,
    });
    mockLocalStorage.getItem.mockReturnValue(mockToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Wrapper component to test the hook
  const TestComponent = () => {
    const { sendMessage, loading } = useSendMessage();
    return (
      <div>
        <span data-testid="loading">{loading.toString()}</span>
        <button
          data-testid="sendMessage-button"
          onClick={() => sendMessage(mockMessage, mockFile)}
        >
          Send Message
        </button>
        <button
          data-testid="sendMessageNoFile-button"
          onClick={() => sendMessage(mockMessage)}
        >
          Send Message No File
        </button>
      </div>
    );
  };

  it('should initialize with loading false', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('loading').textContent).toBe('false');
  });

  it('should send message with file successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData),
    });

    const { getByTestId } = render(<TestComponent />);
    const sendButton = getByTestId('sendMessage-button');

    await act(async () => {
      sendButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('loading').textContent).toBe('false');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/message/send/${mockSelectedConversation._id}`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        body: expect.any(FormData),
      })
    );

    // Verify FormData contents
    const fetchCall = global.fetch.mock.calls[0][1];
    const formData = fetchCall.body;
    expect(formData.get('message')).toBe(mockMessage);
    expect(formData.get('file')).toBe(mockFile);

    expect(mockSetMessages).toHaveBeenCalledWith([...mockMessages, mockResponseData]);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should send message without file successfully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponseData),
    });

    const { getByTestId } = render(<TestComponent />);
    const sendButton = getByTestId('sendMessageNoFile-button');

    await act(async () => {
      sendButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('loading').textContent).toBe('false');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/message/send/${mockSelectedConversation._id}`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        body: expect.any(FormData),
      })
    );

    // Verify FormData contents
    const fetchCall = global.fetch.mock.calls[0][1];
    const formData = fetchCall.body;
    expect(formData.get('message')).toBe(mockMessage);
    expect(formData.get('file')).toBeNull();

    expect(mockSetMessages).toHaveBeenCalledWith([...mockMessages, mockResponseData]);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should handle API error', async () => {
    const errorMessage = 'Failed to send message';
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({ error: errorMessage }),
    });

    const { getByTestId } = render(<TestComponent />);
    const sendButton = getByTestId('sendMessage-button');

    await act(async () => {
      sendButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('loading').textContent).toBe('false');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/message/send/${mockSelectedConversation._id}`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        body: expect.any(FormData),
      })
    );

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockSetMessages).not.toHaveBeenCalled();
  });

  it('should handle network error', async () => {
    const errorMessage = 'Network error';
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId } = render(<TestComponent />);
    const sendButton = getByTestId('sendMessage-button');

    await act(async () => {
      sendButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(getByTestId('loading').textContent).toBe('false');
    expect(global.fetch).toHaveBeenCalledWith(
      `${BACKEND_URL}/message/send/${mockSelectedConversation._id}`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
        body: expect.any(FormData),
      })
    );

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
    expect(mockSetMessages).not.toHaveBeenCalled();
  });

  it('should not send message if selectedConversation is null', async () => {
    useConversation.mockReturnValue({
      messages: mockMessages,
      setMessages: mockSetMessages,
      selectedConversation: null,
    });

    const { getByTestId } = render(<TestComponent />);
    const sendButton = getByTestId('sendMessage-button');

    await act(async () => {
      sendButton.dispatchEvent(new Event('click', { bubbles: true }));
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Cannot read properties of null (reading '_id')");
    expect(mockSetMessages).not.toHaveBeenCalled();
    expect(getByTestId('loading').textContent).toBe('false');
  });
});