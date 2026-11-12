export interface SanitizationResult {
    sanitizedText: string;
    detectedTypes: string[];
    hasPII: boolean;
  }
  
  export function sanitizePII(text: string): SanitizationResult {
    if (!text) {
      return { sanitizedText: '', detectedTypes: [], hasPII: false };
    }
  
    let clean = text;
    const detectedTypes: string[] = [];
  
    // 1. Social Security Numbers (XXX-XX-XXXX)
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    if (ssnRegex.test(clean)) {
      detectedTypes.push('SSN');
      clean = clean.replace(ssnRegex, '[REDACTED SSN]');
    }
  
    // 2. Email Addresses
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    if (emailRegex.test(clean)) {
      detectedTypes.push('Email');
      clean = clean.replace(emailRegex, '[REDACTED EMAIL]');
    }
  
    // 3. Phone Numbers (US/North American formats)
    const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
    if (phoneRegex.test(clean)) {
      detectedTypes.push('Phone Number');
      clean = clean.replace(phoneRegex, '[REDACTED PHONE]');
    }
  
    // 4. Credit Card / Account Number patterns (13-16 digits with optional spaces/dashes)
    const cardRegex = /\b(?:\d[ -]*?){13,16}\b/g;
    if (cardRegex.test(clean)) {
      detectedTypes.push('Account/Card Number');
      clean = clean.replace(cardRegex, '[REDACTED NUMBER]');
    }
  
    return {
      sanitizedText: clean,
      detectedTypes,
      hasPII: detectedTypes.length > 0,
    };
  }