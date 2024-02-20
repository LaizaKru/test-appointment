const { Schedule } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const schedules = [];
    const doctorId = 1;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      if (dayDate.getDay() !== 0 && dayDate.getDay() !== 6) {
        for (let hour = 9; hour < 17; hour++) {
          schedules.push({
            doctorId,
            date: dayDate,
            startTime: `${hour}:00:00`,
            endTime: `${hour + 1}:00:00`,
            isBooked: false,
          });
        }
      }
    }
    await Schedule.bulkCreate(schedules);
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    await Schedule.destroy({ truncate: { cascade: true } });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
