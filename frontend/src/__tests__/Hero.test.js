import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // For testing Link
import Hero from '../components/Hero';

// Mock framer-motion to avoid animation-related complexities
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('Hero Component', () => {
  beforeEach(() => {
    // Wrap with MemoryRouter to support Link
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
  });

  test('renders heading with correct text and styles', () => {
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Your Trusted Platform to Find DU Tutors & Tuitions');
    expect(heading).toHaveClass('text-4xl font-bold mb-4');
  });

  test('renders paragraph with correct text and styles', () => {
    const paragraph = screen.getByText(/DUTutors connects Tutor seekers/);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('mb-6 text-gray-600');
  });

  test('renders Explore Tuition Posts link with correct href and styles', () => {
    const link = screen.getByRole('link', { name: 'Explore Tuition Posts' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/posts');
    expect(link).toHaveClass('bg-customm text-white py-3 px-6 rounded-md hover:bg-[rgba(62,7,181,1)]');
  });

  test('renders image with correct src and alt text', () => {
    const image = screen.getByAltText('Tuition Post');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', './imageHome.jpg');
    expect(image).toHaveClass('rounded-md shadow-md');
  });

  test('renders text content in left column with correct width class', () => {
    const leftColumn = screen.getByRole('heading', { level: 2 }).parentElement;
    expect(leftColumn).toHaveClass('md:w-1/2');
  });

  test('renders image column with correct width class', () => {
    const rightColumn = screen.getByAltText('Tuition Post').parentElement;
    expect(rightColumn).toHaveClass('md:w-1/3');
  });
});