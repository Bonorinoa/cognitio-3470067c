// AI Studio TypeScript Types
// Mirrors database enums and provides type safety for the AI Content Studio

// === Enums (matching database enums) ===

export type DocumentType = 
  | 'academic_paper' 
  | 'cv_bio' 
  | 'methodology' 
  | 'writing_sample' 
  | 'syllabus' 
  | 'other';

export type ContextRole = 
  | 'style_reference' 
  | 'topic_source' 
  | 'background_context';

export type WritingTone = 
  | 'formal' 
  | 'conversational' 
  | 'academic' 
  | 'journalistic';

export type LengthPreference = 
  | 'concise' 
  | 'moderate' 
  | 'detailed';

export type LanguagePreference = 
  | 'es' 
  | 'en' 
  | 'bilingual';

export type GenerationStatus = 
  | 'pending' 
  | 'completed' 
  | 'failed';

export type ContentType = 
  | 'blog' 
  | 'newsletter';

// === Interfaces ===

export interface InstructorStyleProfile {
  id: string;
  instructor_id: string;
  tone: WritingTone;
  target_audience: string | null;
  preferred_length: LengthPreference;
  language_preference: LanguagePreference;
  include_citations: boolean;
  use_examples: boolean;
  include_call_to_action: boolean;
  custom_instructions: string | null;
  setup_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseDocument {
  id: string;
  instructor_id: string;
  title: string;
  document_type: DocumentType;
  context_role: ContextRole;
  content: string;
  content_tokens: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GenerationHistoryEntry {
  id: string;
  instructor_id: string;
  content_type: ContentType;
  topic: string;
  additional_instructions: string | null;
  selected_document_ids: string[];
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  status: GenerationStatus;
  generated_content: string | null;
  error_message: string | null;
  model_used: string;
  created_at: string;
  updated_at: string;
}

// === Form/Input Types ===

export interface StyleProfileFormData {
  tone: WritingTone;
  target_audience: string;
  preferred_length: LengthPreference;
  language_preference: LanguagePreference;
  include_citations: boolean;
  use_examples: boolean;
  include_call_to_action: boolean;
  custom_instructions: string;
}

export interface DocumentFormData {
  title: string;
  document_type: DocumentType;
  context_role: ContextRole;
  content: string;
  tags: string[];
}

export interface BlogGenerationRequest {
  content_type: ContentType;
  topic: string;
  additional_instructions?: string;
  selected_document_ids: string[];
}

// === Context Assembly Types ===

export interface InstructorContext {
  profile: {
    full_name: string;
    headline: string | null;
    bio: string | null;
    affiliation: string | null;
    credentials: string[] | null;
  };
  style: InstructorStyleProfile | null;
  documents: {
    style_reference: KnowledgeBaseDocument[];
    topic_source: KnowledgeBaseDocument[];
    background_context: KnowledgeBaseDocument[];
  };
}

// === UI Helper Types ===

export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
  description: string;
  defaultContextRole: ContextRole;
}

export interface ContextRoleOption {
  value: ContextRole;
  label: string;
  description: string;
}

// === Constants ===

export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  {
    value: 'academic_paper',
    label: 'Academic Paper',
    description: 'Research papers, publications, or scholarly articles',
    defaultContextRole: 'topic_source',
  },
  {
    value: 'cv_bio',
    label: 'CV / Long Bio',
    description: 'Professional background and career history',
    defaultContextRole: 'style_reference',
  },
  {
    value: 'methodology',
    label: 'Methodology',
    description: 'Teaching or research methodology descriptions',
    defaultContextRole: 'style_reference',
  },
  {
    value: 'writing_sample',
    label: 'Writing Sample',
    description: 'Previously written content that reflects your voice',
    defaultContextRole: 'style_reference',
  },
  {
    value: 'syllabus',
    label: 'Syllabus',
    description: 'Course outlines and educational materials',
    defaultContextRole: 'background_context',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Any other relevant document',
    defaultContextRole: 'background_context',
  },
];

export const CONTEXT_ROLE_OPTIONS: ContextRoleOption[] = [
  {
    value: 'style_reference',
    label: 'Style Reference',
    description: 'Used to inform your writing voice and methodology',
  },
  {
    value: 'topic_source',
    label: 'Topic Source',
    description: 'Used as the main subject matter for content',
  },
  {
    value: 'background_context',
    label: 'Background Context',
    description: 'Establishes your expertise and credibility',
  },
];

export const WRITING_TONE_OPTIONS: { value: WritingTone; label: string }[] = [
  { value: 'formal', label: 'Formal' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'academic', label: 'Academic' },
  { value: 'journalistic', label: 'Journalistic' },
];

export const LENGTH_PREFERENCE_OPTIONS: { value: LengthPreference; label: string }[] = [
  { value: 'concise', label: 'Concise (~500 words)' },
  { value: 'moderate', label: 'Moderate (~1000 words)' },
  { value: 'detailed', label: 'Detailed (~2000 words)' },
];

export const LANGUAGE_PREFERENCE_OPTIONS: { value: LanguagePreference; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'bilingual', label: 'Bilingual' },
];

export const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string; description: string }[] = [
  { value: 'blog', label: 'Blog Post', description: 'Long-form article for your website or platform' },
  { value: 'newsletter', label: 'Newsletter', description: 'Email-style content for subscribers' },
];
