/**
 * Shared validation rules and helpers for MainCharacter authentication.
 */

// ================================================================
// 1. EMAIL RULES
// ================================================================
/**
 * Allowed characters: a–z, 0–9, dot, underscore, plus, hyphen. No spaces anywhere.
 * Format: local part, one @, domain, and a top-level domain of at least 2 letters.
 * Reject leading or trailing dots, two dots in a row (..), and a dot right after @.
 * Max 254 characters.
 */
export const EMAIL_REGEX =
  /^[a-z0-9](?:(?!.*\.\.)[a-z0-9._%+-]*[a-z0-9])?@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalized?: string;
}

export function validateEmail(raw: string): ValidationResult {
  if (!raw || raw.trim() === "") {
    return { valid: false, error: "Email is required." };
  }

  const email = raw.trim();

  // Reject any uppercase letter (A–Z) with the exact required message
  if (/[A-Z]/.test(email)) {
    return { valid: false, error: "Email must use lowercase letters only." };
  }

  if (email.length > 254) {
    return { valid: false, error: "Email must not exceed 254 characters." };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Enter a valid email address." };
  }

  return { valid: true, normalized: email };
}

// ================================================================
// 2. PHONE RULES
// ================================================================
/**
 * Normalise before checking: strip spaces, hyphens and brackets.
 * If input has +91 prefix, remove it.
 * Returns the 10-digit normalised number (without +91).
 */
export function normalizePhone(raw: string): string {
  if (!raw) return "";
  let stripped = raw.trim().replace(/[\s\-\(\)\[\]]/g, "");
  if (stripped.startsWith("+91")) {
    stripped = stripped.slice(3);
  }
  return stripped;
}

/**
 * Check if the number contains a run of N or more digits increasing by 1 each time.
 */
export function hasIncreasingRun(digits: string, runLength = 5): boolean {
  let count = 1;
  for (let i = 0; i < digits.length - 1; i++) {
    const curr = Number(digits[i]);
    const next = Number(digits[i + 1]);
    if (!Number.isNaN(curr) && !Number.isNaN(next) && next === curr + 1) {
      count++;
      if (count >= runLength) return true;
    } else {
      count = 1;
    }
  }
  return false;
}

/**
 * Check if the number contains a run of N or more digits decreasing by 1 each time.
 */
export function hasDecreasingRun(digits: string, runLength = 5): boolean {
  let count = 1;
  for (let i = 0; i < digits.length - 1; i++) {
    const curr = Number(digits[i]);
    const next = Number(digits[i + 1]);
    if (!Number.isNaN(curr) && !Number.isNaN(next) && next === curr - 1) {
      count++;
      if (count >= runLength) return true;
    } else {
      count = 1;
    }
  }
  return false;
}

/**
 * Check if the number consists of a repeated block:
 * - Two digits repeated five times (e.g. 9898989898 or 1212121212)
 * - Or 5 digits repeated twice (e.g. 9876198761)
 */
export function hasRepeatedBlock(digits: string): boolean {
  if (digits.length === 10) {
    if (digits.slice(0, 2).repeat(5) === digits) return true;
    if (digits.slice(0, 5).repeat(2) === digits) return true;
  }
  return false;
}

