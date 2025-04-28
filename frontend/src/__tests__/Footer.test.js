import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    render(<Footer />);
  });

  test('renders company information correctly', () => {
    // Use heading role to be more specific
    expect(screen.getByRole('heading', { name: 'DU Tutors' })).toBeInTheDocument();
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
    
    // Get the contact section first, then find "DU Tutors" within it
    const contactSection = screen.getByText('Contact Us').closest('div');
    const contactList = contactSection.querySelector('ul');
    expect(contactList.querySelector('li')).toHaveTextContent('DU Tutors');
    
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
      background: 'linear-gradient(135deg, #A6D8FF 0%, #6B9FBF 50%, #3F7CAD 100%)'
    });
  });

  test('renders social media icons', () => {
    // Use queryAllByRole instead of getByRole since we have multiple buttons without names
    const socialButtons = screen.getAllByRole('button');
    
    // Find buttons that contain SVG elements - these are likely our social media icons
    const socialIconContainer = document.querySelector('.flex.space-x-4');
    expect(socialIconContainer).toBeInTheDocument();
    
    // Check that the container has 4 button children (GitHub, Twitter, LinkedIn, Mail)
    const iconButtons = socialIconContainer.querySelectorAll('button');
    expect(iconButtons.length).toBe(4);
    
    // Verify we have GitHub icon (could check for specific viewBox or path content)
    const githubSvg = document.querySelector('svg[viewBox="0 0 496 512"]');
    expect(githubSvg).toBeInTheDocument();
    
    // Verify we have Twitter icon
    const twitterSvg = document.querySelector('svg[viewBox="0 0 512 512"]');
    expect(twitterSvg).toBeInTheDocument();
    
    // Verify we have LinkedIn icon
    const linkedinSvg = document.querySelector('svg[viewBox="0 0 448 512"]');
    expect(linkedinSvg).toBeInTheDocument();
    
    // Verify we have Mail icon
    const mailSvg = document.querySelector('svg.lucide-mail');
    expect(mailSvg).toBeInTheDocument();
  });
});