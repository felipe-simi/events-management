import OrganizerDto from './OrganizerDto';

export interface EventRequest {
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
  organizerId: string;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
  organizer: OrganizerDto;
}
