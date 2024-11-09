// PasswordGenerator.tsx
import React, { useState } from 'react';
import { Paper, Typography, Button, Checkbox, Grid2, TextField, FormControlLabel } from '@mui/material';
import { useMediator } from './MediatorContext';
import { PasswordBuilder } from '../utils/Password_Builder';

const PasswordGenerator: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [length, setLength] = useState<number>(8);
    const [includeUppercase, setIncludeUppercase] = useState<boolean>(false);
    const [includeLowercase, setIncludeLowercase] = useState<boolean>(false);
    const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
    const [includeSymbols, setIncludeSymbols] = useState<boolean>(false);
    const { addPasswordToVault } = useMediator();

    const handleGeneratePassword = () => {
        const builder = new PasswordBuilder()
          .setLength(length)
          .includeUppercaseLetters(includeUppercase)
          .includeLowercaseLetters(includeLowercase)
          .includeNumbers(includeNumbers)
          .includeSymbols(includeSymbols);

        setPassword(builder.build());
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
        </Paper>
    );
};

export default PasswordGenerator;