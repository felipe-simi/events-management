import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
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
      type: DataTypes.NUMBER,
      allowNull: true,
      field: 'latitude_iso',
    },
    longitudeIso: {
      type: DataTypes.STRING,
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
}
