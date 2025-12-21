import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import ProgressCard from './ProgressCard';

describe('ProgressCard', () => {
  it('renders title and value', () => {
    render(<ProgressCard title="Total Courses" value={25} icon="courses" />);
    
    expect(screen.getByText('Total Courses')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders with string value', () => {
    render(<ProgressCard title="Total Revenue" value="$1,250" icon="trending" />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$1,250')).toBeInTheDocument();
  });

  it('displays subtitle when provided', () => {
    render(
      <ProgressCard
        title="Active Students"
        value={150}
        subtitle="Across all courses"
        icon="courses"
      />
    );
    
    expect(screen.getByText('Across all courses')).toBeInTheDocument();
  });

  it('does not display subtitle when not provided', () => {
    render(<ProgressCard title="Total Courses" value={10} icon="courses" />);
    
    const card = screen.getByText('Total Courses').closest('div');
    expect(card).toBeInTheDocument();
    // Subtitle should not exist
    expect(screen.queryByText(/Across/)).not.toBeInTheDocument();
  });

  it('renders trending icon', () => {
    const { container } = render(
      <ProgressCard title="Revenue" value="$500" icon="trending" />
    );
    
    // Check for icon presence by class
    const icon = container.querySelector('svg.lucide-trending-up');
    expect(icon).toBeInTheDocument();
  });

  it('renders courses icon', () => {
    const { container } = render(
      <ProgressCard title="Courses" value={10} icon="courses" />
    );
    
    const icon = container.querySelector('svg.lucide-book-open');
    expect(icon).toBeInTheDocument();
  });

  it('renders time icon', () => {
    const { container } = render(
      <ProgressCard title="Time Spent" value="24h" icon="time" />
    );
    
    const icon = container.querySelector('svg.lucide-clock');
    expect(icon).toBeInTheDocument();
  });

  it('renders award icon', () => {
    const { container } = render(
      <ProgressCard title="Achievements" value={5} icon="award" />
    );
    
    const icon = container.querySelector('svg.lucide-award');
    expect(icon).toBeInTheDocument();
  });

  it('displays progress bar when progress is provided', () => {
    const { container } = render(
      <ProgressCard title="Course Progress" value="75%" icon="courses" progress={75} />
    );
    
    // Progress component should be rendered
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('does not display progress bar when progress is not provided', () => {
    const { container } = render(
      <ProgressCard title="Total Courses" value={10} icon="courses" />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('renders with zero progress', () => {
    const { container } = render(
      <ProgressCard title="Progress" value="0%" icon="trending" progress={0} />
    );
    
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders with 100% progress', () => {
    const { container } = render(
      <ProgressCard title="Completed" value="100%" icon="award" progress={100} />
    );
    
    expect(screen.getByText('100%')).toBeInTheDocument();
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeInTheDocument();
  });
});
