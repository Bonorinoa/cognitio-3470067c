/**
 * Centralized route configuration for AI Studio
 */

export const AI_STUDIO_ROUTES = {
  // Main routes
  ROOT: "/ai-studio",
  KNOWLEDGE: "/ai-studio/knowledge",
  SETTINGS: "/ai-studio/settings",
  
  // Marketing bundle
  MARKETING: "/ai-studio/marketing",
  MARKETING_BLOG: "/ai-studio/marketing/blog",
  MARKETING_LINKEDIN: "/ai-studio/marketing/linkedin",
  MARKETING_TWITTER: "/ai-studio/marketing/twitter",
  MARKETING_NEWSLETTER: "/ai-studio/marketing/newsletter",
  
  // Academic bundle
  ACADEMIC: "/ai-studio/academic",
  ACADEMIC_LITERATURE_REVIEW: "/ai-studio/academic/literature-review",
  ACADEMIC_PAPER_FORMATTER: "/ai-studio/academic/paper-formatter",
  ACADEMIC_PAPER_EDITOR: "/ai-studio/academic/paper-editor",
} as const;

/**
 * Feature keys for notification requests
 */
export const FEATURE_KEYS = {
  ACADEMIC_BUNDLE: "academic_bundle",
  MARKETING_LINKEDIN: "marketing_linkedin",
  MARKETING_TWITTER: "marketing_twitter",
  MARKETING_NEWSLETTER: "marketing_newsletter",
  ACADEMIC_LITERATURE_REVIEW: "academic_literature_review",
  ACADEMIC_PAPER_FORMATTER: "academic_paper_formatter",
  ACADEMIC_PAPER_EDITOR: "academic_paper_editor",
} as const;

/**
 * Coming soon feature configurations
 */
export const COMING_SOON_FEATURES = {
  marketing: {
    linkedin: {
      featureKey: FEATURE_KEYS.MARKETING_LINKEDIN,
      titleKey: "aiStudio.linkedinGenerator",
      bundle: "marketing" as const,
    },
    twitter: {
      featureKey: FEATURE_KEYS.MARKETING_TWITTER,
      titleKey: "aiStudio.twitterGenerator",
      bundle: "marketing" as const,
    },
    newsletter: {
      featureKey: FEATURE_KEYS.MARKETING_NEWSLETTER,
      titleKey: "aiStudio.newsletterGenerator",
      bundle: "marketing" as const,
    },
  },
  academic: {
    "literature-review": {
      featureKey: FEATURE_KEYS.ACADEMIC_LITERATURE_REVIEW,
      titleKey: "aiStudio.literatureReview",
      bundle: "academic" as const,
    },
    "paper-formatter": {
      featureKey: FEATURE_KEYS.ACADEMIC_PAPER_FORMATTER,
      titleKey: "aiStudio.paperFormatter",
      bundle: "academic" as const,
    },
    "paper-editor": {
      featureKey: FEATURE_KEYS.ACADEMIC_PAPER_EDITOR,
      titleKey: "aiStudio.paperEditor",
      bundle: "academic" as const,
    },
  },
} as const;
