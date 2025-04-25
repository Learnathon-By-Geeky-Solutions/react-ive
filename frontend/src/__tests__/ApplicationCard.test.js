import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicationCard from '../components/ApplicationCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock the imports
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('ApplicationCard Component', () => {
  // Test data
  const mockApplication = {
    _id: 'app123',
    userId: 'user123',
    userName: 'John Doe',
    cvPath: '/uploads/resume123.pdf',
    status: 'PENDING',
    createdAt: '2023-09-15T10:30:00Z',
    statusUpdatedAt: '2023-09-16T14:20:00Z',
    postId: {
      position: 'Software Engineer',
      location: 'New York, NY',
      userId: {
        _id: 'company123',
        name: 'Tech Corp',
      },
    },
  };

  const mockUser = {
    userId: 'company123',
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    useAuth.mockReturnValue({ user: mockUser });
    useNavigate.mockReturnValue(mockNavigate);
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ users: [{ id: 'user123', name: 'John Doe' }] }),
    });
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'fake-token'),
      },
      writable: true,
    });
  });

  test('renders application card with correct data', () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Check for applicant name
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check for location
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    
    // Check for applied date
    expect(screen.getByText(/Applied:/)).toBeInTheDocument();
    
    // Check for status updated date
    expect(screen.getByText(/Status updated:/)).toBeInTheDocument();
    
    // Check for status badge
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    
    // Check for action buttons
    expect(screen.getByText('View CV')).toBeInTheDocument();
    expect(screen.getByText('Change Status')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  test('shows correct status styles for different statuses', () => {
    // Test PENDING status

    const acceptedApp = { ...mockApplication, status: 'ACCEPTED' };
    render(<ApplicationCard app={acceptedApp} />);
    expect(screen.getByText('ACCEPTED')).toHaveClass('text-emerald-800');
    
    const pendingApp = { ...mockApplication, status: 'PENDING' };
    const { rerender } = render(<ApplicationCard app={pendingApp} />);
    expect(screen.getByText('PENDING')).toHaveClass('text-sky-800');
    
    // Test ACCEPTED status
    
    // Test UNDER_REVIEW status
    const reviewApp = { ...mockApplication, status: 'UNDER_REVIEW' };
    render(<ApplicationCard app={reviewApp} />);
    expect(screen.getByText('UNDER_REVIEW')).toHaveClass('text-amber-800');
    
    // Test REJECTED status
    const rejectedApp = { ...mockApplication, status: 'REJECTED' };
    render(<ApplicationCard app={rejectedApp} />);
    expect(screen.getByText('REJECTED')).toHaveClass('text-rose-800');
  });

  test('opens status change modal when change status button is clicked', () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Click the change status button
    fireEvent.click(screen.getByText('Change Status'));
    
    // Modal should be open
    expect(screen.getByText('Change Application Status')).toBeInTheDocument();
    expect(screen.getByText('Schedule Interview')).toBeInTheDocument();
    expect(screen.getByText('Accept Application')).toBeInTheDocument();
    expect(screen.getByText('Reject Application')).toBeInTheDocument();
  });

  test('opens confirmation modal when status is selected', () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Open status modal and select a status
    fireEvent.click(screen.getByText('Change Status'));
    fireEvent.click(screen.getByText('Accept Application'));
    
    // Confirmation modal should be open
    expect(screen.getByText('Confirm Status Change')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to mark this application as/)).toBeInTheDocument();
    expect(screen.getByText('ACCEPTED')).toBeInTheDocument();
  });

  test('updates application status when confirmation is confirmed', async () => {
    const mockOnStatusChange = jest.fn();
    render(<ApplicationCard app={mockApplication} onStatusChange={mockOnStatusChange} />);
    
    // Setup fetch mock for successful status update
    global.fetch.mockImplementation((url) => {
      if (url.includes('/apply/updateStatus/')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Status updated' }),
        });
      } else if (url.includes('/offer/sendOffer')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Offer sent' }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    
    // Open status modal, select status, and confirm
    fireEvent.click(screen.getByText('Change Status'));
    fireEvent.click(screen.getByText('Accept Application'));
    fireEvent.click(screen.getByText('Confirm'));
    
    // Wait for success modal
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Application status updated to ACCEPTED')).toBeInTheDocument();
    });
    
    // Check if onStatusChange callback was called
    expect(mockOnStatusChange).toHaveBeenCalledWith('app123', 'ACCEPTED');
    
    // Check if fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3500/apply/updateStatus/app123',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ status: 'ACCEPTED' }),
      })
    );
    
    // Check if offer was sent when status is ACCEPTED
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3500/offer/sendOffer',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String),
      })
    );
  });

  test('shows error modal when status update fails', async () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Setup fetch mock for failed status update
    global.fetch.mockImplementation((url) => {
      if (url.includes('/apply/updateStatus/')) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ message: 'Failed to update status' }),
        });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    
    // Open status modal, select status, and confirm
    fireEvent.click(screen.getByText('Change Status'));
    fireEvent.click(screen.getByText('Accept Application'));
    fireEvent.click(screen.getByText('Confirm'));
    
    // Wait for error modal
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to update application status')).toBeInTheDocument();
    });
  });

  test('initiates chat when chat button is clicked', async () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Setup fetch mock for successful chat creation
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Conversation created' }),
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        users: [{ id: 'user123', name: 'John Doe' }] 
      }),
    });
    
    // Click the chat button
    fireEvent.click(screen.getByText('Chat'));
    
    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/chats', {
        state: { selectedConversation: { id: 'user123', name: 'John Doe' } }
      });
    });
    
    // Check if fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3500/conversation/createConversation',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ senderId: 'company123', receiverId: 'user123' }),
      })
    );
  });

  test('shows error modal when chat creation fails', async () => {
    render(<ApplicationCard app={mockApplication} />);
    
    // Setup fetch mock for failed chat creation
    global.fetch.mockRejectedValueOnce(new Error('Failed to create conversation'));
    
    // Click the chat button
    fireEvent.click(screen.getByText('Chat'));
    
    // Wait for error modal
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to start conversation')).toBeInTheDocument();
    });
  });

  test('does not show change status button for non-owners', () => {
    // Set user as non-owner
    useAuth.mockReturnValue({ user: { userId: 'different-company' } });
    
    render(<ApplicationCard app={mockApplication} />);
    
    // Change status button should not be present
    expect(screen.queryByText('Change Status')).not.toBeInTheDocument();
  });

  test('does not show chat button for own applications', () => {
    // Set user as the applicant
    useAuth.mockReturnValue({ user: { userId: 'user123' } });
    
    render(<ApplicationCard app={mockApplication} />);
    
    // Chat button should not be present
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  });

  test('handles cases with missing data gracefully', () => {
    const incompleteApp = {
      ...mockApplication,
      userName: null,
      postId: {
        ...mockApplication.postId,
        location: null,
        userId: null,
      }
    };
    
    render(<ApplicationCard app={incompleteApp} />);
    
    // Should display fallbacks
    expect(screen.getByText('Unknown Applicant')).toBeInTheDocument();
    expect(screen.getByText('Unknown Location')).toBeInTheDocument();
  });
});