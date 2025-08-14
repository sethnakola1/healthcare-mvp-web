import securityService from './security.service';

class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user_data';

  // Token Management
  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // Refresh Token Management
  setRefreshToken(token: string): void {
    // Store in httpOnly cookie in production
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  removeRefreshToken(): void {
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // User Data Management (encrypted)
  setUserData(data: any): void {
    const encrypted = securityService.encryptData(data);
    sessionStorage.setItem(this.USER_KEY, encrypted);
  }

  getUserData(): any | null {
    const encrypted = sessionStorage.getItem(this.USER_KEY);
    if (!encrypted) return null;

    try {
      return securityService.decryptData(encrypted);
    } catch {
      return null;
    }
  }

  removeUserData(): void {
    sessionStorage.removeItem(this.USER_KEY);
  }

  // Clear all storage
  clearAll(): void {
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  // Session Management
  setSessionData(key: string, value: any): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionData(key: string): any | null {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeSessionData(key: string): void {
    sessionStorage.removeItem(key);
  }
}

export default new StorageService();