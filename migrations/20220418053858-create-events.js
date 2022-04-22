'use strict';

const tableName = 'events';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'id',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'description',
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_date',
      },
      isOutside: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        field: 'is_outside',
      },
      organizerId: {
        type: Sequelize.UUID,
        field: 'organizer_id',
        references: {
          model: {
            tableName: 'organizers',
          },
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'created_at',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface, _) {
    await queryInterface.dropTable(tableName);
  },
};
