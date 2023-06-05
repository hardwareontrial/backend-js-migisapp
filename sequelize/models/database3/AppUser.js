'use strict';

module.exports = async (sequelize, DataTypes) => {
	const AppUser = sequelize['Database3'].define('AppUser', {
		nik: { type: DataTypes.STRING, noUpdate: true, primaryKey: true },
		name: { type: DataTypes.STRING, noUpdate: true, },
		dept_id: { type: DataTypes.BIGINT, noUpdate: true, },
		position_id: { type: DataTypes.BIGINT, noUpdate: true, },
		group_id: { type: DataTypes.BIGINT, noUpdate: true, },
		avatar: { type: DataTypes.STRING, noUpdate: true, },
		active: { type: DataTypes.TINYINT, noUpdate: true, },
	},{
		modelName: 'AppUser',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		freezeTableName: true,
		tableName: 'app_users',
		schema: sequelize['Database3'].config.database,
	});

	sequelize['Database3'].dialect.supports.schemas = true;

	return AppUser;
}