import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    render(<Footer />);
  });

  test('renders company information correctly', () => {
    expect(screen.getByText('Du Tutors')).toBeInTheDocument();
    expect(
      screen.getByText('Your Trusted Platform to Find DU Tutors & Tuitions')
    ).toBeInTheDocument();
  });

  test('renders Quick Links section correctly', () => {
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Posts' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Applications' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chat' })).toBeInTheDocument();
  });

  test('renders Resources section correctly', () => {
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Blog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tuition Tips' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help Center' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guidelines' })).toBeInTheDocument();
  });

  test('renders Contact Us section correctly', () => {
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Institute of Information Technology')).toBeInTheDocument();
    expect(screen.getByText('University of Dhaka')).toBeInTheDocument();
    expect(screen.getByText('Dhaka-1000, Bangladesh')).toBeInTheDocument();
    expect(screen.getByText('support@dututors.com')).toHaveAttribute(
      'href',
      'mailto:tashrifpro@gmail.com'
    );
  });

  test('renders footer bottom section with correct year and links', () => {
    expect(
      screen.getByText(`© ${currentYear} DU Tutors. All rights reserved.`)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Terms of Service' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Privacy Policy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cookie Settings' })).toBeInTheDocument();
  });

  test('has correct background gradient style', () => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle({
      background: 'linear-gradient(135deg, #D0A6FF 0%, #9B6BBF 50%, #7A5FB1 100%)',
    });
  });
});