import { render, screen, fireEvent } from '@testing-library/react';
import PropTypes from 'prop-types';
import PostList from '../components/PostList';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
}));

// Define mock postPropType outside jest.mock
const mockPostPropType = PropTypes.shape({});

// Mock PostUtils
jest.mock('../components/PostUtils', () => ({
  transformPostData: jest.fn((post) => ({
    jobDetails: { title: post.name, jobPostId: post._id },
    schedule: { days: post.days },
    userInfo: { guardianName: post.userId.name },
  })),
  postPropType: mockPostPropType,
}));

// Mock PostCard component
jest.mock('../components/PostCard', () => jest.fn(() => <div data-testid="post-card">Post Card</div>));

const { transformPostData } = require('../components/PostUtils');
const PostCard = require('../components/PostCard');

describe('PostList', () => {
  const mockPosts = [
    {
      _id: '1',
      name: 'Math Tutor',
      days: 'Mon, Wed',
      userId: { name: 'John Doe' },
    },
    {
      _id: '2',
      name: 'Science Tutor',
      days: 'Tue, Thu',
      userId: { name: 'Jane Doe' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('renders no posts message when posts is empty and no resetFilters', () => {
    render(<PostList isLoading={false} posts={[]} />);
    expect(screen.getByText('No tuition postings found.')).toBeInTheDocument();
    expect(screen.queryByText('View All Tuitions')).not.toBeInTheDocument();
  });

  test('renders no posts message with reset button when resetFilters is provided', () => {
    const resetFilters = jest.fn();
    render(<PostList isLoading={false} posts={[]} resetFilters={resetFilters} />);
    expect(screen.getByText('No tuition postings found.')).toBeInTheDocument();
    const button = screen.getByText('View All Tuitions');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(resetFilters).toHaveBeenCalled();
  });

  test('renders PostCard components for each post without animation', () => {
    render(<PostList isLoading={false} posts={mockPosts} animate={false} />);
    expect(screen.getAllByTestId('post-card')).toHaveLength(2);
    expect(transformPostData).toHaveBeenCalledTimes(2);
    expect(transformPostData).toHaveBeenCalledWith(mockPosts[0]);
    expect(transformPostData).toHaveBeenCalledWith(mockPosts[1]);
    expect(PostCard).toHaveBeenCalledWith(
      expect.objectContaining({
        jobDetails: { title: 'Math Tutor', jobPostId: '1' },
        schedule: { days: 'Mon, Wed' },
        userInfo: { guardianName: 'John Doe' },
      }),
      expect.anything()
    );
    expect(PostCard).toHaveBeenCalledWith(
      expect.objectContaining({
        jobDetails: { title: 'Science Tutor', jobPostId: '2' },
        schedule: { days: 'Tue, Thu' },
        userInfo: { guardianName: 'Jane Doe' },
      }),
      expect.anything()
    );
  });

  test('renders PostCard components with animation when animate is true', () => {
    render(<PostList isLoading={false} posts={mockPosts} animate={true} />);
    expect(screen.getAllByTestId('post-card')).toHaveLength(2);
    expect(transformPostData).toHaveBeenCalledTimes(2);
    const motionDiv = require('framer-motion').motion.div;
    expect(motionDiv).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        variants: expect.any(Object),
        initial: 'hidden',
        animate: 'visible',
      }),
      expect.anything()
    );
    expect(motionDiv).toHaveBeenCalledWith(
      expect.objectContaining({
        variants: expect.any(Object),
        children: expect.anything(),
      }),
      expect.anything()
    );
  });

  test('PostList propTypes validates correct props', () => {
    const sampleProps = {
      isLoading: false,
      posts: mockPosts,
      animate: true,
      resetFilters: jest.fn(),
    };

    const checkPropTypes = require('prop-types').checkPropTypes;
    const consoleError = console.error;
    console.error = jest.fn();

    checkPropTypes(PostList.propTypes, sampleProps, 'prop', 'PostList');

    expect(console.error).not.toHaveBeenCalled();
    console.error = consoleError;
  });

  test('PostList propTypes fails on invalid props', () => {
    const invalidProps = {
      isLoading: 'not a boolean',
      posts: 'not an array',
    };

    const checkPropTypes = require('prop-types').checkPropTypes;
    const consoleError = console.error;
    console.error = jest.fn();

    checkPropTypes(PostList.propTypes, invalidProps, 'prop', 'PostList');

    expect(console.error).toHaveBeenCalled();
    console.error = consoleError;
  });
});