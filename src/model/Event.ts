import { v4 as uuid } from 'uuid';
import Location from './Location';
import Organizer from './Organizer';

export default class Event {
  private _id: string;
  private _name: string;
  private _description: string;
  private _eventDate: Date;
  private _isOutside: boolean;
  private _organizer: Organizer;
  private _location: Location;

  constructor(
    name: string,
    description: string,
    eventDate: Date,
    isOutside: boolean,
    organizer: Organizer,
    location: Location,
    id?: string
  ) {
    if (id) {
      this._id = id;
    } else {
      this._id = uuid();
    }
    this._name = name;
    this._description = description;
    this._eventDate = eventDate;
    this._isOutside = isOutside;
    this._organizer = organizer;
    this._location = location;
  }

  get id(): string {
    return this._id;
  }

  set name(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  set description(description: string) {
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set eventDate(eventDate: Date) {
    this._eventDate = eventDate;
  }

  get eventDate(): Date {
    return this._eventDate;
  }

  set isOutside(isOutside: boolean) {
    this._isOutside = isOutside;
  }

  public get isOutside(): boolean {
    return this._isOutside;
  }

  set organizer(organizer: Organizer) {
    this._organizer = organizer;
  }

  public get organizer(): Organizer {
    return this._organizer;
  }

  set location(location: Location) {
    this._location = location;
  }

  public get location(): Location {
    return this._location;
  }
}
