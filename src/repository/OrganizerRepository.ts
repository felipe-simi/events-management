import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { Postgres } from '../infrastructure/Postgres';
import { Organizer } from '../model/Organizer';

class OrganizerDbo extends Model {
  declare name: string;
  declare id: string;
}

class OrganizerInstance extends Model<
  InferAttributes<OrganizerDbo>,
  InferCreationAttributes<OrganizerDbo>
> {}

OrganizerInstance.init(
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
    return OrganizerInstance.create({
      id: organizer.id,
      name: organizer.name,
    }).then();
  }
}
