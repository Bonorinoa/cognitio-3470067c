import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { EmptyState } from './EmptyState';
import { BookOpen } from 'lucide-react';
import userEvent from '@testing-library/user-event';

describe('EmptyState', () => {
  it('renders icon, title, and description', () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="No courses found"
        description="Try adjusting your filters"
      />
    );
    
    expect(screen.getByText('No courses found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const handleClick = vi.fn();
    
    render(
      <EmptyState
        icon={BookOpen}
        title="No courses found"
        description="Try adjusting your filters"
        action={{
          label: 'Browse Courses',
          onClick: handleClick
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Browse Courses' });
    expect(button).toBeInTheDocument();
  });

  it('calls action onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <EmptyState
        icon={BookOpen}
        title="No courses found"
        description="Try adjusting your filters"
        action={{
          label: 'Browse Courses',
          onClick: handleClick
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Browse Courses' });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when not provided', () => {
    render(
      <EmptyState
        icon={BookOpen}
        title="No courses found"
        description="Try adjusting your filters"
      />
    );
    
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });
});
