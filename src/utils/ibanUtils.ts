import { IbanInfo } from '../types';

// Country code lengths - maps country codes to their expected IBAN lengths
const COUNTRY_IBAN_LENGTHS: Record<string, number> = {
  'AL': 28, 'AD': 24, 'AT': 20, 'AZ': 28, 'BH': 22, 'BY': 28, 'BE': 16, 'BA': 20,
  'BR': 29, 'BG': 22, 'CR': 22, 'HR': 21, 'CY': 28, 'CZ': 24, 'DK': 18, 'DO': 28,
  'EG': 29, 'SV': 28, 'EE': 20, 'FO': 18, 'FI': 18, 'FR': 27, 'GE': 22, 'DE': 22,
  'GI': 23, 'GR': 27, 'GL': 18, 'GT': 28, 'HU': 28, 'IS': 26, 'IQ': 23, 'IE': 22,
  'IL': 23, 'IT': 27, 'JO': 30, 'KZ': 20, 'XK': 20, 'KW': 30, 'LV': 21, 'LB': 28,
  'LI': 21, 'LT': 20, 'LU': 20, 'MK': 19, 'MT': 31, 'MR': 27, 'MU': 30, 'MD': 24,
  'MC': 27, 'ME': 22, 'NL': 18, 'NO': 15, 'PK': 24, 'PS': 29, 'PL': 28, 'PT': 25,
  'QA': 29, 'RO': 24, 'LC': 32, 'SM': 27, 'ST': 25, 'SA': 24, 'RS': 22, 'SC': 31,
  'SK': 24, 'SI': 19, 'ES': 24, 'SE': 24, 'CH': 21, 'TL': 23, 'TN': 24, 'TR': 26,
  'UA': 29, 'AE': 23, 'GB': 22, 'VA': 22, 'VG': 24
};

// Country names mapping
const COUNTRY_NAMES: Record<string, string> = {
  'AL': 'Albania', 'AD': 'Andorra', 'AT': 'Austria', 'AZ': 'Azerbaijan', 'BH': 'Bahrain',
  'BY': 'Belarus', 'BE': 'Belgium', 'BA': 'Bosnia and Herzegovina', 'BR': 'Brazil',
  'BG': 'Bulgaria', 'CR': 'Costa Rica', 'HR': 'Croatia', 'CY': 'Cyprus', 'CZ': 'Czech Republic',
  'DK': 'Denmark', 'DO': 'Dominican Republic', 'EG': 'Egypt', 'SV': 'El Salvador',
  'EE': 'Estonia', 'FO': 'Faroe Islands', 'FI': 'Finland', 'FR': 'France', 'GE': 'Georgia',
  'DE': 'Germany', 'GI': 'Gibraltar', 'GR': 'Greece', 'GL': 'Greenland', 'GT': 'Guatemala',
  'HU': 'Hungary', 'IS': 'Iceland', 'IQ': 'Iraq', 'IE': 'Ireland', 'IL': 'Israel',
  'IT': 'Italy', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'XK': 'Kosovo', 'KW': 'Kuwait',
  'LV': 'Latvia', 'LB': 'Lebanon', 'LI': 'Liechtenstein', 'LT': 'Lithuania',
  'LU': 'Luxembourg', 'MK': 'North Macedonia', 'MT': 'Malta', 'MR': 'Mauritania',
  'MU': 'Mauritius', 'MD': 'Moldova', 'MC': 'Monaco', 'ME': 'Montenegro',
  'NL': 'Netherlands', 'NO': 'Norway', 'PK': 'Pakistan', 'PS': 'Palestine',
  'PL': 'Poland', 'PT': 'Portugal', 'QA': 'Qatar', 'RO': 'Romania', 'LC': 'Saint Lucia',
  'SM': 'San Marino', 'ST': 'São Tomé and Príncipe', 'SA': 'Saudi Arabia', 'RS': 'Serbia',
  'SC': 'Seychelles', 'SK': 'Slovakia', 'SI': 'Slovenia', 'ES': 'Spain', 'SE': 'Sweden',
  'CH': 'Switzerland', 'TL': 'Timor-Leste', 'TN': 'Tunisia', 'TR': 'Turkey',
  'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'VA': 'Vatican City',
  'VG': 'British Virgin Islands'
};

// Bank code lengths by country
const BANK_CODE_LENGTHS: Record<string, number> = {
  'DE': 8, 'FR': 10, 'GB': 6, 'ES': 8, 'IT': 11, 'NL': 4, 'BE': 3, 'PT': 8,
  'AT': 5, 'PL': 8, 'CH': 5, 'SE': 3, 'NO': 4, 'FI': 6, 'DK': 4, 'IE': 4,
  'SK': 4, 'CZ': 4, 'HU': 8, 'RO': 4, 'BG': 4, 'HR': 7, 'SI': 5, 'LV': 4,
  'LT': 5, 'EE': 2, 'GR': 7
};

