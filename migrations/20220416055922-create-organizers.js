'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizers', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'email',
        unique: true,
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
    await queryInterface.dropTable('organizers');
  },
};
