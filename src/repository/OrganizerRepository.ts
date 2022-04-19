import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ValidationError,
} from 'sequelize';
import EmailAlreadyExistsError from '../common/exception/EmailAlreadyExistsError';
import Postgres from '../infrastructure/Postgres';
import Organizer from '../model/Organizer';
('../common/exception/EmailAlreadyExists');

export class OrganizerDbo extends Model<
  InferAttributes<OrganizerDbo>,
  InferCreationAttributes<OrganizerDbo>
> {
  declare id: string;
  declare name: string;
  declare email: string;
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email',
      unique: true,
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
    try {
      await OrganizerDbo.create({
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new EmailAlreadyExistsError(organizer.email);
      }
    }
  }

  public async findById(id: string): Promise<Organizer | undefined> {
    const organizer = await OrganizerDbo.findByPk(id);
    return organizer
      ? new Organizer(organizer.name, organizer.email, organizer.id)
      : undefined;
  }
}
