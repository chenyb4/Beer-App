const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const process = require('process');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const db = require('./database')
const userController = require('./controllers/UserController');
const orderController = require('./controllers/OrderController');
const historyController = require('./controllers/HistoryController');
const creditController = require('./controllers/CreditController');
const roleController = require('./controllers/RoleController');


app.get('/users', userController.getUser);
app.post('/users', userController.createUser);
app.put('/users', userController.updateUser);
app.delete('/users', userController.deleteUser);

app.get('/orders', orderController.getOrder);
app.post('/orders', orderController.createOrder);
app.put('/orders', orderController.updateOrder);
app.delete('/orders', orderController.deleteOrder);

app.get('/histories', historyController.getHistory);
app.post('/histories', historyController.createHistory);
app.put('/histories', historyController.updateHistory);
app.delete('/histories', historyController.deleteHistory);

app.get('/credits', creditController.getCredit);
app.put('/credits', creditController.updateCredit);

app.get('/roles', roleController.getRole);
app.post('/roles', roleController.createRole);
app.put('/roles', roleController.updateRole);
app.delete('/roles', roleController.deleteRole);


async function authenticate() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function sync() {
  try {
    await db.sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Unable to sync database:', error)
  }
}

async function syncForce() {
  try {
    await db.sequelize.sync({force: true});
    console.log('Database force synced');
  } catch (error) {
    console.error('Unable to force sync database:', error)
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
  await db.User.create({username: "Wouter", email: "wouter.baltus1999@gmail.com"});
  res.send('User Created!')
})

app.get('/force', async (req, res) => {
  await syncForce()
  res.send('Forced!')
})

const port = process.env.APIPORT
app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})
authenticate();
module.exports = app;
