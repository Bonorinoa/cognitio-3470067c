/**
 * Validates an email address using a standard regex pattern
 * @param email - The email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Standard email validation regex
  // Allows letters, numbers, dots, hyphens, and underscores before @
  // Requires domain with at least one dot
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailRegex.test(email);
}
