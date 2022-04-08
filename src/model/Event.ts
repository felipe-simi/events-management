import { v4 as uuid } from 'uuid';

export class Event {
  private _id: string;
  private _name: string;
  private _description: string;
  private _eventDate: Date;
  private _isOutside: boolean;

  constructor(
    name: string,
    description: string,
    eventDate: Date,
    isOutside: boolean,
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
}
