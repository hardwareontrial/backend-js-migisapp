'use strict';

module.exports = async (sequelize, DataTypes) => {

	const AttendanceUser = sequelize['Database1'].define('AttendanceUser', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		pin: { type: DataTypes.STRING, allowNull: true },
		name: { type: DataTypes.TEXT, allowNull: true },
		scan_date: { type: DataTypes.TEXT, allowNull: true },
		created_at: { type: DataTypes.DATE },
		updated_at: { type: DataTypes.DATE },
	},
	{
		modelName: 'AttendanceUser',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		freezeTableName: true,
		underscored: true,
		tableName: 'attendance_user',
		schema: sequelize['Database1'].config.database,
	});

	sequelize['Database1'].dialect.supports.schemas = true;

	return AttendanceUser;
}