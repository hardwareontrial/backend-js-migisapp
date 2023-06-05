'use strict'

const cron = require('node-cron');
const AttendanceUserController = require('../../sequelize/controllers/AttendanceUserController');

exports.AttendanceUser = () => {
  const attendanceSync = cron.schedule('58 0,7,11,16 * * *', () => {
    // AttendanceUserController.attSync()
  });
  attendanceSync.start();
}