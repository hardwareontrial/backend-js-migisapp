'use strict'

const path = require('path');
const fs = require('fs');
const { Sequelize, Op } = require('sequelize')
const model = require('../../sequelize');
const moment = require('moment');

const AttendanceExportLog = model.Database1.models.AttendanceExportLog;
const AttendanceUser = model.Database1.models.AttendanceUser;
const AttendanceLogSource = model.Database2.models.AttendanceLogSource;

exports.attSync = async () => {
	
	let startDate, endDate, sourceDataAtt, countLog, storePath, file, filename;

	countLog = await AttendanceExportLog.count();

	if (countLog == 0) {
		startDate =  moment().format('YYYY-MM-DD 00:00:00');
		endDate =  moment().format('YYYY-MM-DD HH:mm:ss');
		// startDate = '2023-03-27 00:00:00';
		// endDate = '2023-03-27 02:00:00';
	} else {
		await AttendanceExportLog.findOne({ order: [['id', 'DESC']] })
		.then(data => { 
			startDate = data.enddate 
		})
		.catch(err => { 
			console.log(err);
		})
		
		endDate =  moment().format('YYYY-MM-DD HH:mm:ss');
		// endDate = '2023-03-27 05:30:00';
	}

	await AttendanceLogSource.findAll({
		where: { scan_date: {[Op.between]: [startDate, endDate]} },
		include: [
			{
				model: model.Database3.models.AppUser,
				as: 'dataUser',
				on: {
					pin: Sequelize.literal(`AttendanceLogSource.pin = nik`)
				},
				required: true,
			}
		],
		order: [ ['scan_date', 'ASC'] ],
	})
	.then(data => { sourceDataAtt = data })
	.catch(err => { 
		console.log(err);
	});

	if(sourceDataAtt.length != 0){
		
		/** storing  raw data to DB */
		sourceDataAtt = sourceDataAtt.map(el => ({pin: el.pin, name: el.dataUser.name, scan_date: el.scan_date}));
		try {
			await model.Database1.transaction( async (t) => {
				await AttendanceUser.bulkCreate(
					sourceDataAtt, 
					{ transaction: t }
				);
			})
			// console.log('stored successfully');
		} catch (err) {
			console.log(err);
		}

		
		/** check storage folder */
		const __dirname = path.resolve();
		storePath = '/express/public/app_hris/autosync_log';
		storePath = storePath.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '');
		if( !fs.existsSync(path.resolve(__dirname, storePath))){
			fs.mkdirSync(path.resolve(__dirname, storePath), {recursive:true}, e => {
				if(e){
					console.log(err);
				}
			})
		}

		/** creating file, store to public folder */
		filename = startDate.replace(/-|\s|:/g,"")+'-'+endDate.replace(/-|\s|:/g,"")+'.txt';
		file = fs.createWriteStream(`${path.resolve(__dirname, storePath)}/${filename}`);
		file.on('error', function(err) { console.log(err) });
		for (let i=0; i < sourceDataAtt.length; i++){
			file.write(sourceDataAtt[i].pin+','+sourceDataAtt[i].name+','+moment(sourceDataAtt[i].scan_date).format('DD/MM/YYYY HH:mm')+',\n')
		}
		file.end();

		await AttendanceExportLog.create({
			startdate: startDate,
			enddate: endDate,
			note: `Export created with filename ${filename}`,
		}).then(() => {
			console.log('Data exported successfully');
		}).catch(err => {
			console.log(err);
		});

	} else {
		await AttendanceExportLog.create({
			startdate: startDate,
			enddate: endDate,
			note: `No Data exported`,
		}).then(() => {
			console.log('Data exported successfully');
		}).catch(err => {
			console.log(err);
		});
	}
};

exports.manualAttSync = async (req, res) => {
	
	let inputStartDate, inputEndDate, startDate, dataAtt;

	/** validation */
	if(!req.query.startdate){
		res.status(422).send({message: 'Tanggal mulai harus diisi!'});
		return;
	}

	else if(!req.query.enddate){
		res.status(422).send({message: 'Tanggal selesai harus diisi!'});
		return;
	}

	inputStartDate = req.query.startdate;
	inputEndDate = req.query.enddate;

	await AttendanceLogSource.min('scan_date', {
		where: { scan_date: {[Op.gt]: inputStartDate }}
	})
	.then(data => {
		startDate = data
	})
	.catch(err => {
		res.status(500).send(err)
	})

	await AttendanceLogSource.findAll({
		where: { scan_date: {[Op.between]: [startDate, inputEndDate]} },
		include: [
			{
				model: model.Database3.models.AppUser,
				as: 'dataUser',
				on: {
					pin: Sequelize.literal(`AttendanceLogSource.pin = nik`)
				},
				required: true,
			}
		],
		order: [ ['scan_date', 'ASC'] ],
	})
	.then(data => { 
		dataAtt = data
	})
	.catch(err => { res.status(500).send({message: err}) });

	if(dataAtt.length != 0){
		dataAtt = dataAtt.map(el => ({pin: el.pin, name: el.dataUser.name, scan_date: el.scan_date}));
		try {
			const transaction = await model.Database1.transaction( async (t) => {
				await AttendanceUser.bulkCreate(
					dataAtt, 
					{ transaction: t }
				);
			})
			res.status(200).send({message: 'sync successfully'});
		} catch (err) {
			res.status(500).send({message: err})
		}
	} else {
		res.status(200).send({message: 'No Data sync.'});
	}
};

exports.generateFile = async (req, res) => {
	let inputStartDate, inputEndDate;
	
	inputStartDate = await req.query.startdate;
	inputEndDate = await req.query.enddate;

	await AttendanceUser.findAll({
		where: { 
			scan_date: {
				// [Op.between]: [inputStartDate, inputEndDate]
				[Op.gte]: inputStartDate,
				[Op.lte]: inputEndDate,
			} 
		},
		order: [ ['id', 'DESC'] ],
	})
	.then(data => { res.status(200).send(data) })
	.catch(err => { res.status(500).send({ message: err}) })
};

exports.allData = async (req, res) => {
	await AttendanceUser.findAll({ order: [['id', 'DESC']] })
	.then(data => {
		res.status(200).send(data)
	})
	.catch(err => {
		res.status(500).send({message: err})
	})
};

exports.testing = async (req, res) => {
	//
}

