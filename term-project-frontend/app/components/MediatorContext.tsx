// MediatorContext.tsx
import React, { useCallback, useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axiosInstance from '../utils/axiosInterceptor'; // Importing the axios instance with interceptor for token attachment
import SessionManager from '../utils/SessionManager'; // Importing SessionManager to retrieve the stored token and user data
import { PasswordObserver } from '../utils/Password_Observer'

// Type definition for a single vault entry
type VaultEntry = {
    type: string;
    password: string;
    [key: string]: any; // Allow for additional fields as needed
};

// Type definition for the context that will be provided
type MediatorContextType = {
    password_observers: PasswordObserver[];
    vaultData: VaultEntry[];
    fetchVaultData: () => void;
    addPasswordToVault: (newPassword: VaultEntry) => void;
    updateVaultEntry: (vaultId: number, entryData: VaultEntry) => void;
    deleteVaultEntry: (vaultId: number) => void;
    registerPasswordObserver: (observer: PasswordObserver) => void;
    removePasswordObserver: (observer: PasswordObserver) => void;
};

// Creating the context and setting the initial value to undefined
const MediatorContext = createContext<MediatorContextType | undefined>(undefined);

// Provider component to wrap around components that need access to the context
export const MediatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vaultData, setVaultData] = useState<VaultEntry[]>([]); // State to hold the user's vault data
    const [password_observers, setPasswordObservers] = useState<PasswordObserver[]>([]);

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
    const addPasswordToVault = async (newEntry: VaultEntry) => {
        const session = SessionManager.getInstance();
        const token = session.getToken();
        const user = session.getUser() as { userId?: number };
    
        if (!token || !user || !user.userId) {
            console.error('No token or user ID found. Please sign in.');
            return;
        }
    
        try {
            // Send a POST request to add the new entry to the vault
            console.log(newEntry);
            const response = await axiosInstance.post(`/vault/add`, {
                type: newEntry.type,
                data: newEntry,
            });
    
            // Update the state with the new entry on success
            if (response.data.success) {
                setVaultData((prevData) => [...prevData, response.data.data]);
            } else {
                console.error('Failed to add entry:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding entry to vault:', error);
        }
    };

    // Function to add a new password entry to the state (could be expanded for API calls if needed)
    const updateVaultEntry = async (vaultId: number, updatedData: any) => {
        const session = SessionManager.getInstance();
        const token = session.getToken();
        const user = session.getUser() as { userId?: number };
    
        if (!token || !user || !user.userId) {
            console.error('No token or user ID found. Please sign in.');
            return;
        }
    
        try {
            // Send a POST request to add the new entry to the vault
            console.log(updatedData);
            const response = await axiosInstance.patch(`/vault/update/${vaultId}`, {
                updatedData,
            });
    
            // Update the state with the new entry on success
            if (response.data.success) {
                setVaultData((prevData) => [...prevData, response.data.data]);
            } else {
                console.error('Failed to modify entry:', response.data.message);
            }
        } catch (error) {
            console.error('Error modifying vault entry:', error);
        }
    };

    const deleteVaultEntry = async (vaultId: number) => {
        const session = SessionManager.getInstance();
        const token = session.getToken();
        const user = session.getUser() as { userId?: number };
    
        if (!token || !user || !user.userId) {
            console.error('No token or user ID found. Please sign in.');
            return;
        }
    
        try {
            // Send DELETE request to backend
            const response = await axiosInstance.delete(`/vault/delete/${vaultId}`);
    
            // If successful, update the state by filtering out the deleted entry
            if (response.data.success) {
                setVaultData((prevData) =>
                    prevData.filter((entry) => entry.vaultId !== vaultId)
                );
            } else {
                console.error('Failed to delete entry:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting vault entry:', error);
        }
    };

    const registerPasswordObserver = useCallback((observer: PasswordObserver) => {
        setPasswordObservers((prev) => {
            if (!prev.includes(observer)) {
                return [...prev, observer];
            }
            return prev;
        });
    }, []);

    const removePasswordObserver = useCallback((observer: PasswordObserver) => {
        setPasswordObservers((prev) => prev.filter((obs) => obs !== observer));
    }, []);

    // useEffect to call fetchVaultData when the component mounts
    useEffect(() => {
        fetchVaultData(); // Fetch vault data on component mount
    }, []);

    // Provide the context value to child components
    return (
        <MediatorContext.Provider value={{ password_observers, vaultData, fetchVaultData, addPasswordToVault, updateVaultEntry, deleteVaultEntry, registerPasswordObserver, removePasswordObserver }}>
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
