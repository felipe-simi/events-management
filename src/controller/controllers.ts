import EventValidationMiddleware from '../middleware/EventValidationMiddleware';
import OrganizerBodyValidationMiddleware from '../middleware/OrganizerBodyValidationMiddleware';
import { EventRepository } from '../repository/EventRepository';
import { OrganizerRepository } from '../repository/OrganizerRepository';
import EventService from '../service/EventService';
import OrganizerService from '../service/OrganizerService';
import { EventController } from './EventController';
import { OrganizerController } from './OrganizerController';

const organizerRepository = OrganizerRepository.getInstance();
const organizerService = new OrganizerService(organizerRepository);
const eventRepository = EventRepository.getInstance();
const eventService = new EventService(eventRepository, organizerService);

export default [
  new EventController(eventService, new EventValidationMiddleware()),
  new OrganizerController(
    organizerService,
    new OrganizerBodyValidationMiddleware()
  ),
];
