const mysql = require('mysql2');

module.exports = {
	// "development": {
		"databases": {
			"Database1": {
				"database": process.env.DB_DATABASE,
				"username": process.env.DB_USERNAME,
				"password": process.env.DB_PASSWORD,
				"host": process.env.DB_HOST,
				"port": process.env.DB_PORT,
				"dialect": process.env.DB_DIALECT,
				"define": {
		      "freezeTableName": true,
		    },
				"timezone": "+07:00",
				"dialectModule": mysql,
			},
			"Database2": {
				"database": process.env.DB_ABSENSI_DATABASE,
				"username":process.env.DB_ABSENSI_USERNAME,
				"password":process.env.DB_ABSENSI_PASSWORD,
				"host":process.env.DB_ABSENSI_HOST,
				"port":process.env.DB_ABSENSI_PORT,
				"dialect":process.env.DB_ABSENSI_DIALECT,
				"define": {
		      "freezeTableName": true,
		    },
				"timezone": "+07:00",
				"dialectModule": mysql,
			},
			"Database3": {
				"database": process.env.DB_WEB_DATABASE,
				"username":process.env.DB_WEB_USERNAME,
				"password":process.env.DB_WEB_PASSWORD,
				"host":process.env.DB_WEB_HOST,
				"port":process.env.DB_WEB_PORT,
				"dialect":process.env.DB_WEB_DIALECT,
				"define": {
		      "freezeTableName": true,
		    },
				"timezone": "+07:00",
				"dialectModule": mysql,
			},	
		}
	// },
}