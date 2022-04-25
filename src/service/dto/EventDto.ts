import Event from '../../model/Event';
import { LocationDto, mapLocationModelToDto } from './LocationDto';
import OrganizerDto from './OrganizerDto';
import { WeatherDetailDto } from './WeatherDetailDto';

export interface EventRequest {
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
  organizerId: string;
  location: LocationDto;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
  organizer: OrganizerDto;
  location: LocationDto;
  weather?: WeatherDetailDto;
}

export const mapEventModelToDto = (event: Event): EventResponse => {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    eventDate: event.eventDate,
    isOutside: event.isOutside,
    organizer: {
      id: event.organizer.id,
      email: event.organizer.email,
      name: event.organizer.name,
    },
    location: mapLocationModelToDto(event.location),
  };
};
