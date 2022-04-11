import { v4 as uuid } from 'uuid';

export default class Organizer {
  private _id: string;
  private _name: string;

  constructor(name: string, id?: string) {
    if (id) {
      this._id = id;
    } else {
      this._id = uuid();
    }
    this._name = name;
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
}
