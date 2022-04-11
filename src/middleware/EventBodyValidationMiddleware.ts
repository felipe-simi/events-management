import { body, ValidationChain } from 'express-validator';

export default class EventBodyValidationMiddleware {
  verifyCreateEvent(): ValidationChain[] {
    return [
      body('name', 'The name must not be blank.').trim().notEmpty(),
      body('description', 'The name must not be blank.').trim().notEmpty(),
      body(
        'eventDate',
        'The date must not be blank, it must be in the future, and valid format is YYYY/MM/DD.'
      )
        .isDate({ strictMode: true })
        .isAfter(),
      body(
        'isOutside',
        `The information if the event is external is mandatory. 'true' for outdoor events and 'false' for indoors.`
      ).isBoolean(),
      body('organizerId', 'The organizer id must be a valid UUID.').isUUID(),
    ];
  }
}
