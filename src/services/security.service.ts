import DOMPurify from 'dompurify';
import CryptoJS from 'crypto-js';

class SecurityService {
  private csrfToken: string | null = null;
  private sessionKey: string | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.sessionKey = this.generateSessionKey();
    this.setSecurityHeaders();
    this.fetchCSRFToken();
  }

  sanitizeInput(input: string): string {
    if (!input) return '';

    const config = {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    };

    return DOMPurify.sanitize(input, config);
  }

  sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html);
  }

  encryptData(data: any): string {
    if (!this.sessionKey) {
      this.sessionKey = this.generateSessionKey();
    }

    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.sessionKey).toString();
  }

  decryptData(encryptedData: string): any {
    if (!this.sessionKey) {
      throw new Error('No session key available');
    }

    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.sessionKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }

  private generateSessionKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  async fetchCSRFToken(): Promise<void> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/csrf`, {
        credentials: 'include',
      });
      const data = await response.json();
      this.csrfToken = data.token;
      this.updateCSRFMeta(data.token);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }

  private updateCSRFMeta(token: string) {
    let meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'csrf-token');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', token);
  }

  getCSRFToken(): string | null {
    return this.csrfToken;
  }

  private setSecurityHeaders() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://localhost:8080",
      "font-src 'self' data:",
      "frame-ancestors 'none'",
    ].join('; ');

    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = csp;
    document.head.appendChild(cspMeta);
  }

  logSecurityEvent(eventType: string, data: any = {}) {
    const event = {
      eventType,
      timestamp: new Date().toISOString(),
      data: this.sanitizeLogData(data),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send to backend
    fetch(`${process.env.REACT_APP_API_URL}/audit/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.csrfToken || '',
      },
      body: JSON.stringify(event),
    }).catch(console.error);
  }

  private sanitizeLogData(data: any): any {
    const sensitiveFields = ['password', 'token', 'ssn', 'creditCard'];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach(key => {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export default new SecurityService();