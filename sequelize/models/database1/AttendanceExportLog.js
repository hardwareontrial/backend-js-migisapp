'use strict';

module.exports = async (sequelize, DataTypes) => {
	const AttendanceExportLog = sequelize['Database1'].define('AttendanceExportLog', {
		id: { type: DataTypes.INTEGER, primaryKey: true },
		startdate: { type: DataTypes.TEXT, allowNull: true },
		enddate: { type: DataTypes.TEXT, allowNull: true },
		note: { type: DataTypes.TEXT, allowNull: true },
		created_at: { type: DataTypes.DATE },
		updated_at: { type: DataTypes.DATE },
	},{
		modelName: 'AttendanceExportLog',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		freezeTableName: true,
		underscored: true,
		tableName: 'attendance_export_log',
		schema: sequelize['Database1'].config.database,
	});

	sequelize['Database1'].dialect.supports.schemas = true;

	return AttendanceExportLog;
}