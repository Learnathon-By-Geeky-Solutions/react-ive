import React from 'react';
import { render, act } from '@testing-library/react';
import { SocketContextProvider, useSocketContext } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { BACKEND_URL } from '../utils/servicesData';

// Mock the modules
jest.mock('socket.io-client');
jest.mock('../context/AuthContext');

describe('SocketContext', () => {
  // Mock socket instance
  const mockSocket = {
    on: jest.fn(),
    disconnect: jest.fn(),
  };

  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup io mock to return our mock socket
    io.mockReturnValue(mockSocket);
    
    // Default auth mock to return a user
    useAuth.mockReturnValue({ user: { userId: 'test-user-123' } });
  });

  test('should create socket connection when user is available', () => {
    render(<SocketContextProvider>Test</SocketContextProvider>);
    
    expect(io).toHaveBeenCalledWith(BACKEND_URL, {
      query: { userId: 'test-user-123' },
    });
    expect(mockSocket.on).toHaveBeenCalledWith('getOnlineUsers', expect.any(Function));
  });

  test('should not create socket connection when user is null', () => {
    useAuth.mockReturnValue({ user: null });
    
    render(<SocketContextProvider>Test</SocketContextProvider>);
    
    expect(io).not.toHaveBeenCalled();
  });

  test('should disconnect socket on unmount', () => {
    const { unmount } = render(<SocketContextProvider>Test</SocketContextProvider>);
    
    unmount();
    
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  test('should update onlineUsers when socket emits getOnlineUsers', () => {
    // Create a test component that uses the context
    const TestComponent = () => {
      const { onlineUsers } = useSocketContext();
      return <div data-testid="online-users">{JSON.stringify(onlineUsers)}</div>;
    };

    // Render the component with the provider
    const { getByTestId } = render(
      <SocketContextProvider>
        <TestComponent />
      </SocketContextProvider>
    );

    // Capture the callback function that was registered
    const socketOnCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'getOnlineUsers'
    )[1];

    // Mock data for online users
    const mockOnlineUsers = [
      { userId: 'user1', username: 'User One' },
      { userId: 'user2', username: 'User Two' }
    ];

    // Simulate the socket emitting the event
    act(() => {
      socketOnCallback(mockOnlineUsers);
    });

    // Check that the online users are displayed correctly
    expect(getByTestId('online-users').textContent).toBe(JSON.stringify(mockOnlineUsers));
  });

  test('should provide the correct context value', () => {
    let contextValue;
    
    const TestConsumer = () => {
      contextValue = useSocketContext();
      return null;
    };
    
    render(
      <SocketContextProvider>
        <TestConsumer />
      </SocketContextProvider>
    );
    
    expect(contextValue).toHaveProperty('socket', mockSocket);
    expect(contextValue).toHaveProperty('onlineUsers');
    expect(Array.isArray(contextValue.onlineUsers)).toBe(true);
  });

  test('should recreate socket when user changes', () => {
    const { rerender } = render(<SocketContextProvider>Test</SocketContextProvider>);
    
    expect(io).toHaveBeenCalledTimes(1);
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
    
    // Change the user
    useAuth.mockReturnValue({ user: { userId: 'different-user-456' } });
    
    rerender(<SocketContextProvider>Test</SocketContextProvider>);
    
    // Should disconnect old socket and create new one
    expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
    expect(io).toHaveBeenCalledTimes(2);
    expect(io).toHaveBeenLastCalledWith(BACKEND_URL, {
      query: { userId: 'different-user-456' },
    });
  });
});