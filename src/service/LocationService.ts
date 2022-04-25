import { Transaction } from 'sequelize/types';
import Location from '../model/Location';
import { LocationRepository } from '../repository/LocationRepository';

export default class LocationService {
  constructor(private locationRepository: LocationRepository) {}

  public async save(
    location: Location,
    transaction?: Transaction
  ): Promise<Location> {
    await this.locationRepository.save(location, transaction);
    return location;
  }
}
