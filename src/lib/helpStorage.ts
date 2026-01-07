// localStorage keys for tracking dismissed help content
export const HELP_STORAGE_KEYS = {
  instructorGettingStarted: 'cognitio_help_instructor_getting_started_dismissed',
  courseCreationTips: 'cognitio_help_course_creation_dismissed',
  aiTutorIntro: 'cognitio_help_ai_tutor_intro_dismissed',
  aiStudioIntro: 'cognitio_help_ai_studio_intro_dismissed',
} as const;

export type HelpKey = keyof typeof HELP_STORAGE_KEYS;

/**
 * Check if a help item has been dismissed
 */
export const isHelpDismissed = (key: HelpKey): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(HELP_STORAGE_KEYS[key]) === 'true';
};

/**
 * Dismiss a help item (user clicked "Got it" or similar)
 */
export const dismissHelp = (key: HelpKey): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HELP_STORAGE_KEYS[key], 'true');
};

/**
 * Reset a dismissed help item (make it visible again)
 */
export const resetHelp = (key: HelpKey): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HELP_STORAGE_KEYS[key]);
};

/**
 * Reset all help items (useful for "show all tips again" feature)
 */
export const resetAllHelp = (): void => {
  if (typeof window === 'undefined') return;
  Object.values(HELP_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
