// Token Utilities for AI Studio
// Provides token estimation and budget management

import type { KnowledgeBaseDocument } from '@/types/aiStudio';

// === Token Limits ===
// Conservative limits for v3.0 to ensure reliable generation

export const TOKEN_LIMITS = {
  /** Maximum tokens for context (conservative budget within Gemini's 1M window) */
  MAX_CONTEXT_BUDGET: 100_000,
  
  /** Maximum tokens for a single document */
  MAX_DOCUMENT_TOKENS: 20_000,
  
  /** Reserved tokens for output generation */
  OUTPUT_RESERVE: 8_000,
  
  /** Maximum number of documents per generation */
  MAX_DOCUMENTS_PER_GENERATION: 10,
  
  /** Daily generation limit per instructor */
  DAILY_GENERATION_LIMIT: 10,
  
  /** Approximate tokens reserved for profile/style context */
  PROFILE_CONTEXT_RESERVE: 2_000,
} as const;

// === Token Estimation ===

/**
 * Estimates the number of tokens in a text string.
 * Uses ~4 characters per token approximation (conservative for English).
 * This is a rough estimate - actual tokenization varies by model.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Rough approximation: ~4 characters per token for English text
  // This tends to slightly overestimate, which is safer for budget management
  return Math.ceil(text.length / 4);
}

/**
 * Formats a token count for display (e.g., "45,000" or "45K")
 */
export function formatTokenCount(tokens: number, compact = false): string {
  if (compact && tokens >= 1000) {
    return `${Math.round(tokens / 1000)}K`;
  }
  return tokens.toLocaleString();
}

// === Budget Validation ===

export interface TokenBudgetValidation {
  isValid: boolean;
  totalTokens: number;
  remainingBudget: number;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a selection of documents against the token budget.
 * Returns validation result with errors and warnings.
 */
export function validateDocumentSelection(
  documents: KnowledgeBaseDocument[]
): TokenBudgetValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check document count limit
  if (documents.length > TOKEN_LIMITS.MAX_DOCUMENTS_PER_GENERATION) {
    errors.push(
      `Maximum ${TOKEN_LIMITS.MAX_DOCUMENTS_PER_GENERATION} documents allowed per generation`
    );
  }
  
  // Calculate total tokens
  const totalTokens = documents.reduce((sum, doc) => sum + doc.content_tokens, 0);
  
  // Available budget after reserving space for profile context and output
  const availableBudget = 
    TOKEN_LIMITS.MAX_CONTEXT_BUDGET - 
    TOKEN_LIMITS.PROFILE_CONTEXT_RESERVE - 
    TOKEN_LIMITS.OUTPUT_RESERVE;
  
  // Check total budget
  if (totalTokens > availableBudget) {
    errors.push(
      `Selected documents (${formatTokenCount(totalTokens)} tokens) exceed budget (${formatTokenCount(availableBudget)} tokens)`
    );
  }
  
  // Warn if approaching budget limit (>80%)
  if (totalTokens > availableBudget * 0.8 && totalTokens <= availableBudget) {
    warnings.push(
      `Using ${Math.round((totalTokens / availableBudget) * 100)}% of available token budget`
    );
  }
  
  // Check individual document sizes
  const oversizedDocs = documents.filter(
    doc => doc.content_tokens > TOKEN_LIMITS.MAX_DOCUMENT_TOKENS
  );
  if (oversizedDocs.length > 0) {
    warnings.push(
      `${oversizedDocs.length} document(s) exceed recommended size of ${formatTokenCount(TOKEN_LIMITS.MAX_DOCUMENT_TOKENS)} tokens`
    );
  }
  
  return {
    isValid: errors.length === 0,
    totalTokens,
    remainingBudget: Math.max(0, availableBudget - totalTokens),
    errors,
    warnings,
  };
}

/**
 * Calculates the total token usage for an instructor's knowledge base.
 */
export function calculateTotalKnowledgeBaseTokens(
  documents: KnowledgeBaseDocument[]
): number {
  return documents
    .filter(doc => doc.is_active)
    .reduce((sum, doc) => sum + doc.content_tokens, 0);
}

// === Usage Tracking ===

/**
 * Checks if adding a new document would exceed the total knowledge base budget.
 */
export function canAddDocument(
  existingDocuments: KnowledgeBaseDocument[],
  newDocumentTokens: number
): { allowed: boolean; reason?: string } {
  const currentTotal = calculateTotalKnowledgeBaseTokens(existingDocuments);
  const newTotal = currentTotal + newDocumentTokens;
  
  // Knowledge base can store more than selection limit, but warn if very large
  const softLimit = TOKEN_LIMITS.MAX_CONTEXT_BUDGET * 5; // 500K for storage
  
  if (newTotal > softLimit) {
    return {
      allowed: false,
      reason: `Adding this document would exceed the knowledge base storage limit of ${formatTokenCount(softLimit)} tokens`,
    };
  }
  
  if (newDocumentTokens > TOKEN_LIMITS.MAX_DOCUMENT_TOKENS) {
    return {
      allowed: true, // Allow but warn
      reason: `Document exceeds recommended size of ${formatTokenCount(TOKEN_LIMITS.MAX_DOCUMENT_TOKENS)} tokens. Consider splitting into smaller documents.`,
    };
  }
  
  return { allowed: true };
}

// === Budget Display Helpers ===

export interface BudgetDisplayInfo {
  usedTokens: number;
  totalBudget: number;
  percentUsed: number;
  status: 'ok' | 'warning' | 'critical' | 'exceeded';
  statusColor: string;
}

/**
 * Gets budget display information for UI components.
 */
export function getBudgetDisplayInfo(usedTokens: number): BudgetDisplayInfo {
  const totalBudget = 
    TOKEN_LIMITS.MAX_CONTEXT_BUDGET - 
    TOKEN_LIMITS.PROFILE_CONTEXT_RESERVE - 
    TOKEN_LIMITS.OUTPUT_RESERVE;
  
  const percentUsed = Math.min(100, Math.round((usedTokens / totalBudget) * 100));
  
  let status: BudgetDisplayInfo['status'];
  let statusColor: string;
  
  if (percentUsed > 100) {
    status = 'exceeded';
    statusColor = 'text-destructive';
  } else if (percentUsed > 90) {
    status = 'critical';
    statusColor = 'text-destructive';
  } else if (percentUsed > 70) {
    status = 'warning';
    statusColor = 'text-warning';
  } else {
    status = 'ok';
    statusColor = 'text-muted-foreground';
  }
  
  return {
    usedTokens,
    totalBudget,
    percentUsed,
    status,
    statusColor,
  };
}
