import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import CourseCard from './CourseCard';

const defaultProps = {
  id: 'course-1',
  title: 'Web Development Bootcamp',
  description: 'Learn web development from scratch with HTML, CSS, and JavaScript',
  image: 'https://example.com/image.jpg',
  price: 99.99,
  chaptersCount: 10,
  category: 'Development',
};

describe('CourseCard', () => {
  it('renders course title and description', () => {
    render(<CourseCard {...defaultProps} />);
    
    expect(screen.getByText('Web Development Bootcamp')).toBeInTheDocument();
    expect(screen.getByText(/Learn web development from scratch/)).toBeInTheDocument();
  });

  it('renders course price when no progress', () => {
    render(<CourseCard {...defaultProps} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Enroll Now')).toBeInTheDocument();
  });

  it('renders progress percentage when progress is provided', () => {
    render(<CourseCard {...defaultProps} progress={75} />);
    
    expect(screen.getByText('75% complete')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.queryByText('$99.99')).not.toBeInTheDocument();
  });

  it('renders chapter count', () => {
    render(<CourseCard {...defaultProps} />);
    
    expect(screen.getByText('10 chapters')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<CourseCard {...defaultProps} />);
    
    expect(screen.getByText('Development')).toBeInTheDocument();
  });

  it('renders duration when provided', () => {
    render(<CourseCard {...defaultProps} totalDurationSeconds={3660} />);
    
    expect(screen.getByText('1h 1m')).toBeInTheDocument();
  });

  it('links to the course page', () => {
    render(<CourseCard {...defaultProps} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/course/course-1');
  });

  it('displays image with alt text', () => {
    render(<CourseCard {...defaultProps} />);
    
    const image = screen.getByAltText('Web Development Bootcamp');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });
});
