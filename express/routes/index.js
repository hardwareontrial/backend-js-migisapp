const express = require('express');
const router = express.Router();

const attendanceUser = require('./attendanceUser');

router.get('/', (req, res) => {
	res.json('Application running');
});

router.use('/hr/attendace', attendanceUser);

router.get('*', (req, res) => {
	res.status(404).send({ message: 'Route not found'});
});

module.exports = router;