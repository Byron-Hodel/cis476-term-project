// PasswordGenerator.tsx
import React, { useState } from 'react';
import { Paper, Typography, Button, Checkbox, Grid2, TextField, FormControlLabel, Snackbar } from '@mui/material';
import { useMediator } from './MediatorContext';
import { PasswordBuilder } from '../utils/Password_Builder';
import copy from 'copy-to-clipboard';

const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [length, setLength] = useState<number>(8);
    const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);
    const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // State for snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState<string>(''); // State for snackbar message
    const { addPasswordToVault } = useMediator();

    // Timeout for clipboard clearing (e.g., 5 minutes)
    const CLIPBOARD_TIMEOUT = 5 * 60 * 1000;

    // Function to generate a password based on user preferences
    const handleGeneratePassword = () => {
        const builder = new PasswordBuilder()
            .setLength(length)
            .includeUppercaseLetters(includeUppercase)
            .includeLowercaseLetters(includeLowercase)
            .includeNumbers(includeNumbers)
            .includeSymbols(includeSymbols);

        const generatedPassword = builder.build(); // Build the password
        setPassword(generatedPassword); // Update the password state
        handleCopyToClipboardWithTimeout(generatedPassword, 'Generated Password'); // Copy password to clipboard
    };

    // Function to copy text to clipboard and clear it after a timeout
    const handleCopyToClipboardWithTimeout = (text: string, label: string) => {
        copy(text); // Copy the text to clipboard
        setSnackbarMessage(`${label} copied to clipboard!`); // Set snackbar message
        setSnackbarOpen(true); // Open the snackbar

        // Set a timeout to clear the clipboard after a specified duration
        setTimeout(() => {
            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText('') // Clear the clipboard
                    .then(() => {
                        console.log(`${label} cleared from clipboard after timeout.`);
                    })
                    .catch((err) => {
                        console.error('Failed to clear clipboard:', err);
                    });
            } else {
                console.warn('Clipboard API not supported.');
            }
        }, CLIPBOARD_TIMEOUT);
    };

    // Function to handle closing the snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const generatePassword = () => {
        const newPassword = Math.random().toString(36).slice(-8); // Simple password generation logic
        addPasswordToVault({ type: 'Login', password: newPassword });
        alert(`Generated Password: ${newPassword}`);
    };

    return (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h4" gutterBottom>Password Generator</Typography>

            <Grid2 container spacing={2}>
                <Grid2>
                    <TextField
                        label="Password Length"
                        type="number"
                        fullWidth
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        variant="outlined"
                    />
                </Grid2>

                <Grid2>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeUppercase}
                                onChange={() => setIncludeUppercase(!includeUppercase)}
                                color="primary"
                            />
                        }
                        label="Include Uppercase"
                    />
                </Grid2>

                <Grid2>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeLowercase}
                                onChange={() => setIncludeLowercase(!includeLowercase)}
                                color="primary"
                            />
                        }
                        label="Include Lowercase"
                    />
                </Grid2>

                <Grid2>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeNumbers}
                                onChange={() => setIncludeNumbers(!includeNumbers)}
                                color="primary"
                            />
                        }
                        label="Include Numbers"
                    />
                </Grid2>

                <Grid2>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeSymbols}
                                onChange={() => setIncludeSymbols(!includeSymbols)}
                                color="primary"
                            />
                        }
                        label="Include Symbols"
                    />
                </Grid2>

                <Grid2>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleGeneratePassword}
                    >
                        Generate Password
                    </Button>
                </Grid2>

                {password && (
                    <Grid2>
                        <Typography variant="h6" gutterBottom>
                            <strong>Generated Password:</strong> {password}
                        </Typography>
                    </Grid2>
                )}
            </Grid2>

            {/* Snackbar for feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000} // Automatically hide after 3 seconds
                onClose={handleSnackbarClose}
                message={snackbarMessage} // Show the snackbar message
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position of the snackbar
            />
        </Paper>
    );
};

export default PasswordGenerator;