'use strict'

const path = require('path');
const fs = require('fs');
const { Sequelize, Op } = require('sequelize')
const model = require('../../sequelize');
const moment = require('moment');

const AttendanceExportLog = model.Database1.models.AttendanceExportLog;
const AttendanceUser = model.Database1.models.AttendanceUser;
const AttendanceLogSource = model.Database2.models.AttendanceLogSource;

exports.attSync = async (req, res) => {
	
	let startDate, endDate, sourceDataAtt, countLog, storePath, file, filename, countAttData, startDateLog, endDateLog, dataExported;

	countLog = await AttendanceExportLog.count();
	countAttData = await AttendanceUser.count();

	if(countAttData == 0){

		startDate = moment().format('YYYY-MM-DD 00:00:00');
		endDate = moment().format('YYYY-MM-DD HH:mm:ss');

	} else {

		await AttendanceUser
		.findOne({ order: [['id', 'DESC']] })
		.then(data => { 
			startDate = data.scan_date 
		})
		.catch(err => { 
			console.log(err);
		})
		
		endDate = moment().format('YYYY-MM-DD HH:mm:ss');

	}

	await AttendanceLogSource.findAll({
		// where: { scan_date: {[Op.between]: [startDate, endDate]} },
		where: {
			scan_date: {
				[Op.gt]: startDate,
				[Op.lte]: endDate,
			},
		},
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

	if(await sourceDataAtt.length != 0){
		
		/** storing  raw data to DB */
		sourceDataAtt = sourceDataAtt.map(el => ({pin: el.pin, name: el.dataUser.name, scan_date: el.scan_date}));
		try {
			await model.Database1.transaction( async (t) => {
				await AttendanceUser.bulkCreate(
					sourceDataAtt, 
					{ transaction: t }
				);
			})
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

		if(countLog == 0){

			if(countAttData == 0){
				startDateLog = startDate;
				endDateLog = endDate;
			}else{
				await AttendanceUser.findAll({ order: [['id', 'ASC']] })
				.then(data => {
					startDateLog = data[0].scan_date;
					endDateLog = data[data.length -1].scan_date;
				})
				.catch(err => { console.log(err); })
			}
		} else {

			await AttendanceExportLog
			.findOne({ order: [['id', 'DESC']] })
			.then(data => { 
				startDateLog = data.enddate
			})
			.catch(err => { console.log(err); });

			endDateLog = endDate;

		}

		await AttendanceUser.findAll({
			where: {
				scan_date: {
					[Op.gt]: startDateLog,
					[Op.lte]: endDateLog,
				},
			},
			order: [['id', 'DESC']]
		})
		.then(data => { dataExported = data })
		.catch(err => { console.error(err) });

		/** creating file, store to public folder */
		filename = startDateLog.replace(/-|\s|:/g,"")+'-'+endDateLog.replace(/-|\s|:/g,"")+'.txt';
		file = fs.createWriteStream(`${path.resolve(__dirname, storePath)}/${filename}`);
		file.on('error', function(err) { console.log(err) });
		for (let i=0; i < dataExported.length; i++){
			file.write(dataExported[i].pin+','+dataExported[i].name+','+moment(dataExported[i].scan_date).format('DD/MM/YYYY HH:mm')+',\n')
		}
		file.end();

		await AttendanceExportLog.create({
			startdate: startDateLog,
			enddate: endDateLog,
			note: `Export created with filename ${filename}`,
		}).then(() => {
			console.log('Data exported successfully');
		}).catch(err => { console.log(err); });

	} else {
		await AttendanceExportLog.create({
			startdate: startDate,
			enddate: endDate,
			note: `No Data exported`,
		}).then(data => {
			console.log(data);
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

	if(!req.query.startdate){
		res.status(422).send({message: 'Tanggal mulai harus diisi!'});
		return;
	}

	else if(!req.query.enddate){
		res.status(422).send({message: 'Tanggal selesai harus diisi!'});
		return;
	}
	
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

