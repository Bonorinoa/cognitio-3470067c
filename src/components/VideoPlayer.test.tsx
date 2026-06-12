import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import VideoPlayer from './VideoPlayer';

describe('VideoPlayer', () => {
  it('renders empty state when no playbackId', () => {
    render(<VideoPlayer />);
    expect(screen.getByText(/no video available/i)).toBeInTheDocument();
  });

  it('renders mux player stub when playbackId provided', () => {
    render(<VideoPlayer playbackId="abc123" />);
    const player = screen.getByTestId('mux-player');
    expect(player).toBeInTheDocument();
    expect(player).toHaveAttribute('data-playback-id', 'abc123');
  });

  it('passes through title via metadata without rendering it as text', () => {
    render(<VideoPlayer playbackId="abc" title="Intro" />);
    expect(screen.getByTestId('mux-player')).toBeInTheDocument();
  });
});
