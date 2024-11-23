export type PasswordObserver = {
    notify: (password: string, is_weak: boolean) => void;
};