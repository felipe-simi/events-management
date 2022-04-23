import Location from '../model/Location';

export interface LocationDto {
  id?: string;
  countryAlphaCode?: string;
  cityName?: string;
  streetAddress?: string;
  postalCode?: string;
  latitudeIso?: number;
  longitudeIso?: number;
}

export const mapLocationDtoToModel = (location: LocationDto): Location => {
  if (
    location.latitudeIso !== undefined &&
    location.longitudeIso !== undefined
  ) {
    return Location.fromGeographicCoordinates(
      location.latitudeIso,
      location.longitudeIso
    );
  }
  if (
    location.countryAlphaCode &&
    location.cityName &&
    location.streetAddress &&
    location.postalCode
  ) {
    return Location.fromAddress(
      location.countryAlphaCode,
      location.cityName,
      location.streetAddress,
      location.postalCode
    );
  }
  throw new Error('Invalid location!');
};

export const mapLocationModelToDto = (location: Location): LocationDto => {
  if (
    location.latitudeIso !== undefined &&
    location.longitudeIso !== undefined
  ) {
    return Location.fromGeographicCoordinates(
      location.latitudeIso,
      location.longitudeIso
    );
  }
  if (
    location.countryAlphaCode &&
    location.cityName &&
    location.streetAddress &&
    location.postalCode
  ) {
    return Location.fromAddress(
      location.countryAlphaCode,
      location.cityName,
      location.streetAddress,
      location.postalCode
    );
  }
  throw new Error('Invalid location!');
};