// Mock BIC/SWIFT codes and bank names for demo purposes
const MOCK_BANK_DATA: Record<string, {bic: string, name: string}> = {
  'DE': {bic: 'DEUTDEFF', name: 'Deutsche Bank'},
  'FR': {bic: 'BNPAFRPP', name: 'BNP Paribas'},
  'GB': {bic: 'BARCGB22', name: 'Barclays Bank'},
  'ES': {bic: 'BBVAESMM', name: 'BBVA'},
  'IT': {bic: 'UNCRITM1', name: 'UniCredit'},
  'NL': {bic: 'ABNANL2A', name: 'ABN AMRO'},
  'BE': {bic: 'GEBABEBB', name: 'KBC Bank'},
  'CH': {bic: 'UBSWCHZH', name: 'UBS Switzerland'},
  'SK': {bic: 'TATRSKBX', name: 'Tatra Banka'},
  'CZ': {bic: 'KOMBCZPP', name: 'Komerční Banka'},
  'AT': {bic: 'BKAUATWW', name: 'Bank Austria'},
  'PL': {bic: 'BREXPLPW', name: 'mBank'},
  'HU': {bic: 'OTPVHUHB', name: 'OTP Bank'},
  'RO': {bic: 'BTRLRO22', name: 'Banca Transilvania'},
  'BG': {bic: 'BPBIBGSF', name: 'Postbank'},
  'HR': {bic: 'ZABAHR2X', name: 'Zagrebačka Banka'}
};

// List of countries with more complete IBAN generation support
const SUPPORTED_RANDOM_COUNTRIES = ['DE', 'FR', 'GB', 'ES', 'IT', 'NL', 'BE', 'CH', 'AT'];

/**
 * Format an IBAN with spaces for better readability
 */
export function formatIban(iban: string): string {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  return cleanIban.match(/.{1,4}/g)?.join(' ') || cleanIban;
}

/**
 * Validate an IBAN
 * Returns an object with validation result and details
 */
export function validateIban(iban: string): {
  isValid: boolean;
  ibanInfo?: IbanInfo;
  errorMessage?: string;
} {
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Basic validation checks
  if (!cleanIban) {
    return { isValid: false, errorMessage: 'IBAN is required' };
  }
  
  if (cleanIban.length < 5) {
    return { isValid: false, errorMessage: 'IBAN is too short' };
  }
  
  // Extract and validate country code
  const countryCode = cleanIban.substring(0, 2);
  if (!/^[A-Z]{2}$/.test(countryCode)) {
    return { isValid: false, errorMessage: 'Invalid country code' };
  }
  
  if (!COUNTRY_IBAN_LENGTHS[countryCode]) {
    return { isValid: false, errorMessage: 'Unsupported country code' };
  }
  
  // Check IBAN length for the country
  if (cleanIban.length !== COUNTRY_IBAN_LENGTHS[countryCode]) {
    return {
      isValid: false,
      errorMessage: `Invalid length for ${countryCode}. Expected ${COUNTRY_IBAN_LENGTHS[countryCode]} characters`
    };
  }
  
  // Extract and validate check digits
  const checkDigits = cleanIban.substring(2, 4);
  if (!/^\d{2}$/.test(checkDigits)) {
    return { isValid: false, errorMessage: 'Invalid check digits' };
  }
  
  // Perform the MOD-97 check
  try {
    // Move the first four characters to the end
    const rearranged = cleanIban.substring(4) + cleanIban.substring(0, 4);
    
    // Replace each letter with two digits (A=10, B=11, ..., Z=35)
    let expandedStr = '';
    for (let i = 0; i < rearranged.length; i++) {
      const char = rearranged.charAt(i);
      const value = char >= 'A' ? (char.charCodeAt(0) - 55).toString() : char;
      expandedStr += value;
    }
    
    // Calculate mod-97 using a more robust method for large numbers
    let remainder = 0;
    for (let i = 0; i < expandedStr.length; i++) {
      remainder = (remainder * 10 + parseInt(expandedStr.charAt(i), 10)) % 97;
    }
    
    if (remainder !== 1) {
      return { isValid: false, errorMessage: 'Invalid IBAN (checksum failed)' };
    }
  } catch (error) {
    return { isValid: false, errorMessage: 'Error validating IBAN' };
  }
  
  // Extract bank code and account number
  const bankCodeLength = BANK_CODE_LENGTHS[countryCode] || 0;
  const bankCode = bankCodeLength > 0 ? cleanIban.substring(4, 4 + bankCodeLength) : '';
  const accountNumber = bankCodeLength > 0 
    ? cleanIban.substring(4 + bankCodeLength) 
    : cleanIban.substring(4);
  
  // Get bank data
  const bankData = MOCK_BANK_DATA[countryCode] || { bic: 'NOTAVAILABLE', name: 'International Bank' };
  
  // IBAN is valid
  return {
    isValid: true,
    ibanInfo: {
      formattedIban: formatIban(cleanIban),
      country: COUNTRY_NAMES[countryCode] || 'Unknown',
      countryCode,
      checkDigits,
      bankCode: bankCode || undefined,
      accountNumber,
      bic: bankData.bic,
      bankName: bankData.name
    }
  };
}

