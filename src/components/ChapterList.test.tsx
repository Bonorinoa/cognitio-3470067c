import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import ChapterList from './ChapterList';

const mockChapters = [
  {
    id: 'chapter-1',
    title: 'Introduction',
    duration: '10:00',
    isPreview: true,
    isCompleted: false,
    isLocked: false,
  },
  {
    id: 'chapter-2',
    title: 'Getting Started',
    duration: '15:00',
    isPreview: false,
    isCompleted: true,
    isLocked: false,
  },
  {
    id: 'chapter-3',
    title: 'Advanced Topics',
    duration: '20:00',
    isPreview: false,
    isCompleted: false,
    isLocked: true,
  },
];

describe('ChapterList', () => {
  it('renders all chapters', () => {
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={() => {}}
        hasAccess={false}
      />
    );

    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Advanced Topics')).toBeInTheDocument();
  });

  it('shows Free Preview badge for preview chapters when no access', () => {
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={() => {}}
        hasAccess={false}
      />
    );

    expect(screen.getByText('Free Preview')).toBeInTheDocument();
  });

  it('does not show Free Preview badge when user has access', () => {
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={() => {}}
        hasAccess={true}
      />
    );

    expect(screen.queryByText('Free Preview')).not.toBeInTheDocument();
  });

  it('calls onSelectChapter when clicking accessible chapter', () => {
    const onSelectChapter = vi.fn();
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={onSelectChapter}
        hasAccess={true}
      />
    );

    fireEvent.click(screen.getByText('Introduction'));
    expect(onSelectChapter).toHaveBeenCalledWith('chapter-1');
  });

  it('does not call onSelectChapter when clicking locked chapter without access', () => {
    const onSelectChapter = vi.fn();
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={onSelectChapter}
        hasAccess={false}
      />
    );

    const advancedButton = screen.getByText('Advanced Topics').closest('button');
    fireEvent.click(advancedButton!);
    expect(onSelectChapter).not.toHaveBeenCalled();
  });

  it('highlights the current chapter', () => {
    render(
      <ChapterList
        chapters={mockChapters}
        currentChapterId="chapter-1"
        onSelectChapter={() => {}}
        hasAccess={true}
      />
    );

    const currentChapterButton = screen.getByText('Introduction').closest('button');
    expect(currentChapterButton).toHaveClass('border-primary');
  });

  it('displays chapter durations', () => {
    render(
      <ChapterList
        chapters={mockChapters}
        onSelectChapter={() => {}}
        hasAccess={true}
      />
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('15:00')).toBeInTheDocument();
    expect(screen.getByText('20:00')).toBeInTheDocument();
  });
});
