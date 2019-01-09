'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const config = {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    }
    await queryInterface.sequelize.query(`INSERT INTO configuration_items (id, data) VALUES ('google-oauth', '${JSON.stringify(config)}');`)
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DELETE FROM configuration_items WHERE id = 'google-oauth';`)
  }
};
