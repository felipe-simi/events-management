import { EventRepository } from '../repository/EventRepository';
import { EventService } from '../service/EventService';
import { EventController } from './EventController';

export default [
  new EventController(new EventService(EventRepository.getInstance())),
];
