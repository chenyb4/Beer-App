const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const process = require('process');
const app = express();
const { Sequelize } = require('sequelize');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const user = process.env.POSTGRES_USER
const password = process.env.PGPASSWORD
const url = process.env.DBURL

const sequelize = new Sequelize('postgres', user, password, {
  host: url,
  dialect: "postgres"
});

// Insert models below
const User = require("./models/User")(sequelize)
const Product = require("./models/Product")(sequelize)

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function sync() {
  await authenticate();
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error)
  }
}

async function syncForce() {
  await authenticate();
  try {
    await sequelize.sync({force: true});
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error)
  }
}

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.get('/', async (req, res) => {
  await sync()
  await User.create({username: "Wouter", email: "wouter.baltus1999@gmail.com"});
  res.send('User Created!')
})

app.get('/force', async (req, res) => {
  await syncForce()
  res.send('User Created!')
})

const port = process.env.APIPORT
app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
