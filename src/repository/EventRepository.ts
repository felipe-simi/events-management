import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
import Event from '../model/Event';
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
  declare organizer?: NonAttribute<OrganizerDbo>;
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

export class EventRepository {
  private static instance = new EventRepository();
  static getInstance(): EventRepository {
    return this.instance;
  }

  public async save(event: Event): Promise<Event> {
    return EventDbo.create({
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      isOutside: event.isOutside,
      organizerId: event.organizer.id,
    }).then(() => event);
  }
}
