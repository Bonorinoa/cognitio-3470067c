import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { server } from './mocks/server';
import es from '../locales/es.json';

// --- i18n mock --------------------------------------------------------------
// Cognitio is Spanish-only. Resolve any dotted key against es.json; falls back
// to the supplied defaultValue and then to the key itself (matches i18next's
// default behavior).
function resolveKey(key: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let node: any = es;
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) node = node[part];
    else return undefined;
  }
  return typeof node === 'string' ? node : undefined;
}

function interpolate(
  template: string,
  vars?: Record<string, unknown>,
): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{{${name}}}`,
  );
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, optsOrDefault?: unknown, maybeOpts?: unknown) => {
      const defaultValue =
        typeof optsOrDefault === 'string' ? optsOrDefault : undefined;
      const opts =
        (typeof optsOrDefault === 'object' && optsOrDefault) ||
        (typeof maybeOpts === 'object' && maybeOpts) ||
        undefined;
      const resolved = resolveKey(key) ?? defaultValue ?? key;
      return interpolate(resolved, opts as Record<string, unknown> | undefined);
    },
    i18n: { language: 'es', changeLanguage: vi.fn() },
  }),
  Trans: ({
    children,
    i18nKey,
  }: {
    children?: React.ReactNode;
    i18nKey?: string;
  }) => children ?? (i18nKey ? resolveKey(i18nKey) ?? i18nKey : null),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

// --- @mux/mux-player(-react) mock ------------------------------------------
// The real web-component crashes inside jsdom's disconnectedCallback. Replace
// with inert stubs so tests can assert on the surrounding UI.
vi.mock('@mux/mux-player-react', async () => {
  const React = await import('react');
  return {
    default: (props: Record<string, unknown>) =>
      React.createElement('div', {
        'data-testid': 'mux-player',
        'data-playback-id': props.playbackId,
      }),
  };
});
vi.mock('@mux/mux-player', () => ({ default: class {} }));

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset any request handlers after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

(globalThis as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
  ResizeObserverMock as unknown as typeof ResizeObserver;
