import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
import Event from '../model/Event';
import Organizer from '../model/Organizer';
import FindAllEventParam from '../service/FindAllEventParam';
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

export class EventRepository {
  DEFAULT_PAGE_SIZE = 10;
  DEFAULT_PAGE_NUMBER = 0;

  private static instance = new EventRepository();
  static getInstance(): EventRepository {
    return this.instance;
  }

  public async save(event: Event): Promise<Event> {
    await EventDbo.create({
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      isOutside: event.isOutside,
      organizerId: event.organizer.id,
    });
    return event;
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
    return result.rows.map(
      (dbo) =>
        new Event(
          dbo.name,
          dbo.description,
          dbo.eventDate,
          dbo.isOutside,
          new Organizer(dbo.organizer.name, dbo.organizer.id),
          dbo.id
        )
    );
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
}
