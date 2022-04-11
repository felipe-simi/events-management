export default interface EventDto {
  id?: string;
  name: string;
  description: string;
  eventDate: Date;
  isOutside: boolean;
  organizerId: string;
}
