class SessionManager {
    private static instance: SessionManager;
    private token: string | null = null;
    private user: object | null = null;
  
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
    }
  }
  
  export default SessionManager;
  