/**
 * The SessionManager class is a Singleton that handles user session management,
 * including storing and retrieving tokens, user data, and managing inactivity timeouts.
 */
class SessionManager {
    // Singleton instance
    private static instance: SessionManager;

    // Stores the authentication token
    private token: string | null = null;

    // Stores the user object
    private user: object | null = null;

    // call back function to be called on logout
    private logoutCallback: (() => void) | null = null;

    // Timer to track user inactivity
    private inactivityTimeout: NodeJS.Timeout | null = null;

    // Time limit for user inactivity before automatic logout 
    private readonly INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes, do 10 * 1000 to make it 10 seconds if you want to test

    // Private constructor ensures the class cannot be instantiated outside
    private constructor() {}

    /**
     * Retrieves the singleton instance of the SessionManager.
     * If an instance doesn't exist, it creates one.
    */
    static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    /**
     * Sets the authentication token in memory and localStorage.
     * Also resets the inactivity timer to prevent automatic logout.
     * @param token - The authentication token to set.
    */
    setToken(token: string) {
        this.token = token;
        localStorage.setItem('authToken', token);
        this.resetInactivityTimer();
    }

    /**
     * Retrieves the authentication token.
     * If the token is not already in memory, it attempts to load it from localStorage.
     * @returns The authentication token or null if none exists.
    */
    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('authToken');
        }
        return this.token;
    }

    /**
     * Sets the user object in memory and localStorage.
     * Also resets the inactivity timer to prevent automatic logout.
     * @param user - The user object to set.
    */
    setUser(user: object) {
        this.user = user;
        localStorage.setItem('userData', JSON.stringify(user));
        this.resetInactivityTimer();
    }

    /**
     * Retrieves the user object.
     * If the user object is not already in memory, it attempts to load it from localStorage.
     * @returns The user object or null if none exists.
    */
    getUser(): object | null {
        if (!this.user) {
            const userData = localStorage.getItem('userData');
            this.user = userData ? JSON.parse(userData) : null;
        }
        return this.user;
    }

    /**
     * Clears the session data from memory and localStorage.
     * Also stops the inactivity timer.
    */
    clearSession() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
    }

    /**
     * Sets a callback function to be executed on logout.
     * @param callback - The callback function to execute.
    */
    setLogoutCallback(callback: () => void) {
        this.logoutCallback = callback;
    }

    /**
     * Resets the inactivity timer.
     * If the timer expires, it clears the session and triggers the logout callback.
    */
    resetInactivityTimer() {
        if (this.inactivityTimeout) {
            clearTimeout(this.inactivityTimeout);
        }
        
        // Start a new inactivity timer
        this.inactivityTimeout = setTimeout(() => {
            this.clearSession();    // Clear session data
            if (this.logoutCallback) {
                this.logoutCallback();  // Execute the logout callback if set
            }
        }, this.INACTIVITY_LIMIT);
    }
}

  
  export default SessionManager;
  