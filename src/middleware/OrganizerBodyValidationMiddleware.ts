import { body, ValidationChain } from 'express-validator';

export default class OrganizerBodyValidationMiddleware {
  verifyCreateOrganizer(): ValidationChain[] {
    return [body('name', 'The name must not be blank.').trim().notEmpty()];
  }
}
