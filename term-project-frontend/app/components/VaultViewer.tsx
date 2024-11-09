import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Box } from '@mui/material';
import { useMediator } from './MediatorContext';

const VaultViewer: React.FC = () => {
    const { vaultData, fetchVaultData } = useMediator();
    const [loading, setLoading] = useState(true);

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

    return (
        <Paper style={{ padding: '20px' }}>
            <Typography variant="h6">Vault</Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
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
                                    ) : entry.type === 'Secure Notes' && entry.data ? (
                                        <>
                                            Note: {entry.data.note}
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
        </Paper>
    );
};

export default VaultViewer;
