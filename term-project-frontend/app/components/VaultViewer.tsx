// VaultViewer.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useMediator } from './MediatorContext';

const VaultViewer: React.FC = () => {
    const { vaultData } = useMediator();

    return (
        <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Vault</Typography>
            {vaultData.length > 0 ? (
                vaultData.map((entry, index) => (
                    <Typography key={index}>{`${entry.type}: ${entry.password}`}</Typography>
                ))
            ) : (
                <Typography>No passwords stored in the vault.</Typography>
            )}
        </Paper>
    );
};

export default VaultViewer;