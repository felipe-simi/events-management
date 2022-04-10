import Express from 'express';
import {
  body,
  ValidationError,
  validationResult,
} from 'express-validator/check';
import EventBodyValidationMiddleware from '../middleware/EventBodyValidationMiddleware';
import { Event } from '../model/Event';
import { EventService } from '../service/EventService';
import { BaseController } from './BaseController';

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
    request: Express.Request<undefined, undefined, EventBody>,
    response: Express.Response<EventBody | { errors: ValidationError[] }>
  ): void | Express.Response => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).send({ errors: errors.array() });
    }
    const event = new Event(
      request.body.name,
      request.body.description,
      request.body.eventDate,
      request.body.isOutside
    );
    this.eventService
      .save(event)
      .then(() => response.status(201).json({ id: event.id, ...request.body }))
      .catch((error) => {
        console.error(error);
        return response.status(500).json();
      });
  };
}

interface EventBody {
  id?: string;
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
}
