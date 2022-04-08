import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Postgres } from '../infrastructure/Postgres';
import { Event } from '../model/Event';

class EventDbo extends Model {
  declare name: string;
  declare description: string;
  declare eventDate: Date;
  declare isOutside: boolean;
  declare id: string;
}

class EventInstance extends Model<
  InferAttributes<EventDbo>,
  InferCreationAttributes<EventDbo>
> {}

EventInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isOutside: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: Postgres.getConnection(),
    paranoid: true,
    timestamps: true,
    tableName: 'events',
  }
);

export class EventRepository {
  private static instance = new EventRepository();
  static getInstance(): EventRepository {
    return this.instance;
  }

  public async save(event: Event): Promise<void> {
    return EventInstance.create({
      id: event.id,
      name: event.name,
      description: event.description,
      eventDate: event.eventDate,
      isOutside: event.isOutside,
    }).then();
  }
}