/**
 * Generate a random string of digits
 */
function generateRandomDigits(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/**
 * Generate a random string of letters
 */
function generateRandomLetters(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a random alphanumeric string
 */
function generateRandomAlphanumeric(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Calculate check digits for an IBAN
 */
function calculateCheckDigits(countryCode: string, bban: string): string {
  // Create the initial string with 00 as check digits
  const initialString = countryCode + '00' + bban;
  
  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let expandedStr = '';
  for (let i = 0; i < initialString.length; i++) {
    const char = initialString.charAt(i);
    const value = char >= 'A' ? (char.charCodeAt(0) - 55).toString() : char;
    expandedStr += value;
  }
  
  // Calculate mod-97
  let remainder = 0;
  for (let i = 0; i < expandedStr.length; i++) {
    remainder = (remainder * 10 + parseInt(expandedStr.charAt(i), 10)) % 97;
  }
  
  // Calculate check digits (98 - remainder)
  const checkDigits = (98 - remainder).toString().padStart(2, '0');
  return checkDigits;
}

/**
 * Generate a random valid IBAN
 * Optionally specify a country code, otherwise a random supported country is chosen
 */
export function generateRandomIban(countryCode?: string): string {
  // If no country code provided, choose a random one from supported countries
  const selectedCountry = countryCode || SUPPORTED_RANDOM_COUNTRIES[
    Math.floor(Math.random() * SUPPORTED_RANDOM_COUNTRIES.length)
  ];
  
  // Get the expected length for this country
  const totalLength = COUNTRY_IBAN_LENGTHS[selectedCountry];
  if (!totalLength) {
    throw new Error(`Country code ${selectedCountry} is not supported`);
  }
  
  // Get bank code length for this country
  const bankCodeLength = BANK_CODE_LENGTHS[selectedCountry] || 4;
  
  // Generate bank code
  let bankCode = '';
  if (selectedCountry === 'GB') {
    // UK sort code is 6 digits
    bankCode = generateRandomDigits(6);
  } else if (['DE', 'AT', 'CH'].includes(selectedCountry)) {
    // German, Austrian, Swiss bank codes are numeric
    bankCode = generateRandomDigits(bankCodeLength);
  } else if (['FR', 'IT'].includes(selectedCountry)) {
    // French, Italian bank codes are alphanumeric
    bankCode = generateRandomAlphanumeric(bankCodeLength);
  } else {
    // Default to alphanumeric
    bankCode = generateRandomAlphanumeric(bankCodeLength);
  }
  
  // Calculate remaining length for account number
  const accountNumberLength = totalLength - 4 - bankCodeLength; // 4 = country code + check digits
  
  // Generate account number
  let accountNumber = '';
  if (['DE', 'AT', 'CH', 'NL', 'BE'].includes(selectedCountry)) {
    // These countries typically have numeric account numbers
    accountNumber = generateRandomDigits(accountNumberLength);
  } else if (selectedCountry === 'GB') {
    // UK account numbers are 8 digits
    accountNumber = generateRandomDigits(8);
  } else {
    // Default to alphanumeric
    accountNumber = generateRandomAlphanumeric(accountNumberLength);
  }
  
  // Combine bank code and account number to form BBAN (Basic Bank Account Number)
  const bban = bankCode + accountNumber;
  
  // Calculate check digits
  const checkDigits = calculateCheckDigits(selectedCountry, bban);
  
  // Combine all parts to form the IBAN
  const iban = selectedCountry + checkDigits + bban;
  
  return iban;
}

/**
 * Get a list of supported countries for random IBAN generation
 */
export function getSupportedRandomCountries(): Array<{code: string, name: string}> {
  return SUPPORTED_RANDOM_COUNTRIES.map(code => ({
    code,
    name: COUNTRY_NAMES[code] || code
  }));
}