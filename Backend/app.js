const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./logger');
const process = require('process');
const app = express();
const cors = require('cors')
const dataManagementService = require('./services/DataManagementService');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
    credentials: true,
    origin: ['http://' + process.env.FEURL + ":" + process.env.FEPORT, process.env.DOCKERFEURL + ':' + process.env.FEPORT, "http://localhost:5173"] // Whitelist the domains you want to allow
};

morgan.token('id', function getId(req) {
    return req.id;
});
morgan.token('timestamp', function getTimestamp() {
    return new Date().toISOString();
});
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

app.use(morgan(morganFormat, {stream: {write: (message) => logger.info(message.trim())}}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors(corsOptions));

const db = require('./database')
const authController = require("./controllers/AuthController");
require("./Routing")(app)

async function authenticate() {
    try {
        await db.sequelize.authenticate();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database:', error);
    }
}

async function sync() {
    try {
        await db.sequelize.sync();
        logger.info('Database synced');
    } catch (error) {
        logger.error('Unable to sync database:', error)
    }
}

app.post('/force', resetDatabaseAndLoadDummyData);

async function resetDatabaseAndLoadDummyData() {
    if (process.env.NODE_ENV === 'development') {
        try {
            await db.sequelize.sync({force: true});
            await dataManagementService.loadDummyData();
            logger.info('Database synced');
        } catch (error) {
            logger.error('Unable to sync database:', error)
        }
    } else {
        logger.info('Environment is not equal to development');
    }
}

const port = process.env.APIPORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
authenticate();
module.exports = app;