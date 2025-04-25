import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  DollarSign: () => <span data-testid="dollar-sign" />,
  Briefcase: () => <span data-testid="briefcase" />,
  MapPin: () => <span data-testid="map-pin" />,
  Code: () => <span data-testid="code" />,
  ArrowRight: () => <span data-testid="arrow-right" />,
  CheckCircle: () => <span data-testid="check-circle" />,
  X: () => <span data-testid="x" />,
  Upload: () => <span data-testid="upload" />,
  Trash2: () => <span data-testid="trash2" />,
  AlertTriangle: () => <span data-testid="alert-triangle" />,
  Clock: () => <span data-testid="clock" />,
  XCircle: () => <span data-testid="x-circle" />,
  BookOpen: () => <span data-testid="book-open" />,
  UserCircle: () => <span data-testid="user-circle" />,
  Calendar: () => <span data-testid="calendar" />,
  Clock3: () => <span data-testid="clock3" />,
}));

// Mock fetch
global.fetch = jest.fn();

// Mock auth context value
const mockUser = {
  userId: 'user123',
  name: 'Test User',
};
const mockAuthValue = {
  user: mockUser,
  isLoading: false,
  login: jest.fn(),
  logout: jest.fn(),
};

// Sample props
const mockProps = {
  jobDetails: {
    title: 'Math Tutor Needed',
    location: 'Dhaka',
    medium: 'English',
    salaryRange: '5000-7000',
    experience: '1-2 years',
    classType: 'Grade 10',
    studentNum: 1,
    subjects: ['Math', 'Physics'],
    gender: 'Any',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    jobPostId: 'post123',
  },
  schedule: {
    days: 3,
    time: new Date().toISOString(),
    duration: '2 hours',
  },
  userInfo: {
    guardianName: 'John Doe',
    userId: 'guardian456',
  },
  onDelete: jest.fn(),
};

describe('PostCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockReset();
    useAuth.mockReturnValue(mockAuthValue);
    render(
      <MemoryRouter>
        <PostCard {...mockProps} />
      </MemoryRouter>
    );
  });

  test('renders job details correctly', () => {
    expect(screen.getByText('Math Tutor Needed')).toHaveClass('text-2xl font-bold text-gray-800 truncate');
    expect(screen.getByText(/English • Class: Grade 10/)).toBeInTheDocument();
    expect(screen.getByText('Dhaka')).toBeInTheDocument();
    expect(screen.getByText(/Posted by: John Doe • Preferred: Any/)).toBeInTheDocument();
  });

  test('renders salary, schedule, and details sections', () => {
    expect(screen.getByText('5000-7000 Tk/month')).toBeInTheDocument();
    expect(screen.getByText('3 days/week')).toBeInTheDocument();
    expect(screen.getByText('2 hours')).toBeInTheDocument();
    expect(screen.getByText('1 student')).toBeInTheDocument();
  });

  test('renders subjects list correctly', () => {
    expect(screen.getByText('SUBJECTS')).toBeInTheDocument();
    expect(screen.getByText('Math')).toHaveClass('bg-indigo-100 text-indigo-900 text-xs px-2 py-1 rounded-full');
    expect(screen.getByText('Physics')).toBeInTheDocument();
  });

  test('renders experience required', () => {
    expect(screen.getByText('EXPERIENCE REQUIRED')).toBeInTheDocument();
    expect(screen.getByText('1-2 years')).toBeInTheDocument();
  });

  test('renders deadline status for non-expired deadline', async () => {
    expect(screen.getByText('Deadline:')).toBeInTheDocument();
    expect(screen.getByTestId('clock')).toBeInTheDocument();
  });

  test('renders Apply Now button when user has not applied', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'not exists' }),
    });

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Apply Now/ });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-purple-600');
      expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    });
  });

  test('renders Already Applied button when user has applied', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'exists' }),
    });

    render(
      <MemoryRouter>
        <PostCard {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Already Applied/ });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
      expect(button).toHaveClass('bg-green-500');
      expect(screen.getByTestId('check-circle')).toBeInTheDocument();
    });
  });

  test('renders Remove Tuition Post button when user is the poster', async () => {
    useAuth.mockReturnValue({
      ...mockAuthValue,
      user: { ...mockUser, userId: mockProps.userInfo.userId },
    });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'not exists' }),
    });

    render(
      <MemoryRouter>
        <PostCard {...mockProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const button = screen.getByRole('button', { name: /Remove Tuition Post/ });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-gray-200');
      expect(screen.getByTestId('trash2')).toBeInTheDocument();
    });
  });

  test('opens apply modal and handles file upload', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'not exists' }),
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Apply Now/ }));
    });

    expect(screen.getByText('Apply for Math Tutor Needed')).toBeInTheDocument();
    expect(screen.getByText(/English • Grade 10/)).toBeInTheDocument();
    expect(screen.getByTestId('upload')).toBeInTheDocument();

    const fileInput = screen.getByLabelText(/Upload your ID Card Image/);
    const file = new File(['id-card'], 'id-card.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/id-card.jpg/)).toBeInTheDocument();
  });

  test('shows error toast when submitting without file', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'not exists' }),
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Apply Now/ }));
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit Application' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please upload your ID card image.');
    });
  });


  test('shows error toast for expired deadline when applying', async () => {
    const expiredProps = {
      ...mockProps,
      jobDetails: {
        ...mockProps.jobDetails,
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      },
    };

    render(
      <MemoryRouter>
        <PostCard {...expiredProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Deadline Expired')).toBeInTheDocument();
    });
  });
});