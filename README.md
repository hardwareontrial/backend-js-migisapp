[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/hardwareontrial/backend-js-migisapp/graphs/commit-activity)
![Maintainer](https://img.shields.io/badge/Maintainer-IT%20MIG-blue)
[![Node](https://img.shields.io/badge/Node-16.13.0-1abc9c.svg)](https://nodejs.org/en/blog/release/v16.13.0)


## Backend-JS

Provide MIG-IS logical as backend served by Express JS and Sequelize for querying database. Purely build with Javascript. But now only controlling logic for manage employees presence between Company and 3rd-party.




### Features

- Use [Sequelize](https://linktodocumentation) Library,
- Use [Express JS](https://linktodocumentation),
- Pure Javascript,
- Using 3 databases, for attendance logs, employee data, and storage data.


### Installation
- Import sql file (on supporting_files folder) to database, it's contain database structure.
```
mysql database_name < structure_db.sql
```
- Clone this project to folder root:

```bash
  mkdir -p root-project/app
  cd root-project/app
  git clone https://github.com/hardwareontrial/backend-js-migisapp.git backend-js
```

- Commented out cron script in app/express/jobs/index.js
```
AttendanceUserController.attSync()
```

- Build docker image as per Dockerfile provided
```
docker build -t migisapp/backend-js:latest .
```

- Copy docker compose file and edit if needed, adjust to internal configuration:
```
cp root-project/app/supporting_files/docker-compose.yaml root-project/backend-js.yaml
```
- Create folder to store data and config
```
mkdir -p root-project/config
mkdir -p root-project/data
```
- **(OPTIONAL)** Create nginx config file if needed and store to root-project/config folder
- Data inside express public folder can be accessed in this folder.
```
root-project/data
```
- Finally, can start docker using:
```
docker compose -f "root-project/backend-js.yaml" up -d
```
- Check using postman.
