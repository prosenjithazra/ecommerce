/**
 * Utility functions for validating 10-digit mobile phone numbers.
 *
 * Rules enforced:
 * - Maximum & exact length: 10 numeric digits
 * - Must start with 6, 7, 8, or 9
 * - Rejects dummy repeated digit sequences (e.g. 0000000000, 9999999999)
 */

export const PHONE_REGEX = /^[6-9]\d{9}$/;

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  const digits = phone ? phone.replace(/\D/g, '') : '';

  if (!digits) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  if (digits.length !== 10) {
    return { isValid: false, error: 'Phone number must be exactly 10 digits.' };
  }

  if (!/^[6-9]/.test(digits)) {
    return { isValid: false, error: 'Phone number must start with 6, 7, 8, or 9.' };
  }

  if (/^(\d)\1{9}$/.test(digits)) {
    return { isValid: false, error: 'Please enter a valid phone number sequence.' };
  }

  return { isValid: true };
}
