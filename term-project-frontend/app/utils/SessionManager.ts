class SessionManager {
  private static instance: SessionManager;
  private token: string | null = null;
  private user: object | null = null;
  private logoutCallback: (() => void) | null = null;
  private inactivityTimeout: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes, do 10 * 1000 to make it 10 seconds if you want to test

  private constructor() {}

  static getInstance(): SessionManager {
      if (!SessionManager.instance) {
          SessionManager.instance = new SessionManager();
      }
      return SessionManager.instance;
  }

  setToken(token: string) {
      this.token = token;
      localStorage.setItem('authToken', token);
      this.resetInactivityTimer();
  }

  getToken(): string | null {
      if (!this.token) {
          this.token = localStorage.getItem('authToken');
      }
      return this.token;
  }

  setUser(user: object) {
      this.user = user;
      localStorage.setItem('userData', JSON.stringify(user));
      this.resetInactivityTimer();
  }

  getUser(): object | null {
      if (!this.user) {
          const userData = localStorage.getItem('userData');
          this.user = userData ? JSON.parse(userData) : null;
      }
      return this.user;
  }

  clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      if (this.inactivityTimeout) {
          clearTimeout(this.inactivityTimeout);
      }
  }

  setLogoutCallback(callback: () => void) {
      this.logoutCallback = callback;
  }

  resetInactivityTimer() {
      if (this.inactivityTimeout) {
          clearTimeout(this.inactivityTimeout);
      }

      this.inactivityTimeout = setTimeout(() => {
          this.clearSession();
          if (this.logoutCallback) {
              this.logoutCallback();
          }
      }, this.INACTIVITY_LIMIT);
  }
}

  
  export default SessionManager;
  