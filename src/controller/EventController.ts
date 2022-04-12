import Express from 'express';
import { validationResult } from 'express-validator/check';
import OrganizerNotFound from '../common/exception/OrganizerNotFound';
import EventValidationMiddleware from '../middleware/EventValidationMiddleware';
import EventDto from '../service/EventDto';
import EventService from '../service/EventService';
import FindAllEventParam from '../service/FindAllEventParam';
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
    private eventValidation: EventValidationMiddleware
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
    router.get(
      this.path,
      this.eventValidation.verifyFindAllEvents(),
      this.findAll
    );
    return router;
  };

  create = async (
    request: Express.Request<undefined, undefined, EventDto>,
    response: Express.Response<EventDto | { errors: FieldError[] }>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const errors: FieldError[] = validationErrors.array().map((error) => ({
        fieldName: error.param,
        value: error.value,
        message: error.msg,
      }));
      response.status(422).send({ errors });
    } else {
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
    }
  };

  findAll = async (
    request: Express.Request<undefined, undefined, EventDto, FindAllEventParam>,
    response: Express.Response<EventDto[] | { errors: FieldError[] }>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const errors: FieldError[] = validationErrors.array().map((error) => ({
        fieldName: error.param,
        value: error.value,
        message: error.msg,
      }));
      response.status(422).send({ errors });
    } else {
      console.log(request.params);
      console.log(request.query);
      try {
        const events = await this.eventService.findAll(request.query);
        const eventsDto: EventDto[] = events.map((event) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          eventDate: event.eventDate,
          isOutside: event.isOutside,
          organizerId: event.organizer.id,
        }));
        response.status(200).json(eventsDto);
      } catch (error) {
        console.error(error);
        response.status(500).json();
      }
    }
  };
}
