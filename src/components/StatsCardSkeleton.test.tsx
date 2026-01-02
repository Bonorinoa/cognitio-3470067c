import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils';
import { StatsCardSkeleton } from './StatsCardSkeleton';

describe('StatsCardSkeleton', () => {
  it('renders skeleton components for stats card', () => {
    const { container } = render(<StatsCardSkeleton />);
    
    // Check that skeleton elements are present
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with proper structure matching ProgressCard', () => {
    const { container } = render(<StatsCardSkeleton />);
    
    // Check for Card component
    const card = container.querySelector('[class*="bg-card"]');
    expect(card).toBeInTheDocument();
    
    // Check that it has multiple skeleton elements (header icon, title, value, subtitle)
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });
});
