import { v4 as uuid } from 'uuid';

export default class Organizer {
  private _id: string;
  private _name: string;
  private _email: string;

  constructor(name: string, email: string, id?: string) {
    if (id) {
      this._id = id;
    } else {
      this._id = uuid();
    }
    this._name = name;
    this._email = email;
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

  set email(email: string) {
    this._email = email;
  }

  get email(): string {
    return this._email;
  }
}
