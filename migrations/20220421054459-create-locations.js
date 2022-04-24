'use strict';

const tableName = 'locations';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        field: 'id',
      },
      countryAlphaCode: {
        type: Sequelize.STRING(3),
        allowNull: true,
        field: 'country_alpha_code',
      },
      cityName: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'city_name',
      },
      streetAddress: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'street_address',
      },
      postalCode: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'postal_code',
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
        field: 'latitude_iso',
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
        field: 'longitude_iso',
        validate: {
          min: -180,
          max: 180,
        },
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
