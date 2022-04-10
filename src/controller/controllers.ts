import EventBodyValidationMiddleware from '../middleware/EventBodyValidationMiddleware';
import OrganizerBodyValidationMiddleware from '../middleware/OrganizerBodyValidationMiddleware';
import { EventRepository } from '../repository/EventRepository';
import { OrganizerRepository } from '../repository/OrganizerRepository';
import { EventService } from '../service/EventService';
import { OrganizerService } from '../service/OrganizerService';
import { EventController } from './EventController';
import { OrganizerController } from './OrganizerController';

export default [
  new EventController(
    new EventService(EventRepository.getInstance()),
    new EventBodyValidationMiddleware()
  ),
  new OrganizerController(
    new OrganizerService(OrganizerRepository.getInstance()),
    new OrganizerBodyValidationMiddleware()
  ),
];
