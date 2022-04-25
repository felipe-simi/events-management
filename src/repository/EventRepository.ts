import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
  Transaction,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
import Event from '../model/Event';
import Location from '../model/Location';
import Organizer from '../model/Organizer';
import FindAllEventParam from '../service/FindAllEventParam';
import { LocationDbo } from './LocationRepository';
import { OrganizerDbo } from './OrganizerRepository';

export class EventDbo extends Model<
  InferAttributes<EventDbo>,
  InferCreationAttributes<EventDbo>
> {
  declare name: string;
  declare description: string;
  declare eventDate: Date;
  declare isOutside: boolean;
  declare id: string;
  declare organizerId: string;
  declare organizer: NonAttribute<OrganizerDbo>;
  declare locationId: string;
  declare location: NonAttribute<LocationDbo>;
}

EventDbo.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'description',
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'event_date',
    },
    isOutside: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_outside',
    },
    organizerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'organizer_id',
    },
    locationId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'location_id',
    },
  },
  {
    sequelize: Postgres.getConnection(),
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    tableName: 'events',
  }
);

OrganizerDbo.hasMany(EventDbo, {
  sourceKey: 'id',
  foreignKey: 'organizerId',
});
EventDbo.belongsTo(OrganizerDbo, { as: 'organizer' });

LocationDbo.hasMany(EventDbo, {
  sourceKey: 'id',
  foreignKey: 'locationId',
});
EventDbo.belongsTo(LocationDbo, { as: 'location' });

export class EventRepository {
  DEFAULT_PAGE_SIZE = 10;
  DEFAULT_PAGE_NUMBER = 0;

  private static instance = new EventRepository();
  static getInstance(): EventRepository {
    return this.instance;
  }

  public async save(event: Event, transaction?: Transaction): Promise<Event> {
    await EventDbo.create(
      {
        id: event.id,
        name: event.name,
        description: event.description,
        eventDate: event.eventDate,
        isOutside: event.isOutside,
        organizerId: event.organizer.id,
        locationId: event.location.id,
      },
      { transaction }
    );
    return event;
  }

  public async findById(id: string): Promise<Event | undefined> {
    const event = await EventDbo.findByPk(id, {
      include: [
        { model: OrganizerDbo, as: 'organizer' },
        { model: LocationDbo, as: 'location' },
      ],
    });
    if (event) {
      return this.mapToDomain(event);
    }
    return undefined;
  }

  public async findAll(param: FindAllEventParam): Promise<Event[]> {
    const dateClauses = this.extractWhereClauses(param);
    const offset = this.calculateOffset(param);
    const limit = param.pageSize ?? this.DEFAULT_PAGE_SIZE;
    let result;
    if (dateClauses.length == 0) {
      result = await EventDbo.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [{ model: OrganizerDbo, as: 'organizer' }],
      });
    } else {
      result = await EventDbo.findAndCountAll({
        limit: limit,
        offset: offset,
        where: {
          eventDate: {
            [Op.and]: dateClauses,
          },
        },
        include: [{ model: OrganizerDbo, as: 'organizer' }],
      });
    }
    return result.rows.map((dbo) => this.mapToDomain(dbo));
  }

  private extractWhereClauses(param: FindAllEventParam) {
    const dateClauses = [];
    if (param.from) {
      dateClauses.push({ [Op.gte]: param.from });
    }
    if (param.to) {
      dateClauses.push({ [Op.lte]: param.to });
    }
    return dateClauses;
  }

  private calculateOffset(param: FindAllEventParam): number {
    return (
      (param.pageNumber ?? this.DEFAULT_PAGE_NUMBER) *
      (param.pageSize ?? this.DEFAULT_PAGE_SIZE)
    );
  }

  private mapToDomain(dbo: EventDbo): Event {
    return new Event(
      dbo.name,
      dbo.description,
      dbo.eventDate,
      dbo.isOutside,
      new Organizer(dbo.organizer.name, dbo.organizer.email, dbo.organizer.id),
      this.mapLocationDboToModel(dbo.location),
      dbo.id
    );
  }

  private mapLocationDboToModel(locationDbo: LocationDbo) {
    const location = new Location(locationDbo.id);
    location.countryAlphaCode = locationDbo.countryAlphaCode;
    location.cityName = locationDbo.cityName;
    location.streetAddress = locationDbo.streetAddress;
    location.postalCode = locationDbo.postalCode;
    location.latitudeIso = locationDbo.latitudeIso;
    location.longitudeIso = locationDbo.longitudeIso;
    return location;
  }
}
