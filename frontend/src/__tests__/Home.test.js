import { render, screen } from '@testing-library/react';
import Home from '../components/Home';

// Mock child components to isolate Home component
jest.mock('../components/Navbar', () => () => <div data-testid="navbar">Mocked Navbar</div>);
jest.mock('../components/Hero', () => () => <div data-testid="hero">Mocked Hero</div>);
jest.mock('../components/LatestPosts', () => () => <div data-testid="latest-posts">Mocked LatestJobPosts</div>);
jest.mock('../components/About', () => () => <div data-testid="about">Mocked About</div>);
jest.mock('../components/Services', () => () => <div data-testid="services">Mocked Services</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer">Mocked Footer</div>);

describe('Home Component', () => {
  beforeEach(() => {
    render(<Home />);
  });


  test('renders Navbar component', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Mocked Navbar')).toBeInTheDocument();
  });

  test('renders Hero component', () => {
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByText('Mocked Hero')).toBeInTheDocument();
  });

  test('renders LatestJobPosts component', () => {
    expect(screen.getByTestId('latest-posts')).toBeInTheDocument();
    expect(screen.getByText('Mocked LatestJobPosts')).toBeInTheDocument();
  });

  test('renders About component', () => {
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByText('Mocked About')).toBeInTheDocument();
  });

  test('renders Services component', () => {
    expect(screen.getByTestId('services')).toBeInTheDocument();
    expect(screen.getByText('Mocked Services')).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });
});