import OrganizerNotFoundError from '../common/exception/OrganizerNotFoundError';
import Postgres from '../infrastructure/Postgres';
import Event from '../model/Event';
import { EventRepository } from '../repository/EventRepository';
import { EventRequest } from './dto/EventDto';
import { mapLocationDtoToModel } from './dto/LocationDto';
import FindAllEventParam from './dto/FindAllEventParam';
import LocationService from './LocationService';
import OrganizerService from './OrganizerService';

export default class EventService {
  constructor(
    private eventRepository: EventRepository,
    private organizerService: OrganizerService,
    private locationService: LocationService
  ) {}

  public async save(event: EventRequest): Promise<Event> {
    const organizer = await this.organizerService.findById(event.organizerId);
    if (organizer !== undefined) {
      const transaction = await Postgres.createTransaction();
      try {
        const location = mapLocationDtoToModel(event.location);
        const createdLocation = await this.locationService.save(
          location,
          transaction
        );
        const createdEvent = await this.eventRepository.save(
          new Event(
            event.name,
            event.description,
            event.eventDate,
            event.isOutside,
            organizer,
            createdLocation
          ),
          transaction
        );
        transaction.commit();
        return createdEvent;
      } catch (error) {
        console.error(error);
        transaction.rollback();
        throw error;
      }
    } else {
      throw new OrganizerNotFoundError(event.organizerId);
    }
  }

  public async findAll(param: FindAllEventParam): Promise<Event[]> {
    return this.eventRepository.findAll(param);
  }

  public async findById(id: string): Promise<Event | undefined> {
    return this.eventRepository.findById(id);
  }
}
