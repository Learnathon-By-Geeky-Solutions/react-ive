import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/Login', () => () => <div>Login Page</div>);
jest.mock('../components/SignUp', () => () => <div>SignUp Page</div>);
jest.mock('../components/Home', () => () => <div>Home Page</div>);
jest.mock('../pages/Posts', () => () => <div>Posts Page</div>);
jest.mock('../pages/CreatePost', () => () => <div>CreatePost Page</div>);
jest.mock('../pages/ForgotPassword', () => () => <div>ForgotPassword Page</div>);
jest.mock('../pages/ResetPassword', () => () => <div>ResetPassword Page</div>);
jest.mock('../pages/Apply', () => () => <div>Apply Page</div>);
jest.mock('../pages/Applications', () => () => <div>Applications Page</div>);
jest.mock('../pages/StudentProfile', () => () => <div>Profile Page</div>);
jest.mock('../pages/Chat', () => () => <div>Chat Page</div>);

describe('App Component', () => {
  const renderWithRouter = (initialEntries) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  test('renders Home component for / route', () => {
    renderWithRouter(['/']);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders Login component for /login route', () => {
    renderWithRouter(['/login']);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders SignUp component for /signup route', () => {
    renderWithRouter(['/signup']);
    expect(screen.getByText('SignUp Page')).toBeInTheDocument();
  });

  test('renders Posts component for /posts route', () => {
    renderWithRouter(['/posts']);
    expect(screen.getByText('Posts Page')).toBeInTheDocument();
  });

  test('renders Applications component for /applications route', () => {
    renderWithRouter(['/applications']);
    expect(screen.getByText('Applications Page')).toBeInTheDocument();
  });

  test('renders ApplyPage component for /posts/apply/:id route', () => {
    renderWithRouter(['/posts/apply/123']);
    expect(screen.getByText('Apply Page')).toBeInTheDocument();
  });

  test('renders CreatePost component for /create-post route', () => {
    renderWithRouter(['/create-post']);
    expect(screen.getByText('CreatePost Page')).toBeInTheDocument();
  });

  test('renders Chat component for /chats route', () => {
    renderWithRouter(['/chats']);
    expect(screen.getByText('Chat Page')).toBeInTheDocument();
  });

  test('renders ForgotPassword component for /forgot-password route', () => {
    renderWithRouter(['/forgot-password']);
    expect(screen.getByText('ForgotPassword Page')).toBeInTheDocument();
  });

  test('renders ResetPassword component for /reset-password route', () => {
    renderWithRouter(['/reset-password']);
    expect(screen.getByText('ResetPassword Page')).toBeInTheDocument();
  });

  test('renders Profile component for /profile route', () => {
    renderWithRouter(['/profile']);
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
  });

  test('renders Processing message for /auth/success route', () => {
    renderWithRouter(['/auth/success']);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  test('renders nothing for unknown route', () => {
    renderWithRouter(['/unknown']);
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });
});