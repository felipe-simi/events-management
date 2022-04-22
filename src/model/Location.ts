import { v4 as uuid } from 'uuid';

export default class Location {
  private _id: string;
  private _countryAlphaCode?: string;
  private _cityName?: string;
  private _streetAddress?: string;
  private _postalCode?: string;
  private _latitudeIso?: number;
  private _longitudeIso?: number;

  constructor(id?: string) {
    if (id) {
      this._id = id;
    } else {
      this._id = uuid();
    }
  }

  static fromGeographicCoordinates(
    latitudeIso: number,
    longitudeIso: number,
    id?: string
  ): Location {
    const location = new Location(id);
    location.latitudeIso = latitudeIso;
    location.longitudeIso = longitudeIso;
    return location;
  }

  static fromAddress(
    countryAlphaCode: string,
    cityName: string,
    streetAddress: string,
    postalCode: string,
    id?: string
  ): Location {
    const location = new Location(id);
    location.countryAlphaCode = countryAlphaCode;
    location.cityName = cityName;
    location.streetAddress = streetAddress;
    location.postalCode = postalCode;
    return location;
  }

  get id(): string {
    return this._id;
  }

  set countryAlphaCode(countryAlphaCode: string | undefined) {
    this._countryAlphaCode = countryAlphaCode;
  }

  get countryAlphaCode(): string | undefined {
    return this._countryAlphaCode;
  }

  set cityName(cityName: string | undefined) {
    this._cityName = cityName;
  }

  get cityName(): string | undefined {
    return this._cityName;
  }

  set postalCode(postalCode: string | undefined) {
    this._postalCode = postalCode;
  }

  get postalCode(): string | undefined {
    return this._postalCode;
  }

  set streetAddress(streetAddress: string | undefined) {
    this._streetAddress = streetAddress;
  }

  get streetAddress(): string | undefined {
    return this._streetAddress;
  }

  set latitudeIso(latitudeIso: number | undefined) {
    this._latitudeIso = latitudeIso;
  }

  get latitudeIso(): number | undefined {
    return this._latitudeIso;
  }

  set longitudeIso(longitudeIso: number | undefined) {
    this._longitudeIso = longitudeIso;
  }

  get longitudeIso(): number | undefined {
    return this._longitudeIso;
  }
}
