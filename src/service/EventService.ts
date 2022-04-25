import OrganizerNotFoundError from '../common/exception/OrganizerNotFoundError';
import Postgres from '../infrastructure/Postgres';
import Event from '../model/Event';
import { EventRepository } from '../repository/EventRepository';
import {
  EventRequest,
  EventResponse,
  mapEventModelToDto,
} from './dto/EventDto';
import { mapLocationDtoToModel } from './dto/LocationDto';
import FindAllEventParam from './dto/FindAllEventParam';
import LocationService from './LocationService';
import OrganizerService from './OrganizerService';
import WeatherService from './WeatherService';
import { WeatherDetailDto } from './dto/WeatherDetailDto';

export default class EventService {
  constructor(
    private eventRepository: EventRepository,
    private organizerService: OrganizerService,
    private locationService: LocationService,
    private weatherService: WeatherService
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

  public async findById(id: string): Promise<EventResponse | undefined> {
    const event = await this.eventRepository.findById(id);
    if (event) {
      const response = mapEventModelToDto(event);
      if (this.displayWeather(event)) {
        const weather = await this.weatherService.getEventWeather(event);
        response.weather = weather;
      }
      return response;
    }
  }

  private displayWeather(event: Event): boolean {
    if (!event.isOutside) {
      return false;
    }
    const eventDate = event.eventDate;
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const MS_PER_WEEK = 7 * MS_PER_DAY;
    const eventDateUtc = Date.UTC(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    const current = Date.now();

    return Math.floor((eventDateUtc - current) / MS_PER_DAY) <= MS_PER_WEEK;
  }
}
