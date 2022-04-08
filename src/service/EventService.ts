import { Event } from '../model/Event';
import { EventRepository } from '../repository/EventRepository';

export class EventService {
  constructor(private eventRepository: EventRepository) {}

  public async save(event: Event): Promise<Event> {
    return this.eventRepository.save(event).then(() => event);
  }
}
