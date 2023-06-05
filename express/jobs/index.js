'use strict'

const cron = require('node-cron');
const AttendanceUserController = require('../../sequelize/controllers/AttendanceUserController');

exports.AttendanceUser = () => {
  const attendanceSync = cron.schedule('* * * * *', () => {
    // AttendanceUserController.testing()
  });
  attendanceSync.start();
}