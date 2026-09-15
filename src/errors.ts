import { ValidationError as ClassValidationError } from "class-validator";

export class ValidationError extends Error {
    constructor(readonly error: ClassValidationError[]) {
        super();
        this.name = 'ValidationError';
    }
}