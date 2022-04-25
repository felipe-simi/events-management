import Express from 'express';
import { validationResult } from 'express-validator';
import OrganizerNotFoundError from '../common/exception/OrganizerNotFoundError';
import EventValidationMiddleware from '../middleware/EventValidationMiddleware';
import Event from '../model/Event';
import {
  EventRequest,
  EventResponse,
  mapEventModelToDto,
} from '../service/dto/EventDto';
import EventService from '../service/EventService';
import FindAllEventParam from '../service/dto/FindAllEventParam';
import { mapLocationModelToDto } from '../service/dto/LocationDto';
import BaseController from './BaseController';
import FieldError from './error/FieldError';
import { fromValidationErrors, ResponseError } from './error/ResponseError';

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
    router.get(
      this.path + '/:eventId',
      this.eventValidation.verifyFindAllEvents(),
      this.findById
    );
    return router;
  };

  create = async (
    request: Express.Request<undefined, undefined, EventRequest>,
    response: Express.Response<EventResponse | ResponseError>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const responseError = fromValidationErrors(validationErrors);
      response.status(422).send(responseError);
    } else {
      const event = request.body;
      try {
        const createdEvent = await this.eventService.save(event);
        response.status(201).json(mapEventModelToDto(createdEvent));
      } catch (error) {
        if (error instanceof OrganizerNotFoundError) {
          const errors: FieldError[] = [
            {
              fieldName: 'organizerId',
              value: event.organizerId,
              message: error.message,
            },
          ];
          response.status(422).json({ errors });
        } else {
          console.error(error);
          response.status(500).json();
        }
      }
    }
  };

  findAll = async (
    request: Express.Request<
      undefined,
      undefined,
      EventRequest,
      FindAllEventParam
    >,
    response: Express.Response<EventResponse[] | ResponseError>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const errors = fromValidationErrors(validationErrors);
      response.status(422).send(errors);
    } else {
      try {
        const events = await this.eventService.findAll(request.query);
        const eventsDto: EventResponse[] = events.map((event) =>
          mapEventModelToDto(event)
        );
        response.status(200).json(eventsDto);
      } catch (error) {
        console.error(error);
        response.status(500).json();
      }
    }
  };

  findById = async (
    request: Express.Request<
      { eventId: string },
      undefined,
      EventRequest,
      FindAllEventParam
    >,
    response: Express.Response<EventResponse | ResponseError>
  ): Promise<void> => {
    const validationErrors = validationResult(request);
    if (!validationErrors.isEmpty()) {
      const errors = fromValidationErrors(validationErrors);
      response.status(422).send(errors);
    } else {
      const { eventId } = request.params;
      try {
        const eventResponse = await this.eventService.findById(eventId);
        if (eventResponse) {
          response.status(200).json(eventResponse);
        } else {
          response.status(404).json();
        }
      } catch (error) {
        console.error(error);
        response.status(500).json();
      }
    }
  };
}
