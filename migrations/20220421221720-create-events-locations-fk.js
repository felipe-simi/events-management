'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addConstraint('events', {
      fields: ['location_id'],
      type: 'foreign key',
      name: 'events_location_id_fkey',
      references: {
        table: 'locations',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('events', 'events_location_id_fkey');
  },
};
