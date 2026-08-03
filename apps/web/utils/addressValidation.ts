/**
 * Utility functions for validating Indian addresses (PIN Code & State).
 */

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export function sanitizePincodeInput(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function validateIndianPincode(pincode: string): { isValid: boolean; error?: string } {
  const digits = pincode ? pincode.replace(/\D/g, '') : '';

  if (!digits) {
    return { isValid: false, error: 'PIN Code (Zip) is required.' };
  }

  if (digits.length !== 6) {
    return { isValid: false, error: 'Indian PIN Code must be exactly 6 digits.' };
  }

  if (/^0/.test(digits)) {
    return { isValid: false, error: 'Indian PIN Code cannot start with 0.' };
  }

  if (!/^[1-9][0-9]{5}$/.test(digits)) {
    return { isValid: false, error: 'Please enter a valid 6-digit Indian PIN Code.' };
  }

  return { isValid: true };
}

export function validateIndianState(stateName: string): { isValid: boolean; error?: string } {
  const cleanState = (stateName || '').trim();
  if (!cleanState) {
    return { isValid: false, error: 'State is required.' };
  }

  const matches = INDIAN_STATES.some(
    (st) => st.toLowerCase() === cleanState.toLowerCase()
  );

  if (!matches) {
    return { isValid: false, error: 'Please select a valid Indian State or Union Territory.' };
  }

  return { isValid: true };
}
