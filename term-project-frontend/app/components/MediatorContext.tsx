// MediatorContext.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

type VaultEntry = {
    type: string;
    password: string;
};

type MediatorContextType = {
    vaultData: VaultEntry[];
    addPasswordToVault: (newPassword: VaultEntry) => void;
};

const MediatorContext = createContext<MediatorContextType | undefined>(undefined);

export const MediatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vaultData, setVaultData] = useState<VaultEntry[]>([]);

    const addPasswordToVault = (newPassword: VaultEntry) => {
        setVaultData((prevData) => [...prevData, newPassword]);
    };

    return (
        <MediatorContext.Provider value={{ vaultData, addPasswordToVault }}>
            {children}
        </MediatorContext.Provider>
    );
};

export const useMediator = (): MediatorContextType => {
    const context = useContext(MediatorContext);
    if (!context) {
        throw new Error('useMediator must be used within a MediatorProvider');
    }
    return context;
};