import OrganizerNotFoundError from '../common/exception/OrganizerNotFoundError';
import Event from '../model/Event';
import { EventRepository } from '../repository/EventRepository';
import EventDto from './EventDto';
import FindAllEventParam from './FindAllEventParam';
import OrganizerService from './OrganizerService';

export default class EventService {
  constructor(
    private eventRepository: EventRepository,
    private organizerService: OrganizerService
  ) {}

  public async save(event: EventDto): Promise<Event> {
    const organizer = await this.organizerService.findById(event.organizerId);
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
      throw new OrganizerNotFoundError(event.organizerId);
    }
  }

  public async findAll(param: FindAllEventParam): Promise<Event[]> {
    return this.eventRepository.findAll(param);
  }
}
