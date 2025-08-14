import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove any HTML tags and scripts
  const config = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  };
  
  return DOMPurify.sanitize(input, config);
};

export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  // Allow basic formatting tags
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  };
  
  return DOMPurify.sanitize(html, config);
};

export const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeInput(obj) : obj;
  }
  
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  
  return sanitized;
};

export default {
  sanitizeInput,
  sanitizeHTML,
  sanitizeObject
};