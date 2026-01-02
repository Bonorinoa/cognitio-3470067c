import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { CourseCardSkeleton } from './CourseCardSkeleton';

describe('CourseCardSkeleton', () => {
  it('renders skeleton components for course card', () => {
    const { container } = render(<CourseCardSkeleton />);
    
    // Check that skeleton elements are present
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with proper structure matching CourseCard', () => {
    const { container } = render(<CourseCardSkeleton />);
    
    // Check for Card component
    const card = container.querySelector('[class*="rounded-xl"]');
    expect(card).toBeInTheDocument();
    
    // Check for CardContent
    const cardContent = container.querySelector('[class*="p-4"]');
    expect(cardContent).toBeInTheDocument();
    
    // Check for CardFooter
    const cardFooter = container.querySelector('[class*="border-t"]');
    expect(cardFooter).toBeInTheDocument();
  });
});
