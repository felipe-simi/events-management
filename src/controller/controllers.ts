import { weatherClient } from '../infrastructure/httpClient';
import EventValidationMiddleware from '../middleware/EventValidationMiddleware';
import OrganizerBodyValidationMiddleware from '../middleware/OrganizerBodyValidationMiddleware';
import { EventRepository } from '../repository/EventRepository';
import { LocationRepository } from '../repository/LocationRepository';
import { OrganizerRepository } from '../repository/OrganizerRepository';
import EventService from '../service/EventService';
import LocationService from '../service/LocationService';
import OrganizerService from '../service/OrganizerService';
import WeatherService from '../service/WeatherService';
import { EventController } from './EventController';
import { OrganizerController } from './OrganizerController';

const eventRepository = EventRepository.getInstance();
const organizerRepository = OrganizerRepository.getInstance();
const organizerService = new OrganizerService(organizerRepository);
const locationRepository = LocationRepository.getInstance();
const locationService = new LocationService(locationRepository);

const weatherService = new WeatherService(weatherClient);
const eventService = new EventService(
  eventRepository,
  organizerService,
  locationService,
  weatherService
);

export default [
  new EventController(eventService, new EventValidationMiddleware()),
  new OrganizerController(
    organizerService,
    new OrganizerBodyValidationMiddleware()
  ),
];
