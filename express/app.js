const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes');
const jobs = require('./jobs');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({origin: "*"}));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/', route);
app.use('/public', express.static(path.join(__dirname, 'public')));

jobs.AttendanceUser();

module.exports = app;