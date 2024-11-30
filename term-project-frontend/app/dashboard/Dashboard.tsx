// Dashboard.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2'; // Correct path for Grid2
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { MediatorProvider } from '../components/MediatorContext';
import PasswordGenerator from '../components/PasswordGenerator';
import VaultViewer from '../components/VaultViewer';
import WeakPasswordNotifier from '../components/WeakPasswordNotifier';
import SessionManager from '../utils/SessionManager';

const Dashboard: React.FC = () => {
    // Clearing token and navigating back to sign in upon clicking sign out
    const handleSignOut = () => {
        const sessionManager = SessionManager.getInstance();
        sessionManager.clearSession(); // Clear the session data
        window.location.href = '/sign-in'; // Redirect to login page
    };

    return (
        <MediatorProvider>
            <Container>
                <Typography variant="h4" gutterBottom>
                    MyPass Dashboard
                </Typography>
                <Grid2 container spacing={3}>
                    <Grid2 component="div">
                        <PasswordGenerator />
                    </Grid2>
                    <Grid2 size="grow" component="div">
                        <WeakPasswordNotifier />
                        <VaultViewer />
                    </Grid2>
                </Grid2>
                {/* Add a sign-out button at the bottom */}
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </Button>
                </Box>
            </Container>
        </MediatorProvider>
    );
};

export default Dashboard;
