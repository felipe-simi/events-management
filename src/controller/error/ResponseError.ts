import { Result, ValidationError } from 'express-validator';
import FieldError from './FieldError';

export interface ResponseError {
  errors: FieldError[];
}

export const fromValidationErrors = (
  validationErrors: Result<ValidationError>
): ResponseError => {
  const errors = validationErrors.array().map((error) => ({
    fieldName: error.param,
    value: error.value,
    message: error.msg,
  }));
  return { errors };
};
