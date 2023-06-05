const app = require('./express/app');
const sequelize = require('./sequelize');

require('dotenv').config();

const PORT = process.env.APP_PORT || 3000;

async function assertDatabaseConnection(){
	console.log('Checking database connection ...');
	try {
		await sequelize.Database1.authenticate()
			.then(() => {
				console.log('Connection has been established successfully DB1.')
			})
			.catch((err) => {
				console.log('Authenticated Failed')
			});
		await sequelize.Database2.authenticate()
			.then(() => {
				console.log('Connection has been established successfully DB2.')
			})
			.catch((err) => {
				console.log('Authenticated Failed')
			});
		await sequelize.Database3.authenticate()
			.then(() => {
				console.log('Connection has been established successfully DB3.')
			})
			.catch((err) => {
				console.log('Authenticated Failed')
			});
	} catch (err) {
		console.log('Unable to connect Database');
		console.log(err.message);
		process.exit(1);
	}
}

async function initialize() {
	await assertDatabaseConnection();
	console.log(`Starting Express + Sequelize on port: ${PORT}`);
	app.listen(PORT, () => {
		console.log(`Express server started on port: ${PORT}`);
	});
}

initialize();
