import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useMediator } from './MediatorContext';
import { PasswordObserver } from '../utils/Password_Observer'

const WeakPasswordNotifier: React.FC = () => {
    const { registerPasswordObserver, removePasswordObserver } = useMediator();
    const [notification, setNotification] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    useEffect(() => {
        const observer: PasswordObserver = {
            notify: (name: string, isWeak: boolean) => {
                if (isWeak) {
                    console.log(name);
                    setNotification({
                        open: true,
                        message: `Weak password detected for login: "${name}". Consider making it stronger.`,
                    });
                }
            }
        };

        registerPasswordObserver(observer);

        return () => {
            removePasswordObserver(observer);
        };
    }, [registerPasswordObserver, removePasswordObserver]);

    const handleClose = () => {
        setNotification({ open: false, message: '' });
    };

    return (
        <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                {notification.message}
            </Alert>
        </Snackbar>
    );
};

export default WeakPasswordNotifier;