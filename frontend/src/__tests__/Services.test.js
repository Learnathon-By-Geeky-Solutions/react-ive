import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Services from '../components/Services';
import { useNavigate } from 'react-router-dom';
import { servicesData } from '../utils/servicesData';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../utils/servicesData', () => ({
  servicesData: [
    {
        title: "Posts",
        description: "Explore job posts and find the perfect opportunity tailored to your skills.",
        icon: "📝",
        link: "/posts",
      },
      {
        title: "Applications",
        description: "Manage your job applications efficiently and stay organized.",
        icon: "📄",
        link: "/applications",
      },
  ],
}));

describe('Services component', () => {
  const mockNavigate = jest.fn();

  beforeAll(() => {
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders all services from servicesData', () => {
    render(<Services />);
    
    servicesData.forEach((service) => {
      expect(screen.getByText(service.title)).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
    });
  });

  it('navigates to service link when a service is clicked', () => {
    render(<Services />);

    const serviceCard = screen.getByText('Posts').closest('div');
    fireEvent.click(serviceCard);

    expect(mockNavigate).toHaveBeenCalledWith('/posts');
  });
});
