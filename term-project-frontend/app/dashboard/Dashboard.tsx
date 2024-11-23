// Dashboard.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Grid2'; // Correct path for Grid2
import { MediatorProvider } from '../components/MediatorContext';
import PasswordGenerator from '../components/PasswordGenerator';
import VaultViewer from '../components/VaultViewer';
import WeakPasswordNotifier from '../components/WeakPasswordNotifier';

const Dashboard: React.FC = () => {
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
            </Container>
        </MediatorProvider>
    );
};

export default Dashboard;
