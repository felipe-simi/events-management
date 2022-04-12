import {
  Association,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import Postgres from '../infrastructure/Postgres';
import Organizer from '../model/Organizer';
import { EventDbo } from './EventRepository';

export class OrganizerDbo extends Model<
  InferAttributes<OrganizerDbo>,
  InferCreationAttributes<OrganizerDbo>
> {
  declare name: string;
  declare id: string;
}

OrganizerDbo.init(
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
  },
  {
    sequelize: Postgres.getConnection(),
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    deletedAt: 'deleted_at',
    updatedAt: 'updated_at',
    tableName: 'organizers',
  }
);

export class OrganizerRepository {
  private static instance = new OrganizerRepository();
  static getInstance(): OrganizerRepository {
    return this.instance;
  }

  public async save(organizer: Organizer): Promise<void> {
    await OrganizerDbo.create({
      id: organizer.id,
      name: organizer.name,
    });
  }

  public async findById(id: string): Promise<Organizer | undefined> {
    const organizer = await OrganizerDbo.findByPk(id);
    return organizer ? new Organizer(organizer.name, organizer.id) : undefined;
  }
}
