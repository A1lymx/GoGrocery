const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const deliveryController = require('../controllers/deliveryController');

router.get('/alive', (req, res) => {
    res.json({
        message: "I'm alive"
    })
});

router.get('/products', productController.getAllProducts);
router.get('/cart', cartController.getCart);
router.get('/delivery', deliveryController.getOpts);

router.get('/product/img/:id', productController.getProductImage);

router.delete('/cart/items/:id', cartController.removeFromCart);

router.post('/cart/items/addItems', cartController.addItemsToCart)

router.post('/cart/checkout', cartController.checkout);
router.post('/cart/items/:id', cartController.addToCart);

module.exports = router;
