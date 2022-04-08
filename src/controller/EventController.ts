import Express from 'express';
import { Event } from '../model/Event';
import { EventService } from '../service/EventService';
import { BaseController } from './BaseController';

export class EventController implements BaseController {
  private path = '/events';

  constructor(private service: EventService) {
    this.service = service;
  }

  createRoutes = (): Express.Router => {
    const router = Express.Router();
    router.post(this.path, [], this.create);
    return router;
  };

  create = (
    request: Express.Request<unknown, unknown, EventBody>,
    response: Express.Response
  ): void => {
    const event = new Event(
      request.body.name,
      request.body.description,
      request.body.eventDate,
      request.body.isOutside
    );
    this.service
      .save(event)
      .then(() => response.status(201).json(event))
      .catch((error) => {
        console.error(error);
        response.status(500).json();
      });
  };
}

interface EventBody {
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
}
