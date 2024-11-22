import { RefCallback } from "react";

type Callback = (password: string) => void;

class PasswordObserver {
    callback: Callback;

    constructor(weak_password_cb: Callback) {
        this.callback = weak_password_cb;
    }


    checkPasswordStrength(password: string) {
        const isWeak = this.isWeakPassword(password);

        if (isWeak) {
            this.callback(password);
        }
    }


    isWeakPassword(password: string) {
        const isTooShort = password.length < 7;
        const lacksUppercase = !/[A-Z]/.test(password);
        const lacksSpecialChar = !/[!@#$%^&*(),.?":{}|<>]/.test(password);
        return isTooShort || lacksUppercase || lacksSpecialChar;
    }
}