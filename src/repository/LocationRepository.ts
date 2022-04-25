import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Transaction,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
import Location from '../model/Location';
('../common/exception/EmailAlreadyExists');

export class LocationDbo extends Model<
  InferAttributes<LocationDbo>,
  InferCreationAttributes<LocationDbo>
> {
  declare id: string;
  declare countryAlphaCode?: string;
  declare cityName?: string;
  declare streetAddress?: string;
  declare postalCode?: string;
  declare latitudeIso?: number;
  declare longitudeIso?: number;
}

LocationDbo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    countryAlphaCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country_alpha_code',
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'city_name',
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'street_address',
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'postal_code',
    },
    latitudeIso: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'latitude_iso',
    },
    longitudeIso: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'longitude_iso',
    },
  },
  {
    sequelize: Postgres.getConnection(),
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    tableName: 'locations',
  }
);

export class LocationRepository {
  private static instance = new LocationRepository();
  static getInstance(): LocationRepository {
    return this.instance;
  }

  public async save(
    location: Location,
    transaction?: Transaction
  ): Promise<Location> {
    await LocationDbo.create(
      {
        id: location.id,
        countryAlphaCode: location.countryAlphaCode,
        cityName: location.cityName,
        postalCode: location.postalCode,
        streetAddress: location.streetAddress,
        latitudeIso: location.latitudeIso,
        longitudeIso: location.longitudeIso,
      },
      { transaction }
    );
    return location;
  }
}
