const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const process = require('process');
const app = express();
const cors = require('cors')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const corsOptions = {
    credentials: true,
    origin: ['http://' + process.env.FEURL + ":" + process.env.FEPORT, process.env.DOCKERFEURL + ':' + process.env.FEPORT, "http://localhost:5173"] // Whitelist the domains you want to allow
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors(corsOptions));

const db = require('./database')
const productController = require('./controllers/ProductController');
const userController = require('./controllers/UserController');
const orderController = require('./controllers/OrderController');
const historyController = require('./controllers/HistoryController');
const creditController = require('./controllers/CreditController');
const roleController = require('./controllers/RoleController');
const mailController = require('./services/MailService');
const authController = require("./controllers/AuthController");
const authService = require("./services/AuthService");


app.get('/users', authService.authenticateToken, userController.getUser);
app.post('/users', authService.authenticateToken, userController.createUser);
app.put('/users', authService.authenticateToken, userController.updateUser);
app.put('/users/credits', authService.authenticateToken, userController.incrementUserCredits);
app.delete('/users', authService.authenticateToken, userController.deleteUser);

app.get('/orders', authService.authenticateToken, orderController.getOrder);
app.post('/orders', authService.authenticateToken, orderController.createOrder);
app.put('/orders', authService.authenticateToken, orderController.updateOrder);
app.put('/orders/confirm', authService.authenticateToken, orderController.confirmOrder);
app.put('/orders/products', authService.authenticateToken, orderController.addProductToOrder)
app.delete('/orders', authService.authenticateToken, orderController.deleteOrder);

app.get('/histories', authService.authenticateToken, historyController.getHistory);
app.get('/histories/inventory', authService.authenticateToken, historyController.getInventoryHistory);
app.post('/histories/undo', authService.authenticateToken, historyController.undo);
app.post('/histories', authService.authenticateToken, historyController.createHistory);
app.put('/histories', authService.authenticateToken, historyController.updateHistory);
app.delete('/histories', authService.authenticateToken, historyController.deleteHistory);

app.get('/credits', authService.authenticateToken, creditController.getCredit);
app.put('/credits', authService.authenticateToken, creditController.updateCredit);

app.get('/roles', authService.authenticateToken, roleController.getRole);
app.post('/roles', authService.authenticateToken, roleController.createRole);
app.put('/roles', authService.authenticateToken, roleController.updateRole);
app.delete('/roles', authService.authenticateToken, roleController.deleteRole);

app.get('/products', authService.authenticateToken, productController.getProducts);
app.post('/products', authService.authenticateToken, productController.createProduct);
app.put('/products', authService.authenticateToken, productController.updateProduct);
app.delete('/products', authService.authenticateToken, productController.deleteProduct)

app.post('/mail', authService.authenticateToken, mailController.sendmail);

app.post('/login', authController.login)
app.post('/register', authController.register);

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

async function loadDummyData() {
    try {
        await db.Role.bulkCreate([
            {
                name: 'member',
                discount: 1.5,
            },
            {
                name: 'student',
                discount: 1
            },
            {
                name: 'seller',
                discount: 1
            }
        ]);
        await db.User.bulkCreate([
            {
                username: "dummy",
                email: "dummy@dummy.nl",
                password: "$2b$10$PhqaHcRo3xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: "2024-05-23 00:00:00.000",
                roleId: 3,
                credits: 20
            }, {
                username: "dummy2",
                email: "dummy2@dummy.nl",
                password: "$2b$10$PhqaHcR13xnMAX3wyzSF7OmsVoR/7QclpJN9.ePjVHRuMACUsqOZ2",
                date_of_birth: "1990-05-23 00:00:00.000",
                roleId: 2,
                credits: 20
            },
        ]);
        await db.Product.create({
            name: 'beer',
            price_in_credits: 1,
            amount_in_stock: 24,
            EAN: '12345678910',
            isAlcoholic: true
        })
        await db.Order.create({
            amount_of_credits: 4,
            buyerId: 2,
            sellerId: 1
        })
        await db.Credit.create({
            default_amount: 10,
            price: 11
        })
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create dummy data');
    }
}


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
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
    await loadDummyData()
    res.send('Forced!')
})

const port = process.env.APIPORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
authenticate();
module.exports = app;
