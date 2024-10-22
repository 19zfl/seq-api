'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Settings', [{
      name: 'seq-api',
      icp: '鄂ICP备xxxxxxxx号-xx',
      copyright: '© 2024 19zfl Inc. All Rights Reserved.',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Settings', null, {})
  }
};
