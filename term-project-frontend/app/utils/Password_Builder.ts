import { buildCustomRoute } from "next/dist/server/lib/router-utils/filesystem";

export class PasswordBuilder {
    private length:           number;
    private includeUppercase: boolean;
    private includeLowercase: boolean;
    private _includeNumbers:  boolean;
    private _includeSymbols:  boolean;
    private characters:       string;

    constructor() {
        this.length = 8;
        this.includeUppercase = false;
        this.includeLowercase = false;
        this._includeNumbers = false;
        this._includeSymbols = false;
        this.characters = '';
    }

    setLength(length: number): PasswordBuilder {
        this.length = length;
        return this;
    }

    includeUppercaseLetters(include: boolean): PasswordBuilder {
        this.includeUppercase = include;
        return this;
    }

    includeLowercaseLetters(include: boolean): PasswordBuilder {
        this.includeLowercase = include;
        return this;
    }

    includeNumbers(include: boolean): PasswordBuilder {
      this._includeNumbers = include;
      return this;
    }

    includeSymbols(include: boolean): PasswordBuilder {
      this._includeSymbols = include;
      return this;
    }

    build(): string {
        let password = "";
        if (this.includeUppercase) this.characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (this.includeLowercase) this.characters += 'abcdefghijklmnopqrstuvwxyz';
        if (this._includeNumbers) this.characters += '0123456789';
        if (this._includeSymbols) this.characters += '!@#$%^&*()_-+=<>?';

        if (this.characters.length === 0) {
            throw new Error('No character sets selected');
        }

        for (let i = 0; i < this.length; i++) {
            const randomIndex = Math.floor(Math.random() * this.characters.length);
            password += this.characters[randomIndex];
        }

        return password;
    }
}