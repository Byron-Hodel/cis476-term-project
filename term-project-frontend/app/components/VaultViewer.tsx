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

const VaultViewer: React.FC = () => {
    const { vaultData, fetchVaultData, addPasswordToVault } = useMediator();
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [entryType, setEntryType] = useState('Password');
    const [entryData, setEntryData] = useState<any>({});

    // Fetch vault data when component mounts
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
        setIsDialogOpen(true);
        setEntryType('Password');
        setEntryData({});
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleAddEntry = () => {
        //addPasswordToVault(...);
        handleCloseDialog();
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
                            <Box key={index} mb={2}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {`Type: ${entry.type}`}
                                </Typography>
                                <Typography variant="body2">
                                    {entry.type === 'Credit Card' && entry.data ? (
                                        <>
                                            Card Number: **** **** **** {entry.data.cardNumber.slice(-4)}
                                            <br />
                                            Expiry: {entry.data.expirationDate}
                                            <br />
                                            CVV: ***
                                        </>
                                    ) : entry.type === 'Login' && entry.data ? (
                                        <>
                                            Site/Application: {entry.data.siteName || 'N/A'}
                                            <br />
                                            Username: {entry.data.username}
                                            <br />
                                            Password: ******
                                        </>
                                    ) : entry.type === 'Passport' && entry.data ? (
                                        <>
                                            Passport Number: {entry.data.passportNumber}
                                            <br />
                                            Expiry: {entry.data.expirationDate}
                                        </>
                                    ) : entry.type === 'License' && entry.data ? (
                                        <>
                                            License Number: {entry.data.licenseNumber}
                                            <br />
                                            Expiry: {entry.data.expirationDate}
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
                <DialogTitle>Add Vault Entry</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Password">Password</MenuItem>
                            <MenuItem value="Credit Card">Credit Card</MenuItem>
                            <MenuItem value="Passport">Passport</MenuItem>
                            <MenuItem value="License">License</MenuItem>
                        </Select>
                    </FormControl>
                    {renderEntryFields()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleAddEntry}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default VaultViewer;
