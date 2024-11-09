// MediatorContext.tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInterceptor'; // Importing the axios instance with interceptor for token attachment
import SessionManager from '../utils/SessionManager'; // Importing SessionManager to retrieve the stored token and user data

// Type definition for a single vault entry
type VaultEntry = {
    type: string;
    password: string;
    [key: string]: any; // Allow for additional fields as needed
};

// Type definition for the context that will be provided
type MediatorContextType = {
    vaultData: VaultEntry[]; // Array of vault entries
    fetchVaultData: () => void; // Function to fetch vault data
    addPasswordToVault: (newPassword: VaultEntry) => void; // Function to add a new password to the vault data
};

// Creating the context and setting the initial value to undefined
const MediatorContext = createContext<MediatorContextType | undefined>(undefined);

// Provider component to wrap around components that need access to the context
export const MediatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vaultData, setVaultData] = useState<VaultEntry[]>([]); // State to hold the user's vault data

    // Function to fetch vault data from the backend API
    const fetchVaultData = async () => {
        const session = SessionManager.getInstance();
        const token = session.getToken();
        const user = session.getUser() as { userId?: number };
    
        if (!token || !user || !user.userId) {
            console.error('No token or user ID found. Please sign in.');
            return;
        }
    
        try {
            const response = await axiosInstance.get(`/vault/${user.userId}`);
            console.log('Response from API:', response.data);
            setVaultData(response.data.data); // Ensure this does not trigger a loop
        } catch (error) {
            console.error('Error fetching vault data:', error);
            setVaultData([]); // Set an empty array if there is an error
        }
    };
    

    // Function to add a new password entry to the state (could be expanded for API calls if needed)
    const addPasswordToVault = (newPassword: VaultEntry) => {
        setVaultData((prevData) => [...prevData, newPassword]); // Update the state with the new entry
    };

    // useEffect to call fetchVaultData when the component mounts
    useEffect(() => {
        fetchVaultData(); // Fetch vault data on component mount
    }, []);

    // Provide the context value to child components
    return (
        <MediatorContext.Provider value={{ vaultData, fetchVaultData, addPasswordToVault }}>
            {children}
        </MediatorContext.Provider>
    );
};

// Custom hook to use the Mediator context
export const useMediator = (): MediatorContextType => {
    const context = useContext(MediatorContext);
    // Throw an error if the hook is used outside of a MediatorProvider
    if (!context) {
        throw new Error('useMediator must be used within a MediatorProvider');
    }
    return context;
};
