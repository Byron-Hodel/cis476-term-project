'use client';

import * as React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../src/theme';
import SessionManager from '@/app/utils/SessionManager';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    React.useEffect(() => {
        const session = SessionManager.getInstance();

        // Set the logout callback
        session.setLogoutCallback(() => {
            router.push('/sign-in'); // Redirect to the sign-in page on logout
        });

        const resetTimer = () => session.resetInactivityTimer();

        // Add event listeners to detect user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('scroll', resetTimer);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [router]);

    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
                />
            </head>
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
