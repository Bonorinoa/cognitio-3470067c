/**
 * Validates an email address using a comprehensive regex pattern
 * Handles common edge cases like plus signs, dots, hyphens, and underscores
 * @param email - The email address to validate
 * @returns true if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  
  // Comprehensive email validation regex that handles:
  // - Plus signs (+) in local part
  // - Multiple dots in local part
  // - Hyphens and underscores
  // - Multiple dots in domain
  // - Subdomains
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional validation: ensure no consecutive dots
  if (email.includes('..')) return false;
  
  // Ensure @ is present and not at start or end
  const atIndex = email.indexOf('@');
  if (atIndex === 0 || atIndex === email.length - 1) return false;
  
  return emailRegex.test(email);
}
