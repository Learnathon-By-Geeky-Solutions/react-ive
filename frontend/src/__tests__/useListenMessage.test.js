import { render, act } from '@testing-library/react';
import useListenMessages from '../hooks/useListenMessages';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation';

// Mock useSocketContext
jest.mock('../context/SocketContext', () => ({
  useSocketContext: jest.fn(),
}));

// Mock useConversation
jest.mock('../zustand/useConversation', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useListenMessages Hook', () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
  };
  const mockMessages = [
    { id: '1', text: 'Hello', shouldShake: false },
    { id: '2', text: 'Hi', shouldShake: false },
  ];
  const mockSetMessages = jest.fn();
  const mockNewMessage = { id: '3', text: 'New message', shouldShake: true };

  beforeEach(() => {
    jest.clearAllMocks();
    useSocketContext.mockReturnValue({ socket: mockSocket });
    useConversation.mockReturnValue({
      messages: mockMessages,
      setMessages: mockSetMessages,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Wrapper component to test the hook
  const TestComponent = () => {
    useListenMessages();
    return <div>Test</div>;
  };

  it('should set up socket listener for newMessage event', () => {
    render(<TestComponent />);

    expect(mockSocket.on).toHaveBeenCalledWith('newMessage', expect.any(Function));
    expect(mockSocket.off).not.toHaveBeenCalled();
  });

  it('should add new message with shouldShake true when newMessage event is received', () => {
    render(<TestComponent />);

    // Find the callback passed to socket.on
    const onCallback = mockSocket.on.mock.calls[0][1];

    act(() => {
      onCallback(mockNewMessage);
    });

    expect(mockSetMessages).toHaveBeenCalledWith([...mockMessages, { ...mockNewMessage, shouldShake: true }]);
  });

  it('should remove socket listener on cleanup', () => {
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(mockSocket.off).toHaveBeenCalledWith('newMessage');
  });

  it('should not set up socket listener if socket is null', () => {
    useSocketContext.mockReturnValue({ socket: null });

    render(<TestComponent />);

    expect(mockSocket.on).not.toHaveBeenCalled();
    expect(mockSocket.off).not.toHaveBeenCalled();
  });
});