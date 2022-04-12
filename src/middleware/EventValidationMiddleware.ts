import { body, param, ValidationChain } from 'express-validator';

export default class EventValidationMiddleware {
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
  verifyFindAllEvents(): ValidationChain[] {
    return [
      param('from', 'The date format must be YYYY/MM/DD.').optional().isDate({
        strictMode: true,
      }),
      param('to', 'The date format must be YYYY/MM/DD.').optional().isDate({
        strictMode: true,
      }),
      param('pageNumber', 'The page number must be a positive value.')
        .optional()
        .isInt({
          min: 0,
        }),
      param('pageSize', 'The page size must be a positive value.')
        .optional()
        .isInt({
          min: 0,
        }),
    ];
  }
}