export function validatePhone(raw: string): ValidationResult {
  if (!raw || raw.trim() === "") {
    return { valid: false, error: "Enter a valid 10-digit mobile number." };
  }

  const trimmed = raw.trim();

  // Accept input in these forms only: 10 digits or +91 followed by 10 digits
  if (trimmed.startsWith("+") && !trimmed.startsWith("+91")) {
    return { valid: false, error: "Enter a valid 10-digit mobile number." };
  }

  const normalized = normalizePhone(trimmed);

  // Exactly 10 digits after removing optional leading +91. Reject 9 or 11 digits, reject letters.
  if (!/^\d{10}$/.test(normalized)) {
    return { valid: false, error: "Enter a valid 10-digit mobile number." };
  }

  // Reject obvious fake numbers (evaluated on 10-digit numbers):
  // a) All the same digit (e.g. 9999999999, 6666666666)
  if (normalized === normalized[0].repeat(10)) {
    return {
      valid: false,
      error: "This phone number looks invalid. Enter your real mobile number.",
    };
  }

  // b) Run of 5 or more digits increasing by 1 (e.g. 1234567890, 6789012345, 3456789012)
  if (hasIncreasingRun(normalized, 5)) {
    return {
      valid: false,
      error: "This phone number looks invalid. Enter your real mobile number.",
    };
  }

  // c) Run of 5 or more digits decreasing by 1 (e.g. 9876543210, 8765432109)
  if (hasDecreasingRun(normalized, 5)) {
    return {
      valid: false,
      error: "This phone number looks invalid. Enter your real mobile number.",
    };
  }

  // d) Repeated block (e.g. 9898989898, 1212121212)
  if (hasRepeatedBlock(normalized)) {
    return {
      valid: false,
      error: "This phone number looks invalid. Enter your real mobile number.",
    };
  }

  // First digit must be 6, 7, 8 or 9 (Indian mobile numbers)
  if (!/^[6-9]/.test(normalized)) {
    return { valid: false, error: "Enter a valid 10-digit mobile number." };
  }

  return { valid: true, normalized };
}

// ================================================================
// 3. USERNAME RULES
// ================================================================
export const RESERVED_USERNAMES = new Set([
  "admin",
  "root",
  "support",
  "account",
  "login",
  "signup",
  "collections",
  "cart",
  "checkout",
]);

export function validateUsername(raw: string): ValidationResult {
  if (!raw || raw.trim() === "") {
    return { valid: false, error: "Username is required." };
  }

  const username = raw.trim();

  // Check reserved words first (case-insensitive)
  if (RESERVED_USERNAMES.has(username.toLowerCase())) {
    return {
      valid: false,
      error: "This username is reserved. Please choose another.",
    };
  }

  // Length: 3 to 20 characters
  if (username.length < 3 || username.length > 20) {
    return {
      valid: false,
      error: "Username must be between 3 and 20 characters.",
    };
  }

  // Cannot start with a number or underscore
  if (/^[0-9_]/.test(username)) {
    return {
      valid: false,
      error: "Username cannot start with a number or underscore.",
    };
  }

  // Only lowercase letters, numbers, and underscores (reject uppercase, spaces, symbols)
  if (/[^a-z0-9_]/.test(username)) {
    return {
      valid: false,
      error:
        "Username can use lowercase letters, numbers and underscores only.",
    };
  }

  return { valid: true, normalized: username };
}

// ================================================================
// 4. PASSWORD RULES
// ================================================================
export interface PasswordValidationContext {
  username?: string;
  email?: string;
}

export function validatePassword(
  password: string,
  context?: PasswordValidationContext
): ValidationResult {
  if (!password) {
    return { valid: false, error: "Password is required." };
  }

  // Min 8, max 72 characters (bcrypt limit)
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters." };
  }
  if (password.length > 72) {
    return { valid: false, error: "Password must not exceed 72 characters." };
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one lowercase letter.",
    };
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter.",
    };
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number.",
    };
  }

  // At least one symbol (!@#$%^&* or similar)
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one symbol (!@#$%^&* etc.).",
    };
  }

  // Must not contain username
  if (context?.username && context.username.length >= 3) {
    if (password.toLowerCase().includes(context.username.toLowerCase())) {
      return {
        valid: false,
        error: "Password must not contain your username.",
      };
    }
  }

  // Must not contain email local part
  if (context?.email && context.email.includes("@")) {
    const localPart = context.email.split("@")[0];
    if (localPart && localPart.length >= 3) {
      if (password.toLowerCase().includes(localPart.toLowerCase())) {
        return {
          valid: false,
          error: "Password must not contain your email local part.",
        };
      }
    }
  }

  return { valid: true };
}

// ================================================================
// 5. LOGIN IDENTIFIER RULES
// ================================================================
export function validateLoginIdentifier(raw: string): ValidationResult {
  if (!raw || raw.trim() === "") {
    return { valid: false, error: "Email or phone number is required." };
  }

  const trimmed = raw.trim();

  // If it contains "@", run email rules
  if (trimmed.includes("@")) {
    return validateEmail(trimmed);
  }

  // Otherwise run phone rules
  return validatePhone(trimmed);
}
