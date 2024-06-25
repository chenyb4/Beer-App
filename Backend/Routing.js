const productController = require('./controllers/ProductController');
const userController = require('./controllers/UserController');
const orderController = require('./controllers/OrderController');
const historyController = require('./controllers/HistoryController');
const creditController = require('./controllers/CreditController');
const roleController = require('./controllers/RoleController');
const mailService = require('./services/MailService');
const authController = require("./controllers/AuthController");
const authService = require("./services/AuthService");
const dataManagementService = require("./services/DataManagementService");
const logger = require("./logger");

module.exports = function (app) {

    app.get('/users', authService.authenticateToken, userController.getUser);
    app.post('/users', authService.authenticateToken, userController.createUser);
    app.put('/users', authService.authenticateToken, userController.updateUser);
    app.put('/users/credits', authService.authenticateToken, userController.incrementUserCredits);
    app.delete('/users', authService.authenticateToken, userController.deleteUser);

    app.get('/orders', authService.authenticateToken, orderController.getOrder);
    app.post('/orders', authService.authenticateTokenForSeller, orderController.createOrder);
    app.put('/orders', authService.authenticateToken, orderController.updateOrder);
    app.put('/orders/confirm', authService.authenticateTokenForSeller, orderController.confirmOrder);
    app.put('/orders/products', authService.authenticateTokenForSeller, orderController.addProductToOrder)
    app.delete('/orders', authService.authenticateToken, orderController.deleteOrder);

    app.get('/histories', authService.authenticateToken, historyController.getHistory);
    app.get('/histories/inventory', authService.authenticateToken, historyController.getInventoryHistory);
    app.post('/histories/undo', authService.authenticateToken, historyController.undo);
    app.post('/histories', authService.authenticateToken, historyController.createHistory);
    app.put('/histories', authService.authenticateToken, historyController.updateHistory);
    app.delete('/histories', authService.authenticateToken, historyController.deleteHistory);

    app.get('/credits', authService.authenticateToken, creditController.getCredit);
    app.put('/credits', authService.authenticateToken, creditController.updateCredit);

    app.get('/roles', authService.authenticateTokenForSeller, roleController.getRole);
    app.post('/roles', authService.authenticateToken, roleController.createRole);
    app.put('/roles', authService.authenticateToken, roleController.updateRole);
    app.delete('/roles', authService.authenticateToken, roleController.deleteRole);

    app.get('/products', authService.authenticateTokenForSeller, productController.getProducts);
    app.post('/products', authService.authenticateToken, productController.createProduct);
    app.put('/products', authService.authenticateToken, productController.updateProduct);
    app.delete('/products', authService.authenticateToken, productController.deleteProduct)

    app.post('/mail', authService.authenticateToken, mailService.mail);

    app.post('/login', authController.login)
    app.post('/register', authController.register);

    app.get('/loadOldCsv', async (req, res) => {
        try {
            await dataManagementService.loadCsvOldFormat();
            res.status(200).json("CSV has been loaded");
        } catch (err) {
            logger.error(err);
            res.status(500).json({message: 'Service Error'});
        }
    });
}