import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Hero from '../components/Hero';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, variants, initial, animate }) => (
      <div className={className} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

// Mock react-router-dom Link component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, className }) => (
    <a href={to} className={className} data-testid="router-link">
      {children}
    </a>
  ),
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));

describe('Hero Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders component with correct heading', () => {
    render(<Hero />);
    
    const heading = screen.getByText('Your Trusted Platform to Find DU Tutors & Tuitions');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-4xl font-bold mb-4');
  });

  test('renders descriptive paragraph', () => {
    render(<Hero />);
    
    const paragraph = screen.getByText(/DUTutors connects Tutor seekers/);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('mb-6 text-gray-600');
  });

  test('renders explore button with correct link', () => {
    render(<Hero />);
    
    const button = screen.getByText('Explore Tuition Posts');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/posts');
    expect(button.closest('a')).toHaveClass('bg-gradient-to-r from-[#A6D8FF] to-[#3F7CAD] text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]');
  });

  test('renders image with correct attributes', () => {
    render(<Hero />);
    
    const image = screen.getByAltText('Tuition Post');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './homeImage.png');
    expect(image).toHaveClass('rounded-md shadow-md');
  });

  test('renders two motion divs with correct classes', () => {
    render(<Hero />);
    
    const motionDivs = screen.getAllByTestId('motion-div');
    expect(motionDivs).toHaveLength(2);
    expect(motionDivs[0]).toHaveClass('md:w-1/2');
    expect(motionDivs[1]).toHaveClass('md:w-1/3');
  });

  test('renders responsive container with correct classes', () => {
    render(<Hero />);
    
    // Find the section container
    const section = screen.getByText('Your Trusted Platform to Find DU Tutors & Tuitions').closest('section');
    expect(section).toHaveClass('container mx-auto py-12 flex flex-col md:flex-row items-center justify-between');
  });
});