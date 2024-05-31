const productService = require('../services/ProductService');
const paginationService = require("../services/PaginationService");

exports.getProducts = async (req, res) => {
    const { id } = req.query;

    try {
        let products
        if (id) {
            products = await productService.getProduct(id);
        } else {
            products = await productService.getAllProducts();
            products = await paginationService.addPaginationProperties(products, products.length, req);

        }
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Service Error'});
    }

};

exports.createProduct = async (req, res) => {
    const {name, price_in_credits, amount_in_stock, EAN} = req.body;

    try {
        const newProduct = await productService.createProduct(name, price_in_credits, amount_in_stock, EAN);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }

};

exports.updateProduct = async (req, res) => {
    const { id } = req.query;
    const {name, price_in_credits, amount_in_stock, EAN} = req.body;

    try {
        const updatedProduct = await productService.updateProduct(id, name, price_in_credits, amount_in_stock, EAN);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct)
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.deleteProduct = async (req, res) => {
    const {id} = req.query;

    try {
        res.status(200).json(await productService.deleteProduct(id));
    } catch (err) {
        res.status(400).json({message: 'Bad request'});
    }
}
