import Express from 'express';
import { validationResult } from 'express-validator/check';
import OrganizerNotFound from '../common/exception/OrganizerNotFound';
import EventBodyValidationMiddleware from '../middleware/EventBodyValidationMiddleware';
import EventDto from '../service/EventDto';
import EventService from '../service/EventService';
import BaseController from './BaseController';

type FieldError = {
  fieldName: string;
  value: unknown;
  message: string;
};

export class EventController implements BaseController {
  private path = '/events';

  constructor(
    private eventService: EventService,
    private eventValidation: EventBodyValidationMiddleware
  ) {
    this.eventService = eventService;
    this.eventValidation = eventValidation;
  }

  createRoutes = (): Express.Router => {
    const router = Express.Router();
    router.post(
      this.path,
      this.eventValidation.verifyCreateEvent(),
      this.create
    );
    return router;
  };

  create = (
    request: Express.Request<undefined, undefined, EventDto>,
    response: Express.Response<EventDto | { errors: FieldError[] }>
  ): void | Express.Response => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const errors: FieldError[] = validationErrors.array().map((error) => ({
        fieldName: error.param,
        value: error.value,
        message: error.msg,
      }));
      return response.status(422).send({ errors });
    }
    const event = request.body;
    this.eventService
      .save(event)
      .then((createdEvent) =>
        response.status(201).json({ id: createdEvent.id, ...request.body })
      )
      .catch((error) => {
        if (error instanceof OrganizerNotFound) {
          const errors: FieldError[] = [
            {
              fieldName: 'organizerId',
              value: event.organizerId,
              message: error.message,
            },
          ];
          response.status(422).json({ errors });
        }
        console.error(error);
        return response.status(500).json();
      });
  };
}
