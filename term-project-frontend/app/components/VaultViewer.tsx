import React, { useEffect, useState } from 'react';
import {
    Paper,
    Typography,
    CircularProgress,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useMediator } from './MediatorContext';
import copy from 'copy-to-clipboard';

const VaultViewer: React.FC = () => {
    // global time for clipboard timeout
    const CLIPBOARD_TIMEOUT = 5 * 60 * 1000; // 5 minutes to time out

    const { vaultData, fetchVaultData, addPasswordToVault } = useMediator();
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [entryType, setEntryType] = useState('Login');
    const [entryData, setEntryData] = useState<any>({});
    const [currentEntryIndex, setCurrentEntryIndex] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            console.log('Fetching vault data...');
            setLoading(true);
            await fetchVaultData();
            setLoading(false);
        };

        loadData();
    }, []);

    const handleOpenDialog = () => {
        setCurrentEntryIndex(null);
        setIsDialogOpen(true);
        setEntryType('Login');
        setEntryData({});
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAddEntry = async () => {
        try {
            // Create the new entry object
            const newEntry = {
                type: entryType,
                ...entryData, // Include all data from the form
            };
    
            // Use the context function to add the entry to the backend
            await addPasswordToVault(newEntry);
    
            // Close the dialog after adding the entry
            handleCloseDialog();
        } catch (error) {
            console.error('Error adding new entry:', error);
        }
    };

    const handleSaveEntry = () => {
        if (currentEntryIndex !== null) {
            // Modify the existing entry
            const updatedVaultData = [...vaultData];
            updatedVaultData[currentEntryIndex] = { ...updatedVaultData[currentEntryIndex], data: entryData };
            // Replace this with the function to update the vault data in the backend
            console.log('Updated Vault Data:', updatedVaultData);
        } else {
            // Add a new entry
            handleAddEntry();
        }
        handleCloseDialog();
    };

    const handleOpenDialogModify = (index: number) => {
        const entry = vaultData[index];
        setEntryType(entry.type);
        setEntryData(entry.data);
        setCurrentEntryIndex(index);
        setIsDialogOpen(true);
    };

    const handleCopyToClipboardWithTimeout = (text: string, label: string) => {
        copy(text); // Use `copy-to-clipboard` to copy the initial value
        alert(`${label} copied to clipboard!`);
    
        setTimeout(() => {
            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText('') // Use the Clipboard API to clear the clipboard
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

    const renderEntryFields = () => {
        switch (entryType) {
            case 'Credit Card':
                return (
                    <>
                        <TextField
                            label="Card Number"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, cardNumber: e.target.value })}
                        />
                        <TextField
                            label="Expiration Date"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, expirationDate: e.target.value })}
                        />
                        <TextField
                            label="CVV"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, cvv: e.target.value })}
                        />
                    </>
                );
            case 'Passport':
                return (
                    <>
                        <TextField
                            label="Passport Number"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, passportNumber: e.target.value })}
                        />
                        <TextField
                            label="Expiration Date"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, expirationDate: e.target.value })}
                        />
                    </>
                );
            case 'License':
                return (
                    <>
                        <TextField
                            label="License Number"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, licenseNumber: e.target.value })}
                        />
                        <TextField
                            label="Expiration Date"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, expirationDate: e.target.value })}
                        />
                    </>
                );
            default:
                return (
                    <>
                        <TextField
                            label="Site/Application"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, siteName: e.target.value })}
                        />
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, username: e.target.value })}
                        />
                        <TextField
                            label="Password"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setEntryData({ ...entryData, password: e.target.value })}
                        />
                    </>
                );
        }
    };

    return (
        
        <Paper style={{ padding: '20px', maxHeight: '600px', overflowY: 'auto' }}>
            <Typography variant="h6">Vault</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Vault Entries</Typography>
                        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                            Add Entry
                        </Button>
                    </Box>
                    {vaultData.length > 0 ? (
                        vaultData.map((entry, index) => (
                            
                            <Box key={index} mb={2} p={2} border={1} borderRadius="5px">
                                {/* Use name if available, fallback to Type */}
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {entry.data.name}
                                </Typography>
                                <Typography variant="body2">
                                    {entry.type === 'Credit Card' && entry.data ? (
                                        <>
                                            Card Number: **** **** **** {entry.data.cardNumber.slice(-4)}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.cardNumber, 'Card Number')}
                                            >
                                                Copy Card Number
                                            </Button>
                                            <br />
                                            Expiry: {entry.data.expirationDate}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.expirationDate, 'Expiration Date')}
                                            >
                                                Copy Expiry
                                            </Button>
                                            <br />
                                            CVV: ***{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.cvv, 'CVV')}
                                            >
                                                Copy CVV
                                            </Button>
                                            <br />
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenDialogModify(index)}
                                            >
                                                Modify
                                            </Button>
                                        </>
                                    ) : entry.type === 'Login' && entry.data ? (
                                        <>
                                            Site/Application: {entry.data.siteName || 'N/A'}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.siteName, 'Site/Application')}
                                            >
                                                Copy Site/Application
                                            </Button>
                                            <br />
                                            Username: {entry.data.username}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.username, 'Username')}
                                            >
                                                Copy Username
                                            </Button>
                                            <br />
                                            Password: ******{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.password, 'Password')}
                                            >
                                                Copy Password
                                            </Button>
                                            <br />
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenDialogModify(index)}
                                            >
                                                Modify
                                            </Button>
                                        </>
                                    ) : entry.type === 'Passport' && entry.data ? (
                                        <>
                                            Passport Number: {entry.data.passportNumber}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.passportNumber, 'Passport Number')}
                                            >
                                                Copy Passport Number
                                            </Button>
                                            <br />
                                            Expiry: {entry.data.expirationDate}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.expirationDate, 'Expiration Date')}
                                            >
                                                Copy Expiry
                                            </Button>
                                            <br />
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenDialogModify(index)}
                                            >
                                                Modify
                                            </Button>
                                        </>
                                    ) : entry.type === 'License' && entry.data ? (
                                        <>
                                            License Number: {entry.data.licenseNumber}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.licenseNumber, 'License Number')}
                                            >
                                                Copy License Number
                                            </Button>
                                            <br />
                                            Expiry: {entry.data.expirationDate}{' '}
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleCopyToClipboardWithTimeout(entry.data.expirationDate, 'Expiration Date')}
                                            >
                                                Copy Expiry
                                            </Button>
                                            <br />
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleOpenDialogModify(index)}
                                            >
                                                Modify
                                            </Button>
                                        </>
                                    ) : (
                                        JSON.stringify(entry.data, null, 2)
                                    )}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>No data stored in the vault.</Typography>
                    )}
                </>
            )}

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>{currentEntryIndex !== null ? 'Modify Vault Entry' : 'Add Vault Entry'}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Login">Login</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Passport">Passport</MenuItem>
                            <MenuItem value="License">License</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={entryData.name || ''}
                        onChange={(e) => setEntryData({ ...entryData, name: e.target.value })}
                    />
                    {renderEntryFields()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSaveEntry}>
                        {currentEntryIndex !== null ? 'Save Changes' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default VaultViewer;
