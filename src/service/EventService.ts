import OrganizerNotFound from '../common/exception/OrganizerNotFound';
import Event from '../model/Event';
import { EventRepository } from '../repository/EventRepository';
import EventDto from './EventDto';
import OrganizerService from './OrganizerService';

export default class EventService {
  constructor(
    private eventRepository: EventRepository,
    private organizerService: OrganizerService
  ) {}

  public async save(event: EventDto): Promise<Event> {
    return this.organizerService
      .findById(event.organizerId)
      .then((organizer) => {
        if (organizer !== undefined) {
          return this.eventRepository.save(
            new Event(
              event.name,
              event.description,
              event.eventDate,
              event.isOutside,
              organizer
            )
          );
        } else {
          return Promise.reject(new OrganizerNotFound(event.organizerId));
        }
      });
  }
}
