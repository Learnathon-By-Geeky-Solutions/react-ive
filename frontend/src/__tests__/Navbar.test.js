import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/AuthContext';

// Mock dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock useNavigate and useLocation
const mockNavigate = jest.fn();
const mockLocation = { search: '' };
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  MemoryRouter: ({ children }) => <div>{children}</div>, // Mock MemoryRouter if needed
}));

describe('Navbar Component', () => {
  const renderWithAuth = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset localStorage mock
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders logo and title', () => {
    renderWithAuth();
    expect(screen.getByText('DU Tutors')).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithAuth();
    expect(screen.getByText('POSTS')).toBeInTheDocument();
    expect(screen.getByText('APPLICATIONS')).toBeInTheDocument();
    expect(screen.getByText('CHATS')).toBeInTheDocument();
  });

  test('renders login button when user is not authenticated', () => {
    renderWithAuth();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('renders user avatar when user is authenticated', () => {
    // Mock a valid token with user data
    const user = { name: 'John Doe', email: 'john@example.com', userType: 'student' };
    const token = 'header.' + btoa(JSON.stringify(user)) + '.signature';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    renderWithAuth();

    expect(screen.getByText('J')).toBeInTheDocument(); // Initial from name
  });

  test('opens menu when avatar is clicked', () => {
    const user = { name: 'John Doe', email: 'john@example.com', userType: 'student' };
    const token = 'header.' + btoa(JSON.stringify(user)) + '.signature';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    renderWithAuth();

    const avatarButton = screen.getByText('J').parentElement;
    fireEvent.click(avatarButton);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('navigates to profile when profile menu item is clicked for student', () => {
    const user = { name: 'John Doe', email: 'john@example.com', userType: 'student' };
    const token = 'header.' + btoa(JSON.stringify(user)) + '.signature';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    renderWithAuth();

    const avatarButton = screen.getByText('J').parentElement;
    fireEvent.click(avatarButton);

    const profileItem = screen.getByText('Profile');
    fireEvent.click(profileItem);

    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  test('navigates to company profile when profile menu item is clicked for company', () => {
    const user = { name: 'Company Inc', email: 'company@example.com', userType: 'company' };
    const token = 'header.' + btoa(JSON.stringify(user)) + '.signature';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    renderWithAuth();

    const avatarButton = screen.getByText('C').parentElement;
    fireEvent.click(avatarButton);

    const profileItem = screen.getByText('Profile');
    fireEvent.click(profileItem);

    expect(mockNavigate).toHaveBeenCalledWith('/companyprofile');
  });

  test('calls logout when logout menu item is clicked', () => {
    const user = { name: 'John Doe', email: 'john@example.com', userType: 'student' };
    const token = 'header.' + btoa(JSON.stringify(user)) + '.signature';
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(token);

    renderWithAuth();

    const avatarButton = screen.getByText('J').parentElement;
    fireEvent.click(avatarButton);

    const logoutItem = screen.getByText('Logout');
    fireEvent.click(logoutItem);

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navigates to home when logo is clicked', () => {
    renderWithAuth();
    const logoContainer = screen.getByText('DU Tutors').parentElement;
    fireEvent.click(logoContainer);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('handles loading state without crashing', () => {
    // Simulate initial loading state by delaying the effect
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    renderWithAuth();
    expect(screen.getByText('DU Tutors')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
});