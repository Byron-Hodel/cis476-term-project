// PasswordGenerator.tsx
import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useMediator } from './MediatorContext';

const PasswordGenerator: React.FC = () => {
    const { addPasswordToVault } = useMediator();

    const generatePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8); // Simple password generation logic
        addPasswordToVault({ type: 'Login', password: newPassword });
        alert(`Generated Password: ${newPassword}`);
    };

    return (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6">Password Generator</Typography>
            <Button variant="contained" color="primary" onClick={generatePassword}>
                Generate Password
            </Button>
        </Paper>
    );
};

export default PasswordGenerator;