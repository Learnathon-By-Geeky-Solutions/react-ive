import { render, screen } from '@testing-library/react';
import About from '../components/About';

// Mock framer-motion to avoid animation-related complexities in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    hr: ({ children, ...props }) => <hr {...props} />,
  },
}));

describe('About Component', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('renders section title and subtitle', () => {
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-3xl md:text-4xl font-bold text-gray-900');
  });

  test('renders image with correct alt text', () => {
    const image = screen.getByAltText('Job connections illustration');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '../img2.jpeg');
  });

  test('renders text content correctly', () => {
    expect(
      screen.getByText(/At DU Tutors, we believe in simplifying the way tuition opportunities are shared/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Whether you're looking for the right tutor or a meaningful teaching opportunity/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We are committed to creating a trusted space where learning and teaching go hand in hand/)
    ).toBeInTheDocument();
  });

  test('renders stats section with correct values', () => {
    expect(screen.getByText('15K+')).toBeInTheDocument();
    expect(screen.getByText('Active Job Seekers')).toBeInTheDocument();
    expect(screen.getByText('5K+')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction Rate')).toBeInTheDocument();
  });

  test('renders gradient divider with correct classes', () => {
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('border-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600');
  });

  test('renders highlight box with correct styling', () => {
    const highlightBox = screen.getByText(
      /We are committed to creating a trusted space where learning and teaching go hand in hand/
    ).parentElement;
    expect(highlightBox).toHaveClass('bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-l-4 border-purple-600');
  });
});