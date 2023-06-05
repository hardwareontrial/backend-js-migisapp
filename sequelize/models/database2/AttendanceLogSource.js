'use strict';

module.exports = async (sequelize, DataTypes) => {
	const AttendanceLogSource = sequelize['Database2'].define('AttendanceLogSource', {
		sn:{ type: DataTypes.STRING, noUpdate: true, primaryKey: true, },
		scan_date: { type: DataTypes.DATE, noUpdate: true, primaryKey: true, },
		pin: { type: DataTypes.STRING, noUpdate: true, primaryKey: true, },
		verifymode: { type: DataTypes.INTEGER, noUpdate: true, },
		inoutmode: { type: DataTypes.INTEGER, noUpdate: true, },
		reserved: { type: DataTypes.INTEGER, noUpdate: true, },
		work_code: { type: DataTypes.INTEGER, noUpdate: true, },
		att_id: { type: DataTypes.STRING, noUpdate: true, },
	},{
		modelName: 'AttendanceLogSource',
		timestamps: false,
		freezeTableName: true,
		tableName: 'att_log',
		schema: sequelize['Database2'].config.database,
	});
	
	sequelize['Database2'].dialect.supports.schemas = true;

	return AttendanceLogSource;
}