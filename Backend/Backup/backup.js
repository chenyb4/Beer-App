// importing required modules
const {execute} = require('@getvim/execute');

// getting db connection parameters from environment file
const username = process.env.PGUSER;
const database = 'postgres';
const dbHost = process.env.DBURL;

// defining backup file name
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
const backupFile = `pg-backup-${today}.tar`;
const backupFolder = 'backups'

// writing postgresql backup function
const takePGBackup = () => {
    execute(`pg_dump -U ${username} -h ${dbHost} -w -f ${backupFolder}/${backupFile} -F t -d ${database}`)
        .then(async () => {
            console.log(`Backup created successfully`);
        })
        .catch((err) => {
            console.log(err);
        });
}

// calling postgresql backup function
takePGBackup();