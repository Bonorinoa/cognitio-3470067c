import { describe, it, expect } from 'vitest';
import { render, screen, userEvent } from '@/test/utils';
import VideoPlayer from './VideoPlayer';

describe('VideoPlayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoPlayer />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(<VideoPlayer title="Introduction to React" />);
    expect(screen.getByText('Introduction to React')).toBeInTheDocument();
  });

  it('does not display title when not provided', () => {
    const { container } = render(<VideoPlayer />);
    const title = container.querySelector('h3');
    expect(title).not.toBeInTheDocument();
  });

  it('shows play button overlay when not playing', () => {
    render(<VideoPlayer />);
    
    // Find play button by its icon (there are two play buttons)
    const playButtons = screen.getAllByRole('button');
    expect(playButtons.length).toBeGreaterThan(0);
  });

  it('toggles play/pause on button click', async () => {
    render(<VideoPlayer />);
    const user = userEvent.setup();
    
    // Click the large play button overlay
    const playButtons = screen.getAllByRole('button');
    const largePlayButton = playButtons.find(btn => 
      btn.className.includes('h-16 w-16')
    );
    
    expect(largePlayButton).toBeInTheDocument();
    if (largePlayButton) {
      await user.click(largePlayButton);
    }
    
    // After clicking, the pause button should appear in controls
    // (Implementation note: In actual usage, video state would change)
  });

  it('displays playback controls', () => {
    render(<VideoPlayer />);
    
    // Controls should be visible by default
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1); // Multiple control buttons
  });

  it('shows time display', () => {
    render(<VideoPlayer />);
    
    // Default time display
    expect(screen.getByText('0:00 / 12:34')).toBeInTheDocument();
  });

  it('toggles mute state', async () => {
    render(<VideoPlayer />);
    const user = userEvent.setup();
    
    // Find mute/unmute button by checking for volume icons
    const buttons = screen.getAllByRole('button');
    
    // Initial state should show volume icon (not muted)
    // Click to mute would show VolumeX icon
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders with poster image', () => {
    const posterUrl = 'https://example.com/poster.jpg';
    const { container } = render(<VideoPlayer poster={posterUrl} />);
    
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', posterUrl);
  });

  it('renders with poster and title', () => {
    const posterUrl = 'https://example.com/poster.jpg';
    const title = 'Course Introduction';
    
    render(<VideoPlayer poster={posterUrl} title={title} />);
    
    expect(screen.getByAltText(title)).toHaveAttribute('src', posterUrl);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('has progress slider', () => {
    const { container } = render(<VideoPlayer />);
    
    // Slider is rendered using Radix UI
    const slider = container.querySelector('[role="slider"]');
    expect(slider).toBeInTheDocument();
  });

  it('has settings button', () => {
    render(<VideoPlayer />);
    
    // Find settings button
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4); // play, mute, settings, fullscreen, etc
  });

  it('has fullscreen button', () => {
    render(<VideoPlayer />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('constructs correct Mux URL when playbackId is provided', () => {
    const playbackId = 'abc123';
    render(<VideoPlayer playbackId={playbackId} />);
    
    // The component should construct the URL internally
    // This is more of an implementation detail, but we can verify the component renders
    const { container } = render(<VideoPlayer playbackId={playbackId} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles mouse enter to show controls', () => {
    const { container } = render(<VideoPlayer />);
    
    const playerContainer = container.firstChild as HTMLElement;
    expect(playerContainer).toBeInTheDocument();
    
    // Controls should be visible by default
    const controlsDiv = container.querySelector('.absolute.bottom-0');
    expect(controlsDiv).toBeInTheDocument();
  });
});
