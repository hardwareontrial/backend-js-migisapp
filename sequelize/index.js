'use strict'

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require('./configs/database.js')[env];
const config = require('./configs/database.js');
const db = {};

const databases = Object.keys(config.databases);

for (let i=0; i < databases.length; ++i){
  let database = databases[i];
  let dbPath = config.databases[database];
  db[database] = new Sequelize(dbPath.database, dbPath.username, dbPath.password, dbPath)
}

fs
  .readdirSync(__dirname + '/models/database1')
  .filter(file => 
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname + '/models/database1', file))(db, Sequelize.DataTypes);
    db[model.name] = model;
  });

fs
  .readdirSync(__dirname + '/models/database2')
  .filter(file => 
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname + '/models/database2', file))(db, Sequelize.DataTypes);
    db[model.name] = model;
  });

fs
  .readdirSync(__dirname + '/models/database3')
  .filter(file => 
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname + '/models/database3', file))(db, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;

const AppUserModel = db.Database3.models.AppUser;
const AttendanceLogSourceModel = db.Database2.models.AttendanceLogSource;

AttendanceLogSourceModel.hasOne(AppUserModel, {foreignKey: 'nik', sourceKey: 'pin', as: 'dataUser'});

module.exports = db;