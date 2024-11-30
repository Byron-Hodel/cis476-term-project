// utils/SensitiveDataProxy.ts

/**
 * The SensitiveDataProxy class acts as a proxy to manage access to sensitive data.
 * It provides controlled visibility of the data and can toggle between hidden
 * (masked) and visible states. This helps protect sensitive information from
 * accidental exposure while allowing controlled access when necessary.
 */
export class SensitiveDataProxy {
    // The actual sensitive data being protected
    private sensitiveData: string;

    // State indicating whether the sensitive data is currently hidden
    public isHidden: boolean;

    /**
     * Constructor initializes the sensitive data and sets its initial state to hidden.
     * @param sensitiveData - The sensitive data to be protected.
     */
    constructor(sensitiveData: string) {
        this.sensitiveData = sensitiveData; // Store the sensitive data
        this.isHidden = true; // Initially set the data to be hidden
    }

    /**
     * Toggles the visibility state of the sensitive data.
     * If the data is currently hidden, it becomes visible, and vice versa.
     */
    toggleVisibility() {
        this.isHidden = !this.isHidden; // Toggle the hidden state
    }

    /**
     * Retrieves the sensitive data based on its current visibility state.
     * If the data is hidden, a masked version ("******") is returned.
     * If the data is visible, the actual sensitive data is returned.
     * @returns {string} - The sensitive data or a masked representation.
     */
    getData(): string {
        return this.isHidden ? "******" : this.sensitiveData;
    }
}