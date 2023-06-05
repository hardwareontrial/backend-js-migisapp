const multer = require('multer');
const upload = multer();
const route = require('express').Router();

const attendanceUserController = require('../../sequelize/controllers/AttendanceUserController');

route.get('/sync-data', attendanceUserController.allData);
route.post('/sync', upload.none(), attendanceUserController.manualAttSync);
route.post('/generate-data', upload.none(), attendanceUserController.generateFile);

route.get('/testing-a', attendanceUserController.testing);

// route.post('/auto-sync', upload.none(), attendanceUserController.autoSync);
// route.post('/auto-generate-data', upload.none(), attendanceUserController.generateAutoFile);
// route.post('/auto-generate-data', upload.none(), attendanceUserController.attSync);

module.exports = route;